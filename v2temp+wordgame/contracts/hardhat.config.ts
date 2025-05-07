// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "paris" // Critical for Celo compatibility
    }
  },
  networks: {
    celo: {
      url: "https://forno.celo.org",
      chainId: 42220,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
      gas: "auto",
      gasMultiplier: 1.2
    }
  },
  namedAccounts: {
    deployer: 0
  }
};

export default config;