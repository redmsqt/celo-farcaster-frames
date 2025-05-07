import { ethers, network } from "hardhat";
import { hashEndpointWithScope } from "@selfxyz/core";
import { BigNumberish } from "ethers";

function toBigIntTuple2(arr: string[]): [BigNumberish, BigNumberish] {
  return [BigInt(arr[0]), BigInt(arr[1])];
}

function toBigIntTuple2x2(
  arr: string[][]
): [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]] {
  return [
    [BigInt(arr[0][0]), BigInt(arr[0][1])],
    [BigInt(arr[1][0]), BigInt(arr[1][1])],
  ];
}

function toBigIntTuple21(arr: string[]): [BigNumberish, ...BigNumberish[]] {
  if (arr.length !== 21) throw new Error("pubSignals must have 21 items");
  return arr.map(BigInt) as [BigNumberish, ...BigNumberish[]];
}

// RUN yarn test:verify to test this
async function main() {
  const [signer] = await ethers.getSigners();

  console.log("Network forked. Using signer:", signer.address);

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

  const CeloBirthdayFrame = await ethers.getContractFactory(
    "CeloBirthdayFrame"
  );
  const contract = await CeloBirthdayFrame.deploy(
    identityVerificationHub,
    scope,
    attestationId,
    olderThanEnabled,
    olderThan,
    forbiddenCountriesEnabled,
    forbiddenCountriesListPacked,
    ofacEnabled
  );
  await contract.waitForDeployment();

  console.log("🎉 Deployed CeloBirthdayFrame:", await contract.getAddress());

  // === Dummy proof for testing (replace with real values) ===
  const proof = {
    a: [
      "18689987482609259976543121413293838883706673632428011795876461007849761889600",
      "11002492442672597215879032081892275945425600517703198111911753525926858046664",
    ],
    b: [
      [
        "10861719069499823165288225218838668829729688050688767772694708933593343539508",
        "8365588457552672098586461357335812299767948621992645445280314397370620854367",
      ],
      [
        "9893621850173437284037729803389539398848567542670181360312261038245000997943",
        "15313933800742579646776791535634901792535303353991855955032184196651338559333",
      ],
    ],
    c: [
      "15849491210183330365695460558420690929188447925525503998857955193574632857702",
      "5016373093441111888523409921939281037153710356553600888181933545353771723602",
    ],
    pubSignals: [
      "115261408968607033031307466064449130912187328440927354228438530078002905088",
      "85175750817918425710041900119009907057840432547576103486151967547934982732",
      "52",
      "0",
      "0",
      "0",
      "0",
      "232899505634211552416266126911335006838793804334277868965825521855752192143",
      "1",
      "21805494687043175113477743360545103370747360091435805417468406071916158527260",
      "2",
      "5",
      "0",
      "5",
      "0",
      "4",
      "17359956125106148146828355805271472653597249114301196742546733402427978706344",
      "7420120618403967585712321281997181302561301414016003514649937965499789236588",
      "16836358042995742879630198413873414945978677264752036026400967422611478610995",
      "590080924736463686012467503391001454017377993996437203705047956386072265915",
      "865134866047133308533628272553533973433355278147",
    ],
  };

  const formattedProof = {
    a: toBigIntTuple2(proof.a),
    b: toBigIntTuple2x2(proof.b),
    c: toBigIntTuple2(proof.c),
    pubSignals: toBigIntTuple21(proof.pubSignals),
  };

  try {
    await contract.verifySelfProof(formattedProof);
    console.log("✅ Proof passed validation.");

    let data = await contract.isCelebrantRegistered(
      "0x9789fD3558316B5185E93507616563084bA71743"
    );
    console.log(data);

    let names = await contract.getCelebrantName(
      "0x9789fD3558316B5185E93507616563084bA71743"
    );
    console.log(names);
  } catch (err: any) {
    console.error("❌ Proof would revert.");

    const iface = new ethers.Interface([
      "error RegisteredNullifier()",
      "error UnRegisteredNullifier()",
      "error RegisteredCelebrant()",
      "error UnRegisteredCelerbrant()",
      "error InvalidAmount()",
      "error OnlyMoneyRoute()",
      "error RecordAlreadyExists()",
      "error NotWithinBirthdayWindow()",
    ]);

    const raw = err?.error?.data || err?.data || "";
    try {
      const decoded = iface.parseError(raw);
      if (decoded) {
        console.error("🧨 Revert Reason:", decoded.name);
      }
    } catch {
      console.error("💬 Could not decode reason. Raw:", raw);
    }
  }
}

main().catch(console.error);
