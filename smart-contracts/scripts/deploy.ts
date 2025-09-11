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

  // Deploy LayananPendidikan Contract, linking it to the RBAC contract
  const layananPendidikan = await ethers.deployContract("LayananPendidikan", [rbac.target]);
  await layananPendidikan.waitForDeployment();
  console.log(`LayananPendidikan contract deployed to: ${layananPendidikan.target}`);

  // Deploy LayananSosial Contract, linking it to the RBAC contract
  const layananSosial = await ethers.deployContract("LayananSosial", [rbac.target]);
  await layananSosial.waitForDeployment();
  console.log(`LayananSosial contract deployed to: ${layananSosial.target}`);

  // Deploy LayananKesehatan Contract, linking it to the RBAC contract
  const layananKesehatan = await ethers.deployContract("LayananKesehatan", [rbac.target]);
  await layananKesehatan.waitForDeployment();
  console.log(`LayananKesehatan contract deployed to: ${layananKesehatan.target}`);

  console.log(`  NEXT_PUBLIC_PENDIDIKAN_CONTRACT_ADDRESS=${layananPendidikan.target}`);
  console.log(`  NEXT_PUBLIC_SOSIAL_CONTRACT_ADDRESS=${layananSosial.target}`);
  console.log(`  NEXT_PUBLIC_KESEHATAN_CONTRACT_ADDRESS=${layananKesehatan.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
