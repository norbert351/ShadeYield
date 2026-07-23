/**
 * ShadeYield Nox Decrypt API v2 — uses publicDecrypt (no ACL needed).
 * Run from packages/contracts: npx tsx nox-api.ts
 */
import { createServer } from 'http';
import { createPublicClient, createWalletClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { createViemHandleClient } from '@iexec-nox/handle';

const PORT = 3139;
const PK = '0xed80e91e6d5ae33fa3b544e9b7e178342b34bf8fc5059f7393d69790a23b7e57';
const VAULT = '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

let hc: any = null;

async function getClient() {
  if (hc) return hc;
  const account = privateKeyToAccount(PK as `0x${string}`);
  const wc = createWalletClient({ chain: arbitrumSepolia, transport: http(), account });
  hc = await createViemHandleClient(wc);
  console.log('[nox-api] Nox client ready');
  return hc;
}

const pc = createPublicClient({ chain: arbitrumSepolia, transport: http() });

const BAL_ABI = [{ type: 'function', name: 'balanceOfShares', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;
const TVL_ABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;

function toBytes32Hex(v: bigint): `0x${string}` {
  return `0x${v.toString(16).padStart(64, '0')}`;
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  try {
    if (url.pathname === '/health') {
      res.writeHead(200, CORS); res.end(JSON.stringify({ ok: true })); return;
    }

    if (url.pathname === '/vault/balance') {
      const addr = url.searchParams.get('address');
      if (!addr) { res.writeHead(400, CORS); res.end(JSON.stringify({ error: 'address required' })); return; }

      const raw = await pc.readContract({ address: VAULT as `0x${string}`, abi: BAL_ABI, functionName: 'balanceOfShares', args: [addr as `0x${string}`] }) as bigint;
      if (raw === 0n) { res.writeHead(200, CORS); res.end(JSON.stringify({ balance: '0', encrypted: false })); return; }

      const client = await getClient();
      const result = await client.publicDecrypt(toBytes32Hex(raw));
      res.writeHead(200, CORS);
      res.end(JSON.stringify({ balance: String(result.value), solidityType: result.solidityType, encrypted: true }));
      return;
    }

    if (url.pathname === '/vault/tvl') {
      const raw = await pc.readContract({ address: VAULT as `0x${string}`, abi: TVL_ABI, functionName: 'totalAssets' }) as bigint;
      const client = await getClient();
      const result = await client.publicDecrypt(toBytes32Hex(raw));
      res.writeHead(200, CORS);
      res.end(JSON.stringify({ tvl: String(result.value), solidityType: result.solidityType, encrypted: true }));
      return;
    }

    res.writeHead(404, CORS); res.end(JSON.stringify({ error: 'not found' }));
  } catch (err: any) {
    console.error('[nox-api] Error:', err.message || err);
    if (!res.headersSent) {
      res.writeHead(500, CORS);
      res.end(JSON.stringify({ error: err.message || 'internal' }));
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[nox-api] Listening on :${PORT}`);
});
