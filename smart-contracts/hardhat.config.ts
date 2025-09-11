import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  // Temporarily commented out Sepolia network for local compilation
  // networks: {
  //   sepolia: {
  //     url: SEPOLIA_RPC_URL,
  //     accounts: [PRIVATE_KEY],
  //   },
  // },
};

export default config;
