import { createPublicClient, http, parseAbi, parseUnits } from "viem";
import { mainnet } from "viem/chains";

const RPC = process.env.MAINNET_RPC || "https://ethereum.publicnode.com";
const client = createPublicClient({ chain: mainnet, transport: http(RPC) });

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const QUOTER = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

const quoterAbi = parseAbi([
  "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)",
]);

const amountIn = parseUnits("5000", 6);
const amountOut = await client.readContract({
  address: QUOTER,
  abi: quoterAbi,
  functionName: "quoteExactInputSingle",
  args: [USDC, USDT, 500, amountIn, 0n],
});
console.log("amountOut:", amountOut.toString());
