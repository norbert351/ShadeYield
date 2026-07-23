// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IPool} from "./interfaces/IPool.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";

/**
 * @title AaveStrategy
 * @notice Invests vault capital into Aave V3 Pool and holds aTokens.
 *         Public protocol integration — Aave itself is unchanged.
 */
contract AaveStrategy is IStrategy {
    using SafeERC20 for IERC20;

    address public immutable asset;
    address public vault;
    IPool public immutable pool;
    address public immutable aToken;

    uint256 public principal; // tracked in aToken units

    modifier onlyVault() {
        require(msg.sender == vault, "Only vault");
        _;
    }

    constructor(address _asset, address _pool) {
        require(_asset != address(0), "Zero asset");
        require(_pool != address(0), "Zero pool");
        asset = _asset;
        pool = IPool(_pool);
        IPool.ReserveData memory data = IPool(_pool).getReserveData(_asset);
        aToken = data.aTokenAddress;
        require(aToken != address(0), "No aToken");
    }

    function setVault(address _vault) external {
        require(vault == address(0) || msg.sender == vault, "Unauthorized");
        require(_vault != address(0), "Zero vault");
        vault = _vault;
    }

    function totalAssets() external view override returns (uint256) {
        return IERC20(aToken).balanceOf(address(this));
    }

    function deposit(uint256 amount) external override onlyVault returns (uint256) {
        require(amount > 0, "Zero amount");
        IERC20(asset).safeTransferFrom(vault, address(this), amount);
        IERC20(asset).forceApprove(address(pool), amount);
        uint256 before = IERC20(aToken).balanceOf(address(this));
        pool.supply(asset, amount, address(this), 0);
        uint256 received = IERC20(aToken).balanceOf(address(this)) - before;
        principal += received;
        return received;
    }

    function withdraw(uint256 amount) external override onlyVault returns (uint256) {
        require(amount > 0, "Zero amount");
        uint256 aTokenBefore = IERC20(aToken).balanceOf(address(this));
        uint256 assetBefore = IERC20(asset).balanceOf(address(this));
        pool.withdraw(asset, amount, vault);
        uint256 pulled = IERC20(asset).balanceOf(address(this)) - assetBefore;
        uint256 burned = aTokenBefore - IERC20(aToken).balanceOf(address(this));
        if (principal >= burned) {
            principal -= burned;
        } else {
            principal = 0;
        }
        IERC20(asset).safeTransfer(vault, pulled);
        return pulled;
    }

    function harvest() external override onlyVault returns (uint256) {
        uint256 aTokenBalance = IERC20(aToken).balanceOf(address(this));
        require(aTokenBalance > principal, "No yield");
        uint256 yield = aTokenBalance - principal;
        uint256 aTokenBefore = IERC20(aToken).balanceOf(address(this));
        uint256 assetBefore = IERC20(asset).balanceOf(address(this));
        pool.withdraw(asset, yield, vault);
        uint256 pulled = IERC20(asset).balanceOf(address(this)) - assetBefore;
        uint256 burned = aTokenBefore - IERC20(aToken).balanceOf(address(this));
        if (principal >= burned) {
            principal -= burned;
        } else {
            principal = 0;
        }
        IERC20(asset).safeTransfer(vault, pulled);
        return pulled;
    }

    function emergencyWithdraw() external override onlyVault returns (uint256) {
        uint256 aTokenBalance = IERC20(aToken).balanceOf(address(this));
        if (aTokenBalance == 0) return 0;
        uint256 assetBefore = IERC20(asset).balanceOf(address(this));
        pool.withdraw(asset, aTokenBalance, vault);
        uint256 pulled = IERC20(asset).balanceOf(address(this)) - assetBefore;
        principal = 0;
        IERC20(asset).safeTransfer(vault, pulled);
        return pulled;
    }
}
