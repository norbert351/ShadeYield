/**
 * ShadeYield Nox Decrypt API
 * Reads encrypted vault data from the Nox contract on Arbitrum Sepolia
 * and decrypts it via @iexec-nox/handle SDK (publicDecrypt, no ACL needed).
 *
 * Env vars:
 *   NOX_API_PRIVATE_KEY (required) — wallet private key for the Nox Handle client
 *   PORT                       (optional) — defaults to 3139
 *   RPC_URL                    (optional) — Arbitrum Sepolia RPC endpoint
 */
import { createServer } from 'http';
import { createPublicClient, createWalletClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { createViemHandleClient } from '@iexec-nox/handle';

const PORT = parseInt(process.env.PORT || '3139', 10);
const PK = process.env.NOX_API_PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || undefined;
const VAULT = '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85';

if (!PK) {
  console.error('[nox-api] NOX_API_PRIVATE_KEY env var is required');
  process.exit(1);
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const transport = http(RPC_URL);

let hc = null;

async function getClient() {
  if (hc) return hc;
  const account = privateKeyToAccount(/** @type {`0x${string}`} */ (PK));
  const wc = createWalletClient({ chain: arbitrumSepolia, transport, account });
  hc = await createViemHandleClient(wc);
  console.log('[nox-api] Nox client ready');
  return hc;
}

const pc = createPublicClient({ chain: arbitrumSepolia, transport });

/** @type {const} */
const BAL_ABI = [{ type: 'function', name: 'balanceOfShares', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' }];

/** @type {const} */
const TVL_ABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' }];

/**
 * @param {bigint} v
 * @returns {`0x${string}`}
 */
function toBytes32Hex(v) {
  return `0x${v.toString(16).padStart(64, '0')}`;
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  try {
    // ── Health check ──
    if (url.pathname === '/health') {
      res.writeHead(200, CORS);
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    // ── Vault share balance for an address ──
    if (url.pathname === '/vault/balance') {
      const addr = url.searchParams.get('address');
      if (!addr) {
        res.writeHead(400, CORS);
        res.end(JSON.stringify({ error: 'address required' }));
        return;
      }

      const raw = await pc.readContract({
        address: /** @type {`0x${string}`} */ (VAULT),
        abi: BAL_ABI,
        functionName: 'balanceOfShares',
        args: [/** @type {`0x${string}`} */ (addr)],
      });

      if (raw === 0n) {
        res.writeHead(200, CORS);
        res.end(JSON.stringify({ balance: '0', encrypted: false }));
        return;
      }

      const client = await getClient();
      const result = await client.publicDecrypt(toBytes32Hex(raw));
      res.writeHead(200, CORS);
      res.end(JSON.stringify({
        balance: String(result.value),
        solidityType: result.solidityType,
        encrypted: true,
      }));
      return;
    }

    // ── Vault TVL ──
    if (url.pathname === '/vault/tvl') {
      const raw = await pc.readContract({
        address: /** @type {`0x${string}`} */ (VAULT),
        abi: TVL_ABI,
        functionName: 'totalAssets',
      });

      const client = await getClient();
      const result = await client.publicDecrypt(toBytes32Hex(raw));
      res.writeHead(200, CORS);
      res.end(JSON.stringify({
        tvl: String(result.value),
        solidityType: result.solidityType,
        encrypted: true,
      }));
      return;
    }

    res.writeHead(404, CORS);
    res.end(JSON.stringify({ error: 'not found' }));
  } catch (err) {
    console.error('[nox-api] Error:', err.message || err);
    if (!res.headersSent) {
      res.writeHead(500, CORS);
      res.end(JSON.stringify({ error: err.message || 'internal' }));
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[nox-api] ShadeYield Nox Decrypt API on :${PORT}`);
});
