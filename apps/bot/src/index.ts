import TelegramBot from "node-telegram-bot-api";
import { ethers } from "ethers";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) throw new Error("TELEGRAM_BOT_TOKEN not set");

const bot = new TelegramBot(TOKEN, { polling: true });

const VAULT_ADDRESS = process.env.VAULT_ADDRESS || "";
const RPC_URL = process.env.SEPOLIA_RPC || "https://sepolia.drpc.org";

const VAULT_ABI = [
  "function vaultName() view returns (string)",
  "function totalShares() view returns (uint256)",
  "function totalAssets() view returns (uint256)",
  "function balanceOfShares(address user) view returns (uint256)",
];

const provider = new ethers.JsonRpcProvider(RPC_URL);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🛡 Welcome to *ShadeYield* \u2014 your private yield vault on iExec Nox.\n\nCommands:\n/balance \u2014 your private vault balance\n/tvl \u2014 public vault TVL\n/deposit <amount> \u2014 deposit SHADE tokens\n/withdraw <amount> \u2014 withdraw SHADE tokens\n/wallet <address> \u2014 link your wallet`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/\/tvl/, async (msg) => {
  if (!VAULT_ADDRESS) return bot.sendMessage(msg.chat.id, "Vault not deployed");
  const vault = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider);
  const totalAssets = await vault.totalAssets();
  bot.sendMessage(msg.chat.id, `TVL: ${ethers.formatEther(totalAssets)} SHADE`);
});

console.log("ShadeYield bot skeleton ready.");
