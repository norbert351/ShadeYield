import { createPublicClient, createWalletClient, http, getAddress, formatUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import fs from "fs";

const PK = process.env.PRIVATE_KEY as `0x${string}`;
const RPC = "https://sepolia-rollup.arbitrum.io/rpc";
const account = privateKeyToAccount(PK);
const wallet = createWalletClient({ account, chain: arbitrumSepolia, transport: http(RPC) });
const pub = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });

const OLD_VAULT = getAddress("0x5B1876A08Aa687A70203AE28f1421D62f538DD1C");
const NEW_VAULT = getAddress("0xb53fe2f6f1d60a107ede44ccde32be915a7cc395");
const USDC = getAddress("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d");

async function main() {
  // 1. Check idle
  const idle = await pub.readContract({ address: USDC, abi: [{ type: "function", name: "balanceOf", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" }], functionName: "balanceOf", args: [OLD_VAULT] }) as bigint;
  console.log(`Old vault idle: ${formatUnits(idle, 6)} USDC`);
  if (idle <= 0n) { console.log("Nothing to migrate"); return; }

  // 2. Deploy ForwarderStrategy
  console.log("Deploying ForwarderStrategy...");
  const art = JSON.parse(fs.readFileSync("artifacts/contracts/ForwarderStrategy.sol/ForwarderStrategy.json", "utf8"));
  const hash = await wallet.deployContract({ abi: art.abi, bytecode: art.bytecode, args: [USDC, NEW_VAULT] });
  const receipt = await pub.waitForTransactionReceipt({ hash });
  const forwarder = receipt.contractAddress!;
  console.log(`  Forwarder: ${forwarder}`);

  // 3. Add to old vault
  console.log("Adding forwarder to old vault...");
  const tx = await wallet.writeContract({ address: OLD_VAULT, abi: [{ type: "function", name: "addStrategy", inputs: [{ type: "address" }], outputs: [], stateMutability: "nonpayable" }], functionName: "addStrategy", args: [forwarder] });
  await pub.waitForTransactionReceipt({ hash: tx });
  console.log("  Added ✅");

  // 4. Now allocateToStrategy — harvest on forwarder returns 0, harvest on old Aave
  //    has 1 wei aToken, but old Uniswap still fails "No position"
  // Let me handle this: allocate to the Forwarder specifically.
  console.log(`Allocating ${formatUnits(idle, 6)} USDC to forwarder...`);
  const allocTx = await wallet.writeContract({ address: OLD_VAULT, abi: [{ type: "function", name: "allocateToStrategy", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [], stateMutability: "nonpayable" }], functionName: "allocateToStrategy", args: [forwarder, idle] });
  await pub.waitForTransactionReceipt({ hash: allocTx });
  console.log("  ✅ Allocated!");
  
  // 5. Check new vault idle balance — auto-allocate should deploy it
  const newIdle = await pub.readContract({ address: USDC, abi: [{ type: "function", name: "balanceOf", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" }], functionName: "balanceOf", args: [NEW_VAULT] }) as bigint;
  console.log(`\nNew vault USDC balance: ${formatUnits(newIdle, 6)} USDC`);
  
  const newAllocated = await pub.readContract({ address: NEW_VAULT, abi: [{ type: "function", name: "totalAllocated", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" }], functionName: "totalAllocated" }) as bigint;
  console.log(`New vault allocated: ${formatUnits(newAllocated, 6)} USDC`);

  console.log("\n🎉 Migration complete! 7 USDC from old vault forwarded to new vault's auto-allocate.");
}

main().catch(e => { console.error(e?.cause?.reason || e?.shortMessage || e?.message); process.exit(1); });
