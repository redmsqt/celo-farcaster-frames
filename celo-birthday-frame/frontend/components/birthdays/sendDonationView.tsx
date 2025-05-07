import { FETCH_PROJECT_BY_ID } from "@/apollo/gql/gqlProjects";
import { ProjectByIdQuery } from "@/apollo/types";
import { ContractAddress, ContractAbi } from "@/data/abi";
import { useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { useRouter } from "next/navigation";

export default function BirthdayDonationView({ celebrantAddress, projectId, projectUrl, setStatusFn }:
  {
    celebrantAddress: string,
    projectId: number,
    projectUrl: string,
    setStatusFn: React.Dispatch<React.SetStateAction<boolean>>
  }) {


  const router = useRouter();

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
      setCelebrantName(data[1])
    } else {
      setCelebrantName("celebrant")
    }

  }, [readCelebrantName]);

  const { data, loading, error } = useQuery<ProjectByIdQuery>(FETCH_PROJECT_BY_ID, {
    variables: {
      id: Number(projectId), skip: 0, status: "verified", take: 1
    }, fetchPolicy: "cache-first"
  });

  useEffect(() => {
    if (!celebrantName) {
      getCelebrantName()
    }

  }, [celebrantName, getCelebrantName])

  if (loading) {
    return (
      <p className="text-[#FFF8C9] text-2xl font-bold mt-4">
        Loading donation information...
      </p>
    );
  }


  if (error || !data?.projectById) {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <p className="text-[#FFF8C9] text-2xl font-bold">
          Failed to load Donation information.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-yellow-400 text-[#2D0C72] px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start">
      {/* Headings */}
      <h1 className="text-[#FFF8C9] text-3xl sm:text-4xl font-bold mb-3">
        Celebrate Birthday!
      </h1>
      <p className="text-[#FFF8C9] mb-6 text-base">
        {celebrantName ? celebrantName : ""} chose to support <strong>{data.projectById.title}</strong> for their birthday!
      </p>

      {/* Project Card */}
      <div className="bg-[#FFF8C9] rounded-2xl shadow-lg px-5 py-6 w-full max-w-md text-left space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D0C72]">{data.projectById.title}</h2>
          <p className="text-[#2D0C72] text-sm">{data.projectById.description}</p>
        </div>

        {/* Project Image */}
        <div className="flex justify-center">
          <img
            src={`https://giveth.io${data.projectById.image}`}
            alt={data.projectById.title}
            className="w-full h-32 object-cover"
          />
        </div>

        {/* Donate Button */}
        <button
          onClick={() => {
            window.open(projectUrl, '_blank', 'noopener,noreferrer')
            setStatusFn(true);
          }}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#2D0C72] font-bold text-lg py-3 rounded-xl transition-all"
        >
          Donate Now
        </button>
      </div>

      <p className="text-[#FFF8C9] text-sm mt-6 max-w-xs text-center mx-auto">
        All proceeds go directly to {data.projectById.title} via Giveth.
      </p>
    </div>
  );
}
