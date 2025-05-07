"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import dynamic from "next/dynamic";
import Application from "./components/Application";

declare global {
  interface Window {
    ethereum?: {
      request: (args: any) => Promise<any>;
      isFrame?: boolean;
    };
  }
}

const GameModal = ({ onClose, connecting }: { onClose: () => void, connecting: boolean }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4">Connect to Play</h2>
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          To play the word guessing game, you need to:
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-6">
          <li>Connect your Celo-compatible wallet</li>
          <li>Ensure you're on the Celo network (Mainnet or Alfajores)</li>
          <li>Have some test CELO for transactions (if needed)</li>
        </ol>
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={onClose}
          disabled={connecting}
          className="w-full bg-celo-green text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {connecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            "Connect Wallet"
          )}
        </button>
        <button
          onClick={addCeloNetwork}
          className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Add Celo Network
        </button>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const [showModal, setShowModal] = useState(true);
  const [connecting, setConnecting] = useState(false);

  // Celo network check
  const isCeloNetwork = chain?.id === celo.id || chain?.id === celoAlfajores.id;

  useEffect(() => {
    if (!isConnected || !isCeloNetwork) {
      setShowModal(true);
    }
  }, [isConnected, isCeloNetwork]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      
      // Directly trigger wallet connection
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        // Check if we need to switch networks
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (chainId !== "0xaef3" && chainId !== "0xa4ec") {
          await addCeloNetwork();
        }
        
        setShowModal(false);
      } else {
        alert("Please install a Celo-compatible wallet!");
      }
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setConnecting(false);
    }
  };

  if (isConnected && isCeloNetwork) {
    return <Application />;
  }

  return (
    <>
      {showModal && <GameModal onClose={handleConnect} connecting={connecting} />}
      
      {/* Show nothing else while modal is open */}
    </>
  );
};

// Keep the existing addCeloNetwork function
async function addCeloNetwork() {
  const ethereum = window.ethereum;
  if (!ethereum) {
    alert("Please install a Celo-compatible wallet!");
    return;
  }

  try {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0xaef3",
        chainName: "Celo Alfajores Testnet",
        nativeCurrency: {
          name: "CELO",
          symbol: "CELO", 
          decimals: 18
        },
        rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
        blockExplorerUrls: ["https://alfajores.celoscan.io"]
      }]
    });
  } catch (error) {
    console.error("Failed to add Celo network:", error);
  }
}

export default Home;