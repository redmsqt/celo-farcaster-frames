import React, { useState } from "react";

const scoringCriteria = [
  { criteria: "Talent Score", requirement: "Should be more than 40" },
];

export default function Information() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 shadow text-white"
        onClick={() => setOpen(true)}
        aria-label="Show scoring criteria"
        type="button"
      >
        <span className="font-semibold text-xs">Scoring Criteria</span>
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
              Scoring Criteria
            </h2>
            <div className="flex flex-col gap-3">
              {scoringCriteria.map((criteria) => (
                <div
                  key={criteria.criteria}
                  className="bg-black/40 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between border border-white/10 shadow"
                >
                  <div className="text-white font-semibold text-lg">
                    {criteria.criteria}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {criteria.requirement}
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
