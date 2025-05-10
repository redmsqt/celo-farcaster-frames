import { gql, request } from 'graphql-request';
import { HypercertExchangeClient, ChainId } from "@hypercerts-org/marketplace-sdk";
import { ethers, JsonRpcProvider, JsonRpcSigner } from 'ethers';

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
          currency
          signature
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

// export async function buyHypercertFraction(
//   order: any,
//   // provider: any,
//   // signer: any,
//   unitsToBuy: bigint,
//   recipientAddress?: string
// ) {
//   try {
//     const provider = new JsonRpcProvider();
//     const signer = new JsonRpcSigner(provider, recipientAddress || "");
//     // // Initialize the HypercertExchangeClient
//     const hypercertExchangeClient = new HypercertExchangeClient(ChainId.CELO, provider, signer);
    
//     // // Get the price per unit from the order
//     const pricePerUnit = BigInt(Math.floor(order.pricePerPercentInToken * 10**18));
    
//     // // Calculate total price
//     const totalPrice = pricePerUnit * unitsToBuy;
    
//     // // Get the recipient address (if not provided, the signer's address will be used)
//     const address = recipientAddress || await signer.getAddress();
    
//     // Generate the taker order
//     // error is coming from here
//     const takerOrder = hypercertExchangeClient.createFractionalSaleTakerBid(
//       order,
//       address,
//       unitsToBuy,
//       pricePerUnit
//     );
    
//     // Check and set ERC20 approval if needed
//     const tokenContract = order.currency;
//     const exchangeAddress = hypercertExchangeClient.addresses;
//     const signerAddress = await signer.getAddress();
    
//     // Get the current allowance using the provider directly
//     const erc20Interface = new ethers.Interface([
//       "function allowance(address owner, address spender) view returns (uint256)"
//     ]);
    
//     const allowanceData = erc20Interface.encodeFunctionData("allowance", [signerAddress, exchangeAddress]);
//     const allowanceResult = await provider.call({
//       to: tokenContract,
//       data: allowanceData
//     });
    
//     const currentAllowance = BigInt(allowanceResult);
    
//     if (currentAllowance < totalPrice) {
//       const approveTx = await hypercertExchangeClient.approveErc20(
//         order.currency,
//         totalPrice
//       );
//       await approveTx.wait();
//     }
    
//     // Check and grant transfer manager approval if needed
//     const isTransferManagerApproved = await hypercertExchangeClient.isTransferManagerApproved();
//     if (!isTransferManagerApproved) {
//       const transferManagerApprove = await hypercertExchangeClient
//         .grantTransferManagerApproval()
//         .call();
//       await transferManagerApprove.wait();
//     }
    
//     // // Set the value if the currency is the native token (CELO)
//     const zeroAddress = "0x0000000000000000000000000000000000000000";
//     const overrides = order.currency === zeroAddress ? { value: totalPrice } : {};
    
//     // Execute the order
//     const tx = await hypercertExchangeClient.executeOrder(
//       order,
//       takerOrder,
//       order.signature,
//       undefined,
//       overrides
//     ).call();
    
//     // Wait for transaction to complete
//     const receipt = await tx.wait();
    
//     return {
//       success: true,
//       transactionHash: receipt?.hash,
//       receipt: receipt
//     };
//     console.log("try")
//   } catch (error) {
//     console.error("Error buying hypercert fraction:", error);
//     return {
//       success: false,
//       error
//     };
//   }
// }

export async function buyHypercertFraction(
  order: any,
  unitsToBuy: bigint,
  recipientAddress: string,
  signer: JsonRpcSigner
) {
  try {
    // const provider = new JsonRpcProvider();
    // const signer = new JsonRpcSigner(provider, recipientAddress || "");
    // Initialize the HypercertExchangeClient
    const hypercertExchangeClient = new HypercertExchangeClient(ChainId.CELO, signer.provider, signer);
    
    // Get the price per unit from the order
    const pricePerUnit = BigInt(Math.floor(order.pricePerPercentInToken * 10**18));
    
    // Calculate total price
    const totalPrice = pricePerUnit * unitsToBuy;
    
    // Get the recipient address (if not provided, the signer's address will be used)
    const address = recipientAddress || await signer.getAddress();
    
    // Generate the taker order with the required properties according to the Taker type
    const takerOrder = {
      buyer: address,
      recipient: address, // Adding the required recipient property
      units: unitsToBuy.toString(),
      price: pricePerUnit.toString(),
      chainId: order.chainId,
      currency: order.currency,
      additionalParameters: "0x"
    };
    
    // Check and set ERC20 approval if needed
    const tokenContract = order.currency;
    const exchangeAddress = hypercertExchangeClient.addresses.EXCHANGE_V2;
    const signerAddress = await signer.getAddress();
    
    // Get the current allowance using the provider directly
    const erc20Interface = new ethers.Interface([
      "function allowance(address owner, address spender) view returns (uint256)"
    ]);
    console.log("signer", signer)
    
    const allowanceData = erc20Interface.encodeFunctionData("allowance", [signerAddress, exchangeAddress]);
    const allowanceResult = await signer.provider.call({
      to: tokenContract,
      data: allowanceData
    });
    
    console.log("here allowanceResult", allowanceResult);
    const currentAllowance = allowanceResult === "0x" ? 0n : BigInt(allowanceResult);
    
    if (currentAllowance < totalPrice) {
      // Using a small approval amount (0.01 tokens) for testing
      const smallApprovalAmount = BigInt(10n ** 16n); // 0.01 tokens (10^16 wei)
      const approveTx = await hypercertExchangeClient.approveErc20(
        order.currency,
        smallApprovalAmount
      );
      await approveTx.wait();
      console.log("passed approve here ", approveTx);
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
    const overrides = order.currency === zeroAddress ? { value: totalPrice } : {};
    
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
      transactionHash: receipt?.hash,
      receipt: receipt
    };
  } catch (error) {
    console.error("Error buying hypercert fraction:", error);
    return {
      success: false,
      error
    };
  }
}
