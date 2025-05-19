import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { github_urls } = await req.json();

    // Forward to the audit service
    const auditResponse = await fetch(
      "https://celo-hackathon-agent.vercel.app/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_urls: github_urls,
          prompt: "prompts/celo.txt",
        }),
      }
    );

    const data = await auditResponse.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Frame audit error:", error);
  }
}
