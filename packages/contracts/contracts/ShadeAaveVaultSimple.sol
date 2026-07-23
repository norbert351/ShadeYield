// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";

/**
 * @title ShadeAaveVaultSimple
 * @notice Transparent (non-encrypted) yield vault for deployments where
 *         Nox confidential compute is unavailable. Same IStrategy interface,
 *         plain uint256 share tracking. Depositors get shares proportional
 *         to their deposit; the owner allocates pooled capital to strategies.
 */
contract ShadeAaveVaultSimple {
    using SafeERC20 for IERC20;

    string public vaultName;
    address public asset;
    address public owner;

    uint256 public constant HARVEST_FEE_BPS = 5; // 0.05% caller incentive for harvestAll

    uint256 public totalShares;
    uint256 public totalAssets;
    uint256 public totalAllocated;

    mapping(address => uint256) public shares;
    mapping(address => uint256) public pendingWithdrawals;
    mapping(address => bool) public isStrategy;
    address[] public strategies;

    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event WithdrawRequested(address indexed user, uint256 shares);
    event WithdrawClaimed(address indexed user, uint256 assets);
    event StrategyAdded(address indexed strategy);
    event Allocated(address indexed strategy, uint256 amount);
    event Deallocated(address indexed strategy, uint256 amount);
    event Harvested(uint256 totalYield);
    event EmergencyDeallocated(address indexed strategy, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(string memory _name, address _asset) {
        require(_asset != address(0), "Zero asset");
        owner = msg.sender;
        vaultName = _name;
        asset = _asset;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Zero amount");
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);

        uint256 sharesToMint = totalShares == 0
            ? amount
            : (amount * totalShares) / totalAssets;

        totalAssets += amount;
        totalShares += sharesToMint;
        shares[msg.sender] += sharesToMint;

        emit Deposited(msg.sender, amount, sharesToMint);
    }

    function requestWithdraw(uint256 sharesToBurn) external {
        require(sharesToBurn > 0, "Zero shares");
        require(shares[msg.sender] >= sharesToBurn, "Insufficient shares");

        uint256 assetsToReturn = (sharesToBurn * totalAssets) / totalShares;

        shares[msg.sender] -= sharesToBurn;
        totalShares -= sharesToBurn;
        totalAssets -= assetsToReturn;

        pendingWithdrawals[msg.sender] += assetsToReturn;

        emit WithdrawRequested(msg.sender, sharesToBurn);
    }

    function claimWithdraw(address user, uint256 amount) external {
        require(amount > 0, "Zero amount");
        require(pendingWithdrawals[user] >= amount, "Insufficient pending");
        require(IERC20(asset).balanceOf(address(this)) >= amount, "Insufficient idle");

        pendingWithdrawals[user] -= amount;
        IERC20(asset).safeTransfer(user, amount);

        emit WithdrawClaimed(user, amount);
    }

    function addStrategy(address _strategy) external onlyOwner {
        require(_strategy != address(0), "Zero strategy");
        require(!isStrategy[_strategy], "Already added");
        require(IStrategy(_strategy).asset() == asset, "Wrong asset");

        isStrategy[_strategy] = true;
        strategies.push(_strategy);
        IStrategy(_strategy).setVault(address(this));
        IERC20(asset).forceApprove(_strategy, type(uint256).max);

        emit StrategyAdded(_strategy);
    }

    function allocateToStrategy(address _strategy, uint256 amount) external onlyOwner {
        require(isStrategy[_strategy], "Invalid strategy");
        require(amount > 0, "Zero amount");
        require(IERC20(asset).balanceOf(address(this)) >= amount, "Insufficient idle");

        _harvestAll();
        IStrategy(_strategy).deposit(amount);
        totalAllocated += amount;

        emit Allocated(_strategy, amount);
    }

    function deallocateFromStrategy(address _strategy, uint256 amount) external onlyOwner {
        require(isStrategy[_strategy], "Invalid strategy");
        require(amount > 0, "Zero amount");

        _harvestAll();
        uint256 pulled = IStrategy(_strategy).withdraw(amount);
        if (totalAllocated >= pulled) totalAllocated -= pulled;
        else totalAllocated = 0;

        emit Deallocated(_strategy, pulled);
    }

    function harvestAll() external returns (uint256 totalYield) {
        return _harvestAll();
    }

    function _harvestAll() internal returns (uint256 totalYield) {
        for (uint256 i = 0; i < strategies.length; i++) {
            address s = strategies[i];
            if (!isStrategy[s]) continue;
            uint256 yield_ = IStrategy(s).harvest();
            if (yield_ > 0) {
                totalYield += yield_;
                uint256 fee = (yield_ * HARVEST_FEE_BPS) / 10000;
                uint256 remaining = yield_ - fee;
                if (fee > 0 && msg.sender != owner) {
                    IERC20(asset).safeTransfer(msg.sender, fee);
                }
                totalAssets += remaining;
            }
        }
        if (totalYield > 0) {
            emit Harvested(totalYield);
        }
    }

    function emergencyDeallocate(address _strategy) external {
        require(isStrategy[_strategy], "Invalid strategy");
        uint256 pulled = IStrategy(_strategy).emergencyWithdraw();
        if (totalAllocated >= pulled) totalAllocated -= pulled;
        else totalAllocated = 0;
        emit EmergencyDeallocated(_strategy, pulled);
    }

    function balanceOfShares(address user) external view returns (uint256) {
        return shares[user];
    }

    function strategyCount() external view returns (uint256) {
        return strategies.length;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Zero address");
        owner = _newOwner;
    }
}
