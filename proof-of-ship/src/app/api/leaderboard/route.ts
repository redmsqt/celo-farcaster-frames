import { NextResponse } from "next/server";
import { prisma } from "~/lib/db";

export async function GET() {
  try {
    const builders = await prisma.builderProfile.findMany({
      where: {
        talentScore: {
          gt: 40,
        },
      },
      orderBy: {
        totalScore: "desc",
      },
      take: 40,
    });

    return NextResponse.json(builders);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
