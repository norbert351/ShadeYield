import TelegramBot from "node-telegram-bot-api";
import {
  createPublicClient,
  createWalletClient,
  http,
  formatUnits,
  parseUnits,
  getContract,
  type Address,
  type PublicClient,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

const BOT_TOKEN = process.env.BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN (or TELEGRAM_BOT_TOKEN) env var required");

const PRIVATE_KEY = (process.env.PRIVATE_KEY ?? "") as Address;
const HAS_WALLET = PRIVATE_KEY.length > 0;

const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const CHAIN = arbitrumSepolia;
const CHAIN_ID = 421614;
const EXPLORER_URL = "https://sepolia.arbiscan.io";

// ---------------------------------------------------------------------------
// Deployed contract addresses (Arbitrum Sepolia)
// ---------------------------------------------------------------------------

const ADDRESSES = {
  USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as Address,
  TestDAI: "0x8adb1d9f04328c355db13276f2be81fcf2710ff9" as Address,
  ShadeToken: "0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5" as Address,
  ShadeAaveVault: "0x5b1876a08aa687a70203ae28f1421d62f538dd1c" as Address,
  ShadeAaveVaultEncrypted: "0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85" as Address,
  AaveStrategy: "0x15bd317773d6793d7de2b4cad0fa6cb23440c990" as Address,
  UniswapV3Strategy: "0x1e59cee63bbdcc6610a4a959e0b5ee5e7904daa6" as Address,
  AaveStrategyEnc: "0xbec0722b889bd6064db52d3339b1e3ae9f00abf1" as Address,
  UniswapV3StrategyEnc: "0x3f21e1d960a6e02a6b54f4100092f57ca6b8399e" as Address,
  AaveV3Pool: "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff" as Address,
} as const;

// ---------------------------------------------------------------------------
// Minimal ABIs
// ---------------------------------------------------------------------------

const ERC20_ABI = [
  { type: "function", name: "balanceOf", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "decimals", inputs: [], outputs: [{ type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "totalSupply", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "name", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
] as const;

const SHADE_TOKEN_ABI = [
  ...ERC20_ABI,
  { type: "function", name: "mint", inputs: [{ type: "address", name: "to" }, { type: "uint256", name: "amount" }], outputs: [], stateMutability: "nonpayable" },
] as const;

const AAVE_STRATEGY_ABI = [
  { type: "function", name: "totalAssets", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "principal", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "asset", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
] as const;

const UNI_STRATEGY_ABI = [
  { type: "function", name: "totalAssets", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "asset", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
] as const;

const VAULT_ABI = [
  ...ERC20_ABI,
  { type: "function", name: "totalAssets", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalShares", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "totalAllocated", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "shares", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "asset", inputs: [], outputs: [{ type: "address" }], stateMutability: "view" },
  { type: "function", name: "deposit", inputs: [{ type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "requestWithdraw", inputs: [{ type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "claimWithdraw", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "balanceOfShares", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "pendingWithdrawals", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "harvestAll", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "nonpayable" },
] as const;

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

const publicClient: PublicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL),
});

let walletClient: WalletClient | null = null;
let botAddress: Address | null = null;
let account: ReturnType<typeof privateKeyToAccount> | null = null;

if (HAS_WALLET) {
  try {
    account = privateKeyToAccount(PRIVATE_KEY);
    walletClient = createWalletClient({ account, chain: CHAIN, transport: http(RPC_URL) });
    botAddress = account.address;
  } catch (e) {
    console.warn("Wallet setup failed — write commands will be unavailable:", e);
  }
}

// ---------------------------------------------------------------------------
// Telegram bot
// ---------------------------------------------------------------------------

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function bold(s: string): string { return `*${s}*`; }
function code(s: string): string { return `\`${s}\``; }
function link(text: string, url: string): string { return `[${text}](${url})`; }

function explorerAddress(address: Address): string {
  return link(`${address.slice(0, 6)}...${address.slice(-4)}`, `${EXPLORER_URL}/address/${address}`);
}

function explorerTx(hash: string): string {
  return link(`${hash.slice(0, 8)}...`, `${EXPLORER_URL}/tx/${hash}`);
}

async function getTokenInfo(tokenAddress: Address, holderAddress: Address): Promise<{ symbol: string; decimals: number; balance: bigint } | null> {
  try {
    const contract = getContract({ address: tokenAddress, abi: ERC20_ABI, client: publicClient });
    const [symbol, decimals, balance] = await Promise.all([
      contract.read.symbol(), contract.read.decimals(), contract.read.balanceOf([holderAddress]),
    ]);
    return { symbol, decimals, balance };
  } catch { return null; }
}

function formatBalance(value: bigint, decimals: number, precision = 4): string {
  const formatted = formatUnits(value, decimals);
  const parts = formatted.split(".");
  if (parts.length === 2 && parts[1].length > precision) return `${parts[0]}.${parts[1].slice(0, precision)}`;
  return formatted;
}

// ---------------------------------------------------------------------------
// /start
// ---------------------------------------------------------------------------
bot.onText(/^\/start$/, async (msg) => {
  const chatId = msg.chat.id;
  const welcome = [
    `🛡 ${bold("ShadeYield Bot")} — Private Yield on iExec Nox`,
    "",
    "DeFi yield strategies on Arbitrum Sepolia, powered by ShadeYield.",
    "",
    `${bold("Commands")}`,
    `${code("/start")} — Show this help`,
    `${code("/status")} — TVL, strategies, APY`,
    `${code("/balance <address>")} — Wallet balances and vault shares`,
    `${code("/harvest")} — Harvest yield (permissionless — earn 0.05% incentive!)`,
    `${code("/contracts")} — All deployed addresses`,
    "",
    `🛡 Encrypted vault: ${explorerAddress(ADDRESSES.ShadeAaveVaultEncrypted)}`,
    `📦 Simple vault: ${explorerAddress(ADDRESSES.ShadeAaveVault)}`,
    "",
    `Chain: Arbitrum Sepolia (${CHAIN_ID})`,
    `${bold("Harvest")}: permissionless — anyone can call and earn 0.05% of the yield!`,
    HAS_WALLET ? `🤖 Bot: ${explorerAddress(botAddress!)}` : "🤖 Bot wallet: not configured",
  ].join("\n");
  await bot.sendMessage(chatId, welcome, { parse_mode: "Markdown" });
});

// ---------------------------------------------------------------------------
// /status
// ---------------------------------------------------------------------------
bot.onText(/^\/status$/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const [aaveAssets, aavePrincipal, uniAssets, sUSDC, vaultAssets] = await Promise.all([
      getContract({ address: ADDRESSES.AaveStrategyEnc, abi: AAVE_STRATEGY_ABI, client: publicClient }).read.totalAssets(),
      getContract({ address: ADDRESSES.AaveStrategyEnc, abi: AAVE_STRATEGY_ABI, client: publicClient }).read.principal(),
      getContract({ address: ADDRESSES.UniswapV3StrategyEnc, abi: UNI_STRATEGY_ABI, client: publicClient }).read.totalAssets(),
      getContract({ address: ADDRESSES.ShadeToken, abi: ERC20_ABI, client: publicClient }).read.totalSupply(),
      getContract({ address: ADDRESSES.ShadeAaveVaultEncrypted, abi: VAULT_ABI, client: publicClient }).read.totalAssets().catch(() => 0n),
    ]);

    const aaveTVL = Number(formatUnits(aaveAssets, 6));
    const aavePrincipalNum = Number(formatUnits(aavePrincipal, 6));
    const uniTVL = Number(formatUnits(uniAssets, 6));
    const totalTVL = aaveTVL + uniTVL;
    const vaultTVL = Number(formatUnits(vaultAssets as bigint, 6));
    const aaveProfit = aaveAssets > aavePrincipal ? aaveAssets - aavePrincipal : 0n;
    const aaveApyEst = aavePrincipal > 0n ? Number((aaveProfit * 10000n) / aavePrincipal) / 100 : 0;

    const msgText = [
      `📊 ${bold("ShadeYield Status")}`,
      "",
      `${bold("TVL")}`,
      `  Total:    ${bold(totalTVL.toFixed(2))} USDC`,
      `  Aave:     ${aaveTVL.toFixed(2)} USDC`,
      `  Uniswap:  ${uniTVL.toFixed(2)} USDC`,
      `  Vault:    ${vaultTVL.toFixed(2)} USDC`,
      "",
      `${bold("Strategies")}`,
      `  Aave V3:   ${totalTVL > 0 ? ((aaveTVL / totalTVL) * 100).toFixed(1) : "0"}% | Est. APY: ${aaveApyEst.toFixed(2)}%`,
      `  Uniswap V3: ${totalTVL > 0 ? ((uniTVL / totalTVL) * 100).toFixed(1) : "0"}%`,
      "",
      `🛡 Encrypted vault: ${vaultTVL > 0 ? "ACTIVE" : "deployed ✓"}`,
    ].join("\n");

    await bot.sendMessage(chatId, msgText, { parse_mode: "Markdown" });
  } catch (err: any) {
    await bot.sendMessage(chatId, `❌ Error fetching status: ${code(err.message || String(err))}`, { parse_mode: "Markdown" });
  }
});

// ---------------------------------------------------------------------------
// /balance <address>
// ---------------------------------------------------------------------------
bot.onText(/^\/balance(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const addressInput = match?.[1]?.trim();
  if (!addressInput) {
    await bot.sendMessage(chatId, `Usage: ${code("/balance <wallet_address>")}`, { parse_mode: "Markdown" });
    return;
  }
  let address: Address;
  try {
    address = addressInput as Address;
    if (!address.startsWith("0x") || address.length !== 42) throw new Error();
  } catch {
    await bot.sendMessage(chatId, "❌ Invalid address format.", { parse_mode: "Markdown" });
    return;
  }

  try {
    const ethBalance = await publicClient.getBalance({ address });
    const tokens = [
      { address: ADDRESSES.USDC, decimals: 6 },
      { address: ADDRESSES.ShadeToken, decimals: 18 },
      { address: ADDRESSES.TestDAI, decimals: 18 },
    ];
    const balanceResults = await Promise.all(tokens.map((t) =>
      getTokenInfo(t.address, address).then((info) => ({
        ...t,
        balance: info?.balance ?? 0n,
        decimals: info?.decimals ?? t.decimals,
        symbol: info?.symbol ?? "??",
      }))
    ));

    // Get vault shares
    let simpleShares = 0n;
    let encShares = 0n;
    try {
      simpleShares = await publicClient.readContract({ address: ADDRESSES.ShadeAaveVault, abi: VAULT_ABI, functionName: "balanceOfShares", args: [address] }) as bigint;
    } catch {}
    try {
      encShares = await publicClient.readContract({ address: ADDRESSES.ShadeAaveVaultEncrypted, abi: VAULT_ABI, functionName: "balanceOfShares", args: [address] }) as bigint;
    } catch {}

    const lines = [
      `💰 ${bold("Wallet Balance")}`,
      `  Address: ${code(address)}`,
      `  ETH: ${formatBalance(ethBalance, 18)}`,
    ];
    for (const r of balanceResults) {
      lines.push(`  ${r.symbol}: ${formatBalance(r.balance, r.decimals)}`);
    }
    lines.push("", `🛡 ${bold("Vault Shares")}`);
    lines.push(`  Simple: ${formatBalance(simpleShares, 6)} shares`);
    lines.push(`  Encrypted: ${formatBalance(encShares, 6)} shares (Nox ${code("euint256")})`);

    await bot.sendMessage(chatId, lines.join("\n"), { parse_mode: "Markdown" });
  } catch (err: any) {
    await bot.sendMessage(chatId, `❌ Error: ${code(err?.shortMessage || err?.message || String(err))}`, { parse_mode: "Markdown" });
  }
});

// ---------------------------------------------------------------------------
// /harvest — permissionless (anyone can call, earns 0.05% incentive)
// ---------------------------------------------------------------------------
bot.onText(/^\/harvest$/, async (msg) => {
  const chatId = msg.chat.id;
  if (!HAS_WALLET || !walletClient || !account) {
    await bot.sendMessage(chatId, `❌ Bot wallet not configured. Set ${code("PRIVATE_KEY")} to enable harvest.`, { parse_mode: "Markdown" });
    return;
  }
  try {
    await bot.sendMessage(chatId, "⏳ Harvesting yield from all strategies via vault...", { parse_mode: "Markdown" });
    const hash = await walletClient.writeContract({
      address: ADDRESSES.ShadeAaveVaultEncrypted,
      abi: VAULT_ABI,
      functionName: "harvestAll",
      args: [],
      chain: CHAIN,
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    await bot.sendMessage(chatId,
      `✅ ${bold("Harvest Complete")}\n\n` +
      `Vault: ${explorerAddress(ADDRESSES.ShadeAaveVaultEncrypted)}\n` +
      `Tx: ${explorerTx(hash)}\n` +
      `Block: ${receipt.blockNumber}\n\n` +
      `ℹ️ Caller earned a ${bold("0.05%")} harvesting incentive fee.`,
      { parse_mode: "Markdown" }
    );
  } catch (err: any) {
    await bot.sendMessage(chatId, `❌ Harvest failed: ${code(err?.shortMessage || err?.message || String(err))}`, { parse_mode: "Markdown" });
  }
});

// ---------------------------------------------------------------------------
// /contracts
// ---------------------------------------------------------------------------
bot.onText(/^\/contracts$/, async (msg) => {
  const chatId = msg.chat.id;
  const contractList = [
    ["ShadeAaveVault (Encrypted + Nox)", ADDRESSES.ShadeAaveVaultEncrypted],
    ["ShadeAaveVaultSimple", ADDRESSES.ShadeAaveVault],
    ["AaveStrategy (enc vault)", ADDRESSES.AaveStrategyEnc],
    ["UniswapV3Strategy (enc vault)", ADDRESSES.UniswapV3StrategyEnc],
    ["AaveStrategy (simple vault)", ADDRESSES.AaveStrategy],
    ["UniswapV3Strategy (simple vault)", ADDRESSES.UniswapV3Strategy],
    ["ShadeToken (sUSDC)", ADDRESSES.ShadeToken],
    ["USDC", ADDRESSES.USDC],
    ["Aave V3 Pool", ADDRESSES.AaveV3Pool],
  ] as const;

  const lines = [`📜 ${bold("Deployed Contracts — Arbitrum Sepolia")}`, ""];
  for (const [name, addr] of contractList) {
    lines.push(`${bold(name)}`);
    lines.push(`  ${explorerAddress(addr)}`);
    lines.push(`  ${code(addr)}`);
    lines.push("");
  }
  lines.push(`🛡 Harvest is permissionless — anyone earns ${bold("0.05%")} of the yield as incentive.`);
  await bot.sendMessage(chatId, lines.join("\n"), { parse_mode: "Markdown" });
});

// ---------------------------------------------------------------------------
// Fallback for unknown commands
// ---------------------------------------------------------------------------
bot.on("message", async (msg) => {
  if (msg.text?.startsWith("/")) {
    const handledCommands = ["/start", "/status", "/balance", "/harvest", "/contracts"];
    const cmd = msg.text.split(" ")[0].toLowerCase();
    if (!handledCommands.includes(cmd)) {
      await bot.sendMessage(msg.chat.id, `❌ Unknown command: ${code(cmd)}\n\nUse ${code("/start")} for help.`, { parse_mode: "Markdown" });
    }
  }
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------
console.log(`🤖 ShadeYield Bot starting...`);
console.log(`   Chain:   Arbitrum Sepolia (${CHAIN_ID})`);
console.log(`   RPC:     ${RPC_URL}`);
console.log(`   Wallet:  ${HAS_WALLET ? botAddress : "not configured"}`);
console.log(`   Polling: active`);

process.on("SIGINT", () => { console.log("\nShutting down..."); bot.stopPolling(); process.exit(0); });
process.on("SIGTERM", () => { console.log("\nShutting down..."); bot.stopPolling(); process.exit(0); });
