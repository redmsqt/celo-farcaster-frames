import { useEffect, useState } from "react";

interface AvatarProps {
  address: string;
  size?: number;
}

export default function Avatar({ address, size = 40 }: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
    setAvatarUrl(avatarUrl);
  }, [address]);

  if (!avatarUrl) {
    return (
      <div
        className="bg-purple-600 rounded-full flex items-center justify-center text-white"
        style={{ width: size, height: size }}
      >
        {address.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={`Avatar for ${address}`}
      className="rounded-full"
      style={{ width: size, height: size }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = address.slice(0, 2);
          parent.className =
            "bg-purple-600 rounded-full flex items-center justify-center text-white";
          parent.style.width = `${size}px`;
          parent.style.height = `${size}px`;
        }
      }}
    />
  );
}
