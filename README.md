# ShadeYield

A **Nox-native privacy wrapper** around existing public DeFi protocols for the iExec WTF Hackathon.

Users deposit a public ERC-20 asset into a vault that mints **encrypted shares** on iExec Nox. The vault owner allocates pooled capital to yield strategies backed by **Aave V3** and **Uniswap V3** without modifying either protocol. Individual ownership stays private; protocol composability stays intact.

## Why this fits WTF

The WTF challenge asks for real open-source protocol integrations that gain privacy through Nox — not standalone demos.

| Requirement | ShadeYield |
|---|---|
| Build on Nox | ✅ Encrypted user share balances + aggregate TVL |
| Real protocol integration | ✅ Aave V3 lending + Uniswap V3 liquidity |
| Don't modify base protocols | ✅ Aave/Uniswap contracts are untouched; adapter strategies sit on top |
| Composability preserved | ✅ Public ERC-20 asset in/out, public protocol positions |
| Close to deployable product | ✅ Modular strategy adapters, owner controls, emergency exits |

## Architecture

```text
User deposits public sUSDC
        |
        v
+-----------------------------------+
|      ShadeAaveVault               |
|  - mints encrypted shares         |
|  - tracks encrypted totalAssets   |
|  - owner allocates capital        |
+-----------------------------------+
        |
        +----------+----------+
        |                     |
        v                     v
  AaveStrategy        UniswapV3Strategy
        |                     |
        v                     v
   Aave V3 Pool      Uniswap V3 Position Manager
   (public protocol) (public protocol)
```

## Privacy model

| Data | Visibility |
|---|---|
| Deposit/withdraw asset amounts | Public (standard ERC-20 transfers) |
| User share balance | Encrypted (Nox `euint256`) |
| Vault total assets | Encrypted, public decryption allowed for TVL |
| Strategy positions | Public (visible on Aave/Uniswap) |
| Individual yield share | Private (derived from encrypted shares) |

## Contracts

| Contract | Purpose |
|---|---|
| `ShadeToken.sol` | Public ERC-20 test stablecoin (sUSDC / sDAI) |
| `ShadeAaveVault.sol` | Confidential vault with encrypted shares, strategy allocator, harvester |
| `AaveStrategy.sol` | Adapter that deposits/withdraws from Aave V3 Pool |
| `UniswapV3Strategy.sol` | Adapter that provides liquidity via Uniswap V3 NFT positions |
| `interfaces/IPool.sol` | Minimal Aave V3 Pool interface |
| `interfaces/INonfungiblePositionManager.sol` | Minimal Uniswap V3 position manager interface |
| `interfaces/IStrategy.sol` | Common strategy interface |
| `mocks/*` | Mock Aave Pool + Uniswap Position Manager for local tests |

## Network

Nox is live on **Arbitrum Sepolia**:

| Key | Value |
|---|---|
| Chain ID | `421614` |
| NoxCompute | `0xd464B198f06756a1d00be223634b85E0a731c229` |
| RPC | `https://sepolia-rollup.arbitrum.io/rpc` |
| Explorer | `https://sepolia.arbiscan.io` |

## Setup

```bash
cd packages/contracts
npm install
```

## Compile

```bash
npx hardhat compile
```

## Test

> ⚠️ Local tests require Docker for Nox off-chain services.

```bash
npx hardhat test
```

If Docker is unavailable, the Hardhat Nox plugin will report:
```
[nox] Cannot connect to the Docker daemon. Is Docker running?
```

## Deploy

### Arbitrum Sepolia (Nox-enabled)

```bash
export PRIVATE_KEY=0x...
export ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
npm run deploy:arbitrumSepolia
```

### Sepolia (non-Nox / plain EVM)

> Plain Sepolia does not have Nox protocol infrastructure. Only deploy here if you remove all `Nox.*` ACL calls.

```bash
export PRIVATE_KEY=0x...
export SEPOLIA_RPC=https://sepolia.drpc.org
npm run deploy:sepolia
```

## Usage flow

1. Deploy `ShadeToken` + `ShadeAaveVault`.
2. Deploy `AaveStrategy(asset, aavePool)` and/or `UniswapV3Strategy(asset, token1, positionManager, ...)`.
3. Call `vault.addStrategy(strategy)`.
4. Users call `vault.deposit(amount)`.
5. Owner calls `vault.allocateToStrategy(strategy, amount)` to deploy capital.
6. Owner calls `vault.harvestAll()` to collect yield back into the vault.
7. Users call `vault.requestWithdraw(encryptedSharesHandle, inputProof)` to burn shares and expose the asset amount via Nox.
8. After off-chain decryption, anyone calls `vault.claimWithdraw(user, amount)` to transfer public assets.

## Known limitations

- `claimWithdraw` trusts the caller to supply the exact decrypted amount. In production, use a Nox-aware relayer or keeper that reads the decrypted `pendingWithdrawals` value off-chain before finalizing.
- `UniswapV3Strategy.totalAssets()` uses a simplified valuation. A production version needs a price oracle for the second token.
- Tests require a running Docker daemon for Nox off-chain services.

## License

MIT
