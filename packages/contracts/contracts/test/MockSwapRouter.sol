// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ISwapRouter} from "../interfaces/ISwapRouter.sol";
import {TestDAI} from "./TestDAI.sol";

/**
 * @title MockSwapRouter
 * @notice Testnet mock of Uniswap V3 SwapRouter for stable pairs (USDC/DAI).
 *         Swaps USDC→DAI by minting TestDAI; swaps DAI→USDC by spending
 *         accumulated USDC balance. 1:1 pricing for test purposes.
 */
contract MockSwapRouter {
    using SafeERC20 for IERC20;

    TestDAI public immutable dai;

    constructor(address _dai) {
        dai = TestDAI(_dai);
    }

    function exactInputSingle(ISwapRouter.ExactInputSingleParams calldata params)
        external
        returns (uint256 amountOut)
    {
        // Pull tokenIn from caller
        IERC20(params.tokenIn).safeTransferFrom(msg.sender, address(this), params.amountIn);

        // 1:1 swap — trust amountOutMinimum as the out amount
        amountOut = params.amountOutMinimum > 0 ? params.amountOutMinimum : params.amountIn;

        if (params.tokenOut == address(dai)) {
            // Mint DAI — it's a test token
            dai.mint(params.recipient, amountOut);
        } else {
            // Pay from accumulated USDC balance
            IERC20(params.tokenOut).safeTransfer(params.recipient, amountOut);
        }
    }
}
