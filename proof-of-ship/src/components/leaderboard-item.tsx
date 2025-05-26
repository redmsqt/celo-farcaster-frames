import { useEnsName } from "wagmi";
import type { BuilderScore } from "~/types";
import Avatar from "~/components/avatar";
import { mainnet } from "wagmi/chains";
import Image from "next/image";

interface LeaderboardItemProps {
  builder: BuilderScore;
  index: number;
}

export default function LeaderboardItem({
  builder,
  index,
}: LeaderboardItemProps) {
  const { data: ensName } = useEnsName({
    address: builder.fid as `0x${string}`,
    chainId: mainnet.id,
  });

  return (
    <div className="flex items-center justify-between p-3 bg-[#2C2C2E] rounded-lg">
      <div className="flex items-center gap-3">
        {builder.profilePicture ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={builder.profilePicture}
              alt={`Profile of ${ensName || builder.fid}`}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <Avatar address={builder.fid} size={40} />
        )}
        <div>
          <div className="font-medium">
            {builder.name ||
              ensName ||
              `${builder.fid.slice(0, 6)}...${builder.fid.slice(-4)}`}
          </div>
          <div className="text-right">
            {builder.totalScore != null
              ? builder.totalScore.toLocaleString()
              : "-"}
          </div>
        </div>
      </div>
      <div className="text-xl font-bold">#{index + 1}</div>
    </div>
  );
}
