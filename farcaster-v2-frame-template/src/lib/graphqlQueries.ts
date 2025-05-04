import { gql, GraphQLClient, request } from 'graphql-request';

const endpoint = 'https://api.hypercerts.org/v1/graphql';

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

const query = gql`
  query hypercerts {
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

export async function getHypercerts() {
  const res = await request<{ hypercerts: { count: number, data: JSON } }>(endpoint, query);
  console.log("hypercertssss", res);
  return res.hypercerts.count;
}
