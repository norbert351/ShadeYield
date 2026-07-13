import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { parseEther } from "viem";

async function deployContract(net: any, name: string, args: any[], account: any) {
  const { contract, deploymentTransaction } = await net.viem.sendDeploymentTransaction(name, args, {
    client: { wallet: account },
  });
  const publicClient = await net.viem.getPublicClient();
  await publicClient.waitForTransactionReceipt({ hash: deploymentTransaction.hash });
  return contract;
}

describe("ShadeYield public components", function () {
  let token: any;
  let token1: any;
  let aavePool: any;
  let positionManager: any;
  let aaveStrategy: any;
  let uniStrategy: any;
  let owner: any;
  let user: any;
  let net: any;

  beforeEach(async function () {
    net = await hre.network.getOrCreate("default");
    [owner, user] = await net.viem.getWalletClients();

    token = await deployContract(net, "ShadeToken", ["Shade USDC", "sUSDC", 18, parseEther("1000000")], owner);
    token1 = await deployContract(net, "ShadeToken", ["Shade DAI", "sDAI", 18, parseEther("1000000")], owner);
    aavePool = await deployContract(net, "MockAavePool", [token.address], owner);
    positionManager = await deployContract(net, "MockNonfungiblePositionManager", [], owner);
    aaveStrategy = await deployContract(net, "AaveStrategy", [token.address, aavePool.address], owner);
    uniStrategy = await deployContract(net, "UniswapV3Strategy", [token.address, token1.address, positionManager.address, 3000, -887220, 887220], owner);

    await aaveStrategy.write.setVault([owner.account.address], { account: owner.account });
    await uniStrategy.write.setVault([owner.account.address], { account: owner.account });

    await token.write.mint([user.account.address, parseEther("10000")], { account: owner.account });
    await token.write.mint([owner.account.address, parseEther("10000")], { account: owner.account });
    await token1.write.mint([owner.account.address, parseEther("10000")], { account: owner.account });
  });

  it("ShadeToken mints and transfers", async function () {
    const balance = await token.read.balanceOf([user.account.address]);
    assert.equal(balance, parseEther("10000"));
  });

  it("AaveStrategy deposits, harvests, and withdraws", async function () {
    await token.write.approve([aaveStrategy.address, parseEther("1000")], { account: owner.account });
    await aaveStrategy.write.deposit([parseEther("1000")], { account: owner.account });

    assert.equal(await aaveStrategy.read.totalAssets(), parseEther("1000"));
    assert.equal(await aavePool.read.supplied([aaveStrategy.address]), parseEther("1000"));

    // Simulate yield: accrue yield through the pool.
    await token.write.approve([aavePool.address, parseEther("50")], { account: owner.account });
    await aavePool.write.accrueYield([aaveStrategy.address, parseEther("50")], { account: owner.account });

    await aaveStrategy.write.harvest([], { account: owner.account });
    const ownerBalance = await token.read.balanceOf([owner.account.address]);
    assert.ok(ownerBalance > parseEther("10000"));

    const remaining = await aaveStrategy.read.totalAssets();
    await aaveStrategy.write.withdraw([remaining], { account: owner.account });
    assert.equal(await aaveStrategy.read.totalAssets(), 0n);
  });

  it("UniswapV3Strategy mints position and tracks assets", async function () {
    await token.write.approve([uniStrategy.address, parseEther("500")], { account: owner.account });
    await token1.write.approve([uniStrategy.address, parseEther("500")], { account: owner.account });
    await uniStrategy.write.deposit([parseEther("500")], { account: owner.account });

    assert.equal(await positionManager.read.balanceOf([uniStrategy.address]), 1n);
    assert.ok((await uniStrategy.read.totalAssets()) > 0n);

    await uniStrategy.write.withdraw([parseEther("100")], { account: owner.account });
    assert.equal(await positionManager.read.balanceOf([uniStrategy.address]), 1n);
  });
});
