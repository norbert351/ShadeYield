/**
 * Deploy updated vaults + new strategies.
 * Old strategies are locked to old vaults, so we deploy fresh ones.
 */
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import fs from "node:fs";
import path from "node:path";

const PK = process.env.PRIVATE_KEY as `0x${string}`;
if (!PK) throw new Error("PRIVATE_KEY required");
const RPC = process.env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc";

const USDC      = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
const AAVE_POOL = "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff";

// Existing TestDAI / MockPositionManager / MockSwapRouter for Uniswap strategy
const TEST_DAI  = "0x8ADB1D9F04328C355dB13276f2BE81FcF2710ff9";
const UNI_PM    = "0x1cf89361e70211f0b9ee879826908880bc5ab5Ab";
const UNI_SR    = "0x2D5c88b952aaaA71457a22071e1B9F04D47977E0";

const account = privateKeyToAccount(PK);
const wallet = createWalletClient({ account, chain: arbitrumSepolia, transport: http(RPC) });
const pub = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });

function findArtifact(name: string) {
  const dirs = (fs.readdirSync("artifacts/contracts", { recursive: true } as any) as string[])
    .filter((f: string) => f.endsWith(`${name}.json`))
    .map((f: string) => path.resolve("artifacts/contracts", f));
  if (dirs.length === 0) throw new Error(`Artifact not found for ${name}`);
  return JSON.parse(fs.readFileSync(dirs[0], "utf8"));
}

async function deploy(name: string, args: any[] = []): Promise<`0x${string}`> {
  const art = findArtifact(name);
  const hash = await wallet.deployContract({ abi: art.abi, bytecode: art.bytecode as `0x${string}`, args });
  const receipt = await pub.waitForTransactionReceipt({ hash });
  console.log(`  ${name} -> ${receipt.contractAddress}`);
  return receipt.contractAddress!;
}

async function main() {
  const deployer = account.address;
  const bal = await pub.getBalance({ address: deployer });
  console.log(`Deployer: ${deployer}  balance: ${Number(bal) / 1e18} ETH\n`);

  // 1. Deploy strategies (Simple vault)
  console.log("Deploying Simple Vault strategies...");
  const aaveSimple = await deploy("AaveStrategy", [USDC, AAVE_POOL]);
  const uniSimple  = await deploy("UniswapV3Strategy", [USDC, TEST_DAI, UNI_PM, UNI_SR, 500, -60, 60]);

  // 2. Deploy strategies (Encrypted vault)
  console.log("\nDeploying Encrypted Vault strategies...");
  const aaveEnc = await deploy("AaveStrategy", [USDC, AAVE_POOL]);
  const uniEnc  = await deploy("UniswapV3Strategy", [USDC, TEST_DAI, UNI_PM, UNI_SR, 500, -60, 60]);

  // 3. Deploy updated Simple Vault
  console.log("\nDeploying updated Simple Vault...");
  const simpleVault = await deploy("ShadeAaveVaultSimple", ["ShadeYield Simple Vault", USDC]);

  // 4. Deploy updated Encrypted Vault
  console.log("Deploying updated Encrypted Vault...");
  const encVault = await deploy("ShadeAaveVault", ["ShadeYield Encrypted Vault", USDC, deployer]);

  // 5. Wire Simple Vault
  console.log("\nWiring Simple Vault...");
  const vaultABI = [
    { type: "function", name: "addStrategy", inputs: [{ name: "_strategy", type: "address" }], outputs: [], stateMutability: "nonpayable" },
  ] as const;

  let tx = await wallet.writeContract({ address: simpleVault, abi: vaultABI, functionName: "addStrategy", args: [aaveSimple] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  AaveStrategy added to Simple Vault ✅");

  tx = await wallet.writeContract({ address: simpleVault, abi: vaultABI, functionName: "addStrategy", args: [uniSimple] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  UniswapV3Strategy added to Simple Vault ✅");

  // 6. Wire Encrypted Vault
  console.log("\nWiring Encrypted Vault...");
  tx = await wallet.writeContract({ address: encVault, abi: vaultABI, functionName: "addStrategy", args: [aaveEnc] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  AaveStrategy added to Encrypted Vault ✅");

  tx = await wallet.writeContract({ address: encVault, abi: vaultABI, functionName: "addStrategy", args: [uniEnc] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  UniswapV3Strategy added to Encrypted Vault ✅");

  // 7. Save
  const out = {
    chain: "arbitrumSepolia",
    chainId: 421614,
    deployer,
    USDC,
    AAVE_POOL,
    simpleVault,
    encVault,
    aaveSimple,
    uniSimple,
    aaveEnc,
    uniEnc,
  };
  const dir = "deployments";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, "updated-vaults.json"), JSON.stringify(out, null, 2));
  console.log("\n✅ All done! Addresses saved to deployments/updated-vaults.json");

  console.log(`\n===== NEW ADDRESSES =====`);
  console.log(`  SimpleVault:        ${simpleVault}`);
  console.log(`  EncryptedVault:     ${encVault}`);
  console.log(`  AaveStrategy:       ${aaveSimple}`);
  console.log(`  UniswapStrategy:    ${uniSimple}`);
  console.log(`  AaveStrategyEnc:    ${aaveEnc}`);
  console.log(`  UniswapStrategyEnc: ${uniEnc}`);
}

main().catch((e) => { console.error(e?.shortMessage || e?.message || e); process.exit(1); });
