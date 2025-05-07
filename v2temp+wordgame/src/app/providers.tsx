"use client";

import dynamic from "next/dynamic";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi"; // Fixed import
import { celo, celoAlfajores } from "wagmi/chains";
import { http } from "viem";
import { frameConnector } from "~/lib/connector";

// 1. Create query client instance
const queryClient = new QueryClient();

// 2. Configure Wagmi with Celo networks
const wagmiConfig = createConfig({ // Changed from createClient to createConfig
  chains: [celo, celoAlfajores],
  connectors: [frameConnector()],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

// 3. Dynamic import for Wagmi provider
const WagmiProviderDynamic = dynamic(
  () => import("wagmi").then((mod) => mod.WagmiProvider),
  {
    ssr: false,
    loading: () => <div>Loading wallet provider...</div>,
  }
);

export function Providers({ 
  session, 
  children 
}: { 
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      {/* Fixed config reference from wagmiClient to wagmiConfig */}
      <WagmiProviderDynamic config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProviderDynamic>
    </SessionProvider>
  );
}