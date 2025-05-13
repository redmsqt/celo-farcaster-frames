import { NextResponse } from "next/server";
import { prisma } from "~/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    const builder = await prisma.builderProfile.findUnique({
      where: { wallet: address },
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
