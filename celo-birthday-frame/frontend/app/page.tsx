'use client';

import React from "react";
import { useRouter } from 'next/navigation'

function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start mt-4">

        {/* Header Balloon Illustration */}
        <div className="relative flex flex-col items-center mb-4 mx-8">
          <img
            src="/baloon.png"
            alt="Balloon decoration"
            className="absolute -left-14 -top-4 z-1 w-16 h-16 object-contain"
          />

          <img
            src="/confetti.png"
            alt="Confetti decoration"
            className="absolute -right-14 -top-4 z-1 w-16 h-16 object-contain transform -rotate-[40deg]"
          />

          {/* Main Headline */}
          <h1 className="text-[#FFF8C9] text-5xl font-bold leading-tight max-w-min z-2">
            Celebrate your birthday!
          </h1>
        </div>


        <p className="text-[#FFF8C9] text-base mb-4">
          Get birthday wishes and gifts from loved ones
        </p>

        {/* CTA Card */}
        <div className="bg-[#FFF8C9] rounded-2xl px-5 py-6 w-full max-w-md shadow-lg text-left space-y-4 ">
          <div className="grid grid-cols-3 gap-4 items-center mb-4">
            <div className="col-span-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-[#2D0C72] leading-tight">
                Ready to make your <br />
                birthday extra <br />
                special?
              </h2>

              <p className="text-xs sm:text-sm md:text-base mt-2 md:mt-4 text-[#2D0C72] max-w-[200px] sm:max-w-none">
                Create and share to everyone that loves you
              </p>
            </div>

            {/* Cake Illustration */}
            <div className="col-span-1">
              <img
                src="/cake.png"
                alt="Birthday cake illustration"
                className="w-full h-auto object-contain scale-150 transform"
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/verify")}
            className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all"
          >
            Create your birthday link
          </button>
        </div>

      </div>

    </div>
  );
}

export default HomePage;