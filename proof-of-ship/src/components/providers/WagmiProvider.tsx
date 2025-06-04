import "@rainbow-me/rainbowkit/styles.css";
import { createConfig, http, WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector";

import { celo, celoAlfajores, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
if (!projectId) {
  console.warn(
    "WalletConnect Project ID não está definido! Isso pode causar problemas de conexão."
  );
}

export const config = createConfig({
  chains: [celo, celoAlfajores, mainnet],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
    [mainnet.id]: http(),
  },
  // wallets,
  ssr: true,
  connectors: [miniAppConnector()],
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
