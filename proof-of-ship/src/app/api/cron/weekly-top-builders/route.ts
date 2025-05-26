import { prisma } from "~/lib/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ethers } from "ethers";
import BuilderTokenArtifact from "../../../../contracts/SHIPRToken.json";
import { generateDivviDataSuffix, submitDivviReferral } from "~/lib/divvi";

dayjs.extend(utc);

const BUILDER_TOKEN_ADDRESS = "0x76c88eb3F5f8C45099a4d4587133a6688C5A257B";

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

    // Get top 40 builders by talent score
    const topBuilders = await prisma.builderProfile.findMany({
      orderBy: {
        totalScore: "desc",
      },
      take: 40,
      select: {
        totalScore: true,
        wallet: true,
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
          builder: { wallet: string | null; totalScore: number | null },
          index: number
        ) => ({
          wallet: builder.wallet || "",
          talentScore: builder.totalScore || 0,
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

      const builderRewards = topBuilders.map((builder, index) => ({
        builder: builder.wallet,
        amount:
          index < 5
            ? ethers.parseEther("300") // First 5 builders get 300 tokens
            : index < 15
            ? ethers.parseEther("200") // Next 10 builders get 200 tokens
            : index < 40
            ? ethers.parseEther("100") // Next 25 builders get 100 tokens
            : ethers.parseEther("0"),
      }));

      // Generate Divvi data suffix for referral tracking with default providers
      const dataSuffix = generateDivviDataSuffix();

      // Get the contract's distributeTopBuilderRewards function data
      const distributeData = builderToken.interface.encodeFunctionData(
        "distributeTopBuilderRewards",
        [builderRewards]
      );

      const txData = distributeData + dataSuffix;

      // Send transaction with Divvi data
      const tx = await wallet.sendTransaction({
        to: BUILDER_TOKEN_ADDRESS,
        data: txData,
      });

      await tx.wait();

      // Submit referral to Divvi
      const chainId = await provider.getNetwork().then((n) => n.chainId);
      await submitDivviReferral(tx.hash as `0x${string}`, Number(chainId));
    }

    return { success: true, count: storedBuilders.count };
  } catch (error) {
    console.error("Error storing weekly top builders:", error);
    throw new Error("Failed to store weekly top builders");
  }
}
