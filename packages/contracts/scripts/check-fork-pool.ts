import hre from "hardhat";
import { getContract, parseAbi } from "viem";

async function main() {
  const net = await hre.network.getOrCreate("default");
  const publicClient = await net.viem.getPublicClient();

  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as const;
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const;
  const PM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88" as const;

  const pm = getContract({
    address: PM,
    abi: parseAbi(["function factory() view returns (address)"]),
    client: publicClient,
  });
  const factory = await pm.read.factory();
  console.log("factory:", factory);

  const factoryContract = getContract({
    address: factory,
    abi: parseAbi(["function getPool(address,address,uint24) view returns (address)"]),
    client: publicClient,
  });
  const pool = await factoryContract.read.getPool([USDC, USDT, 500]);
  console.log("pool:", pool);

  const poolContract = getContract({
    address: pool,
    abi: parseAbi([
      "function liquidity() view returns (uint128)",
      "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)",
    ]),
    client: publicClient,
  });
  const liquidity = await poolContract.read.liquidity();
  const slot0 = await poolContract.read.slot0();
  console.log("liquidity:", liquidity.toString(), "tick:", slot0[1]);
}

main().catch(console.error);
