// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {INonfungiblePositionManager} from "../interfaces/INonfungiblePositionManager.sol";

/**
 * @title MockPositionManager
 * @notice Minimal testnet mock of Uniswap V3 NonfungiblePositionManager.
 *         Accepts actual tokens and tracks a single simulated LP position
 *         per user.  All liquidity math is simplified (1:1 price assumption)
 *         so the ShadeYield UniswapV3Strategy can operate end-to-end.
 */
contract MockPositionManager {
    using SafeERC20 for IERC20;

    uint256 private _nextId = 1;

    struct Position {
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint128 liquidity;
        uint128 tokensOwed0;
        uint128 tokensOwed1;
    }

    mapping(uint256 => Position) private _positions;

    event Minted(uint256 indexed tokenId, address indexed recipient);
    event Increased(uint256 indexed tokenId);
    event Decreased(uint256 indexed tokenId, uint128 liquidityRemoved);
    event Collected(uint256 indexed tokenId, uint256 amount0, uint256 amount1);

    // ───── Mint ─────

    function mint(INonfungiblePositionManager.MintParams calldata params)
        external
        returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
    {
        tokenId = _nextId++;
        amount0 = params.amount0Desired;
        amount1 = params.amount1Desired;
        liquidity = uint128(amount0 + amount1); // simplified: liquidity = value

        IERC20(params.token0).safeTransferFrom(msg.sender, address(this), amount0);
        IERC20(params.token1).safeTransferFrom(msg.sender, address(this), amount1);

        _positions[tokenId] = Position({
            token0: params.token0,
            token1: params.token1,
            fee: params.fee,
            tickLower: params.tickLower,
            tickUpper: params.tickUpper,
            liquidity: liquidity,
            tokensOwed0: 0,
            tokensOwed1: 0
        });

        emit Minted(tokenId, params.recipient);
    }

    // ───── Increase Liquidity ─────

    function increaseLiquidity(INonfungiblePositionManager.IncreaseLiquidityParams calldata params)
        external
        returns (uint128 liquidity, uint256 amount0, uint256 amount1)
    {
        Position storage pos = _positions[params.tokenId];
        require(pos.liquidity > 0, "No position");

        amount0 = params.amount0Desired;
        amount1 = params.amount1Desired;
        liquidity = uint128(amount0 + amount1);

        IERC20(pos.token0).safeTransferFrom(msg.sender, address(this), amount0);
        IERC20(pos.token1).safeTransferFrom(msg.sender, address(this), amount1);

        pos.liquidity += liquidity;

        emit Increased(params.tokenId);
    }

    // ───── Decrease Liquidity ─────

    function decreaseLiquidity(INonfungiblePositionManager.DecreaseLiquidityParams calldata params)
        external
        returns (uint256 amount0, uint256 amount1)
    {
        Position storage pos = _positions[params.tokenId];
        require(pos.liquidity > 0, "No position");
        require(params.liquidity <= pos.liquidity, "Exceeds position");

        // Pro-rata return based on current balance
        uint256 ratio = (uint256(params.liquidity) * 1e18) / pos.liquidity;
        amount0 = (IERC20(pos.token0).balanceOf(address(this)) * ratio) / 1e18;
        amount1 = (IERC20(pos.token1).balanceOf(address(this)) * ratio) / 1e18;

        pos.liquidity -= params.liquidity;
        pos.tokensOwed0 += uint128(amount0);
        pos.tokensOwed1 += uint128(amount1);

        emit Decreased(params.tokenId, params.liquidity);
    }

    // ───── Collect ─────

    function collect(INonfungiblePositionManager.CollectParams calldata params)
        external
        returns (uint256 amount0, uint256 amount1)
    {
        Position storage pos = _positions[params.tokenId];
        require(pos.liquidity > 0 || pos.tokensOwed0 > 0 || pos.tokensOwed1 > 0, "No position");

        amount0 = pos.tokensOwed0;
        amount1 = pos.tokensOwed1;

        if (amount0 > 0) {
            pos.tokensOwed0 = 0;
            if (amount0 > IERC20(pos.token0).balanceOf(address(this))) {
                amount0 = IERC20(pos.token0).balanceOf(address(this));
            }
            IERC20(pos.token0).safeTransfer(params.recipient, amount0);
        }
        if (amount1 > 0) {
            pos.tokensOwed1 = 0;
            if (amount1 > IERC20(pos.token1).balanceOf(address(this))) {
                amount1 = IERC20(pos.token1).balanceOf(address(this));
            }
            IERC20(pos.token1).safeTransfer(params.recipient, amount1);
        }

        emit Collected(params.tokenId, amount0, amount1);
    }

    // ───── Positions (view) ─────

    function positions(uint256 tokenId)
        external
        view
        returns (
            uint96 nonce,
            address operator,
            address token0,
            address token1,
            uint24 fee,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity,
            uint256 feeGrowthInside0LastX128,
            uint256 feeGrowthInside1LastX128,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        )
    {
        Position storage pos = _positions[tokenId];
        require(pos.liquidity > 0 || tokenId == 0, "Invalid tokenId");

        return (
            0,                  // nonce
            address(0),         // operator
            pos.token0,
            pos.token1,
            pos.fee,
            pos.tickLower,
            pos.tickUpper,
            pos.liquidity,
            0,                  // feeGrowthInside0LastX128
            0,                  // feeGrowthInside1LastX128
            pos.tokensOwed0,
            pos.tokensOwed1
        );
    }

    // ───── ERC721 transfer (no-op) ─────

    function safeTransferFrom(address /*from*/, address /*to*/, uint256 /*tokenId*/) external pure {}
}
