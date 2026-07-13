// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Nox, euint256, ebool, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";

/**
 * @title ShadeAaveVault
 * @notice Confidential yield vault that routes public ERC-20 deposits into public
 *         DeFi protocols (Aave + Uniswap V3) while keeping share balances and
 *         aggregate totals encrypted on Nox.
 *
 *         WTF Hackathon fit: privacy wrapper around existing open-source DeFi.
 *         Users deposit a public asset; the vault mints encrypted shares;
 *         the owner allocates pooled capital to Aave / Uniswap strategies;
 *         yield accrues on public protocols; individual ownership stays private.
 *
 *         Withdrawals are two-step Nox-native: burn encrypted shares, publish
 *         the decrypted asset amount off-chain via Nox, then finalize the public
 *         ERC-20 transfer.
 */
contract ShadeAaveVault {
    using SafeERC20 for IERC20;

    string public vaultName;
    address public asset;
    address public owner;

    euint256 public totalShares;
    euint256 public totalAssets;
    uint256 public totalAllocated;

    mapping(address => euint256) private _shares;
    mapping(address => euint256) public pendingWithdrawals;
    mapping(address => bool) public isStrategy;
    address[] public strategies;

    event Deposited(address indexed user, uint256 assets);
    event WithdrawRequested(address indexed user);
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

        totalShares = Nox.toEuint256(0);
        totalAssets = Nox.toEuint256(0);

        Nox.allowThis(totalShares);
        Nox.allowThis(totalAssets);
        Nox.allow(totalShares, owner);
        Nox.allow(totalAssets, owner);
        Nox.allowPublicDecryption(totalAssets);
    }

    /**
     * @notice Deposit public tokens and receive encrypted shares.
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Zero amount");
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);

        euint256 eAmount = Nox.toEuint256(amount);
        euint256 zero = Nox.toEuint256(0);
        euint256 sharesToMint = Nox.select(Nox.eq(totalShares, zero), eAmount, Nox.div(Nox.mul(eAmount, totalShares), totalAssets));

        totalAssets = Nox.add(totalAssets, eAmount);
        totalShares = Nox.add(totalShares, sharesToMint);

        euint256 userShares = _shares[msg.sender];
        userShares = Nox.add(userShares, sharesToMint);
        _shares[msg.sender] = userShares;

        _allowVaultState();
        Nox.allowThis(userShares);
        Nox.allow(userShares, msg.sender);

        emit Deposited(msg.sender, amount);
    }

    /**
     * @notice Request withdrawal by burning encrypted shares.
     *         Computes and stores the encrypted asset amount; exposes it for
     *         off-chain decryption. The public totals are updated immediately
     *         in encrypted form.
     */
    function requestWithdraw(externalEuint256 sharesHandle, bytes calldata inputProof) external {
        euint256 sharesToBurn = Nox.fromExternal(sharesHandle, inputProof);

        euint256 userShares = _shares[msg.sender];
        userShares = Nox.sub(userShares, sharesToBurn);
        _shares[msg.sender] = userShares;

        euint256 assetsToReturn = Nox.div(Nox.mul(sharesToBurn, totalAssets), totalShares);

        totalShares = Nox.sub(totalShares, sharesToBurn);
        totalAssets = Nox.sub(totalAssets, assetsToReturn);

        euint256 pending = pendingWithdrawals[msg.sender];
        pending = Nox.add(pending, assetsToReturn);
        pendingWithdrawals[msg.sender] = pending;

        Nox.allowThis(assetsToReturn);
        Nox.allowThis(pending);
        Nox.allowPublicDecryption(assetsToReturn);
        Nox.allowPublicDecryption(pending);

        _allowVaultState();
        Nox.allowThis(userShares);
        Nox.allow(userShares, msg.sender);

        emit WithdrawRequested(msg.sender);
    }

    /**
     * @notice Finalize withdrawal after the decrypted amount is known off-chain.
     *         The caller passes the exact plaintext amount returned by Nox.
     */
    function claimWithdraw(address user, uint256 amount) external {
        require(amount > 0, "Zero amount");
        require(IERC20(asset).balanceOf(address(this)) >= amount, "Insufficient idle");

        euint256 pending = pendingWithdrawals[user];
        pending = Nox.sub(pending, Nox.toEuint256(amount));
        pendingWithdrawals[user] = pending;

        Nox.allowThis(pending);
        Nox.allowPublicDecryption(pending);

        IERC20(asset).safeTransfer(user, amount);

        emit WithdrawClaimed(user, amount);
    }

    /**
     * @notice Add a strategy contract.
     */
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

    /**
     * @notice Allocate idle capital to a strategy.
     */
    function allocateToStrategy(address _strategy, uint256 amount) external onlyOwner {
        require(isStrategy[_strategy], "Invalid strategy");
        require(amount > 0, "Zero amount");
        require(IERC20(asset).balanceOf(address(this)) >= amount, "Insufficient idle");

        _harvestAll();
        IStrategy(_strategy).deposit(amount);
        totalAllocated += amount;

        emit Allocated(_strategy, amount);
    }

    /**
     * @notice Pull capital back from a strategy to the vault.
     */
    function deallocateFromStrategy(address _strategy, uint256 amount) external onlyOwner {
        require(isStrategy[_strategy], "Invalid strategy");
        require(amount > 0, "Zero amount");

        _harvestAll();
        uint256 pulled = IStrategy(_strategy).withdraw(amount);
        if (totalAllocated >= pulled) totalAllocated -= pulled; else totalAllocated = 0;

        emit Deallocated(_strategy, pulled);
    }

    /**
     * @notice Harvest yield from all strategies.
     */
    function harvestAll() external onlyOwner returns (uint256 totalYield) {
        return _harvestAll();
    }

    function _harvestAll() internal returns (uint256 totalYield) {
        for (uint256 i = 0; i < strategies.length; i++) {
            address s = strategies[i];
            if (!isStrategy[s]) continue;
            uint256 yield = IStrategy(s).harvest();
            if (yield > 0) {
                totalYield += yield;
                totalAssets = Nox.add(totalAssets, Nox.toEuint256(yield));
            }
        }
        if (totalYield > 0) {
            _allowVaultState();
            emit Harvested(totalYield);
        }
    }

    /**
     * @notice Permissionless emergency exit when a strategy is in danger.
     */
    function emergencyDeallocate(address _strategy) external {
        require(isStrategy[_strategy], "Invalid strategy");
        uint256 pulled = IStrategy(_strategy).emergencyWithdraw();
        if (totalAllocated >= pulled) totalAllocated -= pulled; else totalAllocated = 0;
        emit EmergencyDeallocated(_strategy, pulled);
    }

    /**
     * @notice Return encrypted share balance for a user.
     */
    function balanceOfShares(address user) external view returns (euint256) {
        return _shares[user];
    }

    function strategyCount() external view returns (uint256) {
        return strategies.length;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Zero address");
        owner = _newOwner;
    }

    function _allowVaultState() internal {
        Nox.allowThis(totalShares);
        Nox.allowThis(totalAssets);
        Nox.allow(totalShares, owner);
        Nox.allow(totalAssets, owner);
        Nox.allowPublicDecryption(totalAssets);
    }
}
