import hre from "hardhat";

async function main() {
  const net = await hre.network.getOrCreate("default");
  const [owner] = await net.viem.getWalletClients();

  const token = await net.viem.deployContract("ShadeToken", ["Shade USDC", "sUSDC", 18, 1000000000000000000000000n], { client: { wallet: owner } });
  console.log("ShadeToken deployed at:", token.address);

  const vault = await net.viem.deployContract("ShadeAaveVault", ["ShadeYield Vault", token.address], { client: { wallet: owner } });
  console.log("ShadeAaveVault deployed at:", vault.address);
}

main().catch((e) => { console.error(e); process.exit(1); });
