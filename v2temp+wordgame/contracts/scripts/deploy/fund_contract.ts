import { HardhatRuntimeEnvironment } from "hardhat/types";
import "dotenv/config";

export default async function (hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in environment");
  }

  const tx = await deployer.sendTransaction({
    to: contractAddress,
    value: ethers.parseEther("0.1") // Fund with 0.1 CELO
  });

  console.log(`Funding contract with 0.1 CELO...`);
  await tx.wait();
  console.log(`Transaction hash: ${tx.hash}`);
  console.log(`New contract balance: ${await ethers.provider.getBalance(contractAddress)} wei`);
}