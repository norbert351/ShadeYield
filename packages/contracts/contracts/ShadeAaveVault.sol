// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Nox, euint256, ebool, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {IStrategy} from "./interfaces/IStrategy.sol";

/**
 * @title ShadeAaveVault
 * @notice Confidential yield vault. Encrypted shares via Nox.
 *         Constructor takes pre-encrypted handles for initial state.
 *         Uses Nox.fromExternal instead of Nox.toEuint256 for zero-init.
 *         Deposit / harvest still use Nox.toEuint256 (wrapAsPublicHandle
 *         works on Arbitrum Sepolia precompile).
 */
contract ShadeAaveVault {
    using SafeERC20 for IERC20;

    string public vaultName;
    address public asset;
    address public owner;

    uint256 public constant HARVEST_FEE_BPS = 5; // 0.05% caller incentive for harvestAll

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
    event Harvested(uint256 totalYield, uint256 callerFee);
    event EmergencyDeallocated(address indexed strategy, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        string memory _name,
        address _asset,
        address _owner
    ) {
        require(_asset != address(0), "Zero asset");
        owner = _owner;
        vaultName = _name;
        asset = _asset;
    }

    /// @notice Initialize encrypted state with pre-encrypted handles (call once after deploy).
    function initialize(
        bytes32 _totalSharesHandle,
        bytes calldata _totalSharesProof,
        bytes32 _totalAssetsHandle,
        bytes calldata _totalAssetsProof
    ) external {
        require(msg.sender == owner, "Not owner");
        require(euint256.unwrap(totalShares) == bytes32(0), "Already initialized");
        totalShares = Nox.fromExternal(externalEuint256.wrap(_totalSharesHandle), _totalSharesProof);
        totalAssets = Nox.fromExternal(externalEuint256.wrap(_totalAssetsHandle), _totalAssetsProof);
        Nox.allowThis(totalShares);
        Nox.allowThis(totalAssets);
        Nox.allow(totalShares, owner);
        Nox.allow(totalAssets, owner);
        Nox.allowPublicDecryption(totalAssets);
    }

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

        // Auto-allocate deposited funds to the first registered strategy
        if (strategies.length > 0) {
            address strat = strategies[0];
            if (isStrategy[strat]) {
                IStrategy(strat).deposit(amount);
                totalAllocated += amount;
                emit Allocated(strat, amount);
            }
        }

        emit Deposited(msg.sender, amount);
    }

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

    function claimWithdraw(address user, uint256 amount) external {
        require(amount > 0, "Zero amount");

        // Pull from strategies if vault doesn't have enough idle balance
        uint256 idleBalance = IERC20(asset).balanceOf(address(this));
        if (idleBalance < amount) {
            uint256 needed = amount - idleBalance;
            for (uint256 i = 0; i < strategies.length; i++) {
                address s = strategies[i];
                if (!isStrategy[s]) continue;
                uint256 stratBalance = IStrategy(s).totalAssets();
                if (stratBalance == 0) continue;
                uint256 toPull = needed < stratBalance ? needed : stratBalance;
                uint256 pulled = IStrategy(s).withdraw(toPull);
                if (totalAllocated >= pulled) totalAllocated -= pulled; else totalAllocated = 0;
                if (pulled >= needed) break;
                needed -= pulled;
            }
            require(IERC20(asset).balanceOf(address(this)) >= amount, "Insufficient liquidity after deallocation");
        }

        pendingWithdrawals[user] = Nox.sub(pendingWithdrawals[user], Nox.toEuint256(amount));

        Nox.allowThis(pendingWithdrawals[user]);
        Nox.allowPublicDecryption(pendingWithdrawals[user]);

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
        if (totalAllocated >= pulled) totalAllocated -= pulled; else totalAllocated = 0;
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
                totalAssets = Nox.add(totalAssets, Nox.toEuint256(remaining));
            }
        }
        if (totalYield > 0) {
            _allowVaultState();
            emit Harvested(totalYield, msg.sender == owner ? 0 : (totalYield * HARVEST_FEE_BPS) / 10000);
        }
    }

    function emergencyDeallocate(address _strategy) external {
        require(isStrategy[_strategy], "Invalid strategy");
        uint256 pulled = IStrategy(_strategy).emergencyWithdraw();
        if (totalAllocated >= pulled) totalAllocated -= pulled; else totalAllocated = 0;
        emit EmergencyDeallocated(_strategy, pulled);
    }

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
