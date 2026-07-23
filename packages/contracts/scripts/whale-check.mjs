import { createPublicClient, http, parseAbi, formatUnits } from "viem";
import { mainnet } from "viem/chains";

const RPC = process.env.MAINNET_RPC || "https://ethereum.publicnode.com";
const client = createPublicClient({ chain: mainnet, transport: http(RPC) });

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const usdcAbi = parseAbi(["function balanceOf(address) view returns (uint256)"]);

const candidates = [
  "0x55FE002aefF02F77364de339a1292923A15844B8",
  "0x838F9b8228a5C95cD3D13Cf4f2812CeeD7401A74",
  "0x9507c04B104065475f3efDBC1EbB91e3AaEA4224",
  "0xDBF5E9c5206d0dB70a90108bf936DA60221dC080",
  "0xF977814e90dA44bFA03b6295A0616a897441aceC",
  "0x0716a17FBAeE714f1E6aB0f9d59edbC5f09815C0",
  "0x28C6c06298d514Db089934071355E5743bf21d60",
];

for (const addr of candidates) {
  const bal = await client.readContract({ address: USDC, abi: usdcAbi, functionName: "balanceOf", args: [addr] });
  console.log(`${addr}: ${formatUnits(bal, 6)} USDC`);
}
