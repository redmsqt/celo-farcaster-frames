import { createConnector } from "wagmi";
import sdk from "@farcaster/frame-sdk";
import { getAddress, numberToHex, fromHex, SwitchChainError, type Hex } from "viem";
import type { Chain } from "wagmi/chains";

// Type definitions for Farcaster Wallet Provider
interface EthProvider {
  request(args: { method: string; params?: any[] }): Promise<unknown>;
  on?(event: string, listener: (...args: any[]) => void): void;
  removeListener?(event: string, listener: (...args: any[]) => void): void;
}

type SwitchChainParameters = {
  chainId: number;
  addEthereumChainParameter?: {
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
  };
};

export function frameConnector() {
  return createConnector((config) => ({
    id: "farcaster-celo-connector",
    name: "Farcaster Celo Connector",
    type: "farcaster-celo",
    ready: typeof window !== "undefined",

    async connect({ chainId = 44787 } = {}) {
      const provider = await this.getProvider();
      if (!provider) throw new Error("Celo wallet provider not available");

      try {
        const accounts = (await provider.request({ 
          method: "eth_requestAccounts" 
        })) as string[];
        
        let currentChainId = await this.getChainId();

        if (chainId && currentChainId !== chainId) {
          await this.switchChain({ chainId });
          currentChainId = chainId;
        }

        return {
          accounts: accounts.map(getAddress),
          chainId: currentChainId,
        };
      } catch (error) {
        console.error("Celo connection failed:", error);
        throw error;
      }
    },

    async getProvider(): Promise<EthProvider | null> {
      if (typeof window === "undefined") return null;
      return (sdk.wallet.ethProvider as EthProvider) ?? null;
    },

    async getChainId(): Promise<number> {
      const provider = await this.getProvider();
      if (!provider) throw new Error("Celo provider not initialized");

      try {
        const hexChainId = (await provider.request({ 
          method: "eth_chainId" 
        })) as Hex;
        return fromHex(hexChainId, "number");
      } catch (error) {
        console.error("Failed to get Celo chain ID:", error);
        throw error;
      }
    },

    async switchChain({ chainId }: SwitchChainParameters): Promise<Chain> {
      const provider = await this.getProvider();
      if (!provider) throw new Error("Celo provider not available");

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ 
            chainId: numberToHex(chainId) as Hex 
          }]
        });

        const chain = config.chains.find(c => c.id === chainId);
        if (!chain) throw new Error("Celo chain not configured");
        return chain;
      } catch (error) {
        console.error("Celo network switch failed:", error);
        throw new SwitchChainError(error as Error);
      }
    },

    async getAccounts(): Promise<`0x${string}`[]> {
      const provider = await this.getProvider();
      if (!provider) return [];

      try {
        const accounts = (await provider.request({ 
          method: "eth_accounts" 
        })) as string[];
        return accounts.map(a => getAddress(a) as `0x${string}`);
      } catch (error) {
        console.error("Failed to get Celo accounts:", error);
        return [];
      }
    },

    async isAuthorized(): Promise<boolean> {
      const provider = await this.getProvider();
      if (!provider) return false;
      return (await this.getAccounts()).length > 0;
    },

    async disconnect(): Promise<void> {
      // Frame-specific cleanup if needed
    },

    onAccountsChanged(accounts: string[]) {
      config.emitter.emit('change', { 
        accounts: accounts.map(a => getAddress(a)) 
      });
    },

    onChainChanged(chain: string) {
      const chainId = fromHex(chain as Hex, 'number');
      config.emitter.emit('change', { chainId });
    },

    onDisconnect() {
      config.emitter.emit('disconnect');
    }
  }));
}