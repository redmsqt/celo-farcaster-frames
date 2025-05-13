import { useState, useCallback } from "react";
import { useAccount } from "wagmi";

export const useBuilderScore = (isVerified: boolean) => {
  const [builderScore, setBuilderScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const fetchBuilderScore = useCallback(async () => {
    console.log("fetchBuilderScore called with:", { address, isVerified });
    if (!address || !isVerified) {
      console.log("fetchBuilderScore early return - missing:", {
        hasAddress: !!address,
        isVerified,
      });
      return;
    }
    setIsLoadingScore(true);
    setError(null);
    console.log("fetchBuilderScore proceeding with fetch");
    try {
      const response = await fetch(`/api/builder-score/${address}`);
      console.log("response fetchBuilderScore", response);
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
  }, [address, isVerified]);

  return {
    builderScore,
    rank,
    isLoadingScore,
    error,
    mutate: fetchBuilderScore,
  };
};
