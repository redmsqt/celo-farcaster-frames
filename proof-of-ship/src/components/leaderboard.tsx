import { useEffect, useState } from "react";
import type { BuilderScore } from "~/types";
import LeaderboardItem from "./leaderboard-item";

export default function Leaderboard({
  builderScore,
}: {
  builderScore: number;
}) {
  const [builders, setBuilders] = useState<BuilderScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/leaderboard");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const data = await response.json();
        // Sort builders by talent score in descending order
        const sortedBuilders = data.sort(
          (a: BuilderScore, b: BuilderScore) => b.totalScore - a.totalScore
        );
        setBuilders(sortedBuilders);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch leaderboard"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [builderScore]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 h-[400px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skeleton-${i}-${Date.now()}`}
              className="flex items-center justify-between p-3 bg-[#2C2C2E] rounded-lg animate-pulse h-[72px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-700 rounded" />
                  <div className="h-3 w-16 bg-gray-700 rounded" />
                </div>
              </div>
              <div className="h-6 w-8 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4 h-[400px] flex items-center justify-center">
          {error}
        </div>
      );
    }

    return (
      <div className="space-y-4 h-[400px] overflow-y-auto">
        {builders.map((builder, index) => (
          <LeaderboardItem key={builder.fid} builder={builder} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#1C1C1E] text-white p-6 rounded-xl w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
      {renderContent()}
    </div>
  );
}
