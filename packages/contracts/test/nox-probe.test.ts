import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { getContract } from "viem";

describe("NoxProbe — isolate toEuint256(0) failure", function () {
  let net: any;
  let owner: any;
  let publicClient: any;

  beforeEach(async function () {
    net = await hre.network.getOrCreate("default");
    [owner] = await net.viem.getWalletClients();
    publicClient = await net.viem.getPublicClient();
  });

  it("constructor toEuint256(0) — does it revert?", async function () {
    try {
      const c = await net.viem.deployContract("NoxProbe", [], { client: { wallet: owner } });
      console.log("CONSTRUCTOR toEuint256(0): DEPLOYED OK at", c.address);
    } catch (e: any) {
      console.log("CONSTRUCTOR toEuint256(0): REVERTED ->", e?.shortMessage || e?.message);
    }
  });

  it("function toEuint256(1) — does it work?", async function () {
    try {
      const c = await net.viem.deployContract("NoxProbe", [], { client: { wallet: owner } });
      const cc = getContract({
        address: c.address,
        abi: [{ type: "function", name: "wrapOne", inputs: [], outputs: [], stateMutability: "nonpayable" }] as const,
        client: { wallet: owner, public: publicClient },
      });
      const tx = await cc.write.wrapOne();
      await tx.wait();
      console.log("FUNCTION toEuint256(1): OK");
    } catch (e: any) {
      console.log("FUNCTION toEuint256(1): REVERTED ->", e?.shortMessage || e?.message);
    }
  });

  it("function toEuint256(0) — does it revert?", async function () {
    try {
      const c = await net.viem.deployContract("NoxProbe", [], { client: { wallet: owner } });
      const cc = getContract({
        address: c.address,
        abi: [{ type: "function", name: "wrapZero", inputs: [], outputs: [], stateMutability: "nonpayable" }] as const,
        client: { wallet: owner, public: publicClient },
      });
      const tx = await cc.write.wrapZero();
      await tx.wait();
      console.log("FUNCTION toEuint256(0): OK");
    } catch (e: any) {
      console.log("FUNCTION toEuint256(0): REVERTED ->", e?.shortMessage || e?.message);
    }
  });
});
