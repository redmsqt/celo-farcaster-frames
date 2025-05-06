import { gql, request } from 'graphql-request';

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

export async function getHypercerts(first: number = 10, offset: number = 0) {
  const query = createHypercertsQuery(first, offset);
  const res = await request<{ hypercerts: {
    count: number, 
    data: JSON,
    [x: string]: any
  } }>(endpoint, query);
  return res.hypercerts;
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
