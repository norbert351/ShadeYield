import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const INITIAL_SUPPLY = BigInt(1_000_000_000_000_000); // 1e15 wei

const ShadeYieldModule = buildModule("ShadeYield", (m) => {
  const shadeToken = m.contract("ShadeToken", ["Shade USD Coin", "sUSDC", 18, INITIAL_SUPPLY]);
  const vault = m.contract("ShadeAaveVault", ["ShadeYield Vault", shadeToken]);

  return { shadeToken, vault };
});

export default ShadeYieldModule;
