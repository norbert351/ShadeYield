import { type Address } from 'viem';

// ── Deployed addresses (ETH Sepolia) ──
export const ADDRESSES = {
  TestUSDC:           '0xa77d034ff9801337814e47a2843056c6bb99582e' as Address,
  SimpleVault:        '0x2d5c88b952aaaa71457a22071e1b9f04d47977e0' as Address,
  EncryptedVault:     '0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5' as Address,
  SimpleStrategy:     '0x8adb1d9f04328c355db13276f2be81fcf2710ff9' as Address,
  EncStrategy:        '0x1cf89361e70211f0b9ee879826908880bc5ab5ab' as Address,
  NoxCompute:         '0xd464B198f06756a1d00be223634b85E0a731c229' as Address,
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
] as const;
