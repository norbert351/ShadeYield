import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const INITIAL_SUPPLY = BigInt(1_000_000_000_000);

const ShadeVaultModule = buildModule("ShadeVault", (m) => {
  const shadeToken = m.contract("ShadeToken", ["ShadeToken", "SHADE", INITIAL_SUPPLY]);
  const vault = m.contract("ShadeVault", ["ShadeYield Vault", shadeToken]);
  return { shadeToken, vault };
});

export default ShadeVaultModule;
