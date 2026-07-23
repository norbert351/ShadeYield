import { createPublicClient, http, parseAbi, formatUnits } from "viem";
import { mainnet } from "viem/chains";

const RPC = process.env.MAINNET_RPC || "https://ethereum.publicnode.com";
const client = createPublicClient({ chain: mainnet, transport: http(RPC) });

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const factoryAbi = parseAbi(["function getPool(address,address,uint24) view returns (address)"]);
const poolAbi = parseAbi([
  "function liquidity() view returns (uint128)",
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
]);

for (const [name, token0, token1, fee] of [
  ["USDC/USDT 500", USDC, USDT, 500],
  ["USDC/DAI 500", USDC, DAI, 500],
  ["USDC/DAI 3000", USDC, DAI, 3000],
]) {
  const pool = await client.readContract({ address: FACTORY, abi: factoryAbi, functionName: "getPool", args: [token0, token1, fee] });
  if (pool === "0x0000000000000000000000000000000000000000") {
    console.log(`${name}: no pool`);
    continue;
  }
  const liquidity = await client.readContract({ address: pool, abi: poolAbi, functionName: "liquidity" });
  const slot0 = await client.readContract({ address: pool, abi: poolAbi, functionName: "slot0" });
  console.log(`${name}: pool=${pool} liquidity=${liquidity.toString()} tick=${slot0[1]}`);
}
