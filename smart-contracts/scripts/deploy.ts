import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  const identity = await ethers.deployContract("Identity");
  await identity.waitForDeployment();
  console.log(`Identity contract deployed to: ${identity.target}`);

  const rbac = await ethers.deployContract("RBAC");
  await rbac.waitForDeployment();
  console.log(`RBAC contract deployed to: ${rbac.target}`);

  const rbacAddress = rbac.target;
  const identityAddress = identity.target;

  const layananDukcapil = await ethers.deployContract("LayananDukcapil", [rbacAddress, identityAddress]);
  await layananDukcapil.waitForDeployment();
  console.log(`LayananDukcapil contract deployed to: ${layananDukcapil.target}`);

  const layananPendidikan = await ethers.deployContract("LayananPendidikan", [rbacAddress, identityAddress]);
  await layananPendidikan.waitForDeployment();
  console.log(`LayananPendidikan contract deployed to: ${layananPendidikan.target}`);

  const layananSosial = await ethers.deployContract("LayananSosial", [rbacAddress, identityAddress, layananDukcapil.target]);
  await layananSosial.waitForDeployment();
  console.log(`LayananSosial contract deployed to: ${layananSosial.target}`);

  const layananKesehatan = await ethers.deployContract("LayananKesehatan", [rbacAddress, identityAddress]);
  await layananKesehatan.waitForDeployment();
  console.log(`LayananKesehatan contract deployed to: ${layananKesehatan.target}`);

  console.log("\n--- ENV VARS for webapp-light-client ---");
  console.log(`VITE_IDENTITY_CONTRACT_ADDRESS=${identity.target}`);
  console.log(`VITE_RBAC_CONTRACT_ADDRESS=${rbac.target}`);
  console.log(`VITE_DUKCAPIL_CONTRACT_ADDRESS=${layananDukcapil.target}`);
  console.log(`VITE_PENDIDIKAN_CONTRACT_ADDRESS=${layananPendidikan.target}`);
  console.log(`VITE_SOSIAL_CONTRACT_ADDRESS=${layananSosial.target}`);
  console.log(`VITE_KESEHATAN_CONTRACT_ADDRESS=${layananKesehatan.target}`);
  console.log("----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
