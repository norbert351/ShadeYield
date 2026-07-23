import { useCallback } from 'react';
import { type Address, formatUnits, parseUnits } from 'viem';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ADDRESSES, ERC20_ABI, VAULT_ABI, SHADE_TOKEN_ABI, STRATEGY_ABI } from './contracts';

const USDC_DECIMALS = 6;
const SHADE_DECIMALS = 18;

// ── USDC hooks ──

export function useUSDCBalance(address: Address | undefined) {
  return useReadContract({
    address: ADDRESSES.USDC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useUSDCAllowance(owner: Address | undefined, spender: Address | undefined) {
  return useReadContract({
    address: ADDRESSES.USDC,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    query: { enabled: !!owner && !!spender },
  });
}

// ── Vault hooks ──

export function useVault(vaultAddr: Address) {
  const { address } = useAccount();

  const totalAssets = useReadContract({
    address: vaultAddr,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
  });

  const totalShares = useReadContract({
    address: vaultAddr,
    abi: VAULT_ABI,
    functionName: 'totalShares',
  });

  const userShares = useReadContract({
    address: vaultAddr,
    abi: VAULT_ABI,
    functionName: 'balanceOfShares',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return { totalAssets, totalShares, userShares };
}

export function useVaultWrite(vaultAddr: Address) {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const wait = useWaitForTransactionReceipt({ hash });

  const deposit = useCallback(
    (amountRaw: string) => {
      const amount = parseUnits(amountRaw, USDC_DECIMALS);
      writeContract({
        address: vaultAddr,
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amount],
      });
    },
    [vaultAddr, writeContract]
  );

  const requestWithdraw = useCallback(
    (amountRaw: string) => {
      const amount = parseUnits(amountRaw, USDC_DECIMALS);
      writeContract({
        address: vaultAddr,
        abi: VAULT_ABI,
        functionName: 'requestWithdraw',
        args: [amount],
      });
    },
    [vaultAddr, writeContract]
  );

  return { deposit, requestWithdraw, hash, isPending, wait, writeContract };
}

// ── Strategy hooks ──

export function useStrategyTotalAssets(stratAddr: Address) {
  return useReadContract({
    address: stratAddr,
    abi: STRATEGY_ABI,
    functionName: 'totalAssets',
  });
}

// ── ShadeToken hooks ──

export function useShadeBalance(address: Address | undefined) {
  return useReadContract({
    address: ADDRESSES.ShadeToken,
    abi: SHADE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function usePendingRewards(address: Address | undefined) {
  return useReadContract({
    address: ADDRESSES.ShadeToken,
    abi: SHADE_TOKEN_ABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useClaimRewards() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const wait = useWaitForTransactionReceipt({ hash });

  const claim = useCallback(() => {
    writeContract({
      address: ADDRESSES.ShadeToken,
      abi: SHADE_TOKEN_ABI,
      functionName: 'claimRewards',
    });
  }, [writeContract]);

  return { claim, hash, isPending, wait };
}

// ── Approval ──

export function useApproveUSDC(spender: Address | undefined) {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const wait = useWaitForTransactionReceipt({ hash });

  const approve = useCallback(
    (amountRaw: string) => {
      if (!spender) return;
      const amount = parseUnits(amountRaw, USDC_DECIMALS);
      writeContract({
        address: ADDRESSES.USDC,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spender, amount],
      });
    },
    [spender, writeContract]
  );

  return { approve, hash, isPending, wait };
}

// ── Format helpers ──

export function formatUSDC(wei: bigint | undefined): string {
  if (!wei) return '0.00';
  return formatUnits(wei, USDC_DECIMALS);
}

export function formatSHADE(wei: bigint | undefined): string {
  if (!wei) return '0.0000';
  return formatUnits(wei, SHADE_DECIMALS);
}
