'use client'
import React, { useState } from "react";
import { ContractAddress, ContractAbi } from "@/data/abi";
import { useCallback, useEffect } from "react";
import { useReadContract } from "wagmi";
import { BirthdayRecord } from "@/data/types";
import BirthdayDonationView from "./sendDonationView";
import SendMoneyView from "./sendMoneyView";
import DonationSuccessPage from "./Success";
import { useRouter } from "next/navigation";

export default function BirthdayPage({ address }: { address: string }) {
  const router = useRouter();
  const [birthDayRecord, setBirthdayRecord] = useState<BirthdayRecord | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const readContract2 = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "getBirthdayRecord",
    args: [address],
    query: {
      enabled: false,
    },
  })

  const getBirthdayRecord = useCallback(async () => {
    const { data } = await readContract2.refetch();
    setBirthdayRecord(data as unknown as BirthdayRecord);
  }, [readContract2]);

  useEffect(() => {
    if (!birthDayRecord) {
      getBirthdayRecord()
    }

  }, [birthDayRecord, getBirthdayRecord])

  if (!birthDayRecord) {
    return (
      <p className="text-[#FFF8C9] text-2xl font-bold mt-4">
        Loading birthday record...
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start mt-4">

      {!transactionSuccess ?

        <>
          {birthDayRecord.route == 2 && birthDayRecord.donationProjectId &&
            <BirthdayDonationView celebrantAddress={address} projectId={Number(birthDayRecord.donationProjectId)} projectUrl={birthDayRecord.donationProjectUrl || ""} setStatusFn={setTransactionSuccess} />
          }

          {birthDayRecord.route == 1 &&
            <SendMoneyView celebrantAddress={address} token={birthDayRecord.token} setStatusFn={setTransactionSuccess} />
          }

          {birthDayRecord.route == 0 &&
            <div className="flex flex-col items-center gap-4 mt-4">
              <p className="text-[#FFF8C9] text-2xl font-bold">
                Birthday Record not found.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-yellow-400 text-[#2D0C72] px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
              >
                Go Back
              </button>
            </div>
          }
        </>
        :
        <>
          <DonationSuccessPage celebrantAddress={address} />
        </>
      }

    </div>
  )
}
