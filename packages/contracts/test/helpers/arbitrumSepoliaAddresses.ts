/** Arbitrum Sepolia testnet addresses — discovered & deployed */
export const ARBITRUM_SEPOLIA = {
  USDC:              "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const,
  AAVE_V3_POOL:      "0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff" as const,
  NOX_COMPUTE:       "0xd464B198f06756a1d00be223634b85E0a731c229" as const,

  // Deployed mocks
  TestDAI:           "0x9ada40832ee21b52ed5ff254081d56851d977d6a" as const,
  MockSwapRouter:    "0x2ddfa8cf74b341853b65f4357e80dbc8221a35d2" as const,
  MockPositionManager: "0xc558ffe2b269e47eb0e328140c459f87ce41fd4c" as const,

  // Deployed production contracts
  ShadeToken:        "0x114addd9c19642786d3c97ff9f9c010a90c899d9" as const,
  AaveStrategy:      "0xa77d034ff9801337814e47a2843056c6bb99582e" as const,
  UniswapV3Strategy: "0xa64df6102753c3b9de051bab0803a690e54e2425" as const,
} as const;
