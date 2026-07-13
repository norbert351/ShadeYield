// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";
import {INonfungiblePositionManager} from "./interfaces/INonfungiblePositionManager.sol";

/**
 * @title UniswapV3Strategy
 * @notice Provides single-sided liquidity on Uniswap V3 using the vault asset paired with a stable second token.
 *         Simplified: vault sends asset0 + asset1, strategy mints a concentrated LP position and collects fees.
 *         Public protocol integration — Uniswap itself is unchanged.
 */
contract UniswapV3Strategy is IStrategy {
    using SafeERC20 for IERC20;

    address public immutable asset;
    address public immutable token1;
    address public vault;
    INonfungiblePositionManager public immutable positionManager;

    uint24 public immutable feeTier;
    int24 public immutable tickLower;
    int24 public immutable tickUpper;

    uint256 public tokenId;
    uint256 public principal0;
    uint256 public principal1;

    modifier onlyVault() {
        require(msg.sender == vault, "Only vault");
        _;
    }

    constructor(
        address _asset,
        address _token1,
        address _positionManager,
        uint24 _feeTier,
        int24 _tickLower,
        int24 _tickUpper
    ) {
        require(_asset != address(0) && _token1 != address(0), "Zero token");
        require(_positionManager != address(0), "Zero manager");
        require(_asset != _token1, "Same token");
        asset = _asset;
        token1 = _token1;
        positionManager = INonfungiblePositionManager(_positionManager);
        feeTier = _feeTier;
        tickLower = _tickLower;
        tickUpper = _tickUpper;
    }

    function setVault(address _vault) external {
        require(vault == address(0) || msg.sender == vault, "Unauthorized");
        require(_vault != address(0), "Zero vault");
        vault = _vault;
    }

    function totalAssets() external view override returns (uint256) {
        if (tokenId == 0) return 0;
        (, , , , , , , uint128 liquidity, , , , ) = positionManager.positions(tokenId);
        uint256 idle0 = IERC20(asset).balanceOf(address(this));
        uint256 idle1 = IERC20(token1).balanceOf(address(this));
        return idle0 + idle1 + uint256(liquidity) + principal0 + principal1;
    }

    function deposit(uint256 amount) external override onlyVault returns (uint256) {
        require(amount > 0, "Zero amount");
        // Vault sends asset as token0 and token1 in equal halves for this simplified strategy.
        uint256 half = amount / 2;
        IERC20(asset).safeTransferFrom(vault, address(this), half);
        IERC20(token1).safeTransferFrom(vault, address(this), half);

        IERC20(asset).forceApprove(address(positionManager), half);
        IERC20(token1).forceApprove(address(positionManager), half);

        if (tokenId == 0) {
            (uint256 id, , uint256 used0, uint256 used1) = positionManager.mint(
                INonfungiblePositionManager.MintParams({
                    token0: asset,
                    token1: token1,
                    fee: feeTier,
                    tickLower: tickLower,
                    tickUpper: tickUpper,
                    amount0Desired: half,
                    amount1Desired: half,
                    amount0Min: 0,
                    amount1Min: 0,
                    recipient: address(this),
                    deadline: block.timestamp + 300
                })
            );
            tokenId = id;
            principal0 += used0;
            principal1 += used1;
        } else {
            (, uint256 used0, uint256 used1) = positionManager.increaseLiquidity(
                INonfungiblePositionManager.IncreaseLiquidityParams({
                    tokenId: tokenId,
                    amount0Desired: half,
                    amount1Desired: half,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: block.timestamp + 300
                })
            );
            principal0 += used0;
            principal1 += used1;
        }
        return amount;
    }

    function withdraw(uint256 amount) external override onlyVault returns (uint256) {
        require(amount > 0, "Zero amount");
        require(tokenId != 0, "No position");

        (, , , , , , , uint128 liquidity, , , , ) = positionManager.positions(tokenId);
        require(liquidity > 0, "No liquidity");

        // Withdraw proportional liquidity. Simplified: burn 50% of liquidity for requested amount.
        uint128 liquidityToRemove = uint128((uint256(liquidity) * amount) / (principal0 + principal1));
        if (liquidityToRemove > liquidity) liquidityToRemove = liquidity;

        positionManager.decreaseLiquidity(
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: liquidityToRemove,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp + 300
            })
        );

        (uint256 collected0, uint256 collected1) = positionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: vault,
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        if (principal0 >= collected0) principal0 -= collected0; else principal0 = 0;
        if (principal1 >= collected1) principal1 -= collected1; else principal1 = 0;

        return collected0 + collected1;
    }

    function harvest() external override onlyVault returns (uint256) {
        require(tokenId != 0, "No position");
        (uint256 fees0, uint256 fees1) = positionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: vault,
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );
        return fees0 + fees1;
    }

    function emergencyWithdraw() external override onlyVault returns (uint256) {
        if (tokenId == 0) return 0;
        (, , , , , , , uint128 liquidity, , , , ) = positionManager.positions(tokenId);
        if (liquidity == 0) return 0;
        positionManager.decreaseLiquidity(
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: liquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp + 300
            })
        );
        (uint256 c0, uint256 c1) = positionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: vault,
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );
        principal0 = 0;
        principal1 = 0;
        return c0 + c1;
    }
}
