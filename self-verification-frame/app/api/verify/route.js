

import { SelfBackendVerifier, getUserIdentifier } from '@selfxyz/core';
import { env } from '@/env.mjs';

export const dynamic = 'force-dynamic'; // Required for Frame callbacks

export async function POST(req) {
  const { proof, publicSignals } = await req.json();

  if (!proof || !publicSignals) {
    return Response.json(
      { error: "Proof and publicSignals required" },
      { status: 400 }
    );
  }

  try {
    const verifier = new SelfBackendVerifier(
      env.NEXT_PUBLIC_APP_SCOPE,
      `${env.NEXT_PUBLIC_URL}/api/verify`
    );

    const userId = await getUserIdentifier(publicSignals);
    const result = await verifier.verify(proof, publicSignals);

    if (!result.isValid) {
      return Response.json(
        {
          fcFrame: {
            imageUrl: `${env.NEXT_PUBLIC_URL}/failed.png`,
            buttons: [{ label: "Retry", action: "post_redirect" }],
          },
          error: result.isValidDetails,
        },
        { status: 400 }
      );
    }

    return Response.json({
      fcFrame: {
        imageUrl: `${env.NEXT_PUBLIC_URL}/verified.png`,
        buttons: [{ label: "Continue", action: "post_redirect" }],
      },
      userId,
      credentialSubject: result.credentialSubject, // e.g., { isHuman: true }
    });

  } catch (error) {
    console.error("Verification error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}