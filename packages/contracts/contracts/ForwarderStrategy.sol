// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";

/// @notice Forwards idle USDC from old vault to new vault's strategy.
///         Purpose-built to migrate 7 USDC without old harvest reverting.
contract ForwarderStrategy is IStrategy {
    using SafeERC20 for IERC20;

    address public immutable asset;
    address public vault;
    address public immutable target;

    constructor(address _asset, address _target) {
        asset = _asset;
        target = _target;
    }

    function setVault(address _vault) external {
        require(vault == address(0) || msg.sender == vault, "Unauthorized");
        vault = _vault;
    }

    function totalAssets() external view override returns (uint256) {
        return IERC20(asset).balanceOf(address(this));
    }

    function deposit(uint256 amount) external override onlyVault returns (uint256) {
        IERC20(asset).safeTransferFrom(vault, address(this), amount);
        // Forward to new vault which auto-allocates
        IERC20(asset).safeTransfer(target, amount);
        return amount;
    }

    function withdraw(uint256 amount) external override onlyVault returns (uint256) {
        uint256 bal = IERC20(asset).balanceOf(address(this));
        uint256 toSend = amount < bal ? amount : bal;
        IERC20(asset).safeTransfer(vault, toSend);
        return toSend;
    }

    function harvest() external override onlyVault returns (uint256) {
        return 0; // Never reverts — yield happens at the target vault
    }

    function emergencyWithdraw() external override onlyVault returns (uint256) {
        uint256 bal = IERC20(asset).balanceOf(address(this));
        if (bal > 0) IERC20(asset).safeTransfer(vault, bal);
        return bal;
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Only vault");
        _;
    }
}
