// scripts/deploy/01_deploy_wordgame.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`\n🔄 Deploying to ${network.name}...`);
  
  // Verify private key is loaded
  if (!deployer) throw new Error("Deployer account not found!");
  console.log(`📡 Deployer: ${deployer}`);

  // Check CELO balance
  const balance = await hre.ethers.provider.getBalance(deployer);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} CELO`);
  
  if (balance < hre.ethers.parseEther("0.5")) 
    throw new Error("Insufficient balance (< 0.5 CELO)");

  // Real-time gas price check
  const gasPrice = await hre.ethers.provider.getGasPrice();
  console.log(`⛽ Current Gas Price: ${hre.ethers.formatUnits(gasPrice, "gwei")} gwei`);

  // Force fresh deployment
  console.log("🚀 Launching deployment...");
  const result = await deploy("CeloWordGame", {
    from: deployer,
    args: [],
    log: true,
    gasPrice: gasPrice.mul(120).div(100), // 20% premium
    waitConfirmations: network.name === "celo" ? 3 : 1
  });

  if (result.newlyDeployed) {
    console.log(`✅ Success! Contract deployed to: ${result.address}`);
    console.log(`🔗 Explorer: https://explorer.celo.org/mainnet/address/${result.address}`);
  } else {
    console.log("♻️ Using existing contract at:", result.address);
  }
};

func.tags = ["CeloWordGame"];
export default func;