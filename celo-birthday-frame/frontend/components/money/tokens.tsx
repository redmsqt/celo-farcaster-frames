'use client'

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CELO, cEUR, cREAL, cUSD, Token, USDC } from "@/data/token";
import { TokenIcon } from "@/components/tokens/TokenIcon";

const tokens: Token[] = [
  CELO, cUSD, cEUR, cREAL, USDC
];

interface TokensProps {
  setStepsFn: React.Dispatch<React.SetStateAction<number>>;
  setTokenFn: React.Dispatch<React.SetStateAction<Token | null>>;
}

export default function Tokens({ setTokenFn, setStepsFn }: TokensProps) {

  const [selectedId, setSelectedId] = useState<string | null>("education");

  return (
    <div className="w-full flex flex-col items-center justify-start">

      {/* Main Headline */}
      <h1 className="text-[#FFF8C9] text-2xl -mt-4 sm:text-3xl font-bold mb-4 leading-snug">
        Select the <br />
        currency <br />
      </h1>

      <div className="w-full max-w-sm h-[600px]">
        <div className="flex flex-col overflow-y-auto py-2 max-h-[calc(100vh-350px)] space-y-4 scrollbar-hide items-center" style={{ scrollbarWidth: 'none' }}>
          {tokens.map((token) => {
            const isSelected = selectedId === token.id;
            return ((
              <button
                key={token.id}
                onClick={() => {
                  setSelectedId(token.id)
                  setTokenFn(token)
                }}
                className={`w-full max-w-xs ${isSelected ? "bg-teal-600 text-[#FFF8C9]" : "bg-[#FFF1C6] text-[#2D0C72]"}
                    text-lg font-semibold px-6 py-4 rounded-2xl shadow-sm 
                    hover:scale-[1.02] transition-all
                    flex items-center space-x-4`}
              >
                <div className="w-8 h-8 flex-shrink-0">
                  {token && <TokenIcon token={token} />}
                </div>
                <span className="flex-grow text-left">{token.name}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              </button>
            ))
          })}

        </div>

        {selectedId && (
          <div className="bg-gradient-to-t mt-5 from-[#2D0C72] pb-2">
            <button
              className="w-40 bg-yellow-400 text-[#2D0C72] py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
              onClick={() => setStepsFn(1)}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
