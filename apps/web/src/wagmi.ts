import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { createWeb3Modal } from '@web3modal/wagmi/react';

const RPC_URL = 'https://ethereum-sepolia.publicnode.com';

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID ?? '8c5688f834e58fd36346ba37a33c586f',
      showQrModal: false,
    }),
  ],
  transports: {
    [sepolia.id]: http(RPC_URL),
  },
});

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_WC_PROJECT_ID ?? '8c5688f834e58fd36346ba37a33c586f',
  defaultChain: sepolia,
});
