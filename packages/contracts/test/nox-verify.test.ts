import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { parseEther, parseUnits, getContract } from "viem";
import { NOX_COMPUTE_ADDRESS } from "@iexec-nox/nox-hardhat-plugin";

/**
 * Local Nox verification: proves the CONFIDENTIAL ShadeAaveVault works
 * end-to-end against the plugin's local Nox stack (chainId 31337).
 *
 * Run with: npx hardhat test test/nox-verify.test.ts
 * (the @iexec-nox plugin spins up the node + Docker Nox stack automatically)
 *
 * Mirrors the working pattern in ShadeYield.test.ts (deploy inside beforeEach).
 */

describe("ShadeAaveVault (Nox encrypted) — local verification", function () {
  let net: any;
  let owner: any;
  let user: any;
  let publicClient: any;

  beforeEach(async function () {
    net = await hre.network.getOrCreate("default");
    [owner, user] = await net.viem.getWalletClients();
    publicClient = await net.viem.getPublicClient();
  });

  it("deploys encrypted vault, deposits, and mints non-zero encrypted shares", async function () {
    const token = await net.viem.deployContract(
      "ShadeToken",
      ["Shade USDC", "sUSDC", 18, parseEther("1000000")],
      { client: { wallet: owner } }
    );
    const tokenAddr = token.address;

    const vault = await net.viem.deployContract(
      "ShadeAaveVault",
      ["ShadeYield Vault", tokenAddr],
      { client: { wallet: owner } }
    );
    const vaultAddr = vault.address;
    console.log("ShadeToken        :", tokenAddr);
    console.log("ShadeAaveVault    :", vaultAddr);
    console.log("NoxCompute (local):", NOX_COMPUTE_ADDRESS);

    // Constructor calls Nox.toEuint256(0); if Nox weren't initialized it would
    // have reverted above. Reaching here proves the confidential vault deploys.
    assert.ok(vaultAddr, "encrypted vault deployed");

    const erc20 = getContract({
      address: tokenAddr,
      abi: [
        { type: "function", name: "mint", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
        { type: "function", name: "approve", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
      ] as const,
      client: { wallet: owner, public: publicClient },
    });
    await (await erc20.write.mint([user.account.address, parseUnits("1000", 18)])).wait();
    await (await erc20.write.approve([vaultAddr, parseUnits("1000", 18)], { account: user.account.address })).wait();

    const vaultC = getContract({
      address: vaultAddr,
      abi: [
        { type: "function", name: "deposit", inputs: [{ name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
        { type: "function", name: "balanceOfShares", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "euint256" }], stateMutability: "view" },
      ] as const,
      client: { wallet: user, public: publicClient },
    });
    const depositTx = await vaultC.write.deposit([parseUnits("1000", 18)], { account: user.account.address });
    await depositTx.wait();

    const handle = await vaultC.read.balanceOfShares([user.account.address]);
    console.log("encrypted shares handle:", handle.toString());
    assert.notEqual(handle.toString(), "0", "encrypted share handle must be non-zero");
  });
});
