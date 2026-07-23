import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ARBITRUM } from "../../test/helpers/addresses.js";

const INITIAL_SUPPLY = BigInt(1_000_000_000_000_000); // 1e15 wei

const ShadeYieldDeployableModule = buildModule("ShadeYield", (m) => {
  const shadeToken = m.contract("ShadeToken", ["Shade USD Coin", "sUSDC", 18, INITIAL_SUPPLY]);

  const aaveStrategy = m.contract("AaveStrategy", [ARBITRUM.USDC, ARBITRUM.AAVE_V3_POOL]);

  const uniStrategy = m.contract("UniswapV3Strategy", [
    ARBITRUM.USDC,
    ARBITRUM.DAI,
    ARBITRUM.UNISWAP_V3_POSITION_MANAGER,
    ARBITRUM.UNISWAP_V3_SWAP_ROUTER,
    500,
    -60,
    60,
  ]);

  return { shadeToken, aaveStrategy, uniStrategy };
});

export default ShadeYieldDeployableModule;
