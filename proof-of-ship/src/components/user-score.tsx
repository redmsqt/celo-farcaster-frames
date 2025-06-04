import React from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

const getLevelDescription = (score: number) => {
  if (score < 40) return null;
  if (score >= 250)
    return "Master - You're one of the most accomplished builders in the ecosystem!";
  if (score >= 170)
    return "Expert - You're among the top builders with an exceptional track record!";
  if (score >= 120)
    return "Advanced - You've built some impressive things and contributed to notable projects!";
  if (score >= 80)
    return "Practitioner - You've established yourself as a serious builder with real impact!";
  if (score >= 40)
    return "Apprentice - You're building sporadically and starting to make your mark!";
  return null;
};

export default function UserScore({
  rank = 4,
  score = 0,
  isLoading = false,
}: {
  rank?: number;
  score?: number;
  isLoading?: boolean;
}) {
  const levelDescription = getLevelDescription(score);

  if (isLoading) {
    return (
      <Alert className="bg-purple-500 text-white border-none rounded-xl px-3 py-3 font-semibold shadow-md mb-4 w-full max-w-xl mx-auto flex items-center animate-pulse">
        <AlertTitle className="bg-purple-500 rounded-lg px-4 py-2 font-bold text-3xl flex items-center justify-center mr-3 mb-0 w-16 h-12">
          &nbsp;
        </AlertTitle>
        <AlertDescription className="text-base font-medium break-words w-48 h-6">
          &nbsp;
        </AlertDescription>
      </Alert>
    );
  }

  if (score < 40) {
    return (
      <Alert className="bg-purple-600 text-white border-none rounded-xl px-2 py-2 font-semibold shadow-md mb-4 w-full max-w-xl mx-auto flex items-center">
        <AlertDescription className="text-sm font-medium break-words">
          Your score is below 40. Please update your profile on{" "}
          <a
            href="https://talentprotocol.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white"
          >
            Talent Protocol
          </a>
          .Please make sure you have connected your Farcaster account with
          Talent Protocol.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-purple-500 text-white border-none rounded-xl px-2 py-2 font-semibold shadow-md mb-4 w-full max-w-xl mx-auto flex items-center">
      <AlertTitle className="bg-purple-500 rounded-lg px-4 py-2 font-bold text-3xl flex items-center justify-center mr-3 mb-0">
        #{rank}
      </AlertTitle>
      <AlertDescription className="text-sm font-medium break-words">
        {levelDescription && <div className="mb-2">{levelDescription}</div>}
      </AlertDescription>
    </Alert>
  );
}
