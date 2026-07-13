// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {INonfungiblePositionManager} from "../interfaces/INonfungiblePositionManager.sol";

/**
 * @title MockNonfungiblePositionManager
 * @notice Minimal mock Uniswap V3 NFT position manager for local testing.
 */
contract MockNonfungiblePositionManager is INonfungiblePositionManager, ERC721 {
    uint256 private _nextTokenId = 1;

    struct Position {
        address token0;
        address token1;
        uint128 liquidity;
        uint256 principal0;
        uint256 principal1;
    }

    mapping(uint256 => Position) public positionData;

    constructor() ERC721("Mock UniV3 Position", "MUNI-V3") {}

    function mint(MintParams calldata params) external payable override returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) {
        tokenId = _nextTokenId++;
        _mint(params.recipient, tokenId);

        amount0 = params.amount0Desired;
        amount1 = params.amount1Desired;
        liquidity = uint128(amount0 + amount1);

        IERC20(params.token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(params.token1).transferFrom(msg.sender, address(this), amount1);

        positionData[tokenId] = Position({
            token0: params.token0,
            token1: params.token1,
            liquidity: liquidity,
            principal0: amount0,
            principal1: amount1
        });
    }

    function increaseLiquidity(IncreaseLiquidityParams calldata params) external payable override returns (uint128 liquidity, uint256 amount0, uint256 amount1) {
        Position storage p = positionData[params.tokenId];
        amount0 = params.amount0Desired;
        amount1 = params.amount1Desired;
        liquidity = uint128(amount0 + amount1);
        p.liquidity += liquidity;
        p.principal0 += amount0;
        p.principal1 += amount1;

        IERC20(p.token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(p.token1).transferFrom(msg.sender, address(this), amount1);
    }

    function decreaseLiquidity(DecreaseLiquidityParams calldata params) external payable override returns (uint256 amount0, uint256 amount1) {
        Position storage p = positionData[params.tokenId];
        require(params.liquidity <= p.liquidity, "Too much");
        uint256 ratio = (uint256(params.liquidity) * 1e18) / p.liquidity;
        amount0 = (p.principal0 * ratio) / 1e18;
        amount1 = (p.principal1 * ratio) / 1e18;
        // simulate 5% fees on withdrawal
        amount0 = (amount0 * 105) / 100;
        amount1 = (amount1 * 105) / 100;
        p.liquidity -= params.liquidity;
        p.principal0 -= amount0 > p.principal0 ? p.principal0 : amount0;
        p.principal1 -= amount1 > p.principal1 ? p.principal1 : amount1;
    }

    function collect(CollectParams calldata params) external payable override returns (uint256 amount0, uint256 amount1) {
        Position storage p = positionData[params.tokenId];
        amount0 = IERC20(p.token0).balanceOf(address(this));
        amount1 = IERC20(p.token1).balanceOf(address(this));
        if (amount0 > 0) IERC20(p.token0).transfer(params.recipient, amount0);
        if (amount1 > 0) IERC20(p.token1).transfer(params.recipient, amount1);
    }

    function positions(uint256 tokenId) external view override returns (
        uint96, address, address, address, uint24, int24, int24, uint128 liquidity,
        uint256, uint256, uint128, uint128
    ) {
        Position storage p = positionData[tokenId];
        return (0, address(0), p.token0, p.token1, 0, 0, 0, p.liquidity, 0, 0, 0, 0);
    }
}
