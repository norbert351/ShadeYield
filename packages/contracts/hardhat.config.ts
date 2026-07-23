import { defineConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import noxPlugin from "@iexec-nox/nox-hardhat-plugin";

const MAINNET_RPC = process.env.MAINNET_RPC || "https://ethereum.publicnode.com";
const ARBITRUM_RPC = process.env.ARBITRUM_RPC || "https://arb1.arbitrum.io/rpc";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, noxPlugin],
  solidity: {
    version: "0.8.35",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    default: {
      type: "edr-simulated",
      chainType: "l1",
      hardfork: "cancun",
      forking: {
        enabled: true,
        url: MAINNET_RPC,
      },
    },
    arbitrumFork: {
      type: "edr-simulated",
      chainType: "l1",
      hardfork: "cancun",
      forking: {
        enabled: true,
        url: ARBITRUM_RPC,
      },
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainType: "l1",
    },
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC || "https://sepolia.drpc.org",
      chainType: "l1",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrumSepolia: {
      type: "http",
      url: process.env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
      chainType: "l1",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrum: {
      type: "http",
      url: ARBITRUM_RPC,
      chainType: "l1",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
});
