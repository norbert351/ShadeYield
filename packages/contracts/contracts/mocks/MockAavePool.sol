// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IPool} from "../interfaces/IPool.sol";

/**
 * @title MockAToken
 */
contract MockAToken is ERC20 {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}

/**
 * @title MockAavePool
 * @notice Minimal mock Aave V3 pool for local testing.
 */
contract MockAavePool is IPool {
    address public asset;
    MockAToken public aToken;

    mapping(address => uint256) public supplied;

    constructor(address _asset) {
        asset = _asset;
        aToken = new MockAToken("Aave Mock USDC", "aUSDC");
    }

    function supply(address _asset, uint256 amount, address onBehalfOf, uint16) external override {
        require(_asset == asset, "Wrong asset");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        supplied[onBehalfOf] += amount;
        aToken.mint(onBehalfOf, amount);
    }

    function withdraw(address _asset, uint256 amount, address to) external override returns (uint256) {
        require(_asset == asset, "Wrong asset");
        require(aToken.balanceOf(msg.sender) >= amount, "Insufficient aToken");
        require(supplied[msg.sender] >= amount, "Insufficient supplied");
        supplied[msg.sender] -= amount;
        aToken.burn(msg.sender, amount);
        // simulate 10% yield
        uint256 toReturn = (amount * 110) / 100;
        if (IERC20(asset).balanceOf(address(this)) < toReturn) {
            toReturn = IERC20(asset).balanceOf(address(this));
        }
        IERC20(asset).transfer(to, toReturn);
        return toReturn;
    }

    function accrueYield(address account, uint256 amount) external {
        require(amount > 0, "Zero amount");
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        supplied[account] += amount;
        aToken.mint(account, amount);
    }

    function getReserveData(address _asset) external view override returns (ReserveData memory) {
        ReserveData memory data;
        if (_asset == asset) {
            data.aTokenAddress = address(aToken);
        }
        return data;
    }
}
