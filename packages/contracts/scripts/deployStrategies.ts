/**
 * Deploy new Aave + Uniswap strategies for the encrypted vault.
 * Then attach them to the vault via addStrategy().
 */
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import fs from "node:fs";

const RPC = "https://sepolia-rollup.arbitrum.io/rpc";
const PK = process.env.PK!;
if (!PK) throw new Error("Export PK=0x...");
const k = (PK.startsWith("0x") ? PK : "0x" + PK) as `0x${string}`;

// Deployed addresses
const VAULT = "0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85";
const USDC = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
const AAVE_POOL = "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff";
const TEST_DAI = "0x8ADB1D9F04328C355dB13276f2BE81FcF2710ff9";
const UNI_PM = "0x1cf89361e70211f0b9ee879826908880bc5ab5Ab";
const UNI_SR = "0x2D5c88b952aaaA71457a22071e1B9F04D47977E0";

async function main() {
  const account = privateKeyToAccount(k);
  console.log(`Deployer: ${account.address}`);

  const pc = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });
  const wc = createWalletClient({ account, chain: arbitrumSepolia, transport: http(RPC) });

  // ---- Deploy AaveStrategy ----
  const aaveArt = JSON.parse(fs.readFileSync("./artifacts/contracts/AaveStrategy.sol/AaveStrategy.json", "utf8"));
  const aaveHash = await wc.deployContract({
    abi: aaveArt.abi,
    bytecode: aaveArt.bytecode,
    args: [USDC, AAVE_POOL],
    chain: arbitrumSepolia,
  });
  const aaveReceipt = await pc.waitForTransactionReceipt({ hash: aaveHash });
  const aaveAddr = aaveReceipt.contractAddress!;
  console.log(`✅ AaveStrategy: ${aaveAddr}`);

  // ---- Deploy UniswapV3Strategy ----
  const uniArt = JSON.parse(fs.readFileSync("./artifacts/contracts/UniswapV3Strategy.sol/UniswapV3Strategy.json", "utf8"));
  const uniHash = await wc.deployContract({
    abi: uniArt.abi,
    bytecode: uniArt.bytecode,
    args: [USDC, TEST_DAI, UNI_PM, UNI_SR, 500, -60, 60],
    chain: arbitrumSepolia,
  });
  const uniReceipt = await pc.waitForTransactionReceipt({ hash: uniHash });
  const uniAddr = uniReceipt.contractAddress!;
  console.log(`✅ UniswapV3Strategy: ${uniAddr}`);

  // ---- Attach strategies to vault ----
  const vaultArt = JSON.parse(fs.readFileSync("./artifacts/contracts/ShadeAaveVault.sol/ShadeAaveVault.json", "utf8"));

  console.log(`\nAttaching strategies to vault ${VAULT}...`);

  // addStrategy(AaveStrategy)
  const addAaveHash = await wc.writeContract({
    address: VAULT,
    abi: vaultArt.abi,
    functionName: "addStrategy",
    args: [aaveAddr],
    chain: arbitrumSepolia,
  });
  await pc.waitForTransactionReceipt({ hash: addAaveHash });
  console.log(`✅ AaveStrategy attached to vault`);

  // addStrategy(UniswapV3Strategy)
  const addUniHash = await wc.writeContract({
    address: VAULT,
    abi: vaultArt.abi,
    functionName: "addStrategy",
    args: [uniAddr],
    chain: arbitrumSepolia,
  });
  await pc.waitForTransactionReceipt({ hash: addUniHash });
  console.log(`✅ UniswapV3Strategy attached to vault`);

  // ---- Save ----
  const deployment = {
    chain: "arbitrumSepolia",
    chainId: 421614,
    vault: VAULT,
    aaveStrategy: aaveAddr,
    uniStrategy: uniAddr,
    deployTxAave: aaveHash,
    deployTxUni: uniHash,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync("./deployments/strategies-encrypted.json", JSON.stringify(deployment, null, 2));
  console.log(`\n🎉 Done! Strategies saved to deployments/strategies-encrypted.json`);
}

main().catch(e => {
  console.error("FAILED:", e?.shortMessage || e?.message || e);
  process.exit(1);
});
