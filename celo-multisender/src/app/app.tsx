"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { sdk } from "@farcaster/frame-sdk";
import { APP_NAME } from "~/lib/constants";

// note: dynamic import is required for components that use the Frame SDK
const AppComponent = dynamic(() => import("~/components/App"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: APP_NAME }
) {
  useEffect(() => {
    const add = async () => {
      try {
        await sdk.actions.addMiniApp();
        await sdk.actions.ready();
      } catch (err) {
        console.error("Failed to add mini app:", err);
      }
    };
    add();
  }, []);

  return <AppComponent title={title} />;
}
