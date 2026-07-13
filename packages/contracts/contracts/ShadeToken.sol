// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ShadeToken
 * @notice Public ERC-20 test token representing the base asset deposited into ShadeYield.
 *         In production this would be a real stablecoin (USDC/USDT/DAI).
 */
contract ShadeToken is ERC20 {
    uint8 private immutable _decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 supply) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(msg.sender, supply);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
