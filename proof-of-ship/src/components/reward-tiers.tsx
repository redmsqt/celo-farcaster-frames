import React, { useState } from "react";

const rewardTiers = [
  { tier: "Tier 1", prize: "300 SHIPR", winners: "Top 5 builders" },
  { tier: "Tier 2", prize: "200 SHIPR", winners: "Next 10 builders" },
  { tier: "Tier 3", prize: "100 SHIPR", winners: "Next 25 builders" },
];

export default function RewardTiers() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 shadow text-white"
        onClick={() => setOpen(true)}
        aria-label="Show reward tiers"
        type="button"
      >
        {/* Gift Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <title>Gift Icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8V6.75A2.25 2.25 0 1 0 9.75 4.5c0 1.24 1.01 2.25 2.25 2.25zm0 0V6.75A2.25 2.25 0 1 1 14.25 4.5c0 1.24-1.01 2.25-2.25 2.25z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9.75A2.25 2.25 0 0 1 5.25 7.5h13.5A2.25 2.25 0 0 1 21 9.75v1.5a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 11.25v-1.5zM3.75 12v6.75A2.25 2.25 0 0 0 6 21h12a2.25 2.25 0 0 0 2.25-2.25V12"
          />
        </svg>
        <span className="font-semibold">Reward Tiers</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen(false);
          }}
        >
          <div
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Reward Tiers
            </h2>
            <div className="flex flex-col gap-3">
              {rewardTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className="bg-black/40 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between border border-white/10 shadow"
                >
                  <div className="text-white font-semibold text-lg">
                    {tier.tier} –{" "}
                    <span className="text-[#a3e635]">{tier.prize}</span>
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {tier.winners}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
