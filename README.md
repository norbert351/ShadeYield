# ShadeYield — Private Yield Vaults on iExec Nox

**WTF Hackathon Summer Edition** — Built with iExec Nox Confidential Smart Contracts

ShadeYield is a **privacy-first yield vault** that encrypts user share balances using iExec Nox Trusted Execution Environments (TEEs). Users deposit USDC, earn yield, and withdraw — but nobody can see how much they hold except them.

## Live Deployments (ETH Sepolia)

| Contract | Address | Explorer |
|----------|---------|----------|
| **Simple Vault** (transparent) | `0x2d5c88b952aaaa71457a22071e1b9f04d47977e0` | [Etherscan](https://sepolia.etherscan.io/address/0x2d5c88b952aaaa71457a22071e1b9f04d47977e0) |
| **Encrypted Vault** (Nox) | `0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5` | [Etherscan](https://sepolia.etherscan.io/address/0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5) |
| **TestUSDC** | `0xa77d034ff9801337814e47a2843056c6bb99582e` | [Etherscan](https://sepolia.etherscan.io/address/0xa77d034ff9801337814e47a2843056c6bb99582e) |
| **Nox Compute** | `0xd464B198f06756a1d00be223634b85E0a731c229` | Precompile |

**Chain:** ETH Sepolia (`11155111`) · RPC: `https://ethereum-sepolia.publicnode.com`

## How It Works

### Simple Vault Flow
```
User deposits USDC → Simple Vault
                      ↓ auto-allocate
                  HoldStrategy (or Aave/Uniswap in production)
                      ↓
                  Shares minted (transparent ERC-20)
```

### Encrypted Vault Flow
```
User deposits USDC → Encrypted Vault
                      ↓ auto-allocate
                  HoldStrategy
                      ↓
                  Shares encrypted as Nox euint256
                      ↓ (only user can decrypt via Nox API)
                  Balance visible in UI after decryption
```

## Privacy Model

| Data | Simple Vault | Encrypted Vault |
|------|-------------|-----------------|
| Share balance | Public (uint256) | Encrypted (euint256) |
| Deposit amount | Public | Public |
| TVL | Public | Encrypted (public-decrypt) |
| Individual yield | Public | Private |
| Strategy positions | Public | Public |

## Setup

### Prerequisites
- Node.js 22+
- MetaMask or any Web3 wallet
- Test ETH from Sepolia faucet

### Frontend
```bash
cd apps/web
npm install
cp .env.example .env  # Set VITE_NOX_API_URL if running Nox backend
npx vite dev          # Local dev on port 3000
```

### Smart Contracts
```bash
cd packages/contracts
npm install
npx hardhat compile
```

### Deploy
```bash
cd packages/contracts
export PRIVATE_KEY=0x...
npx tsx scripts/deploySepoliaHackathon.ts
```

### Nox Decrypt API (optional)
```bash
cd packages/contracts
npx tsx nox-api.ts    # Runs on port 3139
# Expose via cloudflare tunnel:
cloudflared tunnel --url http://localhost:3139
```

## Architecture

```
┌─────────────┐    ┌──────────────────┐    ┌──────────────┐
│  User       │───→│  ShadeYield      │───→│  Strategy    │
│  Wallet     │    │  Vault           │    │  (Hold/Aave) │
└─────────────┘    └──────────────────┘    └──────────────┘
                          │
                          ↓
              ┌──────────────────────┐
              │  Simple: uint256    │
              │  Encrypted: euint256│
              └──────────────────────┘
                          │
              ┌──────────────────────┐
              │  Nox TEE Decrypt API │
              │  (off-chain)         │
              └──────────────────────┘
```

## Smart Contracts

### ShadeAaveVaultSimple.sol
Transparent vault with plain uint256 share tracking. Auto-allocates deposits to strategy on deposit. Pulls from strategy on withdraw when idle balance is low.

### ShadeAaveVault.sol (Nox-encrypted)
Confidential vault using iExec Nox `euint256` for share state. Encrypted math (`Nox.add`, `Nox.div`, `Nox.select`) processes encrypted values without exposing plaintext on-chain. `totalAssets` has `allowPublicDecryption` for TVL display.

### HoldStrategy.sol
Minimal strategy for ETH Sepolia demo. Holds deposited assets. Replace with Aave V3/Morpho/Uniswap for real yield.

## Tests
```bash
cd packages/contracts
npx hardhat test
```

## License
MIT

## Links
- GitHub: https://github.com/norbert351/ShadeYield
- iExec Nox: https://iex.ec/nox
- ETH Sepolia Faucet: https://faucet.quicknode.com/ethereum/sepolia
