import { prisma } from "~/lib/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ethers } from "ethers";
import BuilderTokenArtifact from "../../../../contracts/SHIPRToken.json";

dayjs.extend(utc);

const BUILDER_TOKEN_ADDRESS = "0x8fE0F1B750eF84024FAb4E6FFd8bB03488f0FADF";

export async function GET(request: Request) {
  console.log("Weekly top builders cron job started");
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
      data: topBuilders.map(
        (
          builder: { wallet: string; talentScore: number | null },
          index: number
        ) => ({
          wallet: builder.wallet,
          talentScore: builder.talentScore || 0,
          rank: index + 1,
          weekStart,
        })
      ),
    });

    // Distribute tokens to top builders
    if (process.env.PRIVATE_KEY) {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const builderToken = new ethers.Contract(
        BUILDER_TOKEN_ADDRESS,
        BuilderTokenArtifact.abi,
        wallet
      );

      const builderAddresses = topBuilders.map((builder) => builder.wallet);
      const tx = await builderToken.distributeTopBuilderRewards(
        builderAddresses
      );
      await tx.wait();

      console.log("Tokens distributed to top builders:", tx.hash);
    }

    return { success: true, count: storedBuilders.count };
  } catch (error) {
    console.error("Error storing weekly top builders:", error);
    throw new Error("Failed to store weekly top builders");
  }
}
