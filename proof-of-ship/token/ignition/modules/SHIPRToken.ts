//@ts-nocheck
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SHIPRToken", (m) => {
  const shiprToken = m.contract("SHIPRToken");

  return { shiprToken };
});
