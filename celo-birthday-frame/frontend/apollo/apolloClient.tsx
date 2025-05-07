"use client";

import { ApolloLink, gql, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import { setVerbosity } from "ts-invariant";
import { isSSRMode } from "@/lib/helpers";

setVerbosity("debug");
const ssrMode = isSSRMode;

function makeClient() {
  const httpLink = new HttpLink({
    uri: "https://mainnet.serve.giveth.io/graphql",
    fetchOptions: { cache: "no-store" },
  });

  return new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false,
    }),
    link: ssrMode
      ? ApolloLink.from([
        new SSRMultipartLink({
          stripDefer: true,
        }),
        httpLink,
      ])
      : httpLink,

    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first",
      },
      query: {
        fetchPolicy: "cache-first",
      },
    },
    typeDefs: gql`
      enum OrderField {
        CreationDate
        Balance
        QualityScore
        Verified
        Hearts
        Donations
        RecentlyAdded
        OldProjects
      }

      enum OrderDirection {
        ASC
        DESC
      }

      type OrderBy {
        field: OrderField!
        direction: OrderDirection!
      }
    `,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
