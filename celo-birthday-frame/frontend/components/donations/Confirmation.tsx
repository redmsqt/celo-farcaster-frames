import { Project } from "@/apollo/types";
import { ContractAbi, ContractAddress } from "@/data/abi";
import { getTokenAddress, Token } from "@/data/token";
import { projectUrl } from "@/lib/helpers";
import React, { useCallback, useEffect, useState } from "react";
import { Address, zeroAddress } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { useRouter } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";
import { TransactionLoader } from "../loader";
import { ConnectButton } from "../buttons/ConnectButton";

type Props = {
  type: "money" | "donation";
  celebrant: string;
  token?: Token;
  category?: string;
  project?: Project;

};

export default function ConfirmationPage({
  type,
  token,
  category,
  project
}: Props) {
  const { address, isConnected } = useAppKitAccount();
  const [txHash, setTxhash] = useState<Address | "">("");

  const router = useRouter();
  const { writeContract, isSuccess, data } = useWriteContract();

  const readContract = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "isCelebrantRegistered",
    args: [address],
    query: {
      enabled: false, // disable the query in onload
    },
  });

  const handleCreateRecord = () => {
    const route = type == "donation" ? 2 : 1;
    const tokenAddress = type === "money" && token ? getTokenAddress(token.id, '44787') : zeroAddress;
    const donationurl = type === "donation" && project ? projectUrl(project?.slug) : "0";
    const projectId = type === "donation" && project ? project.id : "0";
    const projectCategory = type === "donation" && category ? category : "0";

    writeContract({
      address: ContractAddress,
      abi: ContractAbi,
      functionName: "createBirthdayRecord",
      args: [
        address,
        route,
        tokenAddress,
        projectCategory,
        donationurl,
        Number(projectId)
      ],
    });
  };

  const handleSuccess = () => {
    router.push("/create/success")
  }

  useEffect(() => {
    if (isSuccess) {
      setTxhash(data)
    }
  }, [isSuccess, data])


  const checkIfUserRegistered = useCallback(async () => {
    const { data } = await readContract.refetch();
    console.log("data: ", data);
  }, [readContract]);

  useEffect(() => {
    if (isConnected) {
      checkIfUserRegistered()
    }
  }, [isConnected, checkIfUserRegistered])


  return (
    <div className="w-full flex flex-col items-center justify-start mt-4">
      <div className="relative flex flex-col items-center mb-4 mx-8">
        <h1 className="text-[#FFF8C9] text-3xl font-bold mb-2 max-w-xs">
          Confirm your birthday request record!
        </h1>
      </div>

      <div className="bg-[#FFF8C9] w-full max-w-md rounded-2xl px-6 py-6 text-left space-y-4 shadow-lg">
        <div>
          {type === "money" ? (
            <>
              <div>
                <p className="text-[#2D0C72] font-semibold">Wallet Address:</p>
                <p className="text-[#2D0C72] text-sm">{address}</p>
              </div>
              {token && (
                <div>
                  <p className="text-[#2D0C72] font-semibold">Token Info:</p>
                  <p className="text-[#2D0C72] text-sm">{token.name}</p>
                  <p className="text-[#2D0C72] text-sm">
                    ({getTokenAddress(token.id, '44787')})
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <p className="text-[#2D0C72] font-semibold">Category:</p>
                <p className="text-[#2D0C72] text-sm">{category}</p>
              </div>
              <div>
                <p className="text-[#2D0C72] font-semibold">Project:</p>
                <p className="text-[#2D0C72] text-sm">{project?.title}</p>
              </div>
              <div>
                <p className="text-[#2D0C72] font-semibold">Project Link:</p>
                <a
                  href={projectUrl(project?.slug)}
                  className="text-blue-600 text-sm underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {projectUrl(project?.slug)}
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {txHash ? (
        <TransactionLoader txHash={txHash} handleSuccess={handleSuccess} />
      ) : isConnected ? (
        <button
          onClick={handleCreateRecord}
          className="w-40 mt-5 bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all"
        >
          Create
        </button>
      ) : (
        <ConnectButton />
      )}
    </div>

  );
}


