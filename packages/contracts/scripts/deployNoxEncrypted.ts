/**
 * Deploy encrypted ShadeAaveVault on Arbitrum Sepolia.
 * Minimal viem script — no getContract, no type gymnastics.
 */

import { createPublicClient, createWalletClient, http, contract, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import { createViemHandleClient } from "@iexec-nox/handle";
import fs from "node:fs";

const RPC = process.env.RPC || "https://sepolia-rollup.arbitrum.io/rpc";
const PK = process.env.PK!;
if (!PK) throw new Error("Export PK=0x...");
const k = (PK.startsWith("0x") ? PK : "0x" + PK) as Address;

async function main() {
  const account = privateKeyToAccount(k);
  const caller = account.address;
  const asset = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as Address;

  const pc = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });
  const wc = createWalletClient({ account, chain: arbitrumSepolia, transport: http(RPC) });

  console.log(`Deployer: ${caller}`);
  console.log(`Balance: ${(await pc.getBalance({ address: caller })).toString()} wei\n`);

  // 1. Deploy vault
  const art = JSON.parse(fs.readFileSync("./artifacts/contracts/ShadeAaveVault.sol/ShadeAaveVault.json", "utf8"));
  const deployHash = await wc.deployContract({
    abi: art.abi as any,
    bytecode: art.bytecode as any,
    args: ["ShadeYield Encrypted Vault", asset, caller],
    chain: arbitrumSepolia as any,
  } as any);
  const depReceipt = await pc.waitForTransactionReceipt({ hash: deployHash });
  const vaultAddr = depReceipt.contractAddress!;
  console.log(`Vault: ${vaultAddr}`);
  console.log(`Deploy tx: ${deployHash}\n`);

  // 2. Encrypt handles
  const hc = await createViemHandleClient(wc);
  const s0 = await hc.encryptInput(0n, "uint256", vaultAddr);
  const a0 = await hc.encryptInput(0n, "uint256", vaultAddr);
  console.log(`shares handle: ${s0.handle}`);
  console.log(`assets handle: ${a0.handle}\n`);

  // 3. Initialize via writeContract
  const initHash = await wc.writeContract({
    abi: art.abi as any,
    address: vaultAddr,
    functionName: "initialize",
    args: [
      s0.handle as any,
      s0.handleProof as any,
      a0.handle as any,
      a0.handleProof as any,
    ],
    chain: arbitrumSepolia as any,
  } as any);
  const initReceipt = await pc.waitForTransactionReceipt({ hash: initHash });
  console.log(`Init block: ${initReceipt.blockNumber}`);

  // Summary
  console.log(`\n✅ Encrypted ShadeAaveVault live!`);
  console.log(`   Contract: ${vaultAddr}`);
  console.log(`   Owner: ${caller}`);

  fs.writeFileSync("./deployments/arbitrumSepolia-encrypted.json", JSON.stringify({
    chain: "arbitrumSepolia", chainId: 421614, vault: vaultAddr,
    vaultName: "ShadeYield Encrypted Vault", asset, owner: caller,
    deployTx: deployHash, initTx: initHash,
    deployedAt: new Date().toISOString(),
  }, null, 2));
}

main().catch(e => {
  console.error("FAILED:", e?.shortMessage || e?.message || e);
  process.exit(1);
});
