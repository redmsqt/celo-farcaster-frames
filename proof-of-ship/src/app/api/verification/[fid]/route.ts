import { NextResponse } from "next/server";
import { prisma } from "~/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fid: string }> }
) {
  const { fid } = await params;

  if (!fid) {
    return NextResponse.json(
      { error: "FID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const builder = await prisma.builderProfile.findUnique({
      where: { fid: fid },
      select: { isVerified: true },
    });
    if (!builder) {
      return NextResponse.json({ isVerified: false }, { status: 200 });
    }

    return NextResponse.json(
      { isVerified: builder.isVerified },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch verification status" },
      { status: 500 }
    );
  }
}
