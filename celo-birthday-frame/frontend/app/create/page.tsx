'use client'
import React, { useCallback, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { ContractAddress, ContractAbi } from "@/data/abi";
import { useAppKitAccount } from "@reown/appkit/react";
import { useReadContract } from "wagmi";


export default function BirthdayCard() {
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();

  const readContract = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "isCelebrantRegistered",
    args: [address],
    query: {
      enabled: false,
    },
  })

  const checkIfUserRegistered = useCallback(async () => {
    const { data } = await readContract.refetch();

    if (!data) {
      router.push("/verify")
    }
  }, [readContract, router]);

  useEffect(() => {
    if (isConnected) {
      checkIfUserRegistered()
    }
  }, [isConnected, checkIfUserRegistered])

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start">

        <div className="relative  flex flex-col items-center mx-8 mb-10">

          <h1 className="text-[#FFF8C9] text-4xl font-bold leading-tight z-2 mt-8">
            Birthday Verified 🎉
          </h1>

        </div>

        {/* Card */}
        <div className="bg-[#FFF8C9] rounded-2xl p-6 shadow-lg w-full max-w-md text-center">
          <h2 className="text-orange-600 font-semibold text-lg mb-3">Birthday Builder</h2>
          <p className="text-[#1E1E4B] text-xl font-bold mb-6">
            What would you like for your birthday?
          </p>

          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => router.push('/create/money')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Money
            </button>
            <button
              onClick={() => router.push('/create/donations')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Donations
            </button>
          </div>

          <div className="flex flex-col items-center mt-4">
            <img
              src="/self.svg"
              alt="Self Logo"
              className="h-4 mb-1"
            />
            <p className="text-[#1E1E4B] text-[10px]">Verified with Self Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
}
