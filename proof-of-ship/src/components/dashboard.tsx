/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { createStore } from "mipd";
import { useAccount } from "wagmi";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import Leaderboard from "./leaderboard";
import UserScore from "./user-score";
import Countdown from "./countdown";
import { useVerification } from "~/hooks/useVerification";
import { useBuilderScore } from "~/hooks/useBuilderScore";
import { Londrina_Solid } from "next/font/google";
import RewardTiers from "./reward-tiers";

const londrina = Londrina_Solid({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Dashboard() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const {
    isVerified,
    setIsVerified,
    isLoading: isVerificationLoading,
  } = useVerification();
  const { address } = useAccount();
  const {
    builderScore,
    rank,
    mutate: refetchBuilderScore,
    isLoadingScore,
  } = useBuilderScore(isVerified);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
      });
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
    if (isVerified) {
      refetchBuilderScore();
    }
  }, [isVerified, refetchBuilderScore]);

  const selfApp = address
    ? new SelfAppBuilder({
        appName: "Weekly builder rewards",
        scope: "proof-of-ship-scope",
        endpoint: `${window.location.origin}/api/verify`,
        userId: address,
        userIdType: "hex",
        endpointType: "https",
      }).build()
    : null;
  console.log("selfApp", selfApp);

  const renderContent = () => {
    if (!isSDKLoaded) {
      return (
        <div className="flex flex-col items-center justify-center h-[600px]">
          <span className="loader mb-4" />
          <div className="text-white text-lg font-semibold animate-pulse">
            Loading...
          </div>
        </div>
      );
    }

    if (!address) {
      return (
        <div className="flex items-center justify-center h-[600px]">
          <ConnectButton />
        </div>
      );
    }

    if (isVerificationLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[600px]">
          <span className="loader mb-4" />
          <div className="text-white text-lg font-semibold animate-pulse">
            Checking verification status...
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md mx-auto py-8 px-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 relative min-h-[600px]">
        <h1
          className={`text-3xl font-bold text-center text-white ${londrina.className} mb-8`}
        >
          Weekly Builder Rewards
        </h1>
        <div className="flex flex-col items-center">
          {!isVerified && !isVerificationLoading && selfApp && (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-white drop-shadow">
                Verify Your Identity
              </h2>
              <p className="mb-4 text-gray-200 text-center max-w-xs">
                Scan the QR code with your Self app to verify your identity
              </p>
              <div className="p-3 rounded-2xl bg-white/20 border border-white/30 shadow-lg animate-pulse-slow">
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={async () => {
                    await fetch(`/api/builder-score/${address}`, {
                      method: "POST",
                    });
                    setIsVerified(true);
                    if (address) {
                      await refetchBuilderScore();
                    }
                  }}
                  size={300}
                />
              </div>
            </div>
          )}
          {isVerified && (
            <>
              {builderScore && builderScore < 40 ? (
                <UserScore
                  rank={0}
                  score={builderScore || 0}
                  isLoading={isLoadingScore}
                />
              ) : (
                <UserScore
                  rank={rank || 0}
                  score={builderScore || 0}
                  isLoading={isLoadingScore}
                />
              )}
              <div className="flex flex-row items-center justify-between gap-4 mb-4">
                <RewardTiers />
                <Countdown />
              </div>
              <Leaderboard
                isVerified={isVerified}
                builderScore={builderScore || 0}
              />
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
      className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#334155] flex items-center justify-center"
    >
      <div className="w-full max-w-md mx-auto p-4">{renderContent()}</div>
    </div>
  );
}
