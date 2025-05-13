import "@rainbow-me/rainbowkit/styles.css";
import { walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { http, WagmiProvider } from "wagmi";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";

import { celo, celoAlfajores, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const wallets = [
  {
    groupName: "Recommended",
    wallets: [walletConnectWallet],
  },
];

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
if (!projectId) {
  console.warn(
    "WalletConnect Project ID não está definido! Isso pode causar problemas de conexão."
  );
}

export const config = getDefaultConfig({
  appName: "Proof of Ship",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  // add mainnet to resolve ens
  chains: [celo, celoAlfajores, mainnet],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
    [mainnet.id]: http(),
  },
  wallets,
  ssr: true,
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
