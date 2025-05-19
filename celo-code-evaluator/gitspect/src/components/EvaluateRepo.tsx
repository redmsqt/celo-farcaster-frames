"use client";

import { useState, useCallback, FormEvent, useEffect } from "react";
import {
  useSendTransaction,
  useAccount,
  useConnect,
  useSwitchChain,
  useWaitForTransactionReceipt,
  type UseSendTransactionParameters,
} from "wagmi";
import { parseEther } from "viem";
import { AuditResult } from "../../types/audit";
import { auditRepository } from "../../services/auditService";
import { celo } from "wagmi/chains";
import sdk from "@farcaster/frame-sdk";
import { UserRejectedRequestError } from "viem";

type SendTransactionArgs = UseSendTransactionParameters & {
  to: `0x${string}`;
  value: bigint;
};

export default function EvaluateRepo() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const {
    data: hash,
    sendTransaction,
    isPending: isPaymentProcessing,
  } = useSendTransaction();

  const { switchChain } = useSwitchChain();

  const {
    isSuccess: isConfirmed,
    status,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [githubUrl, setGithubUrl] = useState<string>("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string>("");
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);
  const [isAwaitingPayment, setIsAwaitingPayment] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle audit after confirmation
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate input
    if (!isConnected) return setError("Please connect your wallet first");
    if (!githubUrl) return setError("Please enter a GitHub repository URL");
    if (!githubUrl.match(/^https?:\/\/github\.com\/[^/]+\/[^/]+/)) {
      return setError("Please enter a valid GitHub repository URL");
    }

    setIsProcessing(true);
    setIsAwaitingPayment(true);

    try {
      // 1. Switch network
      await switchChain({ chainId: celo.id });

      // 2. Send transaction and wait for hash
      await sendTransactionAsync({
        to: process.env.NEXT_PUBLIC_CELO_ADDRESS as `0x${string}`,
        value: parseEther("0.01"),
      });

      setIsAwaitingPayment(false); // Payment approved

      // 3. Wait for on-chain confirmation
      if (status == "error") {
        throw new Error("Transaction reverted");
      }
    } catch (err) {
      setIsAwaitingPayment(false);
      setIsProcessing(false);
      if (err instanceof UserRejectedRequestError) {
        setError("Payment cancelled");
      } else {
        console.error("Transaction error:", err);
        setError(err instanceof Error ? err.message : "Transaction failed");
      }
    }
  };

  // Enhanced transaction handler
  const sendTransactionAsync = useCallback(
    async (tx: SendTransactionArgs): Promise<`0x${string}`> => {
      return new Promise<`0x${string}`>((resolve, reject) => {
        sendTransaction(tx, {
          onSuccess: (hash) => resolve(hash),
          onError: (err) => reject(err),
        });
      });
    },
    [sendTransaction]
  );

  // Effect for audit (unchanged)
  useEffect(() => {
    if (isConfirmed && isProcessing) {
      performAudit();
    }
    if (isError) {
      setIsProcessing(false);
      setIsAwaitingPayment(false);
      setError("Transaction failed");
    }
  }, [isConfirmed, isProcessing, isError]);

  const performAudit = async () => {
    try {
      const result = await auditRepository(githubUrl);
      setAuditResult(result);
    } catch (err) {
      setError("Failed to perform audit");
      console.error("Audit error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const shareAuditResult = async () => {
    if (!auditResult) return;

    if (!auditResult?.criteria?.length) return null;
    // Format criteria as bullet points
    const criteriaText = auditResult.criteria
      .map(
        (criterion) =>
          `• ${criterion.name}: ${criterion.score}\n` +
          (expandedCriteria === criterion.name
            ? `  ${criterion.justification}\n`
            : "")
      )
      .join("\n");

    await sdk.actions.composeCast({
      text:
        `🔍 I just reviewed ${auditResult.repoName} on Celo!\n\n` +
        `⭐ Overall Score: ${auditResult.score}/10\n\n` +
        `📊 Audit Criteria:\n${criteriaText}\n`,
      embeds: ["https://gitspect.vercel.app/"],
    });
  };

  const toggleCriteria = (name: string) => {
    setExpandedCriteria(expandedCriteria === name ? null : name);
  };

  const renderCriteria = () => {
    if (!auditResult?.criteria?.length) return null;

    return (
      <div className="mt-4 space-y-2">
        <h3 className="font-medium text-lg mb-2">Project Scores</h3>
        {auditResult.criteria.map((criterion) => (
          <div key={criterion.name} className="border-b border-gray-700 pb-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleCriteria(criterion.name)}
            >
              <span className="font-semibold">{criterion.name}</span>
              <span className="font-bold text-blue-400">{criterion.score}</span>
            </div>
            {expandedCriteria === criterion.name && (
              <div className="mt-2 text-sm text-gray-300">
                {criterion.justification}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMetrics = () => {
    if (!auditResult?.metrics) return null;

    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {auditResult.metrics.stars !== undefined && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="text-gray-400 text-sm">Stars</div>
            <div className="text-xl font-bold">{auditResult.metrics.stars}</div>
          </div>
        )}
        {auditResult.metrics.forks !== undefined && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="text-gray-400 text-sm">Forks</div>
            <div className="text-xl font-bold">{auditResult.metrics.forks}</div>
          </div>
        )}
        {auditResult.metrics.contributors !== undefined && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="text-gray-400 text-sm">Contributors</div>
            <div className="text-xl font-bold">
              {auditResult.metrics.contributors}
            </div>
          </div>
        )}
        {auditResult.metrics.commits !== undefined && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="text-gray-400 text-sm">Commits</div>
            <div className="text-xl font-bold">
              {auditResult.metrics.commits}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLanguages = () => {
    if (!auditResult?.metrics?.languages) return null;

    return (
      <div className="mt-4">
        <h3 className="font-medium mb-2">Language Distribution:</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(auditResult.metrics.languages).map(
            ([lang, percent]) => (
              <span
                key={lang}
                className="bg-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {lang}: {percent}%
              </span>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 flex flex-col">
      <div className="max-w-md mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            GitSpect
          </h1>
          <p className="text-gray-400">Celo Project Auditor</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl py-6 px-4 border border-gray-700 shadow-lg">
          {!isConnected ? (
            <div className="text-center">
              <p className="mb-6 text-gray-300">
                Connect your wallet to audit Celo projects
              </p>
              <button
                type="button"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition"
                onClick={() => connect({ connector: connectors[0] })}
              >
                Connect Wallet
              </button>
            </div>
          ) : !auditResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="repoUrl"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  id="repoUrl"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  disabled={isPaymentProcessing || isProcessing}
                />
              </div>

              <button
                type="submit"
                disabled={isPaymentProcessing || isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  isPaymentProcessing || isProcessing
                    ? "bg-blue-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
                }`}
              >
                {isPaymentProcessing || isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isAwaitingPayment
                      ? "Confirm Payment in Wallet..."
                      : "Processing..."}
                  </div>
                ) : (
                  <span>Inspect Repository (0.01 CELO)</span>
                )}
              </button>

              <p className="text-center text-sm text-gray-400 mt-2">
                {isConnected
                  ? "A small 0.01 CELO payment is required"
                  : "Connect wallet to perform audit"}
              </p>

              {error && (
                <div className="mt-2 w-full">
                  <div className="text-sm max-w-[24ch] truncate text-red-500">
                    {error}
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Audit Results</h2>
                <div className="text-sm text-green-400">Paid: 0.01 CELO</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Repository:</span>
                  <span className="font-medium">{auditResult.repoName}</span>
                </div>

                {auditResult.score !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Overall Score:</span>
                    <span
                      className={`font-bold text-xl ${
                        auditResult.score >= 8
                          ? "text-green-400"
                          : auditResult.score >= 5
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {auditResult.score.toFixed(1)}/10
                    </span>
                  </div>
                )}

                {renderMetrics()}
                {renderLanguages()}
                {renderCriteria()}
              </div>

              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => {
                    setAuditResult(null);
                    setGithubUrl("");
                  }}
                  className="w-full py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition"
                >
                  Audit Another Repository
                </button>
                <button
                  onClick={() => shareAuditResult()}
                  className="w-full py-2 px-4 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 transition"
                >
                  Share Results
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Professional code reviews for Celo blockchain projects</p>
        </div>
      </div>
    </div>
  );
}
