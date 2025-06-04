import { Context } from "@farcaster/frame-sdk";
import { useState, useCallback } from "react";
import { useAccount } from "wagmi";

export const useBuilderScore = () => {
  const [builderScore, setBuilderScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const fetchBuilderScore = useCallback(async (user: Context.UserContext) => {
    if (!user) {
      return;
    }
    setIsLoadingScore(true);
    setError(null);
    try {
      console.log("address", address);
      const response = await fetch(
        `/api/builder-score/${user.fid}?profilePicture=${
          user.pfpUrl || ""
        }&name=${user.displayName || ""}&address=${address || ""}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch builder score");
      }
      const data = await response.json();
      setBuilderScore(data.score);
      setRank(data.rank);
    } catch (err) {
      console.error("Error fetching builder score:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch builder score"
      );
    } finally {
      setIsLoadingScore(false);
    }
  }, []);

  return {
    builderScore,
    rank,
    isLoadingScore,
    error,
    mutate: fetchBuilderScore,
  };
};
