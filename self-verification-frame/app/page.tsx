import { Metadata } from 'next';
import SelfVerificationClient from '../components/SelfVerificationClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Self Verification",
    other: {
      "fc:frame": JSON.stringify({
        version: "vNext",
        imageUrl: `${process.env.NEXT_PUBLIC_URL}/og-image.png`,
        buttons: [{ label: "Verify with Self 🔐", action: "post_redirect" }],
        postUrl: `${process.env.NEXT_PUBLIC_URL}/api/verify`,
      }),
    },
  };
}

export default function Page() {
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Verify Your Identity</h1>
      <SelfVerificationClient />
      <p className="mt-4 text-gray-600">
        Scan with the Self app to verify
      </p>
    </div>
  );
}