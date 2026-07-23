import { createWalletClient, createPublicClient, http, parseUnits, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import fs from "node:fs";
import path from "node:path";

/**
 * Deploys the CONFIDENTIAL ShadeAaveVault (Nox-encrypted shares) on Arbitrum
 * Sepolia and wires it to the already-deployed Aave + Uniswap strategies.
 *
 * Prereqs:
 *  - PRIVATE_KEY exported (deployer already holds the strategies + USDC)
 *  - NoxCompute precompile live at 0xd464B198f06756a1d00be223634b85E0a731c229
 *    (verified present on Arbitrum Sepolia)
 *
 * Writes results to deployments/sepolia-nox.json
 */

const PK = process.env.PRIVATE_KEY as `0x${string}`;
if (!PK) throw new Error("PRIVATE_KEY required");
const RPC = process.env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc";

// Addresses already deployed by scripts/deploySepolia.ts (see deployments/sepolia.json)
const USDC = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const;
const AAVE_POOL = "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff" as const;
const FEE = 500;
const TICK_L = -60;
const TICK_U = 60;

// Already-deployed on this network (from sepolia.json)
const SHADE_TOKEN = "0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5" as const;
const AAVE_STRATEGY = "0x15bd317773d6793d7de2b4cad0fa6cb23440c990" as const;
const UNI_STRATEGY = "0x1e59cee63bbdcc6610a4a959e0b5ee5e7904daa6" as const;
const TEST_DAI = "0x8adb1d9f04328c355db13276f2be81fcf2710ff9" as const;
const MOCK_ROUTER = "0x2d5c88b952aaaa71457a22071e1b9f04d47977e0" as const;
const MOCK_PM = "0x1cf89361e70211f0b9ee879826908880bc5ab5ab" as const;

const account = privateKeyToAccount(PK);
const wallet = createWalletClient({ account, chain: arbitrumSepolia, transport: http(RPC) });
const pub = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });

function findArtifact(name: string) {
  const dirs = fs
    .readdirSync("artifacts/contracts", { recursive: true })
    .filter((f: string) => f.endsWith(`${name}.json`))
    .map((f: string) => path.resolve("artifacts/contracts", f));
  if (dirs.length === 0) throw new Error(`Artifact not found for ${name}`);
  return JSON.parse(fs.readFileSync(dirs[0], "utf8"));
}

async function deploy(name: string, args: any[] = []): Promise<`0x${string}`> {
  const art = findArtifact(name);
  const hash = await wallet.deployContract({
    abi: art.abi,
    bytecode: art.bytecode as `0x${string}`,
    args,
  });
  const receipt = await pub.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) throw new Error(`No contract address for ${name}`);
  console.log(`  ${name} -> ${receipt.contractAddress}`);
  return receipt.contractAddress;
}

async function main() {
  const deployer = account.address;
  const bal = await pub.getBalance({ address: deployer });
  console.log(`Deployer: ${deployer}  balance: ${Number(bal) / 1e18} ETH\n`);

  // Deploy the CONFIDENTIAL vault (Nox-encrypted shares)
  const vault = await deploy("ShadeAaveVault", ["ShadeYield Vault", USDC]);

  console.log("\n===== Confidential vault deployed =====");

  const vaultABI = [
    { type: "function", name: "addStrategy", inputs: [{ name: "_strategy", type: "address" }], outputs: [], stateMutability: "nonpayable" },
    { type: "function", name: "asset", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
    { type: "function", name: "owner", inputs: [], outputs: [{ name: "", type: "address" }], stateMutability: "view" },
    { type: "function", name: "balanceOfShares", inputs: [{ name: "user", type: "address" }], outputs: [{ name: "", type: "euint256" }], stateMutability: "view" },
  ] as const;

  // Add Aave strategy
  let tx = await wallet.writeContract({ address: vault, abi: vaultABI, functionName: "addStrategy", args: [AAVE_STRATEGY] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  AaveStrategy added to confidential vault");

  // Add Uniswap strategy
  tx = await wallet.writeContract({ address: vault, abi: vaultABI, functionName: "addStrategy", args: [UNI_STRATEGY] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  UniswapV3Strategy added to confidential vault");

  const out = {
    chain: "arbitrumSepolia",
    chainId: 421614,
    deployer,
    noxCompute: "0xd464B198f06756a1d00be223634b85E0a731c229",
    confidentialVault: vault,
    shadeToken: SHADE_TOKEN,
    aaveStrategy: AAVE_STRATEGY,
    uniStrategy: UNI_STRATEGY,
    usdc: USDC,
    testDAI: TEST_DAI,
    mockRouter: MOCK_ROUTER,
    mockPM: MOCK_PM,
  };
  fs.writeFileSync("deployments/sepolia-nox.json", JSON.stringify(out, null, 2));
  console.log("\nWritten -> deployments/sepolia-nox.json");
  console.log("\n✅ ShadeAaveVault (Nox-encrypted) deployed. Verify with a test deposit next.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
