import { createWalletClient, createPublicClient, http, parseUnits, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import fs from "node:fs";
import path from "node:path";

const PK = process.env.PRIVATE_KEY as `0x${string}`;
if (!PK) throw new Error("PRIVATE_KEY required");
const RPC = process.env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc";

const USDC      = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const;
const AAVE_POOL = "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff" as const;
const FEE       = 500;
const TICK_L    = -60;
const TICK_U    = 60;

const account   = privateKeyToAccount(PK);
const wallet    = createWalletClient({ account, chain: arbitrumSepolia, transport: http(RPC) });
const pub       = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });

function findArtifact(name: string) {
  // Search through all artifact directories
  const dirs = fs.readdirSync("artifacts/contracts", { recursive: true })
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

  const testDAI    = await deploy("TestDAI");
  const mockPM     = await deploy("MockPositionManager");
  const mockRouter = await deploy("MockSwapRouter", [testDAI]);

  const shadeToken   = await deploy("ShadeToken", ["Shade USD Coin", "sUSDC", 18, parseUnits("1000000", 18)]);

  const aaveStrategy = await deploy("AaveStrategy", [USDC, AAVE_POOL]);
  const uniStrategy  = await deploy("UniswapV3Strategy", [USDC, testDAI, mockPM, mockRouter, FEE, TICK_L, TICK_U]);

  // Deploy transparent vault (no Nox required)
  const vault        = await deploy("ShadeAaveVaultSimple", ["ShadeYield Vault", USDC]);

  console.log("\n===== Deployed =====");
  const entries: Record<string, string> = { shadeToken, vault, aaveStrategy, uniStrategy, testDAI, mockRouter, mockPM };
  for (const [k, v] of Object.entries(entries)) console.log(`  ${k.padEnd(22)} ${v}`);

  // Wire vault with strategies
  console.log("\nWiring vault to strategies...");
  const vaultABI = [
    { type: "function", name: "addStrategy", inputs: [{ name: "_strategy", type: "address" }], outputs: [], stateMutability: "nonpayable" },
    { type: "function", name: "allocateToStrategy", inputs: [{ name: "_strategy", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
    { type: "function", name: "asset", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
    { type: "function", name: "owner", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
  ] as const;

  // Add Aave strategy
  let tx = await wallet.writeContract({ address: vault, abi: vaultABI, functionName: "addStrategy", args: [aaveStrategy] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log(`  AaveStrategy added to vault`);

  // Add Uniswap strategy
  tx = await wallet.writeContract({ address: vault, abi: vaultABI, functionName: "addStrategy", args: [uniStrategy] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log(`  UniswapV3Strategy added to vault`);

  // Seed vault with any USDC the deployer holds
  const myUsdc = await pub.readContract({ address: USDC, abi: [
    { type: "function", name: "balanceOf", inputs: [{ name: "a", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  ] as const, functionName: "balanceOf", args: [deployer] });
  if (myUsdc > 0n) {
    const seedAmount = myUsdc > 1000000n ? 1000000n : myUsdc; // max 1 USDC for gas testing
    tx = await wallet.writeContract({ address: USDC, abi: [
      { type: "function", name: "transfer", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
    ] as const, functionName: "transfer", args: [vault, seedAmount] });
    await pub.waitForTransactionReceipt({ hash: tx });
    console.log(`  Vault seeded with ${Number(seedAmount) / 1e6} USDC`);
  } else {
    console.log("  No test USDC to seed vault. Get from https://faucet.circle.com");
  }

  console.log("\nShadeAaveVault deployed — no Nox dependency, ready for deposits!");

  const out = { chain: "arbitrumSepolia", chainId: 421614, deployer, ...entries };
  fs.writeFileSync("deployments/sepolia.json", JSON.stringify(out, null, 2));
  console.log("\nWritten -> deployments/sepolia.json");
}

main().catch((e) => { console.error(e); process.exit(1); });
