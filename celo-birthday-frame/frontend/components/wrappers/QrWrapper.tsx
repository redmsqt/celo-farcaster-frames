'use client';

import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from '@selfxyz/qrcode';
import { logo } from '../../data/birthdayAppLogo';
import { useRouter } from 'next/navigation';

export default function QrWrapper({ address }: { address: string }) {
  const router = useRouter();
  const selfApp = new SelfAppBuilder({
    appName: "Celo Birthday Frame",
    scope: "Celo-Birthday-Frame",
    // endpoint: "https://happy-birthday-rho-nine.vercel.app/api/verify",
    // run `ngrok http 3000` and copy the url here to test locally
    endpoint: "https://celo-farcaster-frames-six.vercel.app/api/verify",
    logoBase64: logo,
    userId: address,
    userIdType: "hex",
    disclosures: {
      date_of_birth: true,
      name: true
    },
    devMode: true,
  } as Partial<SelfApp>).build();

  const handleSuccess = async () => {
    console.log('Verification successful');
    setTimeout(() => {
      router.push(`/create`)
    }, 3000)
  };

  return (
    <>
      {selfApp && (
        <div className="flex flex-col items-center gap-4 mb-6">
          <SelfQRcodeWrapper
            selfApp={selfApp}
            type='websocket'
            onSuccess={handleSuccess}
          />
          <p className="text-lg font-medium text-white">
            Scan QR Code to Verify your birthday
          </p>
        </div>
      )}
    </>
  );
}
