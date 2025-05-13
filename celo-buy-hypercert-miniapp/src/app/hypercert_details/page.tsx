"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { getHypercertById, buyHypercertFraction, MarketplaceOrder } from "../../lib/graphqlQueries";
import { useAccount, useWalletClient, useConfig } from "wagmi";
import { Config, getConnectorClient } from '@wagmi/core';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import Link from "next/link";

// interface HypercertData {
//   hypercert_id: string;
//   units: number;
//   metadata: {
//     image: string;
//     name: string;
//     work_scope: string;
//     description: string;
//   };
//   orders?: {
//     totalUnitsForSale: number;
//     data: {
//       price: number;
//       pricePerPercentInUSD: number;
//       chainId: string;
//       currency: string;
//       signature: string;
//     }[];
//     cheapestOrder?: {
//       amounts: number[];
//     };
//   };
// }
interface HypercertData {
  hypercert_id: string;
  units: number;
  metadata: {
    image: string;
    name: string;
    work_scope: string | string[];
    description: string;
  };
  orders?: {
    totalUnitsForSale: number;
    data: MarketplaceOrder[];
    cheapestOrder?: {
      amounts: number[];
    };
  };
}

function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

// Action to convert a viem Wallet Client to an ethers.js Signer
async function getEthersSigner(
  config: Config,
  { chainId }: { chainId?: number } = {},
) {
  const client = await getConnectorClient(config, { chainId });
  return clientToSigner(client);
}

export default function HypercertDetails() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [hypercert, setHypercert] = useState<HypercertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<{ success?: boolean; error?: string; transactionHash?: string }>({});
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [unitsToBuy, setUnitsToBuy] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<'CELO' | 'USD'>('CELO');
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // const appUrl = process.env.NEXT_PUBLIC_URL;
  
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const config = useConfig();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      console.log("Farcaster SDK ready");
      sdk.actions.ready({});
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    const fetchHypercert = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getHypercertById(id);
        if (data && Array.isArray(data) && data.length > 0) {
          setHypercert(data[0] as unknown as HypercertData);
        } else {
          setHypercert(data as unknown as HypercertData);
        }
      } catch (error) {
        console.error("Error fetching hypercert details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHypercert();
  }, [id]);

  useEffect(() => {
    if (hypercert?.orders?.cheapestOrder?.amounts && hypercert.orders.cheapestOrder.amounts.length > 0) {
      setUnitsToBuy(Number(hypercert.orders.cheapestOrder.amounts[0]));
    }
  }, [hypercert]);

  const handleBuyFraction = async () => {
    if (!hypercert?.orders?.data || !address || !walletClient) {
      setPurchaseStatus({ error: "Missing required data" });
      return;
    }

    const signer = await getEthersSigner(config, { chainId: 42220 });
  //   const provider = new JsonRpcProvider("https://celo-mainnet.g.alchemy.com/v2/4FF6xgfo305aOiFhplzY7M6AaWWZMmg_");
  // // Create a signer that uses the walletClient to sign
  //   const signer = new JsonRpcSigner(provider, address);
    
    setPurchasing(true);
    setPurchaseStatus({});
    console.log("got here", signer);
    
    try {
      const order = hypercert.orders.data[0];
      const unitsToBuyBigInt = BigInt(unitsToBuy);
      
      const result = await buyHypercertFraction(
        order,
        unitsToBuyBigInt,
        address,
        BigInt(hypercert.units),
        signer
      );
      
      setPurchaseStatus({
        success: result.success,
        transactionHash: result.transactionHash,
        error: result.error ? String(result.error) : undefined
      });
      
      if (result.success) {
        setShowPurchaseModal(false);
      }
    } catch (error) {
      console.error("Error purchasing hypercert fraction:", error);
      setPurchaseStatus({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setPurchasing(false);
    }
  };

  const getMinUnits = () => {
    if (hypercert?.orders?.cheapestOrder?.amounts && hypercert.orders.cheapestOrder.amounts.length > 0) {
      return Number(hypercert.orders.cheapestOrder.amounts[0]);
    }
    return 1;
  };

  const getMaxUnits = () => {
    return hypercert?.orders?.totalUnitsForSale || 0;
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const min = getMinUnits();
    const max = getMaxUnits();
    
    if (isNaN(value)) {
      setUnitsToBuy(min);
    } else if (value < min) {
      setUnitsToBuy(min);
    } else if (value > max) {
      setUnitsToBuy(max);
    } else {
      setUnitsToBuy(value);
    }
  };

  const calculateTotalPrice = () => {
    if (!hypercert?.orders?.data || hypercert.orders.data.length === 0) {
      return 0;
    }
    
    const pricePerUnit = selectedCurrency === 'CELO' 
      ? parseFloat(hypercert.orders.data[0].price) 
      : parseFloat(hypercert.orders.data[0].pricePerPercentInUSD);
    
    return (pricePerUnit * unitsToBuy).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-teal-600 text-xl font-medium">Loading hypercert details...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        paddingTop: context?.client.safeAreaInsets?.top ?? 30, 
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-100 max-h-[93vh]">
          <div className="md:flex items-start">
            <div className="md:w-1/2 relative">
              {hypercert?.metadata?.image ? (
                <img
                  src={hypercert.metadata.image}
                  alt={hypercert.metadata.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-teal-200 to-cyan-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">Hypercert Image</span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <span className="text-teal-700 font-medium text-sm">Celo</span>
              </div>
            </div>
            <div className="md:w-1/2 p-8 max-h-[90vh] overflow-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-600">
                  {hypercert?.metadata?.name || "Hypercert Title"}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    ID: {hypercert?.hypercert_id ? `${hypercert.hypercert_id.substring(0, 4)}...${hypercert.hypercert_id.substring(hypercert.hypercert_id.length - 4)}` : id || "Unknown"}
                  </span>
                  {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                    Verified
                  </span> */}
                </div>
                <p className="text-gray-600 text-md">
                  {hypercert?.metadata?.description || "This hypercert represents a unique contribution to a public good. Own a fraction to support the creator and their work."}
                </p>
              </div>
              
              {hypercert?.metadata?.work_scope && (
                <div className="mb-6">
                  <h2 className="text-md font-semibold text-gray-800 mb-2">Work Scope</h2>
                  <p className="text-gray-600">
                    {typeof hypercert.metadata.work_scope === 'string' 
                      ? hypercert.metadata.work_scope.split(',').slice(0, 3).join(', ')
                      : Array.isArray(hypercert.metadata.work_scope)
                        ? (hypercert.metadata.work_scope as string[]).slice(0, 3).join(', ')
                        : hypercert.metadata.work_scope}
                  </p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-md font-semibold text-gray-800 mb-4">Purchase Fractions</h2>
                <div className="bg-teal-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-700 font-medium">Price per unit (CELO):</div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.data && hypercert.orders.data.length > 0
                        ? `${Number(hypercert.orders.data[0].price).toFixed(2)} CELO`
                        : "Not for sale"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-700 font-medium">Price per unit (USD):</div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.data && hypercert.orders.data.length > 0
                        ? `$${Number(hypercert.orders.data[0].pricePerPercentInUSD).toFixed(2)}`
                        : "Not for sale"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-700 font-medium">Min unit per order:</div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.cheapestOrder
                        ? `${hypercert.orders.cheapestOrder.amounts}`
                        : "Not for sale"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700 font-medium">Available fractions:</div>
                    <div className="font-bold text-teal-700">
                      {hypercert?.orders?.totalUnitsForSale 
                        ? `${hypercert.orders.totalUnitsForSale}/${hypercert.units}` 
                        : `0/${hypercert?.units || 0}`}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      mounted,
                    }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      return (
                        <div
                          {...(!ready && {
                            'aria-hidden': true,
                            style: {
                              opacity: 0,
                              pointerEvents: 'none',
                              userSelect: 'none',
                            },
                          })}
                          className="w-full"
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <button
                                  onClick={openConnectModal}
                                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-xl shadow-sm hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                                >
                                  Connect Wallet
                                </button>
                              );
                            }

                            if (chain.unsupported) {
                              return (
                                <button
                                  onClick={openChainModal}
                                  className="w-full py-3 bg-red-500 text-white font-medium rounded-xl shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                >
                                  Switch to Celo
                                </button>
                              );
                            }

                            return (
                              <div className="flex flex-col space-y-3">
                                <button
                                  onClick={openAccountModal}
                                  className="flex items-center justify-center space-x-2 w-full py-3 bg-teal-100 text-teal-800 font-medium rounded-xl hover:bg-teal-200 transition-all duration-200"
                                >
                                  <span>{account.displayName}</span>
                                  <span>{account.displayBalance ? ` (${account.displayBalance})` : ''}</span>
                                </button>
                                
                                <button 
                                  className={`w-full py-3 font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ${
                                    hypercert?.orders?.totalUnitsForSale && !purchasing
                                      ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700" 
                                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                  }`}
                                  disabled={!hypercert?.orders?.totalUnitsForSale || purchasing}
                                  onClick={() => setShowPurchaseModal(true)}
                                >
                                  {purchasing ? (
                                    <div className="flex items-center justify-center">
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                      Processing...
                                    </div>
                                  ) : hypercert?.orders?.totalUnitsForSale ? (
                                    "Buy Fractions"
                                  ) : (
                                    "Not Available"
                                  )}
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                  
                  <Link 
                    href="/"
                    className="text-center py-3 text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowPurchaseModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">Buy Hypercert Fractions</h2>
            
            {purchaseStatus.success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Purchase successful!</span>
              </div>
              {purchaseStatus.transactionHash && (
                <a
                  href={`https://explorer.celo.org/mainnet/tx/${purchaseStatus.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-800 underline mt-2 inline-block"
                >
                  View transaction
                </a>
              )}
            </div>
          )}

          {purchaseStatus.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Transaction failed</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{purchaseStatus.error}</p>
            </div>
          )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Units to Buy
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={unitsToBuy}
                  onChange={handleUnitChange}
                  min={getMinUnits()}
                  max={getMaxUnits()}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Min: {getMinUnits()} | Max: {getMaxUnits()}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedCurrency('CELO')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    selectedCurrency === 'CELO'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  CELO
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCurrency('USD')}
                  className={`flex-1 py-2 px-4 rounded-lg border ${
                    selectedCurrency === 'USD'
                      ? 'bg-teal-50 border-teal-500 text-teal-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  USD
                </button>
              </div>
            </div>
            
            <div className="bg-teal-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Price:</span>
                <span className="font-bold text-teal-700">
                  {selectedCurrency === 'CELO' 
                    ? `${calculateTotalPrice()} CELO` 
                    : `$${calculateTotalPrice()}`}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPurchaseModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBuyFraction}
                disabled={purchasing || !hypercert?.orders?.data || !address || !walletClient}
                className={`px-4 py-2 rounded-lg text-white ${
                  purchasing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                }`}
              >
                {purchasing ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Purchase'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
