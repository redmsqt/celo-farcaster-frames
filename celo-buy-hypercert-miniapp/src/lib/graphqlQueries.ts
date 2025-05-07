import { gql, request } from 'graphql-request';
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";

// const endpoint = 'https://staging-api.hypercerts.org/v1/graphql';
const endpoint = 'https://api.hypercerts.org/v1/graphql';

const createHypercertsQuery = (first: number, offset: number) => gql`
  query hypercerts {
    hypercerts(
      where: {contract: {chain_id: {eq: "42220"}}}
      first: ${first}
      offset: ${offset}
    ) {
      count
      data {
        hypercert_id
        metadata {
            name
            image
            description
        }
        units
      }
    }
  }
`;

const createSearchHypercertsQuery = (searchTerm: string, search_id: string, first: number, offset: number) => gql`
  query searchHypercerts {
    hypercerts(
      where: {
        contract: {chain_id: {eq: "42220"}},
        hypercert_id: {contains: "${search_id}"},
        metadata: {name: {contains: "${searchTerm}"}}
      }
      first: ${first}
      offset: ${offset}
    ) {
      count
      data {
        hypercert_id
        metadata {
            name
            image
            description
        }
        units
      }
    }
  }
`;

const createHypercertByIdQuery = (id: string) => gql`
  query hypercertById {
    hypercerts(
      where: {hypercert_id: {eq: "${id}"}}
      first: 1
    ) {
      data {
      hypercert_id
      units
      orders {
        totalUnitsForSale
        data {
          pricePerPercentInToken
          pricePerPercentInUSD
          chainId
        }
        cheapestOrder {
          amounts
        }
      }
      metadata {
        image
        name
        work_scope
        description
      }
    }
    }
  }
`;

export async function getHypercerts(first: number = 10, offset: number = 0) {
  const query = createHypercertsQuery(first, offset);
  const res = await request<{
    hypercerts: {
      count: number,
      data: JSON,
      [x: string]: any
    }
  }>(endpoint, query);
  return res.hypercerts;
}

export async function searchHypercerts(searchTerm: string, search_id: string, first: number = 10, offset: number = 0) {
  const query = createSearchHypercertsQuery(searchTerm, search_id, first, offset);
  const res = await request<{
    hypercerts: {
      count: number,
      data: JSON,
      [x: string]: any
    }
  }>(endpoint, query);
  return res.hypercerts;
}

export async function getHypercertById(id: string) {
  const query = createHypercertByIdQuery(id);
  const res = await request<{
    hypercerts: {
      data: JSON,
      [x: string]: any
    }
  }>(endpoint, query);
  return res.hypercerts.data || null;
}

export async function getAllHypercerts() {
  // First get the count
  const initialResult = await getHypercerts(1, 0);
  const totalCount = initialResult.count;

  // Then fetch all records
  if (totalCount > 0) {
    return getHypercerts(totalCount, 0);
  }

  return initialResult;
}

export async function buyHypercertFraction(
  order: any,
  provider: any,
  signer: any,
  unitsToBuy: bigint,
  recipientAddress?: string
) {
  try {
    // Initialize the HypercertExchangeClient
    const hypercertExchangeClient = new HypercertExchangeClient(ChainId.CELO, provider, signer);
    
    // Get the price per unit from the order
    const pricePerUnit = BigInt(order.price);
    
    // Calculate total price
    const totalPrice = pricePerUnit * unitsToBuy;
    
    // Get the recipient address (if not provided, the signer's address will be used)
    const address = recipientAddress || await signer.getAddress();
    
    // Generate the taker order
    const takerOrder = hypercertExchangeClient.createFractionalSaleTakerBid(
      order,
      address,
      unitsToBuy,
      pricePerUnit
    );
    
    // Check and set ERC20 approval if needed
    const currentAllowance = await hypercertExchangeClient.getErc20Allowance(order.currency);
    
    if (currentAllowance < totalPrice) {
      const approveTx = await hypercertExchangeClient.approveErc20(
        order.currency,
        totalPrice
      );
      await approveTx.wait();
    }
    
    // Check and grant transfer manager approval if needed
    const isTransferManagerApproved = await hypercertExchangeClient.isTransferManagerApproved();
    if (!isTransferManagerApproved) {
      const transferManagerApprove = await hypercertExchangeClient
        .grantTransferManagerApproval()
        .call();
      await transferManagerApprove.wait();
    }
    
    // Set the value if the currency is the native token (CELO)
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const overrides = order.currency === zeroAddress ? { value: totalPrice } : undefined;
    
    // Execute the order
    const tx = await hypercertExchangeClient.executeOrder(
      order,
      takerOrder,
      order.signature,
      undefined,
      overrides
    ).call();
    
    // Wait for transaction to complete
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      receipt
    };
  } catch (error) {
    console.error("Error buying hypercert fraction:", error);
    return {
      success: false,
      error
    };
  }
}
