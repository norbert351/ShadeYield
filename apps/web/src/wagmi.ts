import { http, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { createWeb3Modal } from '@web3modal/wagmi/react';

const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID ?? '8c5688f834e58fd36346ba37a33c586f',
      showQrModal: false,
    }),
  ],
  transports: {
    [arbitrumSepolia.id]: http(RPC_URL),
  },
});

// Initialize Web3Modal - must be called at module level
createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_WC_PROJECT_ID ?? '8c5688f834e58fd36346ba37a33c586f',
  defaultChain: arbitrumSepolia,
});
