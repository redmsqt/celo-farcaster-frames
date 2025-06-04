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
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 shadow text-white"
        onClick={() => setOpen(true)}
        aria-label="Show reward tiers"
        type="button"
      >
        <span className="font-semibold text-xs">Reward Tiers</span>
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
