import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/db";

const TALENT_PROTOCOL_API = "https://api.talentprotocol.com";
const TALENT_PROTOCOL_API_KEY = process.env.TALENT_PROTOCOL_API_KEY;
if (!TALENT_PROTOCOL_API_KEY) {
  throw new Error("TALENT_PROTOCOL_API_KEY is not set");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  const existingProfile = await prisma.builderProfile.findUnique({
    where: { wallet: address },
  });

  if (!existingProfile?.isVerified) {
    return NextResponse.json({ status: 401 });
  }

  try {
    const response = await fetch(
      `${TALENT_PROTOCOL_API}/score?id=${address}&account_source=wallet`,
      {
        headers: {
          Accept: "application/json",
          "X-API-KEY": TALENT_PROTOCOL_API_KEY as string,
        },
      }
    );

    if (!response.ok) {
      console.log("Talent Protocol API error:", response);
      throw new Error(`Talent Protocol API error: ${response.statusText}`);
    }

    const data = await response.json();
    const score = data?.score?.points;

    if (score < 40) {
      if (existingProfile.talentScore === 0) {
        await prisma.builderProfile.update({
          where: { id: existingProfile.id },
          data: {
            talentScore: score,
          },
        });
      }
      return NextResponse.json({ score, rank: 0 }, { status: 200 });
    }

    if (
      existingProfile &&
      existingProfile.talentScore !== score &&
      score !== 0
    ) {
      // Update existing record
      await prisma.builderProfile.update({
        where: { id: existingProfile.id },
        data: {
          talentScore: score,
        },
      });

      // Calculate rank by counting users with higher scores
      const rank = await prisma.builderProfile.count({
        where: {
          talentScore: {
            gt: score,
          },
        },
      });
      return NextResponse.json({ score, rank: rank + 1 }, { status: 200 });
    }
    const rank = await prisma.builderProfile.count({
      where: {
        talentScore: {
          gt: existingProfile?.talentScore ?? 0,
        },
      },
    });
    return NextResponse.json({ score, rank: rank + 1 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching builder score:", error);
    return NextResponse.json(
      { error: "Failed to fetch builder score" },

      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  await prisma.builderProfile.create({
    data: {
      wallet: address,
      isVerified: true,
      talentScore: 0,
    },
  });
  return NextResponse.json(
    { message: "Builder profile created" },
    { status: 200 }
  );
}
