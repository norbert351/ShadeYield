/**
 * Deploy ShadeYield on ETH Sepolia for WTF Hackathon.
 * Uses TestUSDC + HoldStrategy (no Aave dependency).
 */
import { createPublicClient, createWalletClient, http, parseUnits, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { createViemHandleClient } from "@iexec-nox/handle";
import fs from "fs";
import path from "path";

const PK = process.env.PRIVATE_KEY as `0x${string}`;
if (!PK) throw new Error("PRIVATE_KEY required");
const RPC = process.env.SEPOLIA_RPC || "https://ethereum-sepolia.publicnode.com";

const account = privateKeyToAccount(PK);
const wallet = createWalletClient({ account, chain: sepolia, transport: http(RPC) });
const pub = createPublicClient({ chain: sepolia, transport: http(RPC) });

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

  // 1. Deploy TestUSDC (mintable ERC20)
  console.log("Deploying TestUSDC...");
  const testUsdc = await deploy("TestDAI"); // TestDAI is a mintable ERC20, works as TestUSDC

  // 2. Mint 10,000 TestUSDC to deployer
  const mintTx = await wallet.writeContract({
    address: testUsdc,
    abi: [{ type: "function", name: "mint", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [], stateMutability: "nonpayable" }],
    functionName: "mint",
    args: [deployer, parseUnits("10000", 18)],
  });
  await pub.waitForTransactionReceipt({ hash: mintTx });
  console.log(`  Minted 10,000 TestUSDC to ${deployer}`);

  // 3. Deploy HoldStrategy
  console.log("\nDeploying HoldStrategy...");
  // 3. Deploy HoldStrategies (one per vault)
  console.log("\nDeploying HoldStrategies...");
  const simpleStrategy = await deploy("HoldStrategy", [testUsdc]);
  const encStrategy = await deploy("HoldStrategy", [testUsdc]);

  // 4. Deploy Simple Vault
  console.log("\nDeploying Simple Vault...");
  const simpleVault = await deploy("ShadeAaveVaultSimple", ["ShadeYield Simple", testUsdc]);

  // 5. Deploy Encrypted Vault (Nox)
  console.log("\nDeploying Encrypted Vault (Nox)...");
  const encVault = await deploy("ShadeAaveVault", ["ShadeYield Encrypted", testUsdc, deployer]);

  // 6. Wire Simple Vault
  console.log("\nWiring Simple Vault...");
  let tx = await wallet.writeContract({
    address: simpleVault,
    abi: [{ type: "function", name: "addStrategy", inputs: [{ type: "address" }], outputs: [], stateMutability: "nonpayable" }],
    functionName: "addStrategy",
    args: [simpleStrategy],
  });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  HoldStrategy added ✅");

  // 7. Wire Encrypted Vault
  console.log("\nWiring Encrypted Vault...");
  tx = await wallet.writeContract({
    address: encVault,
    abi: [{ type: "function", name: "addStrategy", inputs: [{ type: "address" }], outputs: [], stateMutability: "nonpayable" }],
    functionName: "addStrategy",
    args: [encStrategy],
  });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  HoldStrategy added ✅");

  // 8. Initialize Nox encrypted vault state
  console.log("\nInitializing Nox state for encrypted vault...");
  try {
    const hc = await createViemHandleClient(wallet);
    const s0 = await hc.encryptInput(0n, "uint256", encVault);
    const a0 = await hc.encryptInput(0n, "uint256", encVault);
    console.log(`  shares handle: ${s0.handle}`);
    console.log(`  assets handle: ${a0.handle}`);

    tx = await wallet.writeContract({
      address: encVault,
      abi: (findArtifact("ShadeAaveVault")).abi,
      functionName: "initialize",
      args: [s0.handle, s0.handleProof, a0.handle, a0.handleProof],
    });
    await pub.waitForTransactionReceipt({ hash: tx });
    console.log("  Nox state initialized ✅");
  } catch (e: any) {
    console.log("  ⚠️ Nox init skipped:", e?.shortMessage?.slice(0, 60) || "Nox handle client not available");
  }

  // 9. Seed simple vault with 100 TestUSDC (so it has idle balance for demo)
  tx = await wallet.writeContract({
    address: testUsdc,
    abi: [{ type: "function", name: "transfer", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" }],
    functionName: "transfer",
    args: [simpleVault, parseUnits("100", 18)],
  });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("\n  Seeded Simple Vault with 100 TestUSDC");

  // 10. Save deployment
  const out = {
    chain: "sepolia",
    chainId: 11155111,
    deployer,
    testUsdc,
    simpleStrategy,
    encStrategy,
    simpleVault,
    encVault,
    noxCompute: "0xd464B198f06756a1d00be223634b85E0a731c229",
  };
  const dir = "deployments";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, "sepolia-hackathon.json"), JSON.stringify(out, null, 2));

  console.log("\n===== DEPLOYMENT SUMMARY =====");
  console.log(`  TestUSDC:          ${testUsdc}`);
  console.log(`  SimpleStrategy:    ${simpleStrategy}`);
  console.log(`  EncStrategy:       ${encStrategy}`);
  console.log(`  SimpleVault:       ${simpleVault}`);
  console.log(`  EncryptedVault:    ${encVault}`);
  console.log(`  NoxCompute:        0xd464B198f06756a1d00be223634b85E0a731c229`);
  console.log(`\n✅ ShadeYield deployed on ETH Sepolia!`);
}

main().catch((e) => { console.error(e?.shortMessage || e?.message || e); process.exit(1); });
