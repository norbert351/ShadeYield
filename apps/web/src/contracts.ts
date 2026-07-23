import { type Address } from 'viem';

// ── Deployed addresses (Arbitrum Sepolia) ──
export const ADDRESSES = {
  USDC:               '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' as Address,
  ShadeToken:         '0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5' as Address,
  SimpleVault:        '0x5b1876a08aa687a70203ae28f1421d62f538dd1c' as Address,
  EncryptedVault:     '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85' as Address,
  AaveStrategy:       '0x15bd317773d6793d7de2b4cad0fa6cb23440c990' as Address,
  UniswapStrategy:    '0x1e59cee63bbdcc6610a4a959e0b5ee5e7904daa6' as Address,
  // Encrypted vault strategies (new)
  AaveStrategyEnc:    '0xbec0722b889bd6064db52d3339b1e3ae9f00abf1' as Address,
  UniswapStrategyEnc: '0x3f21e1d960a6e02a6b54f4100092f57ca6b8399e' as Address,
  AavePool:           '0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff' as Address,
} as const;

// ── ABIs ──

export const ERC20_ABI = [
  { type: 'function', name: 'balanceOf', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' },
  { type: 'function', name: 'symbol', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'approve', inputs: [{ type: 'address' }, { type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'allowance', inputs: [{ type: 'address' }, { type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
] as const;

export const VAULT_ABI = [
  ...ERC20_ABI,
  { type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'totalShares', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'shares', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'balanceOfShares', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'deposit', inputs: [{ type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'requestWithdraw', inputs: [{ type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'claimWithdraw', inputs: [{ type: 'address' }, { type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'pendingWithdrawals', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'pendingWithdrawalShares', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'harvestAll', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'nonpayable' },
] as const;

export const STRATEGY_ABI = [
  { type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'principal', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'asset', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' },
] as const;

export const SHADE_TOKEN_ABI = [
  ...ERC20_ABI,
  { type: 'function', name: 'mint', inputs: [{ type: 'address' }, { type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'getPendingRewards', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'claimRewards', inputs: [], outputs: [], stateMutability: 'nonpayable' },
] as const;
