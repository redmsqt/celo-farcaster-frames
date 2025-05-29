/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { createStore } from "mipd";
import { useAccount } from "wagmi";
import { getUniversalLink, SelfAppBuilder } from "@selfxyz/core";
import { CheckCircle2 } from "lucide-react";
import Leaderboard from "./leaderboard";
import UserScore from "./user-score";
import Countdown from "./countdown";
import { useVerification } from "~/hooks/useVerification";
import { useBuilderScore } from "~/hooks/useBuilderScore";
import { Londrina_Solid } from "next/font/google";
import RewardTiers from "./reward-tiers";
import { Button } from "./ui/button";
import Information from "./information";
const londrina = Londrina_Solid({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Dashboard() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const { address } = useAccount();
  const [userFid, setUserFid] = useState<number | undefined>();
  const { isVerified } = useVerification(userFid);
  const {
    builderScore,
    rank,
    mutate: refetchBuilderScore,
    isLoadingScore,
  } = useBuilderScore();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      const user = context.user;
      setUserFid(user?.fid);
      setContext(context);
      sdk.actions.ready({});
      if (user?.fid) {
        refetchBuilderScore(user);
      }

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

  const userId = userFid ? `0x${userFid.toString(16)}` : undefined;
  console.log("userId", userId);

  const selfApp = address
    ? new SelfAppBuilder({
        appName: "Shipper",
        scope: "proof-of-ship-scope",
        endpoint: `${window.location.origin}/api/verify`,
        userId,
        userIdType: "hex",
        endpointType: "https",
        logoBase64: "https://your-logo-url.png",
      }).build()
    : null;

  const deeplink = selfApp ? getUniversalLink(selfApp) : null;

  const handleMobileDeeplink = async () => {
    if (deeplink) {
      try {
        window.location.href = deeplink;
      } catch (error) {
        console.error("Error handling deeplink:", error);
      }
    }
  };

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

    return (
      <div className="w-full max-w-md mx-auto py-8 px-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 relative min-h-[600px]">
        <h1
          className={`text-2xl font-bold text-center text-white ${londrina.className} mb-8`}
        >
          SHIPPER
        </h1>
        <div className="flex flex-col items-center">
          {
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
              {deeplink && (
                <div className="w-full flex items-center justify-between bg-white/5 p-4 rounded-lg mb-4">
                  <div className="flex-col text-white text-left text-base leading-tight">
                    Verify with self.xyz
                    <br />& earn +25 points
                  </div>
                  <div className="flex items-center justify-center">
                    {isVerified ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Button
                        onClick={handleMobileDeeplink}
                        className="bg-purple-400 hover:bg-purple-500 text-xs px-1 py-1 rounded-sm text-white shadow-md transition-colors duration-200"
                      >
                        Verify Now
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-row items-center justify-between gap-4 mb-4">
                <RewardTiers />
                <Countdown />
                <Information />
              </div>
              {!isLoadingScore && (
                <Leaderboard builderScore={builderScore || 0} />
              )}
            </>
          }
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
