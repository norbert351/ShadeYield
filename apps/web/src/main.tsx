// Safeguard for iframe environments
if (typeof window !== 'undefined') {
  try { const originalFetch = window.fetch; Object.defineProperty(window, 'fetch', { value: originalFetch, writable: true, configurable: true, enumerable: true }); } catch (error) { console.warn('fetch redefinition failed:', error); }
}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
