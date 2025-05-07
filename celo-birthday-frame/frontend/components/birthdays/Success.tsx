import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ContractAddress, ContractAbi } from "@/data/abi";
import { useReadContract } from "wagmi";

export default function DonationSuccessPage({ celebrantAddress }: { celebrantAddress: string }) {
  const [celebrantName, setCelebrantName] = useState("");

  const readCelebrantName = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "getCelebrantName",
    args: [celebrantAddress],
    query: {
      enabled: false,
    },
  })

  const getCelebrantName = useCallback(async () => {
    const { data } = await readCelebrantName.refetch();
    if (data && Array.isArray(data)) {
      setCelebrantName(data.join(", "))
    } else {
      setCelebrantName("celebrant")
    }

  }, [readCelebrantName]);


  useEffect(() => {
    if (!celebrantName) {
      getCelebrantName()
    }

  }, [celebrantName, getCelebrantName])

  return (
    <div className="w-full flex flex-col items-center justify-start">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-[#FFF8C9]" />
      </div>

      {/* Success Text */}
      <h1 className="text-[#FFF8C9] text-3xl font-bold mb-3">Donation successful!</h1>
      <p className="text-[#FFF8C9] text-lg max-w-xs">
        You helped {celebrantName} celebrate their birthday.
      </p>

      <button
        onClick={() => window.location.href = '/create-birthday'}
        className="mt-8 px-6 py-3 bg-teal-600 text-[#FFF8C9] rounded-lg hover:bg-teal-700 transition-colors"
      >
        Create Your Birthday Page
      </button>

    </div>
  );
}
