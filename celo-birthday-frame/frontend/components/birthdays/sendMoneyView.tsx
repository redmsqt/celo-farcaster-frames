import { Address, parseUnits } from "viem";
import { ContractAddress, ContractAbi, IERC20Abi } from "@/data/abi";
import { getTokenByAddress } from "@/data/token";
import React, { useCallback, useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { TokenIcon } from "../tokens/TokenIcon";
import { useAppKitAccount } from "@reown/appkit/react";
import { ConnectButton } from "../buttons/ConnectButton";
import { TransactionLoader } from "../loader";
import { rest } from "lodash";

export default function SendMoneyView({ celebrantAddress, token, setStatusFn }:
  {
    celebrantAddress: string,
    token: string, setStatusFn:
    React.Dispatch<React.SetStateAction<boolean>>
  }) {

  const [amount, setAmount] = useState(5);
  const [celebrantName, setCelebrantName] = useState("");
  const [txHash, setTxhash] = useState<Address | "">("");
  const [txCount, setTxCount] = useState(0);
  const { writeContract, isSuccess, data, reset } = useWriteContract();

  const { isConnected } = useAppKitAccount();

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
      setCelebrantName(data[1])
    } else {
      setCelebrantName("celebrant")
    }
  }, [readCelebrantName]);

  const tokenInfo = getTokenByAddress(token as Address);

  const handleSuccess = () => {
    if (txCount == 0) {
      setTxCount(1);
      reset();
      setTxhash("");
    }
    if (txCount == 1) {
      setStatusFn(true)
    }
  }

  const handleApprove = () => {
    const finalAmount = parseUnits(amount.toString(), tokenInfo.decimals);
    if (finalAmount < 0) {
      return
    }
    writeContract({
      address: token as Address,
      abi: IERC20Abi,
      functionName: "approve",
      args: [
        ContractAddress,
        finalAmount
      ],
    });
  }

  const handleSendGift = async () => {
    const finalAmount = parseUnits(amount.toString(), tokenInfo.decimals);
    if (finalAmount < 0) {
      return
    }
    writeContract({
      address: ContractAddress,
      abi: ContractAbi,
      functionName: "sendBirthdayGift",
      args: [
        celebrantAddress,
        finalAmount
      ],
    });
  };

  useEffect(() => {
    if (isConnected && isSuccess) {
      setTxhash(data);
    }
  }, [isSuccess, isConnected, data])

  useEffect(() => {

    if (!celebrantName) {
      getCelebrantName()
    }

  }, [celebrantName, getCelebrantName])

  return (
    <div className="w-full flex flex-col items-center justify-start">

      {/* Headline */}
      <h1 className="text-[#FFF8C9] text-3xl sm:text-4xl font-bold mb-6">
        Celebrate Birthday!
      </h1>

      {isConnected && <ConnectButton />}

      {/* Card */}
      <div className="bg-[#FFF8C9] rounded-2xl px-5 py-6 w-full max-w-md shadow-lg text-left space-y-4">
        {/* Birthday Icon */}
        <div className="text-center">
          <span className="text-5xl">🎂</span>
        </div>

        {/* Heading and Subtext */}
        <h2 className="text-center text-[#2D0C72] text-lg font-bold">It’s  {celebrantName ? celebrantName : ""}’s Birthday!</h2>
        <div className="bg-white rounded-xl px-4 py-2 text-sm text-[#2D0C72] text-center">
          Hey! I’m raising funds this birthday <span className="text-purple-600">♥</span>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="font-semibold text-[#2D0C72] whitespace-nowrap">Amount:</label>
          <div className="flex w-full items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-[#2D0C72] rounded-xl text-[#2D0C72] text-lg font-semibold outline-none"
            />
            <div className="w-8 h-8 flex-shrink-0">
              <TokenIcon token={tokenInfo} />
            </div>
          </div>
        </div>

        {/* Wallet Button */}
        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>

        ) : (
          txHash ? (
            <div className="flex justify-center -mt-2">
              <TransactionLoader txHash={txHash} handleSuccess={handleSuccess} />
            </div>

          ) : (
            <button
              onClick={() => txCount == 0 ? handleApprove() : handleSendGift()}
              className="w-full bg-[#066D6D] hover:bg-[#055a5a] text-[#FFF8C9] font-bold text-lg py-3 rounded-xl transition-all"
            >
              {txCount == 0 ? "Approve Amount" : "Complete Transaction"}
            </button>
          )
        )}

        {/* Footer */}
        <p className="flex items-center gap-2 text-sm text-[#2D0C72] mt-1">
          <span className="text-teal-600">✔</span> Verified Birthday with Self Protocol
        </p>
      </div>
    </div>
  );
}
