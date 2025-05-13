import { useEnsName } from "wagmi";
import type { BuilderScore } from "~/types";
import Avatar from "~/components/avatar";
import { mainnet } from "wagmi/chains";

interface LeaderboardItemProps {
  builder: BuilderScore;
  index: number;
}

export default function LeaderboardItem({
  builder,
  index,
}: LeaderboardItemProps) {
  const { data: ensName } = useEnsName({
    address: builder.wallet as `0x${string}`,
    chainId: mainnet.id,
  });
  console.log("builder", builder);
  console.log("ensName", ensName);

  return (
    <div className="flex items-center justify-between p-3 bg-[#2C2C2E] rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar address={builder.wallet} size={40} />
        <div>
          <div className="font-medium">
            {ensName ||
              `${builder.wallet.slice(0, 6)}...${builder.wallet.slice(-4)}`}
          </div>
          <div className="text-gray-400">
            {builder.talentScore.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="text-xl font-bold">#{index + 1}</div>
    </div>
  );
}
