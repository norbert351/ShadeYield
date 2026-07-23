import { createPublicClient, http, parseAbi, parseUnits } from "viem";
import { mainnet } from "viem/chains";

const RPC = process.env.MAINNET_RPC || "https://ethereum.publicnode.com";
const client = createPublicClient({ chain: mainnet, transport: http(RPC) });

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const ROUTER02 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

const routerAbi = parseAbi(["function exactInputSingle((address,address,uint24,address,uint256,uint256,uint160)) external returns (uint256)"]);

const amountIn = parseUnits("5000", 6);
const params = [USDC, USDT, 500, "0x0000000000000000000000000000000000000001", amountIn, 0n, 0n];
const amountOut = await client.readContract({ address: ROUTER02, abi: routerAbi, functionName: "exactInputSingle", args: [params] });
console.log("amountOut:", amountOut.toString());
