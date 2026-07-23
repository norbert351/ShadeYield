import { createPublicClient, http, parseAbi } from "viem";
import { arbitrum } from "viem/chains";

const USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const RPC = process.env.ARBITRUM_RPC || "https://arb1.arbitrum.io/rpc";

const client = createPublicClient({ chain: arbitrum, transport: http(RPC) });
const factoryAbi = parseAbi([
  "function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)",
]);
const poolAbi = parseAbi([
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint32 feeProtocol, bool unlocked)",
  "function liquidity() view returns (uint128)",
]);

for (const fee of [100, 500, 3000, 10000]) {
  const pool = await client.readContract({ address: FACTORY, abi: factoryAbi, functionName: "getPool", args: [USDC, DAI, fee] });
  console.log(`fee=${fee} pool=${pool}`);
  if (pool !== "0x0000000000000000000000000000000000000000") {
    const [slot0, liquidity] = await Promise.all([
      client.readContract({ address: pool, abi: poolAbi, functionName: "slot0" }),
      client.readContract({ address: pool, abi: poolAbi, functionName: "liquidity" }),
    ]);
    console.log(`  sqrtPriceX96=${slot0[0].toString()} tick=${slot0[1]} liquidity=${liquidity.toString()}`);
  }
}
