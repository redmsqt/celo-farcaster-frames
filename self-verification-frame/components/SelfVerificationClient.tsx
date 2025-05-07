'use client';
import {SelfAppBuilder } from '@selfxyz/qrcode';
import SelfQRcodeWrapper from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';

export default function SelfVerificationClient() {
  console.log(process.env.NEXT_PUBLIC_APP_SCOPE)
  const userId = uuidv4();
  const selfApp = new SelfAppBuilder({
    appName: "Self Verification",
    scope: process.env.NEXT_PUBLIC_APP_SCOPE!,
    endpoint: `${process.env.NEXT_PUBLIC_URL}/api/verify`,
    userId,
  }).build();

  return (
    <SelfQRcodeWrapper
      selfApp={selfApp}
      onSuccess={() => console.log("Verified!")}
      size={300}
    />
  );
}