import { useState, useEffect } from "react";
import {
  type BaseError,
  useAccount,
  useBalance,
  useConnect,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
  useSendTransaction,
} from "wagmi";
import { celo } from "wagmi/chains";
import { parseEther, encodeFunctionData } from "viem";
import MultiSendABI from "../../ABI/MultisendABI.json";
import { getReferralTag, submitReferral } from "@divvi/referral-sdk";
import { config } from "./providers/WagmiProvider";
import { MultiSendContract } from "../lib/constants";

export default function TokenSender() {
  const { isConnected, chain, address } = useAccount();
  const { switchChain } = useSwitchChain();
  const { connect, connectors } = useConnect();
  const { data: balance } = useBalance({
    address: useAccount().address,
    chainId: celo.id,
  });
  const { sendTransactionAsync } = useSendTransaction({ config });

  const {
    data: hash,
    error: txError,
    isPending: isSending,
  } = useWriteContract();
  const { isLoading: isConfirming, status } = useWaitForTransactionReceipt({
    hash,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Search users with debounce
  useEffect(() => {
    // Fetch users from the API based on searchQuery, with debounce to avoid too many requests
    const fetchUsers = async () => {
      if (searchQuery.length === 0) return;

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/user?q=${encodeURIComponent(searchQuery)}&limit=5`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        // Filter out users already selected
        const filteredData = data.filter(
          (user: any) =>
            !selectedUsers.some((selected) => selected.fid === user.fid)
        );
        setSearchResults(filteredData || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce timer to limit API calls
    const debounceTimer = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedUsers]);

  // Add a user to the selectedUsers list
  const addUser = (user: any) => {
    if (!selectedUsers.some((u) => u.fid === user.fid)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Remove a user from the selectedUsers list by fid
  const removeUser = (fid: number) => {
    setSelectedUsers(selectedUsers.filter((user) => user.fid !== fid));
  };

  // Handle sending tokens to selected users
  const handleSend = async () => {
    setError("");
    setSuccess("");

    // Validate wallet connection and input
    if (!isConnected || !address)
      return setError("Please connect your wallet first");
    if (selectedUsers.length === 0)
      return setError("Please select at least one user");
    if (!amount || parseFloat(amount) <= 0)
      return setError("Please enter a valid amount");

    const totalAmount = parseFloat(amount) * selectedUsers.length;
    if (balance && parseFloat(balance.formatted) < totalAmount) {
      return setError(
        `Insufficient balance. You need ${totalAmount} CELO but only have ${parseFloat(
          balance.formatted
        ).toFixed(4)}`
      );
    }

    try {
      // Switch to Celo chain if not already on it
      if (chain?.id !== celo.id) {
        await switchChain({ chainId: celo.id });
      }

      // Collect addresses from selected users
      const addresses: string[] = [];
      for (const user of selectedUsers) {
        const address = user.verified_addresses?.eth_addresses?.[0];
        if (!address) {
          console.warn(
            `User ${user.username} has no verified address, skipping`
          );
          continue;
        }
        addresses.push(address);
      }

      // Get referral tag for tracking on Divvi
      const referralTag = getReferralTag({
        user: address,
        consumer: "0xC00DA57cDE8dcB4ED4a8141784B5B4A5CBf62551",
      });

      // Encode multisend transaction data
      const multiSendData = encodeFunctionData({
        abi: MultiSendABI,
        functionName: "multiSend",
        args: [addresses],
      });

      // Combine multisend data with referral tag if present
      const combinedData = referralTag
        ? multiSendData + referralTag
        : multiSendData;

      // Send the transaction
      const txHash = await sendTransactionAsync({
        to: MultiSendContract as `0x${string}`,
        data: combinedData as `0x${string}`,
        value: parseEther(`${totalAmount}`),
      });

      // Check for transaction error
      if (status === "error") throw new Error("Transaction reverted");

      try {
        // Submit referral for tracking
        await submitReferral({
          txHash: txHash,
          chainId: 42220,
        });
      } catch (referralError) {
        console.error("Referral submission error:", referralError);
      }

      setSuccess(
        `Successfully sent ${amount} CELO to ${selectedUsers.length} users`
      );
      setSelectedUsers([]);
      setAmount("");
    } catch (error: any) {
      console.error("Send error:", error);
      setError(error.message || "Transaction failed");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Multi-Send Celo on Farcaster
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Search for users and send them Celo tokens in bulk
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {txError && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">
              {(txError as BaseError).shortMessage || txError.message}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 rounded-md">
            <p className="text-sm text-green-700">{success}</p>
            {hash && (
              <a
                href={`https://celoscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline text-xs"
              >
                View transaction on Celo Explorer
              </a>
            )}
          </div>
        )}

        <div style={{ width: "100%", marginBottom: "2rem" }}>
          {!isConnected ? (
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#cbd5e1",
                  marginBottom: "1.5rem",
                  fontSize: "1.3rem",
                }}
              >
                Connect your wallet
              </p>
              <button
                className="font-vt323 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-800 text-white text-xl mb-2
             transition-all duration-200 ease-in-out
             hover:border-2 hover:border-white hover:-translate-y-0.5 hover:shadow-lg
             active:scale-95 active:bg-white/10 active:border-2 active:border-white/80
             relative overflow-hidden"
                onClick={() => connect({ connector: connectors[0] })}
              >
                CONNECT WALLET
              </button>
            </div>
          ) : chain?.id !== celo.id ? (
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#cbd5e1",
                  marginBottom: "1.5rem",
                  fontSize: "1.3rem",
                }}
              >
                Switch to Celo network
              </p>
              <button
                type="button"
                className="font-vt323 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-800 text-white text-xl mb-2
             transition-all duration-200 ease-in-out
             hover:border-2 hover:border-white hover:-translate-y-0.5 hover:shadow-lg
             active:scale-95 active:bg-white/10 active:border-2 active:border-white/80
             relative overflow-hidden"
                onClick={() => switchChain({ chainId: celo.id })}
              >
                SWITCH TO CELO
              </button>
            </div>
          ) : null}
        </div>

        {isConnected && chain?.id === celo.id && (
          <>
            <div className="mb-6">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Farcaster Users
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching && (
                <p className="mt-1 text-sm text-gray-500">Searching...</p>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Users
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.fid}
                      className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => addUser(user)}
                    >
                      <img
                        src={user.pfp_url}
                        alt={user.username}
                        className="w-10 h-10 rounded-full mr-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/default-pfp.png";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          @{user.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.display_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedUsers.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Users ({selectedUsers.length})
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.fid}
                      className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src={user.pfp_url}
                          alt={user.username}
                          className="w-10 h-10 rounded-full mr-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/default-pfp.png";
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeUser(user.fid)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount per User (CELO)
              </label>
              <input
                type="number"
                id="amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {balance && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Your balance: {parseFloat(balance.formatted).toFixed(4)}{" "}
                    CELO
                  </p>
                  {amount && selectedUsers.length > 0 && (
                    <p>
                      Total to send:{" "}
                      {(parseFloat(amount) * selectedUsers.length).toFixed(4)}{" "}
                      CELO
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={
                isSending ||
                isConfirming ||
                selectedUsers.length === 0 ||
                !amount
              }
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSending ||
                isConfirming ||
                selectedUsers.length === 0 ||
                !amount
                  ? "bg-yellow-300 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              }`}
            >
              {isSending
                ? "Preparing transactions..."
                : isConfirming
                ? "Processing transactions..."
                : selectedUsers.length === 0
                ? "Select users to send"
                : `Send ${amount} CELO to ${selectedUsers.length} user${
                    selectedUsers.length > 1 ? "s" : ""
                  }`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
