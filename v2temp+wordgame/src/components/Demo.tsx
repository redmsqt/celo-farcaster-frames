"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import sdk, { FrameNotificationDetails, type Context } from "@farcaster/frame-sdk";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useDisconnect,
} from "wagmi";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";

export default function Demo({ title }: { title?: string } = { title: "Frames v2 Demo" }) {
  const router = useRouter(); // Initialize router

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready({});
    };

    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

        <div className="mb-4">
          <h2 className="font-2xl font-bold">Actions</h2>

          {/* Play Wordle Button with Route Navigation */}
          <div className="mb-4">
            <Button onClick={() => router.push("/word-guessing-game")}>
              Play Wordle
            </Button>
          </div>

          {/* Disconnect Button */}
          <div className="mb-4">
            <Button onClick={()=> disconnect}>Disconnect</Button>
          </div>
        </div>

        {/* Wallet Info */}
        <div>
          <h2 className="font-2xl font-bold">Wallet</h2>
          {address && (
            <div className="my-2 text-xs">
              Address: <pre className="inline">{truncateAddress(address)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
