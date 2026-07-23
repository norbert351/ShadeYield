import hre from "hardhat";

const USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" as const;
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1" as const;
const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984" as const;

async function main() {
  const net = await hre.network.getOrCreate("default");
  const publicClient = await net.viem.getPublicClient();

  const factoryAbi = [
    { type: "function", name: "getPool", inputs: [{ name: "tokenA", type: "address" }, { name: "tokenB", type: "address" }, { name: "fee", type: "uint24" }], outputs: [{ name: "pool", type: "address" }], stateMutability: "view" },
  ] as const;

  for (const fee of [100, 500, 3000, 10000]) {
    const pool = await publicClient.readContract({
      address: FACTORY,
      abi: factoryAbi,
      functionName: "getPool",
      args: [USDC, DAI, fee],
    });
    console.log(`fee=${fee} pool=${pool}`);
    if (pool !== "0x0000000000000000000000000000000000000000") {
      const slot0 = await publicClient.readContract({
        address: pool,
        abi: [{ type: "function", name: "slot0", inputs: [], outputs: [{ name: "sqrtPriceX96", type: "uint160" }, { name: "tick", type: "int24" }, { name: "observationIndex", type: "uint16" }, { name: "observationCardinality", type: "uint16" }, { name: "observationCardinalityNext", type: "uint16" }, { name: "feeProtocol", type: "uint32" }, { name: "unlocked", type: "bool" }], stateMutability: "view" }],
        functionName: "slot0",
      });
      const liquidity = await publicClient.readContract({ address: pool, abi: [{ type: "function", name: "liquidity", inputs: [], outputs: [{ name: "", type: "uint128" }], stateMutability: "view" }], functionName: "liquidity" });
      console.log(`  slot0=${JSON.stringify(slot0)} liquidity=${liquidity.toString()}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
