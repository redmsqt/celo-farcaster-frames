"use client";

// import dynamic from "next/dynamic";
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiAdapter, projectId, networks } from '@/config'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { ApolloWrapper } from '@/apollo/apolloClient';

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: 'celo-birthday-frame',
  description: 'celo-birthday-frame',
  url: 'celo-farcaster-frames-six.vercel.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: 'dark',
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    '--w3m-accent': '#F97316',
  }

})

export function Providers({ children, cookies }: { children: React.ReactNode, cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  return (
    <ApolloWrapper >
      <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </ApolloWrapper>
  );
}
