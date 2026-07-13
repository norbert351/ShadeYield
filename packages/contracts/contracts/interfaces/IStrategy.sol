// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

/**
 * @title IStrategy
 * @notice Interface for yield strategies used by ShadeAaveVault.
 */
interface IStrategy {
    function asset() external view returns (address);
    function vault() external view returns (address);
    function totalAssets() external view returns (uint256);
    function deposit(uint256 amount) external returns (uint256);
    function withdraw(uint256 amount) external returns (uint256);
    function harvest() external returns (uint256);
    function emergencyWithdraw() external returns (uint256);
    function setVault(address _vault) external;
}
