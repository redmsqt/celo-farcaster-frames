import { prisma } from "~/lib/db";
import dayjs from "dayjs";
// import type { BuilderProfile } from "../../../../../generated/prisma";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await storeWeeklyTopBuilders();
    return Response.json({ success: true, result });
  } catch (error) {
    console.error("Failed to store weekly top builders:", error);
    return Response.json(
      { success: false, error: "Failed to store weekly top builders" },
      { status: 500 }
    );
  }
}

async function storeWeeklyTopBuilders() {
  try {
    // Get the start of the current week (Sunday)
    const now = dayjs.utc();
    const weekStart = now.startOf("week").toDate();

    // Get top 10 builders by talent score
    const topBuilders = await prisma.builderProfile.findMany({
      orderBy: {
        talentScore: "desc",
      },
      take: 10,
      select: {
        wallet: true,
        talentScore: true,
      },
      where: {
        talentScore: {
          gt: 40,
        },
      },
    });

    const storedBuilders = await prisma.weeklyTopBuilder.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: topBuilders.map((builder: any, index: number) => ({
        wallet: builder.wallet,
        talentScore: builder.talentScore || 0,
        rank: index + 1,
        weekStart,
      })),
    });

    return { success: true, count: storedBuilders.count };
  } catch (error) {
    console.error("Error storing weekly top builders:", error);
    throw new Error("Failed to store weekly top builders");
  }
}
