'use client'

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { FETCH_MAIN_CATEGORIES } from "@/apollo/gql/gqlProjects";
import { useQuery } from "@apollo/client";
import { MainCategoriesQuery } from "@/apollo/types";
import { useRouter } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";
import { ConnectButton } from "../buttons/ConnectButton";

interface Props {
  setCategoryFn: React.Dispatch<React.SetStateAction<string>>;
  setStepFn: React.Dispatch<React.SetStateAction<number>>;
}

export default function Categories({ setCategoryFn, setStepFn }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>("");
  const { isConnected } = useAppKitAccount();

  const { data, loading, error } = useQuery<MainCategoriesQuery>(FETCH_MAIN_CATEGORIES, {
    fetchPolicy: "cache-first"
  });

  if (loading) {
    return (
      <p className="text-[#FFF8C9] text-2xl font-bold mt-4">
        Loading categories...
      </p>
    );
  }

  if (error || !data?.mainCategories?.length) {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <p className="text-[#FFF8C9] text-2xl font-bold">
          Failed to load Categories.
        </p>
        <button
          onClick={() => router.push('/create')}
          className="bg-yellow-400 text-[#2D0C72] px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const allCategories = data.mainCategories
    .flatMap((cat) => cat.categories)
    .filter((sub) => sub.isActive && sub.canUseOnFrontend);

  return (
    <div className="w-full flex flex-col items-center justify-start">

      {/* Main Headline */}
      <h1 className="text-[#FFF8C9] text-2xl -mt-4 sm:text-3xl font-bold mb-4 leading-snug">
        Choose a <br />
        donation
        category
      </h1>

      <div className="w-full max-w-sm h-[600px]">
        <div className="flex flex-col overflow-y-auto py-2 max-h-[calc(100vh-350px)] space-y-4 scrollbar-hide items-center" style={{ scrollbarWidth: 'none' }}>
          {allCategories.map((category) => {
            const isSelected = selectedId === category.name;
            return ((
              <button
                key={category.name}
                onClick={() => {
                  setSelectedId(category.name)
                  setCategoryFn(category.name)
                }}
                className={`w-full max-w-xs bg-[#FFF1C6] text-[#2D0C72] text-lg font-semibold px-4 py-4 rounded-2xl 
                      shadow-sm hover:scale-[1.02] transition-all flex justify-between items-center
                      ${isSelected ? "bg-teal-600 text-[#FFF8C9]" : "bg-[#FFF1C6] text-[#2D0C72]"}`}
              >
                {category.value}
                {isSelected && <CheckCircle2 className="w-5 h-5" />}
              </button>
            ))
          })}

        </div>

        {selectedId && isConnected && (
          <div className="bg-gradient-to-t mt-5 from-[#2D0C72] pb-2">
            <button
              className="w-40 bg-yellow-400 text-[#2D0C72] py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
              onClick={() => setStepFn(1)}
            >
              Continue
            </button>
          </div>
        )}

        {!isConnected && <ConnectButton />}
      </div>
    </div>

  );
}
