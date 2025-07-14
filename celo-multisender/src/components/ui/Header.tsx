"use client";

import { useState } from "react";
import { APP_NAME } from "~/lib/constants";
import sdk from "@farcaster/frame-sdk";
import { useMiniApp } from "@neynar/react";

type HeaderProps = {
  neynarUser?: {
    fid: number;
    score: number;
  } | null;
};

export function Header({ neynarUser }: HeaderProps) {
  const { context } = useMiniApp();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <div className="mt-4 mb-4 mx-4 px-2 py-2 bg-gray-100 rounded-lg flex items-center justify-between border-[3px] border-double border-yellow-500 text-black">
        <div className="text-lg font-light">Welcome to {APP_NAME}!</div>
        {context?.user && (
          <div
            className="cursor-pointer"
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
            }}
          >
            {context.user.pfpUrl && (
              <img
                src={context.user.pfpUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-yellow-500"
              />
            )}
          </div>
        )}
      </div>
      {context?.user && (
        <>
          {isUserDropdownOpen && (
            <div className="absolute top-full right-0 z-50 w-fit mt-1 mx-4 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-3 space-y-2">
                <div className="text-right">
                  <h3
                    className="font-bold text-sm hover:underline cursor-pointer inline-block"
                    onClick={() =>
                      sdk.actions.viewProfile({ fid: context.user.fid })
                    }
                  >
                    {context.user.displayName || context.user.username}
                  </h3>
                  <p className="text-xs text-black">@{context.user.username}</p>
                  <p className="text-xs text-black">FID: {context.user.fid}</p>
                  {neynarUser && (
                    <>
                      <p className="text-xs text-black">
                        Neynar Score: {neynarUser.score}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
