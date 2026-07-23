// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";
import {ISwapRouter} from "./interfaces/ISwapRouter.sol";
import {INonfungiblePositionManager} from "./interfaces/INonfungiblePositionManager.sol";

/** @title UniswapV3Strategy */
/**
 * @notice Single-sided liquidity strategy. The vault deposits only `asset`
 *         (e.g. USDC). Half of the deposit is swapped into `token1` (e.g. DAI)
 *         via Uniswap V3 SwapRouter exactInputSingle, then the pair is added
 *         as concentrated liquidity on the Uniswap V3 PositionManager.
 *
 *         On exit, token1 proceeds are swapped back into `asset` so the vault
 *         always receives a single asset.
 */
contract UniswapV3Strategy is IStrategy {
    using SafeERC20 for IERC20;

    address public immutable asset;
    address public immutable token1;
    address public vault;
    INonfungiblePositionManager public immutable positionManager;
    ISwapRouter public immutable swapRouter;

    uint24 public immutable feeTier;
    int24 public immutable tickLower;
    int24 public immutable tickUpper;
    uint8 public immutable decimals0;
    uint8 public immutable decimals1;

    uint256 public tokenId;
    uint256 public principal0;
    uint256 public principal1;

    uint256 private constant SLIPPAGE_BPS = 200; // 2% — production deployments should tighten with an oracle.
    uint256 private constant BPS_DENOMINATOR = 10000;

    modifier onlyVault() {
        require(msg.sender == vault, "Only vault");
        _;
    }

    constructor(
        address _asset,
        address _token1,
        address _positionManager,
        address _swapRouter,
        uint24 _feeTier,
        int24 _tickLower,
        int24 _tickUpper
    ) {
        require(_asset != address(0) && _token1 != address(0), "Zero token");
        require(_positionManager != address(0), "Zero manager");
        require(_swapRouter != address(0), "Zero router");
        require(_asset != _token1, "Same token");
        require(_asset < _token1, "Asset must be token0");

        asset = _asset;
        token1 = _token1;
        positionManager = INonfungiblePositionManager(_positionManager);
        swapRouter = ISwapRouter(_swapRouter);
        feeTier = _feeTier;
        tickLower = _tickLower;
        tickUpper = _tickUpper;

        decimals0 = IERC20Metadata(_asset).decimals();
        decimals1 = IERC20Metadata(_token1).decimals();
    }

    function setVault(address _vault) external {
        require(vault == address(0) || msg.sender == vault, "Unauthorized");
        require(_vault != address(0), "Zero vault");
        vault = _vault;
    }

    function totalAssets() external view override returns (uint256) {
        uint256 idle0 = IERC20(asset).balanceOf(address(this));
        uint256 idle1 = IERC20(token1).balanceOf(address(this));
        uint256 idleValue = idle0 + _token1ToAsset(idle1);
        if (tokenId == 0) {
            return idleValue;
        }
        (, , , , , , , uint128 liquidity, , , , ) = positionManager.positions(tokenId);
        return idleValue + uint256(liquidity);
    }

    /**
     * @notice Accept the vault's single-sided asset, swap half to token1, then
     *         mint or increase a Uniswap V3 concentrated liquidity position.
     * @return assetsPutToWork Total asset-side value deposited into the position
     *         (including the swapped token1 expressed in asset terms).
     */
    function deposit(uint256 amount) external override onlyVault returns (uint256) {
        require(amount > 0, "Zero amount");
        IERC20(asset).safeTransferFrom(vault, address(this), amount);

        uint256 half = amount / 2;
        // Single-sided entry: swap half of USDC to token1 via SwapRouter02.
        IERC20(asset).forceApprove(address(swapRouter), half);

        uint256 minOut = _assetToToken1((half * (BPS_DENOMINATOR - SLIPPAGE_BPS)) / BPS_DENOMINATOR);

        ISwapRouter.ExactInputSingleParams memory swapParams = ISwapRouter.ExactInputSingleParams({
            tokenIn: asset,
            tokenOut: token1,
            fee: feeTier,
            recipient: address(this),
            deadline: block.timestamp + 300,
            amountIn: half,
            amountOutMinimum: minOut,
            sqrtPriceLimitX96: 0
        });

        uint256 token1Received = swapRouter.exactInputSingle(swapParams);
        require(token1Received >= minOut, "Swap slippage exceeded");

        // Use the actual balances (dust tolerant) for the liquidity add.
        uint256 amount0Desired = IERC20(asset).balanceOf(address(this));
        uint256 amount1Desired = IERC20(token1).balanceOf(address(this));

        IERC20(asset).forceApprove(address(positionManager), amount0Desired);
        IERC20(token1).forceApprove(address(positionManager), amount1Desired);

        uint256 used0;
        uint256 used1;
        if (tokenId == 0) {
            (uint256 id, , uint256 u0, uint256 u1) = positionManager.mint(
                INonfungiblePositionManager.MintParams({
                    token0: asset,
                    token1: token1,
                    fee: feeTier,
                    tickLower: tickLower,
                    tickUpper: tickUpper,
                    amount0Desired: amount0Desired,
                    amount1Desired: amount1Desired,
                    amount0Min: 0,
                    amount1Min: 0,
                    recipient: address(this),
                    deadline: block.timestamp + 300
                })
            );
            tokenId = id;
            used0 = u0;
            used1 = u1;
        } else {
            (, uint256 u0, uint256 u1) = positionManager.increaseLiquidity(
                INonfungiblePositionManager.IncreaseLiquidityParams({
                    tokenId: tokenId,
                    amount0Desired: amount0Desired,
                    amount1Desired: amount1Desired,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: block.timestamp + 300
                })
            );
            used0 = u0;
            used1 = u1;
        }

        principal0 += used0;
        principal1 += used1;

        // Return dust approvals to 0 to avoid stale unlimited approvals.
        IERC20(asset).forceApprove(address(positionManager), 0);
        IERC20(token1).forceApprove(address(positionManager), 0);
        IERC20(asset).forceApprove(address(swapRouter), 0);

        return used0 + _token1ToAsset(used1);
    }

    function withdraw(uint256 amount) external override onlyVault returns (uint256) {
        require(amount > 0, "Zero amount");
        require(tokenId != 0, "No position");

        (, , , , , , , uint128 liquidity, , , , ) = positionManager.positions(tokenId);
        require(liquidity > 0, "No liquidity");

        // Remove liquidity proportional to the requested asset value.
        uint256 totalPrincipalValue = principal0 + _token1ToAsset(principal1);
        uint128 liquidityToRemove = totalPrincipalValue == 0
            ? liquidity
            : uint128((uint256(liquidity) * amount) / totalPrincipalValue);
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
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        _swapToken1ToAsset(collected1);
        uint256 totalAsset = IERC20(asset).balanceOf(address(this));

        if (totalAsset > 0) {
            IERC20(asset).safeTransfer(vault, totalAsset);
        }

        if (principal0 >= collected0) principal0 -= collected0; else principal0 = 0;
        if (principal1 >= collected1) principal1 -= collected1; else principal1 = 0;

        return totalAsset;
    }

    function harvest() external override onlyVault returns (uint256) {
        require(tokenId != 0, "No position");
        (, uint256 collected1) = positionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        _swapToken1ToAsset(collected1);
        uint256 totalAsset = IERC20(asset).balanceOf(address(this));

        if (totalAsset > 0) {
            IERC20(asset).safeTransfer(vault, totalAsset);
        }

        return totalAsset;
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

        (, uint256 c1) = positionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        _swapToken1ToAsset(c1);
        uint256 totalAsset = IERC20(asset).balanceOf(address(this));

        if (totalAsset > 0) {
            IERC20(asset).safeTransfer(vault, totalAsset);
        }

        principal0 = 0;
        principal1 = 0;
        return totalAsset;
    }

    /**
     * @dev Swap token1 proceeds back into asset. Uses a 1:1 price assumption
     *      only for slippage tolerance; the actual swap amount is returned.
     */
    function _swapToken1ToAsset(uint256 amountIn) internal returns (uint256) {
        if (amountIn == 0) return 0;

        IERC20(token1).forceApprove(address(swapRouter), amountIn);

        uint256 minOut = (_token1ToAsset(amountIn) * (BPS_DENOMINATOR - SLIPPAGE_BPS)) / BPS_DENOMINATOR;

        uint256 amountOut = swapRouter.exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: token1,
                tokenOut: asset,
                fee: feeTier,
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: amountIn,
                amountOutMinimum: minOut,
                sqrtPriceLimitX96: 0
            })
        );

        IERC20(token1).forceApprove(address(swapRouter), 0);
        return amountOut;
    }

    /**
     * @dev For stable pairs (USDC/DAI) we assume 1:1 price. Decimal adjustment
     *      is applied so token1 amounts can be compared with asset amounts.
     */
    function _token1ToAsset(uint256 token1Amount) internal view returns (uint256) {
        if (token1Amount == 0) return 0;
        if (decimals1 == decimals0) return token1Amount;
        if (decimals1 > decimals0) {
            return token1Amount / (10 ** (decimals1 - decimals0));
        }
        return token1Amount * (10 ** (decimals0 - decimals1));
    }

    function _assetToToken1(uint256 assetAmount) internal view returns (uint256) {
        if (assetAmount == 0) return 0;
        if (decimals0 == decimals1) return assetAmount;
        if (decimals0 > decimals1) {
            return assetAmount / (10 ** (decimals0 - decimals1));
        }
        return assetAmount * (10 ** (decimals1 - decimals0));
    }
}
