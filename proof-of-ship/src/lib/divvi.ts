import { getDataSuffix, submitReferral } from "@divvi/referral-sdk";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

// Your Divvi consumer identifier
const DIVVI_CONSUMER = (process.env.NEXT_PUBLIC_DIVVI_CONSUMER ||
  "") as `0x${string}`;

// Divvi provider addresses from environment variables
const DIVVI_PROVIDERS = (process.env.NEXT_PUBLIC_DIVVI_PROVIDERS || "")
  .split(",")
  .filter((addr) => addr.trim() !== "")
  .map((addr) => addr.trim() as `0x${string}`);

// Initialize wallet client
export const initWalletClient = async () => {
  if (typeof window === "undefined") return null;

  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum),
  });

  const [account] = await walletClient.getAddresses();
  return { walletClient, account };
};

// Generate Divvi data suffix for referral tracking
export const generateDivviDataSuffix = (customProviders?: `0x${string}`[]) => {
  // Use custom providers if provided, otherwise use default providers
  const providers = customProviders || DIVVI_PROVIDERS;

  if (providers.length === 0) {
    console.warn(
      "No Divvi providers configured. Please set NEXT_PUBLIC_DIVVI_PROVIDERS environment variable."
    );
  }

  return getDataSuffix({
    consumer: DIVVI_CONSUMER,
    providers,
  });
};

// Submit referral to Divvi
export const submitDivviReferral = async (
  txHash: `0x${string}`,
  chainId: number
) => {
  try {
    await submitReferral({
      txHash,
      chainId,
    });
  } catch (error) {
    console.error("Failed to submit referral to Divvi:", error);
    throw error;
  }
};
