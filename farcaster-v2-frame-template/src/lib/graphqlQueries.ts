import { gql, GraphQLClient } from 'graphql-request';

const endpoint = 'https://api.hypercerts.org/v1/graphql/';

export const graphQLClient = new GraphQLClient(endpoint);

export const GET_HYPERCERTS = gql`
  {
    hypercerts {
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

import { HypercertClient } from "@hypercerts-org/sdk";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

const client = new HypercertClient({
  chainId: 11155111, // Replace with your target chain ID
  walletClient,
});


