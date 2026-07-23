// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

/**
 * @title ISwapRouter
 * @notice Minimal Uniswap V3 SwapRouter interface (the original V3 router at
 *         0xE592427A0AEce92De3Edee1F18E0157C05861564) used by ShadeYield. It
 *         includes a deadline in ExactInputSingleParams.
 */
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}
