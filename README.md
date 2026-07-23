# ShadeYield

A **Nox-native private yield vault** on Arbitrum Sepolia. Users deposit USDC into a vault that mints **encrypted shares** (Nox `euint256`). Capital is deployed to **Aave V3** and **Uniswap V3** via strategy adapters. Individual share balances are private; protocol composability is preserved.

## Live Deployments (Arbitrum Sepolia)

| Contract | Address | Notes |
|----------|---------|-------|
| **ShadeAaveVault (Encrypted)** | `0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85` | Nox `euint256` shares, permissionless harvest |
| ShadeAaveVaultSimple | `0x5b1876a08aa687a70203ae28f1421d62f538dd1c` | Transparent vault (fallback) |
| ShadeToken (sUSDC) | `0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5` | 18 decimal test stablecoin |
| USDC | `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d` | 6 decimal test USDC |
| AaveStrategy (enc vault) | `0xbec0722b889bd6064db52d3339b1e3ae9f00abf1` | Deposits into Aave V3 Pool |
| UniswapV3Strategy (enc vault) | `0x3f21e1d960a6e02a6b54f4100092f57ca6b8399e` | USDC/DAI concentrated liquidity |
| Aave V3 Pool | `0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff` | Public Aave pool on Sepolia |
| NoxCompute | `0xd464B198f06756a1d00be223634b85E0a731c229` | Nox encrypted compute precompile |

**Chain:** Arbitrum Sepolia (`421614`) · **RPC:** `https://sepolia-rollup.arbitrum.io/rpc` · **Explorer:** `https://sepolia.arbiscan.io`

## Harvest (Permissionless)

`harvestAll()` is **open to everyone** — no owner-only restriction. The caller earns **0.05%** of harvested yield as an incentive. Anyone can call it via the Telegram bot (`/harvest`), the web UI, or directly on-chain.

## Privacy Model

| Data | Visibility |
|------|------------|
| Deposit/withdraw asset amounts | Public (standard ERC-20 transfers) |
| User share balance | Encrypted (Nox `euint256`) |
| Vault total assets | Encrypted, public decryption allowed for TVL |
| Strategy positions | Public (visible on Aave/Uniswap) |
| Individual yield share | Private (derived from encrypted shares) |

## Architecture

```
User deposits USDC → Encrypted Vault → allocates to strategies
         ↓                                    ↓
   Encrypted shares (Nox)            AaveStrategy → Aave V3 Pool
         ↓                           UniswapV3Strategy → Uniswap V3
   Private balance                        ↓
                                   harvestAll() (permissionless)
                                          ↓
                               Yield → vault + 0.05% caller incentive
```

## Quick Links

- **Telegram Bot:** [@shadeyield_bot](https://t.me/shadeyield_bot) — `/start`, `/status`, `/balance`, `/harvest`, `/contracts`
- **Web UI:** `http://localhost:3000` (or Cloudflare tunnel)
- **Explorer:** [Arbiscan Sepolia](https://sepolia.arbiscan.io)

## Getting Test USDC

- Arbitrum Sepolia faucet: https://faucet.quicknode.com/arbitrum/sepolia
- Request USDC + ETH for gas on Arbitrum Sepolia

## Setup

```bash
cd packages/contracts
npm install
npx hardhat compile
```

## Deploy

### Encrypted vault + strategies

```bash
export PK=0x...
RPC=https://sepolia-rollup.arbitrum.io/rpc npx tsx scripts/deployNoxEncrypted.ts
RPC=https://sepolia-rollup.arbitrum.io/rpc npx tsx scripts/deployStrategies.ts
```

### Simple vault (non-Nox)

```bash
export PRIVATE_KEY=0x...
npx hardhat run scripts/deploySepolia.ts --network arbitrumSepolia
```

## Test

```bash
npx hardhat test        # local (requires Docker for Nox off-chain services)
```

## Usage flow

1. Deploy vault + strategies (above)
2. Deposit USDC via web UI or bot (`/deposit <amount>`)
3. Allocate to strategies: `vault.allocateToStrategy(strategyAddr, amount)`
4. Call `vault.harvestAll()` (permissionless) to compound yield
5. Request withdrawal: `vault.requestWithdraw(shares)`, then `vault.claimWithdraw(user, amount)`

## Bots & Automation

| Service | Schedule | Method |
|---------|----------|--------|
| Telegram Bot | Continuous | `npx tsx apps/bot/src/index.ts` |
| Harvest | Every 8h | Cron script → `harvestAll()` |
| Bot Keeper | Every 5m | Cron check → restart if down |
| Web Keeper | Every 5m | Cron check → restart vite if down |

## License

MIT
