/**
 * ShadeYield Nox Decrypt API
 * Runs on Node.js — proxies encrypted vault reads through the Nox Handle SDK.
 * Frontend calls this to get decrypted balances.
 */
import { createServer } from 'http';

const PORT = 3139;

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

let noxClient: any = null;
let nxa: any = null;

// ── Lazy load Nox SDK (ESM only, use dynamic import) ──
async function getNox() {
  if (noxClient) return noxClient;
  // Nox handle SDK viem wrapper
  nxa = await import('@iexec-nox/handle');
  const hc = nxa.createHandleClient;
  noxClient = await hc({
    gatewayUrl: 'https://gateway-testnets.noxprotocol.dev',
    handleAddress: '0xFE0d168079aA6b73A348FC622B25e26A24fD2411' as `0x${string}`,
  });
  console.log('[nox-api] Nox client initialized');
  return noxClient;
}

// ── Simple HTTP server ──
const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  try {
    if (url.pathname === '/health') {
      res.writeHead(200, headers);
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (url.pathname === '/decrypt') {
      const handle = url.searchParams.get('handle');
      if (!handle) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: 'Missing handle param' }));
        return;
      }

      const nox = await getNox();
      const decrypted = await nox.decrypt(handle as `0x${string}`);
      res.writeHead(200, headers);
      res.end(JSON.stringify({ decrypted }));
      return;
    }

    // Get encrypted vault balance for an address
    if (url.pathname === '/vault/balance') {
      const userAddr = url.searchParams.get('address');
      if (!userAddr) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: 'Missing address param' }));
        return;
      }

      // Read encrypted shares from vault contract
      const { createPublicClient, http } = await import('viem');
      const { arbitrumSepolia } = await import('viem/chains');
      const pc = createPublicClient({ chain: arbitrumSepolia, transport: http() });
      const encryptedHandle = await pc.readContract({
        address: '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85',
        abi: [{ type: 'function', name: 'balanceOfShares', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' }],
        functionName: 'balanceOfShares',
        args: [userAddr as `0x${string}`],
      }) as bigint;

      if (encryptedHandle === 0n) {
        res.writeHead(200, headers);
        res.end(JSON.stringify({ balance: 0, encrypted: false }));
        return;
      }

      // Decrypt through Nox
      const nox = await getNox();
      const decrypted = await nox.decrypt(`0x${encryptedHandle.toString(16).padStart(64, '0')}` as `0x${string}`);
      res.writeHead(200, headers);
      res.end(JSON.stringify({ balance: decrypted, encrypted: true }));
      return;
    }

    // Get encrypted vault TVL
    if (url.pathname === '/vault/tvl') {
      const { createPublicClient, http } = await import('viem');
      const { arbitrumSepolia } = await import('viem/chains');
      const pc = createPublicClient({ chain: arbitrumSepolia, transport: http() });
      const encryptedTotalAssets = await pc.readContract({
        address: '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85',
        abi: [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' }],
        functionName: 'totalAssets',
      }) as bigint;

      const nox = await getNox();
      const decrypted = await nox.decrypt(`0x${encryptedTotalAssets.toString(16).padStart(64, '0')}` as `0x${string}`);
      res.writeHead(200, headers);
      res.end(JSON.stringify({ tvl: decrypted }));
      return;
    }

    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (err: any) {
    console.error('[nox-api] Error:', err.message || err);
    res.writeHead(500, headers);
    res.end(JSON.stringify({ error: err.message || 'Internal error' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[nox-api] ShadeYield Nox Decrypt API listening on :${PORT}`);
});
