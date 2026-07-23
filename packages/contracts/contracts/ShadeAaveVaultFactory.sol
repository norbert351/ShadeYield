// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {ShadeAaveVault} from "./ShadeAaveVault.sol";

/**
 * @title ShadeAaveVaultFactory
 * @notice Deploys ShadeAaveVault (3-arg constructor) and initializes
 *         encrypted state in a single transaction.
 */
contract ShadeAaveVaultFactory {
    event VaultDeployed(address indexed vault, address indexed owner, address asset);

    function deploy(
        string memory _name,
        address _asset,
        address _owner,
        bytes32 _totalSharesHandle,
        bytes calldata _totalSharesProof,
        bytes32 _totalAssetsHandle,
        bytes calldata _totalAssetsProof
    ) external returns (address vaultAddr) {
        vaultAddr = address(new ShadeAaveVault(_name, _asset, _owner));
        ShadeAaveVault(vaultAddr).initialize(
            _totalSharesHandle,
            _totalSharesProof,
            _totalAssetsHandle,
            _totalAssetsProof
        );
        emit VaultDeployed(vaultAddr, _owner, _asset);
    }
}
