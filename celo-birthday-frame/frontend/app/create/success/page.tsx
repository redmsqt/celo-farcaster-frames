'use client'
import React, { useCallback, useEffect, useState } from "react";
import { CheckCheck, Copy } from "lucide-react";
import QRCode from "react-qr-code";
import { useAppKitAccount } from "@reown/appkit/react";
import { generateInviteUrl } from "@/lib/helpers";
import { useReadContract } from "wagmi";
import { ContractAddress, ContractAbi } from "@/data/abi";
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
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


  const [inviteLink, setInviteLink] = useState("");

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      setCopied(true)
      await navigator.clipboard.writeText(inviteLink);
      setTimeout(() => setCopied(false), 4000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    if (address) {
      setInviteLink(generateInviteUrl(address))
    }
  }, [address])

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start">

        {/* Check Icon */}
        <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mb-6">
          <CheckCheck className="w-12 h-12 text-[#FFF8C9]" />
        </div>

        {/* Confirmation Text */}
        <h1 className="text-[#FFF8C9] text-3xl font-bold mb-4">Birthday invite <br /> set!</h1>

        <p className="text-[#FFF8C9] text-base leading-relaxed max-w-sm mb-8">
          Here’s your birthday donation invite. Share it with others to get some love.
        </p>

        {/* Invite Link with QR */}
        {/* Invite Link with QR */}
        {inviteLink && <div className="bg-[#FFF8C9] text-[#2D0C72] px-5 py-4 rounded-lg flex items-center gap-4 shadow-md">

          <div className="flex items-center">
            <div className="text-left text-sm font-medium">
              {inviteLink}
            </div>

            <button
              onClick={() => copyToClipboard()}
              className="p-2 hover:bg-[#2D0C72]/10 rounded-full transition-colors relative group"
              title="Copy link"
            >
              <Copy className="w-4 h-4" />

              {copied &&
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2D0C72] text-[#FFF8C9] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Copied!
                </span>
              }
            </button>
          </div>

          <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={inviteLink}
              viewBox={`0 0 256 256`}
              bgColor="#FFF8C9"
            />
          </div>
        </div>
        }
        <a
          href={inviteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center px-6 py-3 bg-[#FFF8C9] text-[#2D0C72] rounded-lg font-medium hover:bg-[#FFF8C9]/90 transition-colors"
        >
          View Your Birthday Page
        </a>
      </div>
    </div>
  );
}
