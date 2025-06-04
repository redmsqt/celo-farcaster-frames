import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/db";

const TALENT_PROTOCOL_API = "https://api.talentprotocol.com";
const TALENT_PROTOCOL_API_KEY = process.env.TALENT_PROTOCOL_API_KEY;
if (!TALENT_PROTOCOL_API_KEY) {
  throw new Error("TALENT_PROTOCOL_API_KEY is not set");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fid: string }> }
) {
  const { fid } = await params;
  const { searchParams } = new URL(request.url);
  const profilePicture = searchParams.get("profilePicture");
  const name = searchParams.get("name");
  const address = searchParams.get("address");

  if (!fid) {
    return NextResponse.json(
      { error: "FID parameter is required" },
      { status: 400 }
    );
  }

  const existingProfile = await prisma.builderProfile.findUnique({
    where: { fid: fid },
  });

  try {
    const response = await fetch(
      `${TALENT_PROTOCOL_API}/farcaster/scores?fids=${fid}`,
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
    const score = data?.scores?.[0]?.points;

    if (!existingProfile) {
      console.log("creating new profile");
      await prisma.builderProfile.create({
        data: {
          fid: fid,
          talentScore: score,
          profilePicture: profilePicture || null,
          name: name || null,
          wallet: address || null,
          totalScore: score,
        },
      });
    }
    const selfscore = existingProfile?.isVerified ? 25 : 0;
    if (score < 40) {
      if (existingProfile?.talentScore === 0) {
        await prisma.builderProfile.update({
          where: { id: existingProfile.id },
          data: {
            talentScore: score,
            totalScore: score + selfscore,
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
          totalScore: score + selfscore,
        },
      });

      // Calculate rank by counting users with higher scores
      const rank = await prisma.builderProfile.count({
        where: {
          totalScore: {
            gt: score + selfscore,
          },
        },
      });
      return NextResponse.json({ score, rank: rank + 1 }, { status: 200 });
    }

    const rank = await prisma.builderProfile.count({
      where: {
        totalScore: {
          gt: score + selfscore,
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
  { params }: { params: Promise<{ fid: string }> }
) {
  const { fid } = await params;
  const { searchParams } = new URL(req.url);
  const profilePicture = searchParams.get("profilePicture");
  const name = searchParams.get("name");

  await prisma.builderProfile.create({
    data: {
      fid: fid,
      isVerified: true,
      talentScore: 0,
      profilePicture: profilePicture || null,
      name: name || null,
    },
  });
  return NextResponse.json(
    { message: "Builder profile created" },
    { status: 200 }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ fid: string }> }
) {
  const { fid } = await params;

  try {
    // Get existing profile
    const existingProfile = await prisma.builderProfile.findFirst({
      where: { fid },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update score by adding 25 points
    const newScore = (existingProfile.talentScore ?? 0) + 25;

    await prisma.builderProfile.update({
      where: { id: existingProfile.id },
      data: {
        totalScore: newScore,
        isVerified: true,
      },
    });

    // Calculate new rank
    const rank = await prisma.builderProfile.count({
      where: {
        totalScore: {
          gt: newScore,
        },
      },
    });

    return NextResponse.json(
      { score: newScore, rank: rank + 1 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating builder score:", error);
    return NextResponse.json(
      { error: "Failed to update builder score" },
      { status: 500 }
    );
  }
}
