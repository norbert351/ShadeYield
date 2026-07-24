import { type Address } from 'viem';

// ── Deployed addresses (Arbitrum Sepolia) ──
export const ADDRESSES = {
  USDC:               '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' as Address,
  ShadeToken:         '0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5' as Address,
  SimpleVault:        '0xb53fe2f6f1d60a107ede44ccde32be915a7cc395' as Address,
  EncryptedVault:     '0x980c0832b52a3f0b6027e0d988bbfab04ad29f6d' as Address,
  AaveStrategy:       '0x3255818aa50af0e9b7a07c887acd85cf7770c4ef' as Address,
  UniswapStrategy:    '0x2acde84ab0d15873f3ea90608da9b48ae8fe605a' as Address,
  AaveStrategyEnc:    '0x68e18a2f9aee5b6d428f08f6b12a0bfb92a53893' as Address,
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
