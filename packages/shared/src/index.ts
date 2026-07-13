export interface VaultConfig {
  chainId: number;
  vaultAddress: string;
  tokenAddress: string;
  rpcUrl: string;
}

export interface VaultState {
  tvl: string;
  sharePrice: string;
  userShares: string;
  userAssets: string;
}

export interface BotUser {
  telegramId: number;
  walletAddress: string;
}
