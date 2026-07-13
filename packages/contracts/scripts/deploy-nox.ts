import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  const net = await hre.network.getOrCreate("localhost");
  const [owner] = await net.viem.getWalletClients();

  const token = await net.viem.deployContract("ShadeToken", [
    "Shade USDC",
    "sUSDC",
    18,
    parseEther("1000000"),
  ], { client: { wallet: owner } });
  console.log("ShadeToken:", token.address);

  const vault = await net.viem.deployContract("ShadeAaveVault", [
    "ShadeYield Vault",
    token.address,
  ], { client: { wallet: owner } });
  console.log("ShadeAaveVault:", vault.address);

  console.log("✅ Nox confidential vault deployed on local Nox node");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
