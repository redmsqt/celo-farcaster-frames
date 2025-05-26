import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const { proof, publicSignals } = await req.json();

      if (!proof || !publicSignals) {
        return NextResponse.json(
          { message: "Proof and publicSignals are required" },
          { status: 400 }
        );
      }

      const userId = await getUserIdentifier(publicSignals);

      // Get the current URL from the request
      const url = new URL(req.url);
      const baseUrl = `${url.protocol}//${url.host}`;
      console.log("baseUrl", baseUrl);

      const selfBackendVerifier = new SelfBackendVerifier(
        "proof-of-ship-scope",
        `${baseUrl}/api/verify`,
        "hex"
      );

      // Verify the proof
      const result = await selfBackendVerifier.verify(proof, publicSignals);
      console.log("result", result);

      if (result.isValid) {
        console.log("userId", userId);
        return NextResponse.json(
          {
            status: "success",
            result: true,
            credentialSubject: result.credentialSubject,
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          status: "error",
          result: false,
          message: "Verification failed",
          details: result.isValidDetails,
        },
        { status: 500 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: "error",
          result: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
