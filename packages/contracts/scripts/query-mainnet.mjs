import { createPublicClient, http, parseAbi, formatUnits } from "viem";
import { mainnet } from "viem/chains";

const RPC = process.env.MAINNET_RPC || "https://eth.llamarpc.com";
const client = createPublicClient({ chain: mainnet, transport: http(RPC) });

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const BINANCE = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
const erc20Abi = parseAbi(["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"]);
const factoryAbi = parseAbi(["function getPool(address,address,uint24) view returns (address)"]);
const poolAbi = parseAbi(["function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint32, bool)", "function liquidity() view returns (uint128)"]);

async function checkPair(label, a, b) {
  console.log(`\n${label}`);
  for (const fee of [100, 500, 3000]) {
    const pool = await client.readContract({ address: FACTORY, abi: factoryAbi, functionName: "getPool", args: [a, b, fee] });
    if (pool === "0x0000000000000000000000000000000000000000") continue;
    const [slot0, liquidity] = await Promise.all([
      client.readContract({ address: pool, abi: poolAbi, functionName: "slot0" }),
      client.readContract({ address: pool, abi: poolAbi, functionName: "liquidity" }),
    ]);
    console.log(`  fee=${fee} pool=${pool} tick=${slot0[1]} liquidity=${liquidity.toString()}`);
  }
  const bnBal = await client.readContract({ address: USDC, abi: erc20Abi, functionName: "balanceOf", args: [BINANCE] });
  console.log(`  Binance USDC balance: ${formatUnits(bnBal, 6)}`);
}

checkPair("USDC/USDT", USDC, USDT);
checkPair("USDC/DAI", USDC, DAI);
