import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { parseEther, parseUnits, formatUnits, getContract } from "viem";
import { MAINNET, USDC_DECIMALS, USDC_WHALE } from "./helpers/mainnetAddresses.js";

const ADDRESSES = MAINNET;

function erc20Contract(address: `0x${string}`, client: any): any {
  return getContract({
    address,
    abi: [
      { type: "function", name: "balanceOf", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
      { type: "function", name: "approve", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
      { type: "function", name: "transfer", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
      { type: "function", name: "transferFrom", inputs: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
      { type: "function", name: "decimals", inputs: [], outputs: [{ name: "", type: "uint8" }], stateMutability: "view" },
    ] as const,
    client,
  }) as any;
}

async function deployContract(net: any, name: string, args: any[], account: any) {
  const { contract, deploymentTransaction } = await net.viem.sendDeploymentTransaction(name, args, {
    client: { wallet: account },
  });
  const publicClient = await net.viem.getPublicClient();
  await publicClient.waitForTransactionReceipt({ hash: deploymentTransaction.hash });
  return contract;
}

describe("ShadeYield real protocol integrations (mainnet fork)", function () {
  let net: any;
  let owner: any;
  let user: any;
  let whale: any;
  let usdc: any;
  let usdt: any;
  let aaveStrategy: any;
  let uniStrategy: any;

  beforeEach(async function () {
    net = await hre.network.getOrCreate("default");
    [owner, user] = await net.viem.getWalletClients();

    const publicClient = await net.viem.getPublicClient();
    const ownerClient = { wallet: owner, public: publicClient };

    // Impersonate a USDC whale and fund it with ETH for gas.
    const networkHelpers = await net.networkHelpers;
    await networkHelpers.impersonateAccount(USDC_WHALE);
    await networkHelpers.setBalance(USDC_WHALE, parseEther("10"));

    whale = await net.viem.getWalletClient(USDC_WHALE);
    const whaleClient = { wallet: whale, public: publicClient };

    usdc = erc20Contract(ADDRESSES.USDC, ownerClient);
    usdt = erc20Contract(ADDRESSES.USDT, ownerClient);

    // Transfer 50k USDC from the whale to the test owner.
    const whaleUsdc = erc20Contract(ADDRESSES.USDC, whaleClient);
    const transferAmount = parseUnits("50000", USDC_DECIMALS);
    await whaleUsdc.write.transfer([owner.account.address, transferAmount], { account: whale.account });

    const ownerBalance = await usdc.read.balanceOf([owner.account.address]);
    assert.ok(ownerBalance >= transferAmount, `owner USDC balance too low: ${formatUnits(ownerBalance, USDC_DECIMALS)}`);
  });

  it("ShadeToken mints and transfers", async function () {
    const token = await deployContract(net, "ShadeToken", ["Shade USD Coin", "sUSDC", 18, parseEther("1000000")], owner);
    await token.write.mint([user.account.address, parseEther("10000")], { account: owner.account });
    const balance = await token.read.balanceOf([user.account.address]);
    assert.equal(balance, parseEther("10000"));
  });

  it("AaveStrategy deposits, harvests, and withdraws real USDC", async function () {
    aaveStrategy = await deployContract(net, "AaveStrategy", [ADDRESSES.USDC, ADDRESSES.AAVE_V3_POOL], owner);
    await aaveStrategy.write.setVault([owner.account.address], { account: owner.account });

    const depositAmount = parseUnits("10000", USDC_DECIMALS);
    await usdc.write.approve([aaveStrategy.address, depositAmount], { account: owner.account });

    const aTokenBalanceBefore = await aaveStrategy.read.totalAssets();
    assert.equal(aTokenBalanceBefore, 0n);

    await aaveStrategy.write.deposit([depositAmount], { account: owner.account });

    const aTokenBalance = await aaveStrategy.read.totalAssets();
    assert.ok(aTokenBalance > 0n, "aUSDC balance should be > 0");
    // aToken balance equals deposit / liquidityIndex, so it is slightly below deposit.
    assert.ok(aTokenBalance >= (depositAmount * 99n) / 100n, "aUSDC balance should be ~deposit");

    // Advance time to accrue yield, then harvest.
    const networkHelpers = await net.networkHelpers;
    await networkHelpers.time.increase(60 * 60 * 24 * 7); // 1 week
    const harvestYield = await aaveStrategy.write.harvest([], { account: owner.account });
    assert.ok(harvestYield >= 0n, "harvest should succeed");

    // Withdrawing the full aToken balance should return the underlying USDC.
    // A small aToken dust balance can remain due to rounding.
    const aTokenBalanceAfterHarvest = await aaveStrategy.read.totalAssets();
    await aaveStrategy.write.withdraw([aTokenBalanceAfterHarvest], { account: owner.account });
    const finalATokenBalance = await aaveStrategy.read.totalAssets();
    assert.ok(finalATokenBalance <= 10n, `aToken dust should be negligible, got ${finalATokenBalance}`);
  });

  it("UniswapV3Strategy mints position and tracks assets via single-sided deposit", async function () {
    uniStrategy = await deployContract(net, "UniswapV3Strategy", [
      ADDRESSES.USDC,
      ADDRESSES.USDT,
      ADDRESSES.UNISWAP_V3_POSITION_MANAGER,
      ADDRESSES.UNISWAP_V3_SWAP_ROUTER,
      500,
      -60,
      60,
    ], owner);
    await uniStrategy.write.setVault([owner.account.address], { account: owner.account });

    const depositAmount = parseUnits("10000", USDC_DECIMALS);
    await usdc.write.approve([uniStrategy.address, depositAmount], { account: owner.account });

    const publicClient = await net.viem.getPublicClient();
    const ownerClient = { wallet: owner, public: publicClient };

    const tokenIdBefore = await uniStrategy.read.tokenId();
    assert.equal(tokenIdBefore, 0n);

    await uniStrategy.write.deposit([depositAmount], { account: owner.account });

    const tokenId = await uniStrategy.read.tokenId();
    assert.ok(tokenId > 0n, "tokenId should be minted");

    const totalAssets = await uniStrategy.read.totalAssets();
    assert.ok(totalAssets > 0n, "totalAssets should be > 0");

    // Withdraw a portion and verify USDC is returned to the vault (owner in this test).
    const ownerUsdcBefore = await usdc.read.balanceOf([owner.account.address]);
    const withdrawAmount = parseUnits("1000", USDC_DECIMALS);
    const returned = await uniStrategy.write.withdraw([withdrawAmount], { account: owner.account });
    assert.ok(returned > 0n, "withdraw should return > 0");

    const ownerUsdcAfter = await usdc.read.balanceOf([owner.account.address]);
    assert.ok(ownerUsdcAfter > ownerUsdcBefore, "owner USDC balance should increase");
  });
});
