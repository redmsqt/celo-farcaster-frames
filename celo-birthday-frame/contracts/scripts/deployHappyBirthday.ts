import { ethers } from "hardhat";
import { hashEndpointWithScope } from "@selfxyz/core";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const nonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log("Account nonce:", nonce);

  const futureAddress = ethers.getCreateAddress({
    from: deployer.address,
    nonce: nonce,
  });
  console.log("Calculated future contract address:", futureAddress);

  // For testnet environment
  const identityVerificationHub = "0x3e2487a250e2A7b56c7ef5307Fb591Cc8C83623D";
  // For mainnet environment
  // const identityVerificationHub = "0x77117D60eaB7C044e785D68edB6C7E0e134970Ea";

  const scope = hashEndpointWithScope(
    "https://celo-farcaster-frames-six.vercel.app/api/verify",
    "Celo-Birthday-Frame"
  );

  const attestationId = 1n;

  const olderThanEnabled = false;
  const olderThan = 18n;
  const forbiddenCountriesEnabled = false;
  const forbiddenCountriesListPacked = [0n, 0n, 0n, 0n] as [
    bigint,
    bigint,
    bigint,
    bigint
  ];
  const ofacEnabled = [false, false, false] as [boolean, boolean, boolean];

  const SelfHappyBirthday = await ethers.getContractFactory(
    "CeloBirthdayFrame"
  );

  console.log("Deploying CeloBirthdayFrame...");
  const selfHappyBirthday = await SelfHappyBirthday.deploy(
    identityVerificationHub,
    scope,
    attestationId,
    olderThanEnabled,
    olderThan,
    forbiddenCountriesEnabled,
    forbiddenCountriesListPacked,
    ofacEnabled
  );

  await selfHappyBirthday.waitForDeployment();

  const deployedAddress = await selfHappyBirthday.getAddress();
  console.log("CeloBirthdayFrame deployed to:", deployedAddress);

  console.log("To verify on Celoscan:");
  console.log(
    `npx hardhat verify --network alfajores ${deployedAddress} ${identityVerificationHub} ${scope} ${attestationId} ${olderThanEnabled} ${olderThan} ${forbiddenCountriesEnabled} "[${forbiddenCountriesListPacked.join(
      ","
    )}]" "[${ofacEnabled.join(",")}]"`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
