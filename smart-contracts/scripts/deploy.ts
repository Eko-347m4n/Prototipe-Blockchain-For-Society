import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy Identity Contract
  const identity = await ethers.deployContract("Identity");
  await identity.waitForDeployment();
  console.log(`Identity contract deployed to: ${identity.target}`);

  // Deploy RBAC Contract
  const rbac = await ethers.deployContract("RBAC");
  await rbac.waitForDeployment();
  console.log(`RBAC contract deployed to: ${rbac.target}`);

  // Deploy LayananDukcapil Contract, linking it to the RBAC contract
  const layananDukcapil = await ethers.deployContract("LayananDukcapil", [rbac.target]);
  await layananDukcapil.waitForDeployment();
  console.log(`LayananDukcapil contract deployed to: ${layananDukcapil.target}`);

  console.log("\nDeployment finished!");
  console.log("Addresses:");
  console.log(`  NEXT_PUBLIC_IDENTITY_CONTRACT_ADDRESS=${identity.target}`);
  console.log(`  NEXT_PUBLIC_RBAC_CONTRACT_ADDRESS=${rbac.target}`);
  console.log(`  NEXT_PUBLIC_DUKCAPIL_CONTRACT_ADDRESS=${layananDukcapil.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
