// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {Nox, euint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

/// @notice Diagnostic: isolate whether wrapping literal 0 fails on Nox.
contract NoxProbe {
    euint256 public zeroWrap;   // set in constructor via toEuint256(0)
    euint256 public oneWrap;    // set via toEuint256(1) in a function

    constructor() {
        zeroWrap = Nox.toEuint256(0); // line that may revert
    }

    function wrapOne() external {
        oneWrap = Nox.toEuint256(1);
    }

    function wrapZero() external {
        zeroWrap = Nox.toEuint256(0);
    }
}
