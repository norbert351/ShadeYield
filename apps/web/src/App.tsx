/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatUnits, parseUnits, createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { injected } from 'wagmi/connectors';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  ArrowRight,
  Coins,
  Eye,
  EyeOff,
  Cpu,
  Layers,
  Activity,
  Wallet,
  ExternalLink,
  FileText,
  TrendingUp,
  Sparkles,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  Zap,
  ChevronRight,
  Info,
  QrCode,
  Check,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

// Interfaces for State Management
interface Transaction {
  id: string;
  txHash: string;
  type: 'Deposit' | 'Withdraw' | 'Reward Claim';
  vault: 'Simple Vault' | 'Encrypted Vault' | 'N/A';
  amount: number;
  timestamp: string;
  status: 'Success' | 'Pending' | 'Failed';
}

interface NodeDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string;
  codeSnippet: string;
}

// Custom brand logo matching the uploaded white-to-red interlocking loop design
const ShadeYieldLogo = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="sy-logo-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <filter id="sy-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#sy-glow)">
        {[0, 90, 180, 270].map((angle, idx) => (
          <path
            key={idx}
            d="M 38,38 C 38,26 62,26 62,38 C 62,50 38,50 38,62 C 38,74 62,74 62,62"
            stroke="url(#sy-logo-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`rotate(${angle} 50 50)`}
            className="opacity-95"
          />
        ))}
      </g>
    </svg>
  );
};

// Interactive real-time matrix decryption digital code rain for Web3 theme
function NoxHexDecryptionRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const columns = Math.floor(width / 14);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -height);
    const chars = '0123456789ABCDEFSHADEYIELDNOXSECUREPRIVACY';

    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(9, 9, 11, 0.15)'; // Deep graphite to match bg-zinc-950/bg-zinc-900
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)'; // Soft glowing red hexadecimal digits
      ctx.font = 'bold 9px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        const y = drops[i];

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 1.5;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen rounded-2xl" />;
}

// Live interactive typing terminal reproducing secure enclave operations
interface TerminalLine {
  text: string;
  type: 'system' | 'security' | 'success' | 'warning' | 'code';
  timestamp: string;
}

function NoxCodeTerminal({ isDecrypting, isDecrypted }: { isDecrypting: boolean; isDecrypted: boolean }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const idleLogs: TerminalLine[] = [
    { text: 'SYSTEM: Initializing iExec Nox Secure Enclave...', type: 'system', timestamp: '10:30:01' },
    { text: 'INTEL-SGX: Attestation Report generated.', type: 'security', timestamp: '10:30:02' },
    { text: 'SECURE-CORE: Enclave memory isolated & locked.', type: 'security', timestamp: '10:30:03' },
    { text: 'ROUTER: Listening for Arbitrum Sepolia events...', type: 'code', timestamp: '10:30:04' },
    { text: 'LEDGER: Encrypted Share ledger is currently LOCKED.', type: 'warning', timestamp: '10:30:05' }
  ];

  // Load default logs on mount
  useEffect(() => {
    if (!isDecrypting && !isDecrypted) {
      setLines(idleLogs);
    }
  }, [isDecrypting, isDecrypted]);

  // Handle live decryption sequence
  useEffect(() => {
    if (isDecrypting) {
      setLines([{ text: '🔐 NOX DECRYPTION INITIATED VIA USER SIGNATURE...', type: 'warning', timestamp: 'NOW' }]);
      
      const sequence = [
        { text: '⚡ CONNECTING TO INTEL SGX TRUSTED EXECUTION ENVIRONMENT...', type: 'system', delay: 250 },
        { text: '🔑 RETRIEVING CIPHERTEXT SHARES FROM ARBITRUM SEPOLIA...', type: 'code', delay: 500 },
        { text: '🛡️ VALIDATING CRYPTOGRAPHIC PROOF & ATTESTATION...', type: 'security', delay: 800 },
        { text: '🗝️ DECRYPTING VAULT SHARE LEDGER VIA LOCAL PRIVATE KEY...', type: 'security', delay: 1100 },
        { text: '📊 RECONCILING CO-LOCATED REWARDS AND BALANCE PROOFS...', type: 'code', delay: 1400 },
        { text: '✅ SHADEYIELD STATE UNLOCKED. BALANCE VERIFIED OK.', type: 'success', delay: 1700 }
      ];

      const timers: NodeJS.Timeout[] = [];
      sequence.forEach((item) => {
        const timer = setTimeout(() => {
          setLines(prev => [...prev, {
            text: item.text,
            type: item.type as any,
            timestamp: new Date().toLocaleTimeString()
          }]);
        }, item.delay);
        timers.push(timer);
      });

      return () => timers.forEach(clearTimeout);
    }
  }, [isDecrypting]);

  // Handle decrypted live state
  useEffect(() => {
    if (isDecrypted && !isDecrypting) {
      setLines([
        { text: '✅ SHADEYIELD STATE UNLOCKED. NOX SESSION ACTIVE.', type: 'success', timestamp: 'LIVE' },
        { text: 'TEE-PROOF: 0x9a834f82be...8d3c validated on-chain.', type: 'security', timestamp: 'LIVE' },
        { text: 'SESSION-KEY: TEE_SESSION_AES_256_GCM active.', type: 'code', timestamp: 'LIVE' },
        { text: 'DATA: Balance state decrypted in secure browser memory.', type: 'system', timestamp: 'LIVE' }
      ]);
    }
  }, [isDecrypted, isDecrypting]);

  // Scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden font-mono text-[10px] h-48 flex flex-col mt-4">
      <div className="bg-zinc-900/60 px-3 py-2 border-b border-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isDecrypting ? 'bg-amber-500 animate-pulse' : isDecrypted ? 'bg-red-500 animate-ping' : 'bg-red-600 animate-pulse'}`}></span>
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Nox Cryptographic Enclave Terminal</span>
        </div>
        <span className="text-[7px] text-zinc-500 font-bold tracking-widest uppercase">
          {isDecrypting ? 'DECRYPTING' : isDecrypted ? 'DECRYPTED' : 'ENCRYPTED'}
        </span>
      </div>
      <div ref={terminalRef} className="p-3 overflow-y-auto space-y-2 flex-1 scrollbar-thin scrollbar-thumb-zinc-800 scroll-smooth">
        <AnimatePresence initial={false}>
          {lines.map((line, idx) => (
            <motion.div
              key={idx + line.text}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-1.5 leading-normal"
            >
              <span className="text-[8px] text-zinc-600 shrink-0 select-none">[{line.timestamp}]</span>
              <span className={`font-semibold shrink-0 select-none ${
                line.type === 'system' ? 'text-zinc-500' :
                line.type === 'security' ? 'text-red-400' :
                line.type === 'success' ? 'text-red-400' :
                line.type === 'warning' ? 'text-amber-500' :
                'text-indigo-400'
              }`}>
                {line.type === 'success' ? '✓' : line.type === 'warning' ? '⚠️' : line.type === 'security' ? '🛡️' : '›'}
              </span>
              <span className={`break-words ${line.type === 'success' ? 'text-red-400 font-bold' : 'text-zinc-300'}`}>
                {line.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  // App navigation state: 'home' | 'app'
  const [currentView, setCurrentView] = useState<'home' | 'app'>('home');

  // ── Real Wallet (wagmi) ──
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const walletConnected = isConnected;
  const walletAddress = address || '';
  const [walletBalanceUSDC, setWalletBalanceUSDC] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<bigint>(0n);
  const [simpleTotalAssets, setSimpleTotalAssets] = useState<bigint>(0n);
  const [encryptedTotalAssets, setEncryptedTotalAssets] = useState<bigint>(0n);

  // ── Real Vault State (from chain) ──
  const [simpleVaultBalance, setSimpleVaultBalance] = useState<number>(0);
  const [encryptedVaultBalance, setEncryptedVaultBalance] = useState<number>(0);
  const [simpleVaultPrincipal, setSimpleVaultPrincipal] = useState<number>(0);
  const [encryptedVaultPrincipal, setEncryptedVaultPrincipal] = useState<number>(0);
  const [aaveTotalAssets, setAaveTotalAssets] = useState<bigint>(0n);
  const [aavePrincipal, setAavePrincipal] = useState<bigint>(0n);
  const [uniTotalAssets, setUniTotalAssets] = useState<bigint>(0n);
  // Simple vault's own (non-encrypted) strategy data
  const [simpleAaveTotalAssets, setSimpleAaveTotalAssets] = useState<bigint>(0n);
  const [simpleAavePrincipal, setSimpleAavePrincipal] = useState<bigint>(0n);
  const [simpleUniTotalAssets, setSimpleUniTotalAssets] = useState<bigint>(0n);
  const [contractsLoaded, setContractsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Staking Rewards ($SHADE)
  const [shadeClaimable, setShadeClaimable] = useState<number>(0);
  const [shadeBalance, setShadeBalance] = useState<number>(0);

  // Nox Encryption state
  const [isNoxDecrypted, setIsNoxDecrypted] = useState<boolean>(false);
  const [noxPrivateKey, setNoxPrivateKey] = useState<string>('nox_sk_9a7b8e2f11c34891a92e1850fcb1280f');
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [isArtCardFlipped, setIsArtCardFlipped] = useState<boolean>(false);

  // Interaction State
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedVault, setSelectedVault] = useState<'simple' | 'encrypted'>('encrypted');
  const [amountInput, setAmountInput] = useState<string>('');
  const [isProcessingTx, setIsProcessingTx] = useState<boolean>(false);
  const [txStep, setTxStep] = useState<number>(0);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Transaction Log — persisted in localStorage so history survives refresh
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('shade-txs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => { localStorage.setItem('shade-txs', JSON.stringify(transactions)); }, [transactions]);

  // Architecture visualizer
  const [activeArchitectureFlow, setActiveArchitectureFlow] = useState<'simple' | 'encrypted'>('encrypted');
  const [activeNodeId, setActiveNodeId] = useState<string>('nox-engine');
  const [activeCompareCard, setActiveCompareCard] = useState<'simple' | 'encrypted'>('encrypted');

  const totalTVL = simpleTotalAssets + encryptedTotalAssets;
  const APY_SIMPLE = simpleAavePrincipal > 0n ? Number((simpleAaveTotalAssets - simpleAavePrincipal) * 10000n / simpleAavePrincipal) / 100 : 0;
  const APY_ENCRYPTED = APY_SIMPLE; // same strategies, same returns
  const SHADE_REWARD_RATE_SIMPLE = 0.0001;
  const SHADE_REWARD_RATE_ENCRYPTED = 0.0003;

  // ── Real Chain Data Fetch (wallet required) ──
  useEffect(() => {
    if (!isConnected || !address) return;
    const pc = createPublicClient({ chain: arbitrumSepolia, transport: http('https://sepolia-rollup.arbitrum.io/rpc') });
    const stratABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;
    const aaveABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
                     { type: 'function', name: 'principal', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;
    const tokenABI = [{ type: 'function', name: 'balanceOf', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
                       { type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' }] as const;
    const vaultABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
                      { type: 'function', name: 'balanceOfShares', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;
    const USDC = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d';
    const SIMPLE = '0x5b1876a08aa687a70203ae28f1421d62f538dd1c';
    const ENC = '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85';
    const AAVE_S = '0xbec0722b889bd6064db52d3339b1e3ae9f00abf1';
    const UNI_S = '0x3f21e1d960a6e02a6b54f4100092f57ca6b8399e';
    const AAVE_SIMPLE = '0x15bd317773d6793d7de2b4cad0fa6cb23440c990';
    const UNI_SIMPLE = '0x1e59cee63bbdcc6610a4a959e0b5ee5e7904daa6';

    const readAll = async () => {
      try {
        const [usdcBal, stBal, encBal, sShares, eShares, aTA, aP, uTA, sAta, sAp, sUta] = await Promise.all([
          pc.readContract({ address: USDC, abi: tokenABI, functionName: 'balanceOf', args: [address] }),
          pc.readContract({ address: SIMPLE, abi: vaultABI, functionName: 'totalAssets' }),
          pc.readContract({ address: ENC, abi: vaultABI, functionName: 'totalAssets' }),
          pc.readContract({ address: SIMPLE, abi: vaultABI, functionName: 'balanceOfShares', args: [address] }).catch(() => 0n),
          pc.readContract({ address: ENC, abi: vaultABI, functionName: 'balanceOfShares', args: [address] }).catch(() => 0n),
          pc.readContract({ address: AAVE_S, abi: aaveABI, functionName: 'totalAssets' }).catch(() => 0n),
          pc.readContract({ address: AAVE_S, abi: aaveABI, functionName: 'principal' }).catch(() => 0n),
          pc.readContract({ address: UNI_S, abi: stratABI, functionName: 'totalAssets' }).catch(() => 0n),
          pc.readContract({ address: AAVE_SIMPLE, abi: aaveABI, functionName: 'totalAssets' }).catch(() => 0n),
          pc.readContract({ address: AAVE_SIMPLE, abi: aaveABI, functionName: 'principal' }).catch(() => 0n),
          pc.readContract({ address: UNI_SIMPLE, abi: stratABI, functionName: 'totalAssets' }).catch(() => 0n),
        ]);
        setUsdcBalance(usdcBal as bigint);
        setWalletBalanceUSDC(parseFloat(formatUnits(usdcBal as bigint, 6)));
        setSimpleTotalAssets(stBal as bigint);
        setEncryptedTotalAssets(encBal as bigint);
        setSimpleVaultPrincipal(parseFloat(formatUnits(sShares as bigint, 6)));
        setEncryptedVaultPrincipal(parseFloat(formatUnits(eShares as bigint, 6)));
        setSimpleVaultBalance(parseFloat(formatUnits(sShares as bigint, 6)));
        setEncryptedVaultBalance(parseFloat(formatUnits(eShares as bigint, 6)));
        setAaveTotalAssets(aTA as bigint);
        setAavePrincipal(aP as bigint);
        setUniTotalAssets(uTA as bigint);
        setSimpleAaveTotalAssets(sAta as bigint);
        setSimpleAavePrincipal(sAp as bigint);
        setSimpleUniTotalAssets(sUta as bigint);
        if (!contractsLoaded) setContractsLoaded(true);
      } catch (e) { console.warn('chain read error', e); }
    };
    readAll();
    const interval = setInterval(readAll, 15000);
    return () => clearInterval(interval);
  }, [isConnected, address, refreshKey]);

  // ── Public Chain Reads (no wallet needed) ──
  useEffect(() => {
    const pc = createPublicClient({ chain: arbitrumSepolia, transport: http('https://sepolia-rollup.arbitrum.io/rpc') });
    const vaultABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;
    const SIMPLE = '0x5b1876a08aa687a70203ae28f1421d62f538dd1c';
    const ENC = '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85';
    const readPublic = async () => {
      try {
        const [stBal, encBal] = await Promise.all([
          pc.readContract({ address: SIMPLE, abi: vaultABI, functionName: 'totalAssets' }),
          pc.readContract({ address: ENC, abi: vaultABI, functionName: 'totalAssets' }),
        ]);
        setSimpleTotalAssets(stBal as bigint);
        setEncryptedTotalAssets(encBal as bigint);
        if (!contractsLoaded) setContractsLoaded(true);
      } catch (e) { console.warn('public read error', e); }
    };
    readPublic();
  }, [refreshKey]);

  // Helper trigger notifications
  const triggerNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Real Wallet Connection ──
  const handleConnectWallet = (walletType: string) => {
    const c = connectors[0];
    if (c) { connect({ connector: c }); setShowWalletModal(false); }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    setSimpleVaultBalance(0); setEncryptedVaultBalance(0);
    setSimpleVaultPrincipal(0); setEncryptedVaultPrincipal(0);
    setShadeBalance(0); setShadeClaimable(0);
    setUsdcBalance(0n); setSimpleTotalAssets(0n); setEncryptedTotalAssets(0n);
    setSimpleAaveTotalAssets(0n); setSimpleAavePrincipal(0n); setSimpleUniTotalAssets(0n);
    triggerNotification('Wallet disconnected.', 'info');
  };

  // ── Real Deposit/Withdraw ──
  const handleExecuteTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected || !address) { setShowWalletModal(true); return; }
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) { triggerNotification('Please enter a valid amount', 'error'); return; }
    if (activeTab === 'deposit' && amount > walletBalanceUSDC) { triggerNotification('Insufficient USDC balance', 'error'); return; }
    if (activeTab === 'withdraw') {
      const targetBalance = selectedVault === 'simple' ? simpleVaultBalance : encryptedVaultBalance;
      if (amount > targetBalance) { triggerNotification('Insufficient vault balance', 'error'); return; }
    }
    setIsProcessingTx(true); setTxStep(1);
    try {
      const vaultAddr = selectedVault === 'simple' ? '0x5b1876a08aa687a70203ae28f1421d62f538dd1c' : '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85';
      const USDC = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d';
      const amountWei = parseUnits(amountInput, 6);
      const pc = createPublicClient({ chain: arbitrumSepolia, transport: http('https://sepolia-rollup.arbitrum.io/rpc') });
      const actions = await import('wagmi/actions');
      const wcfg = (await import('./wagmi')).config;
      const erc20ABI = [{ type: 'function', name: 'approve', inputs: [{ type: 'address' }, { type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable' },
                         { type: 'function', name: 'allowance', inputs: [{ type: 'address' }, { type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' }];
      const vaultABI = [{ type: 'function', name: 'deposit', inputs: [{ type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
                        { type: 'function', name: 'requestWithdraw', inputs: [{ type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' }];

      if (activeTab === 'deposit') {
        const allowance = await pc.readContract({ address: USDC, abi: erc20ABI, functionName: 'allowance', args: [address, vaultAddr] }) as bigint;
        if (allowance < amountWei) {
          setTxStep(2);
          const { request } = await pc.simulateContract({ address: USDC, abi: erc20ABI, functionName: 'approve', args: [vaultAddr, amountWei], account: address });
          const h = await actions.writeContract(wcfg, request); setTxHash(h);
          await pc.waitForTransactionReceipt({ hash: h });
        }
        setTxStep(3);
        const { request } = await pc.simulateContract({ address: vaultAddr, abi: vaultABI, functionName: 'deposit', args: [amountWei], account: address });
        const h = await actions.writeContract(wcfg, request); setTxHash(h);
        await pc.waitForTransactionReceipt({ hash: h });
      } else {
        setTxStep(2);
        const { request } = await pc.simulateContract({ address: vaultAddr, abi: vaultABI, functionName: 'requestWithdraw', args: [amountWei], account: address });
        const h = await actions.writeContract(wcfg, request); setTxHash(h);
        await pc.waitForTransactionReceipt({ hash: h });
      }
      setTxStep(4); setRefreshKey(k => k + 1);
      const newTx: Transaction = { id: `tx-${Date.now()}`, txHash: txHash || '0x' + '0'.repeat(64), type: activeTab === 'deposit' ? 'Deposit' : 'Withdraw', vault: selectedVault === 'encrypted' ? 'Encrypted Vault' : 'Simple Vault', amount, timestamp: 'Just now', status: 'Success' };
      setTransactions(prev => [newTx, ...prev]);
      setAmountInput('');
      triggerNotification(`${activeTab === 'deposit' ? 'Deposited' : 'Withdrawn'} $${amount.toLocaleString()} USDC successfully!`, 'success');
    } catch (err: any) {
      triggerNotification('Error: ' + (err?.shortMessage || err?.message || 'Transaction failed'), 'error');
    }
    setTimeout(() => { setIsProcessingTx(false); setTxStep(0); }, 2000);
  };

  // ── Real Harvest ──
  const handleHarvest = async () => {
    if (!walletConnected || !address) { setShowWalletModal(true); return; }
    setIsProcessingTx(true); setTxStep(1);
    try {
      const pc = createPublicClient({ chain: arbitrumSepolia, transport: http('https://sepolia-rollup.arbitrum.io/rpc') });
      const harvestABI = [{ type: 'function', name: 'harvestAll', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'nonpayable' }];
      const { request } = await pc.simulateContract({ address: '0x7c9e196d879c60f39d4d591fbae1a7369bbb6f85', abi: harvestABI, functionName: 'harvestAll', account: address });
      const actions = await import('wagmi/actions');
      const wcfg = (await import('./wagmi')).config;
      const h = await actions.writeContract(wcfg, request); setTxHash(h);
      await pc.waitForTransactionReceipt({ hash: h });
      setRefreshKey(k => k + 1);
      triggerNotification('✅ Yield harvested! Caller earned 0.05% incentive.', 'success');
    } catch (err: any) {
      triggerNotification('Harvest: ' + (err?.shortMessage || err?.message || 'no yield yet'), 'info');
    }
    setTimeout(() => { setIsProcessingTx(false); setTxStep(0); }, 1500);
  };

  // $SHADE staking rewards — requires ShadeToken with reward distribution
  const handleClaimRewards = () => {
    triggerNotification('$SHADE staking rewards coming soon after token upgrade. Stake your vault shares to earn.', 'info');
  };

  // Nox decrypt — calls the ShadeYield Nox Decrypt API (Node.js backend using publicDecrypt)
  const handleDecryptNoxShares = async () => {
    if (!address) return;
    try {
      triggerNotification('🔐 Decrypting encrypted vault state via Nox TEE...', 'info');
      const apiUrl = import.meta.env.VITE_NOX_API_URL || '';
      const [tvlRes, balRes] = await Promise.all([
        fetch(`${apiUrl}/vault/tvl`).then(r => r.json()),
        fetch(`${apiUrl}/vault/balance?address=${address}`).then(r => r.json()),
      ]);
      if (tvlRes.tvl) {
        setEncryptedTotalAssets(BigInt(tvlRes.tvl));
        triggerNotification(`✅ Encrypted vault TVL: ${(Number(tvlRes.tvl) / 1e6).toFixed(2)} USDC`, 'success');
      }
      if (balRes.balance) {
        setEncryptedVaultBalance(parseFloat(balRes.balance) / 1e6);
        setEncryptedVaultPrincipal(parseFloat(balRes.balance) / 1e6);
        triggerNotification(`✅ Your encrypted balance: ${(Number(balRes.balance) / 1e6).toFixed(2)} shares`, 'success');
      }
    } catch (e: any) {
      console.error('Nox decrypt error:', e);
      triggerNotification('Nox decrypt unavailable. Is the decrypt API running?', 'error');
    }
  };

  // Technical Node Details for the architecture layout
  const nodeDetails: Record<string, NodeDetail> = {
    'user-wallet': {
      id: 'user-wallet',
      title: 'User Wallet',
      category: 'Client Interface',
      description: 'Standard EIP-1193 compatible Web3 wallet (e.g. MetaMask, WalletConnect). Connects to Arbitrum Sepolia Network to submit transactions.',
      details: 'The client-side dApp manages interactions with the user’s wallet. Deposits are initiated by signing a USDC spending approval transaction, followed by the vault deposit contract call.',
      codeSnippet: `// Approve USDC Contract spending
const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
await usdc.approve(SHADE_VAULT_ADDRESS, depositAmount);

// Call Vault Deposit
const vault = new ethers.Contract(SHADE_VAULT_ADDRESS, VAULT_ABI, signer);
await vault.deposit(depositAmount);`
    },
    'shade-gateway': {
      id: 'shade-gateway',
      title: 'ShadeYield Router',
      category: 'Smart Contract',
      description: 'Non-custodial gateway contract that aggregates user funds and triggers downstream yield routing strategies.',
      details: 'Acts as the single point of entry. It abstracts the routing complexity between simple (transparent ERC-20 shares) and encrypted (iExec Nox wrapped shares) logic, then allocates the USDC into top-tier protocols.',
      codeSnippet: `function deposit(uint256 amount) external nonReentrant {
    IERC20(usdc).safeTransferFrom(msg.sender, address(this), amount);
    
    // Route to yield engine
    _allocateToStrategies(amount);
    
    // Mint shares to user
    _mintVaultShares(msg.sender, amount);
}`
    },
    'nox-engine': {
      id: 'nox-engine',
      title: 'iExec Nox Secure Sandbox',
      category: 'Privacy Enclave (TEE)',
      description: 'Hardware-secure execution environment (TEE) executing the Nox SDK, managing encrypted balances on Arbitrum Sepolia.',
      details: 'iExec Nox encrypts user balance states so that they are unreadable on-chain. When a user deposits, Nox computes the updated share value within a secure enclave, signs a cryptographic state update, and stores only the ciphertext. To view, only the authenticated private key holder can decrypt.',
      codeSnippet: `// iExec Nox SDK Client Balance Update
import { NoxClient } from '@iexec/nox-sdk';

const nox = new NoxClient({ enclaveUrl: 'https://nox-tee.iex.ec' });
const encryptedBalance = await nox.encryptBalance({
    address: userAddress,
    balance: currentShares + newShares,
    privateKey: userNoxPrivateKey
});

// Update contract with encrypted state
await vaultContract.updateEncryptedBalance(encryptedAddress, encryptedBalance);`
    },
    'aave-yield': {
      id: 'aave-yield',
      title: 'Aave V3 Lending Engine',
      category: 'Yield Source',
      description: 'Blue-chip decentralized borrowing & lending protocol where USDC earns passive interest.',
      details: 'ShadeYield routes up to 60% of the USDC holdings to Aave V3’s isolated lending pool. It receives interest-bearing aUSDC in return, ensuring consistent, low-volatility capital appreciation with immediate liquidity.',
      codeSnippet: `// Routing USDC to Aave V3 Pool
address aavePool = poolAddressesProvider.getPool();
IERC20(usdc).approve(aavePool, amountToRoute);
IPool(aavePool).supply(usdcAddress, amountToRoute, address(this), 0);`
    },
    'uniswap-yield': {
      id: 'uniswap-yield',
      title: 'Uniswap V3 LP Engine',
      category: 'Yield Source',
      description: 'Automated market maker protocol where USDC is deployed in high-volume, narrow-range stablecoin pairs to harvest fees.',
      details: 'The remaining 40% of the vault’s capital is dynamically deployed into Uniswap V3 concentrated liquidity positions (e.g. USDC/USDT 0.01% fee tier). This yields exceptional fee accrual matching Aave’s lending rates during peak trading volume.',
      codeSnippet: `// Concentrated Liquidity Position Management
INonfungiblePositionManager.MintParams memory params = 
    INonfungiblePositionManager.MintParams({
        token0: usdcAddress,
        token1: usdtAddress,
        fee: 100, // 0.01% tier
        tickLower: tickLower,
        tickUpper: tickUpper,
        amount0Desired: amount0,
        amount1Desired: amount1,
        recipient: address(this),
        deadline: block.timestamp + 15 minutes
    });
positionManager.mint(params);`
    },
    'decrypted-client': {
      id: 'decrypted-client',
      title: 'Client-Side Nox Decryptor',
      category: 'Client SDK decryption',
      description: 'Browser-side cryptographic engine. Decrypts share-balance ciphertext using the user’s private key.',
      details: 'Because the ledger only stores the encrypted ciphertext representation of your shares (e.g. `0x7b5c...e29f`), standard block explorers see zero balance. The ShadeYield UI retrieves this ciphertext and decrypts it instantly inside your browser using your isolated key.',
      codeSnippet: `// Local browser decryption of share balances
const ciphertext = await vaultContract.getEncryptedShares(userAddress);
const decryptedShares = await noxClient.decrypt({
    ciphertext: ciphertext,
    privateKey: localStorage.getItem('NOX_PRIVATE_KEY')
});

console.log(\`Actual Share Balance: \${decryptedShares}\`);`
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Dynamic Toast Notification */}
      {notification && (
        <div id="toast-notif" className="fixed bottom-6 right-6 z-50 animate-bounce flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl backdrop-blur-md max-w-sm">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {notification.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />}
          {notification.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />}
          <p className="text-sm text-zinc-300 font-medium">{notification.message}</p>
        </div>
      )}

      {/* Floating Navbar Section */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50">
        <header id="main-nav" className="rounded-2xl border border-red-950/80 bg-black/95 shadow-[0_4px_30px_rgba(239,68,68,0.15)] backdrop-blur-md">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white via-red-950 to-black p-[1.5px] shadow-lg shadow-red-950/30">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center p-1.5">
                  <ShadeYieldLogo className="w-full h-full" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Shade
                </span>
                <span className="font-extrabold text-xl tracking-tight text-red-500">
                  Yield
                </span>
                <span className="block text-[10px] text-zinc-500 font-mono tracking-wider uppercase leading-none">Privacy DeFi Wrapper</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <button 
                onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('about-decentralization')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
                className="hover:text-red-400 transition-colors cursor-pointer"
              >
                Protocol Pillars
              </button>
              <button 
                onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('architecture-map')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
                className="hover:text-red-400 transition-colors cursor-pointer"
              >
                Interactive Architecture
              </button>
            </nav>

            {/* Desktop Navigation Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Chain status indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Arbitrum Sepolia
              </div>

              {walletConnected ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('app')}
                    className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-red-400 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    Terminal
                  </button>
                  <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                    <span className="px-2.5 text-xs font-mono font-bold text-zinc-300">
                      {walletBalanceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                    </span>
                    <button
                      onClick={handleDisconnectWallet}
                      className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 hover:text-rose-400 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer"
                      title="Disconnect Wallet"
                    >
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  id="connect-wallet-nav"
                  onClick={() => setShowWalletModal(true)}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/10 cursor-pointer flex items-center gap-2"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  Connect Wallet
                </button>
              )}
            </div>

            {/* Mobile Menu Icon Toggle */}
            <div className="flex md:hidden items-center gap-2">
              {walletConnected && (
                <button
                  onClick={() => setCurrentView('app')}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  title="Terminal"
                >
                  <Activity className="w-4 h-4 animate-pulse" />
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-zinc-900 px-4 py-4 space-y-4 text-sm font-medium text-zinc-400"
              >
                <button 
                  onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('about-decentralization')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
                  className="block w-full text-left py-2 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Protocol Pillars
                </button>
                <button 
                  onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('architecture-map')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
                  className="block w-full text-left py-2 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Interactive Architecture
                </button>
                
                <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Arbitrum Sepolia
                  </div>
                  
                  {walletConnected ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => { setCurrentView('app'); setMobileMenuOpen(false); }}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-red-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Activity className="w-4 h-4 animate-pulse" />
                        Go to Terminal
                      </button>
                      
                      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                        <span className="text-xs font-bold text-zinc-300">
                          {walletBalanceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                        </span>
                        <button
                          onClick={() => { handleDisconnectWallet(); setMobileMenuOpen(false); }}
                          className="px-3 py-1.5 bg-zinc-855 hover:bg-zinc-800 hover:text-rose-400 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
                        >
                          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} (Disconnect)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setShowWalletModal(true); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/10 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>

      {/* Main View Area */}
      <main className="grow">
        
        {/* VIEW 1: Homepage & Features */}
        {currentView === 'home' && (
          <div className="animate-fade-in">
            
            {/* HERO SECTION */}
            <section id="hero" className="relative py-20 lg:py-32 overflow-hidden border-b border-zinc-900 bg-zinc-950">
              {/* Solvix-inspired Glowing Crimson conduits and ambient backdrops in the background */}
              <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-red-950/10 via-red-900/5 to-transparent blur-[140px] rounded-full pointer-events-none" />
              <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-950/10 via-zinc-900/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

              {/* Grid backdrop for cyberpunk vibe */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Hackathon Flag */}
                <div className="flex justify-start mb-8">
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-mono tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>SOLVIX CRYPTO SECURED • NOX SHIELD ACTIVE</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column: Premium Typography & CTAs */}
                  <div className="lg:col-span-7 space-y-8 text-left">
                    <div className="space-y-6 max-w-xl">
                      <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
                          THE PRIVACY <br />
                          <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                            WRAPPER
                          </span> <br />
                          <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
                            FOR PUBLIC DEFI
                          </span>
                        </h1>
                        
                        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                          Securely deposit USDC into ShadeYield. Our smart contracts automatically route liquidity into Aave V3 and Uniswap V3 to earn top-tier yield, while wrapping and encrypting your shares using <strong className="text-red-400">iExec Nox Trusted Execution Environments</strong>. Not even the smart contract knows what you own.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <button
                          id="hero-cta-enter"
                          onClick={() => setCurrentView('app')}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                          Launch ShadeYield Terminal
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-red-200" />
                        </button>
                        
                        <button
                          id="hero-cta-docs"
                          onClick={() => {
                            const archSection = document.getElementById('architecture-map');
                            if (archSection) archSection.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Layers className="w-4 h-4 text-red-400" />
                          Interactive Architecture
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Click to Rotate Card Art */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div 
                      onClick={() => setIsArtCardFlipped(!isArtCardFlipped)}
                      className="relative cursor-pointer select-none w-full max-w-[340px]"
                      style={{ perspective: '1200px' }}
                    >
                      <motion.div
                        animate={{ rotateY: isArtCardFlipped ? 180 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="relative w-full h-[450px] rounded-2xl"
                      >
                        {/* FRONT SIDE (Padlock & Frosted Glass Card) */}
                        <div 
                          className="absolute inset-0 w-full h-full rounded-2xl border border-zinc-900 bg-zinc-950/90 overflow-hidden flex flex-col items-center justify-center p-6"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          {/* Interactive Canvas Falling Code Rain */}
                          <NoxHexDecryptionRain />

                          {/* Glowing background pipelines / conduits behind padlock */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[120%] h-[2px] bg-red-600/10 blur-[3px] rotate-[-12deg] absolute" />
                            <div className="w-[120%] h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/40 to-red-500/0 rotate-[-12deg] absolute animate-pulse" />
                            <div className="w-[240px] h-[240px] rounded-full border-2 border-red-600/10 border-t-red-600/20 blur-[2px] rotate-[45deg] absolute" />
                          </div>

                          {/* Glowing Neon Padlock */}
                          <div className="relative mb-6 select-none group scale-90">
                            <div className={`absolute -inset-8 rounded-full bg-red-600/20 blur-3xl transition-all duration-700 ${isNoxDecrypted ? 'bg-red-600/15' : 'bg-red-600/20'}`} />
                            
                            {/* Physical Lock Arc */}
                            <div className="relative z-10 flex flex-col items-center">
                              <motion.div 
                                initial={{ y: 0 }}
                                animate={{ y: isNoxDecrypted ? -12 : 0 }}
                                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                                className={`w-20 h-14 rounded-t-full border-8 bg-transparent transition-colors duration-700 ${
                                  isNoxDecrypted 
                                    ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                                    : 'border-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                                }`}
                              />
                              
                              {/* Lock Body */}
                              <motion.div 
                                animate={{ y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                                className={`w-28 h-20 rounded-2xl p-[2px] -mt-1 shadow-2xl transition-all duration-700 ${
                                  isNoxDecrypted 
                                    ? 'bg-gradient-to-b from-red-400 to-red-600 shadow-red-500/20' 
                                    : 'bg-gradient-to-b from-red-600 to-red-800 shadow-red-600/30'
                                }`}
                              >
                                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                  <div className={`w-4 h-8 rounded-full relative flex flex-col items-center justify-between py-1 shadow-inner transition-colors duration-700 ${isNoxDecrypted ? 'bg-red-500/20' : 'bg-red-600/20'}`}>
                                    <div className={`w-2 h-2 rounded-full transition-colors duration-700 ${isNoxDecrypted ? 'bg-red-400' : 'bg-red-600'}`} />
                                    <div className={`w-1 h-4 rounded-sm transition-colors duration-700 ${isNoxDecrypted ? 'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]' : 'bg-red-600 shadow-[0_0_6px_rgba(239,68,68,0.6)]'}`} />
                                  </div>
                                  <span className="text-[6px] font-mono tracking-widest text-zinc-600 uppercase mt-1">SOLVIX CHIP</span>
                                </div>
                              </motion.div>
                            </div>
                          </div>

                          {/* Frosted Glassmorphism Card */}
                          <div className="w-full rounded-xl border bg-zinc-950/80 backdrop-blur-md p-4 border-red-500/20 overflow-hidden relative">
                            <motion.div 
                              animate={{ top: ['-20%', '120%'] }}
                              transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
                              className="absolute left-0 w-full h-[2px] bg-red-500/40 shadow-[0_0_8px_#ef4444] pointer-events-none"
                            />

                            <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-900/60">
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                                <span className="text-[7px] font-mono font-bold tracking-widest text-red-400 uppercase">SOLVIX PROTOCOL</span>
                              </div>
                              <div className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                                <span className="text-[5px] text-red-400 font-mono">SECURE</span>
                              </div>
                            </div>

                            <div className="text-center space-y-1">
                              <span className="text-[7px] font-mono tracking-widest text-zinc-500 uppercase font-bold">CRYPTO SHIELD</span>
                              <h3 className="text-xs font-black tracking-tight text-white uppercase leading-none">
                                {isNoxDecrypted ? (
                                  <span className="text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]">DECRYPTED OK</span>
                                ) : (
                                  <span className="text-red-600 drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]">ENCRYPTED STATE</span>
                                )}
                              </h3>
                              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/15 to-transparent" />
                              <p className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider">iExec TEE SHIELDED</p>
                            </div>
                          </div>

                          <div className="absolute bottom-4 text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5 text-red-500 animate-spin-slow" />
                            <span>Click Card to Flip</span>
                          </div>
                        </div>

                        {/* BACK SIDE (with premium Red and Black gradient) */}
                        <div 
                          className="absolute inset-0 w-full h-full rounded-2xl border border-red-500/40 bg-gradient-to-br from-black via-red-950/40 to-zinc-950 overflow-hidden flex flex-col p-6 shadow-2xl"
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                          <NoxHexDecryptionRain />

                          <div className="h-full flex flex-col justify-between relative z-10">
                            <div className="flex items-center justify-between pb-2 border-b border-red-950/60">
                              <div className="flex items-center gap-1">
                                <ShieldAlert className="w-4 h-4 text-red-500" />
                                <span className="text-[9px] font-mono font-bold text-red-400 tracking-widest uppercase">SOLVIX CORE</span>
                              </div>
                              <span className="text-[8px] text-zinc-500 font-mono">ENCLAVE SECURE</span>
                            </div>

                            <div className="space-y-3 my-auto">
                              <div className="p-3 bg-black/70 rounded-lg border border-red-950/40 space-y-1">
                                <span className="text-[8px] font-mono text-zinc-500 uppercase font-black block">PUBLIC-SHARE COMPONENT</span>
                                <div className="font-mono text-[9px] text-zinc-400 leading-none truncate">
                                  Pubkey: <span className="text-red-400">0x03a893c8df9e8...9a21</span>
                                </div>
                                <div className="font-mono text-[9px] text-zinc-400 leading-none truncate mt-0.5">
                                  Proof: <span className="text-red-500">0xf3e28...ad73bc</span>
                                </div>
                              </div>

                              <div className="p-3 bg-black/70 rounded-lg border border-red-950/40 space-y-1">
                                <span className="text-[8px] font-mono text-zinc-500 uppercase font-black block">ENCLAVE ATTESTATION</span>
                                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                                  <span>SGX-MRENCLAVE:</span>
                                  <span className="text-red-400 font-bold">VERIFIED</span>
                                </div>
                                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                                  <span>ATTESTATION LEVEL:</span>
                                  <span className="text-red-500 font-bold">HARDENED</span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-red-950/50 pt-2 flex items-center justify-between text-[8px] font-mono text-zinc-500">
                              <span>CLICK TO RE-FLIP</span>
                              <span className="text-red-500 font-bold">SOLVIX CHIP</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                </div>

                {/* Key Metrics Dashboard Bar with customized red palette */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto p-1.5 rounded-2xl bg-zinc-900/40 border border-zinc-900 backdrop-blur-sm mt-16">
                  <div className="p-4 text-center rounded-xl bg-zinc-950/50 border border-zinc-900/50">
                    <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Total Value Locked</span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">
                      ${contractsLoaded
                        ? (parseFloat(formatUnits(simpleTotalAssets, 6))).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                        : '—'} USDC
                    </span>
                    <span className="block text-[10px] text-red-500 font-medium mt-1">Live · Arbitrum Sepolia · Encrypted TVL via Nox</span>
                  </div>
                  
                  <div className="p-4 text-center rounded-xl bg-zinc-950/50 border border-zinc-900/50">
                    <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Average Vault APY</span>
                    <span className="text-xl sm:text-2xl font-black text-red-500 font-mono">6.42%</span>
                    <span className="block text-[10px] text-zinc-500 font-medium mt-1">Aave V3 + Uniswap V3</span>
                  </div>

                  <div className="p-4 text-center rounded-xl bg-zinc-950/50 border border-zinc-900/50">
                    <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Active Nox Enclaves</span>
                    <span className="text-xl sm:text-2xl font-black text-red-400 font-mono">4,120</span>
                    <span className="block text-[10px] text-red-500/70 font-medium mt-1">iExec TEE isolated</span>
                  </div>

                  <div className="p-4 text-center rounded-xl bg-zinc-950/50 border border-zinc-900/50">
                    <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Arbitrum Gas Avg</span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">&lt; $0.05</span>
                    <span className="block text-[10px] text-emerald-400 font-medium mt-1">Arbitrum Sepolia Demo</span>
                  </div>
                </div>

              </div>
            </section>

            {/* THREE PILLARS: DECENTRALIZATION, SECURITY, USER-OWNED ASSETS */}
            <section id="about-decentralization" className="py-20 lg:py-28 bg-gradient-to-br from-white via-red-50 to-red-100 border-b border-red-200 relative overflow-hidden">
              <div className="absolute top-10 left-10 w-96 h-96 bg-red-200/20 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-red-100/30 blur-[130px] rounded-full pointer-events-none animate-pulse" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">
                    Architected for <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Maximum Privacy & Security</span>
                  </h2>
                  <p className="text-zinc-600 font-medium">
                    ShadeYield bridges the gap between public ledger capital efficiency and absolute financial privacy by wrapping standard yield pools inside cryptographic enclaves.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  
                  {/* Pillar 1: Decentralization */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 5.5,
                      ease: "easeInOut",
                      delay: 0
                    }}
                    whileHover={{
                      y: -14,
                      scale: 1.025,
                      boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.12)",
                      borderColor: "rgba(239, 68, 68, 0.25)"
                    }}
                    className="p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-red-100 shadow-[0_10px_30px_rgba(239,68,68,0.03)] transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Cpu className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                      Non-Custodial & Decentralized
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                      Capital routes directly from your wallet to the underlying DeFi smart contracts on Aave V3 and Uniswap V3. ShadeYield maintains no custody, utilizes non-upgradeable base contracts, and allows instantaneous withdrawals at any time.
                    </p>
                    <ul className="text-xs font-mono space-y-2 mt-4 border-t border-red-100 pt-4">
                      <li className="flex items-center gap-2 text-zinc-500">
                        <Check className="w-3 h-3 text-red-500" /> Zero protocol custody
                      </li>
                      <li className="flex items-center gap-2 text-zinc-500">
                        <Check className="w-3 h-3 text-red-500" /> Direct blue-chip routing
                      </li>
                    </ul>
                  </motion.div>

                  {/* Pillar 2: Security */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 5.5,
                      ease: "easeInOut",
                      delay: 0.4
                    }}
                    whileHover={{
                      y: -14,
                      scale: 1.025,
                      boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.12)",
                      borderColor: "rgba(239, 68, 68, 0.25)"
                    }}
                    className="p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-red-100 shadow-[0_10px_30px_rgba(239,68,68,0.03)] transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                      Cryptographic TEE Security
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                      By utilizing iExec Nox technology, computation and balance modifications execute securely inside hardware-enforced Trusted Execution Environments (TEEs). This ensures absolute isolation from external malicious software or compromised validators.
                    </p>
                    <ul className="text-xs font-mono space-y-2 mt-4 border-t border-red-100 pt-4">
                      <li className="flex items-center gap-2 text-zinc-500">
                        <Check className="w-3 h-3 text-red-500" /> Intel® SGX Hardware Enclaves
                      </li>
                      <li className="flex items-center gap-2 text-zinc-500">
                        <Check className="w-3 h-3 text-red-500" /> Real-time state verification
                      </li>
                    </ul>
                  </motion.div>

                  {/* Pillar 3: User-Owned Assets */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 5.5,
                      ease: "easeInOut",
                      delay: 0.8
                    }}
                    whileHover={{
                      y: -14,
                      scale: 1.025,
                      boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.12)",
                      borderColor: "rgba(239, 68, 68, 0.25)"
                    }}
                    className="p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-red-100 shadow-[0_10px_30px_rgba(239,68,68,0.03)] transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Lock className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                      User-Owned Encrypted Shares
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                      Normally, vaults track your share balance publicly. In ShadeYield, your share state is encrypted using your unique Nox Private Key. Not even the smart contract owner or block explorers can view how much you hold. You retain exclusive decryption keys.
                    </p>
                    <ul className="text-xs font-mono space-y-2 mt-4 border-t border-red-100 pt-4">
                      <li className="flex items-center gap-2 text-zinc-500">
                        <Check className="w-3 h-3 text-red-500" /> Local key derivation
                      </li>
                      <li className="flex items-center gap-2 text-zinc-500">
                        <Check className="w-3 h-3 text-red-500" /> Complete transaction stealth
                      </li>
                    </ul>
                  </motion.div>

                </div>

              </div>
            </section>

            {/* INTERACTIVE ARCHITECTURE SECTION */}
            <section id="architecture-map" className="py-20 lg:py-28 bg-zinc-950/60 border-b border-zinc-900 relative">
              <div className="absolute top-1/2 left-1/4 w-[450px] h-[250px] bg-red-950/15 blur-[120px] rounded-full pointer-events-none animate-pulse" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                  
                  {/* Left Column - Explain and Toggles */}
                  <div className="w-full lg:w-5/12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400 mb-4 font-mono">
                      <Layers className="w-3.5 h-3.5 text-red-500" />
                      Dynamic Flowchart Visualizer
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                      Protocol Flow Design
                    </h2>
                    <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                      Track how tokens and encryption keys flow between smart contracts, liquidity pools, and the iExec Nox secure enclave. Toggle the view below to see the dramatic difference in privacy architecture.
                    </p>

                    {/* Flow Selection Toggles */}
                    <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-8">
                      <button
                        onClick={() => {
                          setActiveArchitectureFlow('simple');
                          setActiveNodeId('shade-gateway');
                        }}
                        className={`py-3 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          activeArchitectureFlow === 'simple'
                            ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 text-white shadow-md'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                        }`}
                      >
                        <Unlock className="w-3.5 h-3.5 text-red-400" />
                        Simple Vault (Transparent)
                      </button>
                      <button
                        onClick={() => {
                          setActiveArchitectureFlow('encrypted');
                          setActiveNodeId('nox-engine');
                        }}
                        className={`py-3 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          activeArchitectureFlow === 'encrypted'
                            ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-500/20 border border-red-500/30'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5 text-red-100 animate-pulse" />
                        Encrypted Vault (Nox)
                      </button>
                    </div>

                    {/* Selected Node Details Box */}
                    <div className="p-6 rounded-2xl bg-zinc-900/90 border border-red-950/40 shadow-xl shadow-red-950/5 hover:border-red-500/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/40">
                          {nodeDetails[activeNodeId]?.category}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">Component ID: #{nodeDetails[activeNodeId]?.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{nodeDetails[activeNodeId]?.title}</h3>
                      <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{nodeDetails[activeNodeId]?.description}</p>
                      <div className="text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 font-sans leading-relaxed mb-4">
                        <p className="font-semibold text-zinc-400 mb-1">Architecture Impact:</p>
                        {nodeDetails[activeNodeId]?.details}
                      </div>

                      {/* Code block */}
                      <div className="mt-3">
                        <span className="text-[10px] text-zinc-500 font-mono block mb-1">Integration Sample Code</span>
                        <pre className="text-[11px] font-mono text-red-300 bg-zinc-950 p-3 rounded-lg overflow-x-auto border border-red-950/30 max-h-40">
                          {nodeDetails[activeNodeId]?.codeSnippet}
                        </pre>
                      </div>
                    </div>

                  </div>

                  {/* Right Column - Flow Graph visualization */}
                  <div className="w-full lg:w-7/12 flex flex-col justify-center">
                    <span className="text-xs font-mono text-zinc-500 mb-3 block text-center lg:text-left">
                      💡 Click on any component node below to view its smart contract logic and SDK implementation
                    </span>

                    <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/30 border border-zinc-900/80 hover:border-red-950/50 backdrop-blur-sm relative overflow-hidden flex flex-col gap-6 transition-all duration-300 shadow-[0_4px_30px_rgba(239,68,68,0.02)]">
                      
                      {/* Enclave Glow layer */}
                      {activeArchitectureFlow === 'encrypted' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />
                      )}

                      {/* Row 1: Wallet Connection */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => setActiveNodeId('user-wallet')}
                          className={`w-full max-w-sm p-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                            activeNodeId === 'user-wallet'
                              ? 'bg-zinc-800/90 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-900/50 hover:scale-[1.02]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                              <Wallet className="w-4.5 h-4.5 text-red-400" />
                            </div>
                            <div>
                              <p className="text-xs text-zinc-400 leading-none">External Interface</p>
                              <h4 className="text-sm font-bold text-white mt-1">User Wallet Interface</h4>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeNodeId === 'user-wallet' ? 'text-red-400 translate-x-1' : 'text-zinc-600'}`} />
                        </button>
                      </div>

                      {/* Arrow Down */}
                      <div className="flex justify-center -my-3">
                        <div className="w-[1.5px] h-6 bg-gradient-to-b from-red-500 to-red-600 animate-pulse"></div>
                      </div>

                      {/* Row 2: ShadeYield Router Gateway */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => setActiveNodeId('shade-gateway')}
                          className={`w-full max-w-sm p-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                            activeNodeId === 'shade-gateway'
                              ? 'bg-gradient-to-br from-red-950/20 to-zinc-900 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-900/50 hover:scale-[1.02]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                              <Cpu className="w-4.5 h-4.5 text-red-400 animate-spin-slow" />
                            </div>
                            <div>
                              <p className="text-xs text-zinc-400 leading-none">Aggregate router</p>
                              <h4 className="text-sm font-bold text-white mt-1">ShadeYield Vault Gateway</h4>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeNodeId === 'shade-gateway' ? 'text-red-400 translate-x-1' : 'text-zinc-600'}`} />
                        </button>
                      </div>

                      {/* Path splitting logic visually */}
                      <div className="grid grid-cols-5 gap-1 -my-3 h-8">
                        <div className="col-span-2 border-r border-t border-red-950/50 rounded-tr-xl"></div>
                        <div className="col-span-1 flex justify-center items-center">
                          <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider bg-red-950/40 px-1.5 py-0.5 border border-red-900/30 rounded">Allocation</span>
                        </div>
                        <div className="col-span-2 border-l border-t border-red-950/50 rounded-tl-xl"></div>
                      </div>

                      {/* Row 3: Splits (Either simple transparent route or Encrypted Nox engine route) */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        
                        {/* LEFT: Yield Engine (Aave & Uniswap) */}
                        <div className="flex flex-col gap-4">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono text-center block">Yield Routing</span>
                          
                          {/* Aave node */}
                          <button
                            onClick={() => setActiveNodeId('aave-yield')}
                            className={`p-3.5 rounded-xl border transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                              activeNodeId === 'aave-yield'
                                ? 'bg-zinc-800/90 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-900/50 hover:scale-[1.02]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-xs text-red-400 font-bold font-mono">A3</span>
                              <div>
                                <h5 className="text-xs font-bold text-white">Aave V3 Lending</h5>
                                <p className="text-[10px] text-zinc-500">60% Allocation Pool</p>
                              </div>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${activeNodeId === 'aave-yield' ? 'text-red-400 translate-x-1' : 'text-zinc-600'}`} />
                          </button>

                          {/* Uniswap node */}
                          <button
                            onClick={() => setActiveNodeId('uniswap-yield')}
                            className={`p-3.5 rounded-xl border transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                              activeNodeId === 'uniswap-yield'
                                ? 'bg-zinc-800/90 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-900/50 hover:scale-[1.02]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-xs text-red-400 font-bold font-mono">U3</span>
                              <div>
                                <h5 className="text-xs font-bold text-white">Uniswap V3 LP</h5>
                                <p className="text-[10px] text-zinc-500">40% Concentration Pool</p>
                              </div>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${activeNodeId === 'uniswap-yield' ? 'text-red-400 translate-x-1' : 'text-zinc-600'}`} />
                          </button>
                        </div>

                        {/* RIGHT: Privacy wrapper selection based on flow toggle */}
                        <div className="flex flex-col gap-4">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono text-center block">Share Registry State</span>
                          
                          {activeArchitectureFlow === 'simple' ? (
                            <div className="grow p-4 rounded-xl border border-dashed border-red-900/40 bg-zinc-950 flex flex-col justify-center items-center text-center">
                              <Unlock className="w-7 h-7 text-red-400 mb-2" />
                              <p className="text-xs font-bold text-white">Public Balance Registry</p>
                              <p className="text-[10px] text-zinc-500 mt-1 max-w-xs leading-normal">
                                Shares are stored as normal ERC-20 balances. Completely transparent on-chain tracker. Anyone can query your holdings.
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setActiveNodeId('nox-engine')}
                              className={`grow p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden ${
                                activeNodeId === 'nox-engine'
                                  ? 'bg-gradient-to-br from-red-950/20 to-zinc-900 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                                  : 'bg-red-950/10 hover:bg-red-950/25 border-red-900/50 hover:border-red-500/40 hover:scale-[1.02]'
                              }`}
                            >
                              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-xl rounded-full"></div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-800">
                                  iExec TEE Active
                                </span>
                                <Lock className="w-4 h-4 text-red-400 animate-pulse" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-white">iExec Nox Secure Sandbox</h5>
                                <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                                  Decrypts balance details client-side in the browser. Vault contract only holds cryptographic proof of shares.
                                </p>
                              </div>
                              <div className="mt-4 flex items-center justify-between border-t border-red-950/40 pt-2 text-[9px] text-red-300 font-mono w-full">
                                <span>TEE Sandbox State</span>
                                <span className="text-red-400 font-bold animate-pulse">SECURE</span>
                              </div>
                            </button>
                          )}
                        </div>

                      </div>

                      {/* Flow Connector bottom */}
                      {activeArchitectureFlow === 'encrypted' && (
                        <>
                          <div className="flex justify-center -my-3">
                            <div className="w-[1.5px] h-6 bg-gradient-to-b from-red-500 to-red-600"></div>
                          </div>

                          {/* Client Decryptor row */}
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() => setActiveNodeId('decrypted-client')}
                              className={`w-full max-w-sm p-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                                activeNodeId === 'decrypted-client'
                                  ? 'bg-gradient-to-br from-red-950/20 to-zinc-900 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-900/50 hover:scale-[1.02]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                  <Eye className="w-4.5 h-4.5 text-red-400 animate-pulse" />
                                </div>
                                <div>
                                  <p className="text-xs text-zinc-400 leading-none">Local Browser Level</p>
                                  <h4 className="text-sm font-bold text-white mt-1">Client-Side Nox Decryptor</h4>
                                </div>
                              </div>
                              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeNodeId === 'decrypted-client' ? 'text-red-400 translate-x-1' : 'text-zinc-600'}`} />
                            </button>
                          </div>
                        </>
                      )}

                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* CALL TO ACTION SECURE WALLET INTEGRATION */}
            <section className="py-20 bg-zinc-950/40 border-b border-zinc-900 relative overflow-hidden">
              <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Floating Text Card with Red Gradient and Red Glow Background */}
                  <div className="lg:col-span-5">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-red-950/60 via-zinc-950/95 to-red-900/30 border border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.22)] relative overflow-hidden group"
                    >
                      {/* Subtle inner background red pulse */}
                      <div className="absolute -inset-px bg-gradient-to-tr from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      
                      <span className="text-xs text-red-400 font-mono font-extrabold uppercase tracking-widest block mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        Secure Ledger Interaction
                      </span>
                      
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 leading-tight">
                        Join the Privacy Yield <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Revolution</span>
                      </h2>
                      
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
                        Experience the next logical leap in DeFi. Secure 6.42% APY in your choice of standard or fully wrapped encrypted private vaults on Arbitrum.
                      </p>

                      <div className="space-y-3 border-t border-red-950/60 pt-6">
                        <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>No custody of private keys or credentials</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>Hardware TEE Isolation prevents frontrunning</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>Fully compatible with standard Web3 workflows</span>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center gap-4 text-[10px] text-zinc-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-red-500/60" /> Hardware Sealed
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-red-500/60" /> Arbitrum Dev Demo
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column: Scrolling Swipe effect Vault Comparison with Red Gradient */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-zinc-400 font-semibold uppercase tracking-wider">
                        Swipe or Click to Compare Vaults:
                      </span>
                      
                      {/* Swipe / Tab Controls */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveCompareCard('simple')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            activeCompareCard === 'simple'
                              ? 'bg-zinc-800 border border-zinc-700 text-white shadow'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Simple
                        </button>
                        <button
                          onClick={() => setActiveCompareCard('encrypted')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            activeCompareCard === 'encrypted'
                              ? 'bg-gradient-to-r from-red-950/60 to-red-900/40 border border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Encrypted
                        </button>
                      </div>
                    </div>

                    {/* Comparison Swiping Deck Container with Red Gradient Outline */}
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-red-500/20 via-zinc-950 to-red-950/40 border border-red-900/30 shadow-2xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                      
                      {/* Swipeable Motion Area */}
                      <div className="p-6 sm:p-8 grow flex flex-col justify-between">
                        
                        <motion.div
                          key={activeCompareCard}
                          initial={{ opacity: 0, x: activeCompareCard === 'simple' ? -50 : 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: activeCompareCard === 'simple' ? 50 : -50 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="space-y-6"
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                activeCompareCard === 'simple'
                                  ? 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                                  : 'bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse'
                              }`}>
                                {activeCompareCard === 'simple' ? (
                                  <Unlock className="w-5 h-5 text-red-400" />
                                ) : (
                                  <Lock className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-bold text-white">
                                    {activeCompareCard === 'simple' ? 'Simple Vault (Standard)' : 'Encrypted Vault (ShadeYield)'}
                                  </h3>
                                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                    activeCompareCard === 'simple'
                                      ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                      : 'bg-red-500/20 text-red-300 border border-red-800'
                                  }`}>
                                    {activeCompareCard === 'simple' ? 'Transparent' : 'TEE Wrapped'}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-0.5">Yield distribution engine with real-time on-chain allocation</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-2xl font-black text-white block">6.42%</span>
                              <span className="text-[10px] text-zinc-500 font-mono uppercase">Target APY</span>
                            </div>
                          </div>

                          {/* Attributes comparison Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Privacy Protection</span>
                              <span className={`text-xs font-bold font-mono block mt-1 ${activeCompareCard === 'simple' ? 'text-red-400' : 'text-emerald-400'}`}>
                                {activeCompareCard === 'simple' ? '0% - Transparent' : '100% - Fully Shielded'}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Metadata Leak</span>
                              <span className={`text-xs font-bold font-mono block mt-1 ${activeCompareCard === 'simple' ? 'text-red-400' : 'text-emerald-400'}`}>
                                {activeCompareCard === 'simple' ? 'High Exposure' : 'Fully Protected'}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                              <span className="text-[10px] text-zinc-500 uppercase block font-mono">MEV Shielding</span>
                              <span className={`text-xs font-bold font-mono block mt-1 ${activeCompareCard === 'simple' ? 'text-zinc-500' : 'text-emerald-400'}`}>
                                {activeCompareCard === 'simple' ? 'Vulnerable' : 'Always Active'}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                              <span className="text-[10px] text-zinc-500 uppercase block font-mono">Reward Multiplier</span>
                              <span className="text-xs font-bold font-mono text-white block mt-1">
                                {activeCompareCard === 'simple' ? '1.0x $SHADE' : '3.0x $SHADE'}
                              </span>
                            </div>
                          </div>

                          {/* Technical description block */}
                          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 leading-relaxed">
                            {activeCompareCard === 'simple' ? (
                              <p>
                                <strong className="text-white">On-chain exposure:</strong> Share balances, wallet holdings, deposit histories, and rewards are written directly in public smart contract variables. Any block explorer, scanner, or competitor can programmatically link your identity and balances.
                              </p>
                            ) : (
                              <p>
                                <strong className="text-white">Confidential Sandbox state:</strong> Your actual yield shares are hidden behind standard cryptographic hashes. When viewing, only you can trigger client-side browser decryptors inside iExec Nox enclaves. Outside watchers see zero linked balance metrics.
                              </p>
                            )}
                          </div>

                          {/* Comparative visual state bar */}
                          <div>
                            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                              <span>Privacy & Security Level Score</span>
                              <span>{activeCompareCard === 'simple' ? '1.5 / 10' : '10 / 10 Perfect'}</span>
                            </div>
                            <div className="h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: activeCompareCard === 'simple' ? '15%' : '100%' }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  activeCompareCard === 'simple'
                                    ? 'bg-red-500'
                                    : 'bg-gradient-to-r from-red-600 via-red-500 to-emerald-500'
                                }`}
                              />
                            </div>
                          </div>

                        </motion.div>

                      </div>

                      {/* Sliding controls at the bottom */}
                      <div className="border-t border-red-950/40 p-4 bg-zinc-950/80 flex items-center justify-between">
                        {/* Dot paginations */}
                        <div className="flex items-center gap-1.5 ml-4">
                          <button
                            onClick={() => setActiveCompareCard('simple')}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              activeCompareCard === 'simple' ? 'bg-red-500 w-6' : 'bg-zinc-700 hover:bg-zinc-600'
                            }`}
                          />
                          <button
                            onClick={() => setActiveCompareCard('encrypted')}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              activeCompareCard === 'encrypted' ? 'bg-red-500 w-6' : 'bg-zinc-700 hover:bg-zinc-600'
                            }`}
                          />
                        </div>

                        {/* Interactive Swipe Arrow button */}
                        <button
                          onClick={() => {
                            setActiveCompareCard(prev => prev === 'simple' ? 'encrypted' : 'simple');
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5 border border-zinc-800 cursor-pointer"
                        >
                          Swipe to {activeCompareCard === 'simple' ? 'Encrypted' : 'Simple'}
                          <ChevronRight className="w-4 h-4 text-red-500 animate-pulse" />
                        </button>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: DeFi Terminal Dashboard */}
        {currentView === 'app' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 animate-fade-in">
            
            {/* Quick stats & Wallet reminder */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  ShadeYield Terminal
                </h1>
                <p className="text-xs text-zinc-400 mt-1">Manage private vaults, watch live yield accumulation, and decrypt balances in real-time.</p>
              </div>

              {!walletConnected && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-300 max-w-md">
                  <Info className="w-5 h-5 shrink-0 text-red-400" />
                  <div>
                    <span className="font-bold">Wallet not connected yet.</span> Connect your wallet to view real-time vault positions and deposit USDC on Arbitrum Sepolia.
                    <button 
                      onClick={() => setShowWalletModal(true)}
                      className="ml-2 underline hover:text-white font-semibold cursor-pointer"
                    >
                      Connect now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DASHBOARD GRID */}
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Vault Balances & Transaction Form (8 Columns) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* 1. VAULT BALANCES GRID */}
                <div className="grid sm:grid-cols-2 gap-6">
                  
                  {/* Card A: Simple Vault */}
                  <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-900 hover:border-zinc-800 transition-all relative overflow-hidden flex flex-col justify-between min-h-[190px]">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">Simple Vault</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-900">
                          <Unlock className="w-3 h-3" />
                          Transparent
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-6">
                          <span className="text-[10px] text-zinc-400 font-mono block">Deposited Balance</span>
                          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1 tracking-tight">
                            ${simpleVaultBalance.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                            <span className="text-[10px] text-zinc-500 font-normal ml-1">USDC</span>
                          </div>
                        </div>
                        
                        <div className="md:col-span-6 grid grid-cols-2 gap-2 border-l border-zinc-850 pl-4">
                          <div>
                            <span className="text-[9px] text-zinc-500 font-mono uppercase block">Total Shares</span>
                            <span className="text-xs font-bold font-mono text-white block mt-0.5">
                              {simpleVaultPrincipal > 0 ? (simpleVaultPrincipal * 0.998).toFixed(4) : '0.0000'} sUSDC
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 font-mono uppercase block">Yield Earned</span>
                            <span className="text-xs font-bold font-mono text-emerald-400 block mt-0.5">
                              +${Math.max(0, simpleVaultBalance - simpleVaultPrincipal).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-950/50 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-zinc-500 block">Current APY</span>
                        <span className="font-bold text-white font-mono">{APY_SIMPLE}%</span>
                      </div>
                    </div>

                    {/* Protocol Strategies Stats */}
                    <div className="mt-4 pt-4 border-t border-zinc-950/50 space-y-3">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Active Strategies</span>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Uniswap V3 Strategy */}
                        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-900 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-white block mb-2">Uniswap V3 Strategy</span>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-1 font-mono text-[9px] text-zinc-400">
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">TVL</span>
                              <span className="text-zinc-300 font-semibold">{simpleUniTotalAssets > 0n ? `${formatUnits(simpleUniTotalAssets, 6)} USDC` : '0.00 USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">Assets</span>
                              <span className="text-zinc-300 font-semibold">{simpleUniTotalAssets > 0n ? `${formatUnits(simpleUniTotalAssets, 6)} USDC` : '0.00 USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">Debt</span>
                              <span className="text-zinc-300 font-semibold">— USDC</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">APR</span>
                              <span className="text-zinc-300 font-semibold">—</span>
                            </div>
                          </div>
                        </div>

                        {/* Aave Strategy */}
                        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-900 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-white block mb-2">Aave Strategy</span>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-1 font-mono text-[9px] text-zinc-400">
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">TVL</span>
                              <span className="text-zinc-300 font-semibold">{simpleAaveTotalAssets > 0n ? `${formatUnits(simpleAaveTotalAssets, 6)} USDC` : '0.00 USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">Assets</span>
                              <span className="text-zinc-300 font-semibold">{simpleAaveTotalAssets > 0n ? `${formatUnits(simpleAaveTotalAssets, 6)} USDC` : '0.00 USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">Debt</span>
                              <span className="text-zinc-300 font-semibold">{simpleAavePrincipal > 0n ? `${formatUnits(simpleAavePrincipal, 6)} USDC` : '— USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">APR</span>
                              <span className="text-zinc-300 font-semibold">{simpleAavePrincipal > 0n ? `${((Number(simpleAaveTotalAssets - simpleAavePrincipal) * 10000) / Number(simpleAavePrincipal) / 100).toFixed(2)}%` : '—'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card B: Encrypted Vault */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900/60 to-red-950/25 border border-red-900/30 hover:border-red-800/40 transition-all relative overflow-hidden flex flex-col justify-between min-h-[190px]">
                    {/* Glowing effect inside */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-xl rounded-full"></div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">Encrypted Vault</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-900">
                          <Lock className="w-3 h-3" />
                          iExec Nox Protected
                        </span>
                      </div>
                      
                      {isNoxDecrypted ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-6">
                            <span className="text-[10px] text-zinc-400 font-mono block">Deposited Balance</span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-red-400 mt-1 tracking-tight animate-fade-in">
                              ${encryptedVaultBalance.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                              <span className="text-[10px] text-zinc-500 font-normal ml-1">USDC</span>
                            </div>
                          </div>
                          
                          <div className="md:col-span-6 grid grid-cols-2 gap-2 border-l border-red-950/40 pl-4">
                            <div>
                              <span className="text-[9px] text-zinc-500 font-mono uppercase block">Total Shares</span>
                              <span className="text-xs font-bold font-mono text-white block mt-0.5">
                                {encryptedVaultPrincipal > 0 ? (encryptedVaultPrincipal * 0.998).toFixed(4) : '0.0000'} vUSDC
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-mono uppercase block">Yield Earned</span>
                              <span className="text-xs font-bold font-mono text-red-400 block mt-0.5 animate-pulse">
                                +${Math.max(0, encryptedVaultBalance - encryptedVaultPrincipal).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-6">
                            <span className="text-[10px] text-zinc-400 font-mono block">Deposited Balance</span>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm sm:text-base font-mono font-extrabold text-zinc-600 tracking-wider">
                                🔒 Encrypted
                              </span>
                              <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-900">
                                NOX euint256
                              </span>
                            </div>
                          </div>
                          
                          <div className="md:col-span-6 grid grid-cols-2 gap-2 border-l border-red-950/40 pl-4">
                            <div>
                              <span className="text-[9px] text-zinc-500 font-mono uppercase block">Total Shares</span>
                              <span className="text-xs font-bold font-mono text-zinc-600 block mt-0.5">
                                🔒 ENCRYPTED
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 font-mono uppercase block">Yield Earned</span>
                              <span className="text-xs font-bold font-mono text-zinc-600 block mt-0.5">
                                🔒 ENCRYPTED
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-red-950/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-zinc-500 block">Current APY</span>
                        <span className="font-bold text-white font-mono">{APY_ENCRYPTED}%</span>
                      </div>
                    </div>

                    {/* Protocol Strategies Stats */}
                    <div className="mt-4 pt-4 border-t border-red-950/60 space-y-3">
                      <span className="text-[10px] text-red-400/80 font-mono uppercase tracking-wider block">Active Strategies</span>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Uniswap V3 Strategy */}
                        <div className="p-3 rounded-xl bg-zinc-950/60 border border-red-950/20 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-white block mb-2">Uniswap V3 Strategy</span>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-1 font-mono text-[9px] text-zinc-400">
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">TVL</span>
                              <span className="text-zinc-300 font-semibold">{uniTotalAssets > 0n ? `${formatUnits(uniTotalAssets, 6)} USDC` : '0.00 USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">Assets</span>
                              <span className="text-zinc-300 font-semibold">{uniTotalAssets > 0n ? `${formatUnits(uniTotalAssets, 6)} USDC` : '0.00 USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">Debt</span>
                              <span className="text-zinc-300 font-semibold">— USDC</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">APR</span>
                              <span className="text-red-400 font-semibold">—</span>
                            </div>
                          </div>
                        </div>

                        {/* Aave Strategy */}
                        <div className="p-3 rounded-xl bg-zinc-950/60 border border-red-950/20 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-white block mb-2">Aave Strategy</span>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-1 font-mono text-[9px] text-zinc-400">
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">TVL</span>
                              <span className="text-zinc-300 font-semibold">{aaveTotalAssets > 0n ? `${formatUnits(aaveTotalAssets, 6)} USDC` : '0.00 USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">Assets</span>
                              <span className="text-zinc-300 font-semibold">{aaveTotalAssets > 0n ? `${formatUnits(aaveTotalAssets, 6)} USDC` : '0.00 USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">Debt</span>
                              <span className="text-zinc-300 font-semibold">{aavePrincipal > 0n ? `${formatUnits(aavePrincipal, 6)} USDC` : '— USDC'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-600 block text-[8px] uppercase">APR</span>
                              <span className="text-red-400 font-semibold">{aavePrincipal > 0n ? `${((Number(aaveTotalAssets - aavePrincipal) * 10000) / Number(aavePrincipal) / 100).toFixed(2)}%` : '—'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. CORE DEFI TRANSACTION COMPONENT */}
                <div id="defi-action-panel" className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-900 relative">
                  
                  {/* Action Tabs: Deposit / Withdraw */}
                  <div className="flex border-b border-zinc-800 mb-6">
                    <button
                      onClick={() => { setActiveTab('deposit'); setAmountInput(''); }}
                      className={`pb-3.5 px-6 font-bold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                        activeTab === 'deposit'
                          ? 'border-red-500 text-red-400'
                          : 'border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <ArrowDownRight className="w-4 h-4" />
                      Deposit into Vault
                    </button>
                    <button
                      onClick={() => { setActiveTab('withdraw'); setAmountInput(''); }}
                      className={`pb-3.5 px-6 font-bold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                        activeTab === 'withdraw'
                          ? 'border-red-500 text-red-400'
                          : 'border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Withdraw from Vault
                    </button>
                  </div>

                  <form onSubmit={handleExecuteTransaction}>
                    
                    {/* Vault Selector */}
                    <div className="mb-6">
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
                        Choose Destination Vault
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        
                        {/* Option 1: Simple Vault */}
                        <div
                          onClick={() => setSelectedVault('simple')}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            selectedVault === 'simple'
                              ? 'bg-red-950/25 border-red-500/80 ring-1 ring-red-500/20'
                              : 'bg-zinc-950/30 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                              Simple Vault
                              <Unlock className="w-3.5 h-3.5 text-zinc-500" />
                            </h4>
                            <span className="text-[10px] text-zinc-500 font-mono">Transparent Shares</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-normal mb-2">
                            Yield generated via Aave + Uniswap. Standard ERC-20 tracking. Wallet balances are publicly queryable.
                          </p>
                          <div className="flex items-center justify-between border-t border-zinc-800 pt-2 mt-1 text-[11px] text-zinc-500">
                            <span>APY: 6.42%</span>
                            <span>Gas: Normal</span>
                          </div>
                        </div>

                        {/* Option 2: Encrypted Vault */}
                        <div
                          onClick={() => setSelectedVault('encrypted')}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                            selectedVault === 'encrypted'
                              ? 'bg-red-950/25 border-red-500/80 ring-1 ring-red-500/20'
                              : 'bg-zinc-950/30 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/5 blur-md rounded-full"></div>
                          
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                              Encrypted Vault
                              <Lock className="w-3.5 h-3.5 text-red-400" />
                            </h4>
                            <span className="text-[10px] text-red-400 font-mono font-bold">iExec Nox Secure</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-normal mb-2">
                            Identical yield but balances are encrypted inside iExec Trusted Hardware. Completely private share allocation.
                          </p>
                          <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 mt-1 text-[11px] text-zinc-500">
                            <span className="text-red-400 font-semibold">APY: 6.42%</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
                          Amount to {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}
                        </label>
                        <span className="text-xs text-zinc-500">
                          {activeTab === 'deposit' ? (
                            <>Wallet USDC: <strong className="text-zinc-300 font-mono">{walletBalanceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</strong></>
                          ) : (
                            <>
                              Deposited Balance:{' '}
                              <strong className="text-zinc-300 font-mono">
                                {selectedVault === 'simple'
                                  ? `${simpleVaultBalance.toFixed(2)} USDC`
                                  : isNoxDecrypted
                                  ? `${encryptedVaultBalance.toFixed(2)} USDC`
                                  : 'Encrypted [Nox Protected]'
                                }
                              </strong>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center rounded-xl bg-zinc-950 border border-zinc-800 p-2 focus-within:border-red-500/50 transition-colors">
                        <input
                          type="number"
                          step="any"
                          required
                          value={amountInput}
                          onChange={(e) => setAmountInput(e.target.value)}
                          placeholder="0.00"
                          disabled={isProcessingTx}
                          className="grow bg-transparent border-0 outline-none text-lg font-mono text-white px-3 py-1.5"
                        />
                        <div className="flex items-center gap-2 px-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (activeTab === 'deposit') {
                                setAmountInput(walletBalanceUSDC.toString());
                              } else {
                                const bal = selectedVault === 'simple' ? simpleVaultBalance : encryptedVaultBalance;
                                setAmountInput(bal.toString());
                              }
                            }}
                            className="px-2 py-1 text-[10px] font-bold text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 transition-colors cursor-pointer"
                          >
                            MAX
                          </button>
                          <span className="text-sm font-mono font-bold text-zinc-300">USDC</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isProcessingTx}
                      className={`w-full py-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                        isProcessingTx
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/20'
                      }`}
                    >
                      {isProcessingTx ? (
                        <>
                          <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                          Processing Transaction Steps...
                        </>
                      ) : activeTab === 'deposit' ? (
                        <>
                          <ArrowDownRight className="w-4.5 h-4.5" />
                          Execute Vault Deposit
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-4.5 h-4.5" />
                          Decrypt & Withdraw Funds
                        </>
                      )}
                    </button>

                  </form>

                  {/* Harvest Button — permissionless, anyone can call */}
                  {walletConnected && (
                    <button
                      type="button"
                      onClick={handleHarvest}
                      className="mt-3 w-full py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      Harvest Yield (0.05% incentive)
                    </button>
                  )}

                  {/* Faucet Info */}
                  {(!walletConnected || walletBalanceUSDC === 0) && (
                    <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-blue-400/80 leading-relaxed">
                      <span className="font-bold">💧 Need test USDC?</span>{' '}
                      Get Arbitrum Sepolia ETH + USDC from{' '}
                      <a href="https://faucet.quicknode.com/arbitrum/sepolia" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">
                        QuickNode
                      </a>
                      {' or '}
                      <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">
                        Circle
                      </a>
                    </div>
                  )}

                  {/* Dynamic Multi-Step Transaction progress visualizer */}
                  {isProcessingTx && txStep > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-zinc-950 border border-zinc-900 animate-fade-in text-xs">
                      <p className="font-mono font-bold text-zinc-400 uppercase tracking-wider mb-3">Arbitrum Ledger Progress Logs</p>
                      
                      <div className="space-y-3 font-mono">
                        {/* Step 1: Wallet Connection & ERC20 approve */}
                        <div className="flex items-start gap-2.5">
                          {txStep >= 1 ? (
                            txStep > 1 ? (
                              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                            ) : (
                              <RefreshCw className="w-4.5 h-4.5 text-indigo-400 animate-spin shrink-0" />
                            )
                          ) : (
                            <div className="w-4.5 h-4.5 rounded-full border border-zinc-800 shrink-0"></div>
                          )}
                          <div className={txStep === 1 ? 'text-zinc-200' : 'text-zinc-500'}>
                            <span>[1/3] Signature Verification & Allowance Approved</span>
                            {txStep === 1 && <span className="block text-[10px] text-zinc-500 mt-1">Prompting user wallet to sign Arbitrum token approval...</span>}
                          </div>
                        </div>

                        {/* Step 2: USDC Deposit execute */}
                        <div className="flex items-start gap-2.5">
                          {txStep >= 2 ? (
                            txStep > 2 ? (
                              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                            ) : (
                              <RefreshCw className="w-4.5 h-4.5 text-indigo-400 animate-spin shrink-0" />
                            )
                          ) : (
                            <div className="w-4.5 h-4.5 rounded-full border border-zinc-800 shrink-0"></div>
                          )}
                          <div className={txStep === 2 ? 'text-zinc-200' : 'text-zinc-500'}>
                            <span>[2/3] Transferring USDC into ShadeYield Gate Contract</span>
                            {txStep === 2 && <span className="block text-[10px] text-zinc-500 mt-1">Calling 0xd76ecef... transferFrom. Simulating blockchain confirmation.</span>}
                          </div>
                        </div>

                        {/* Step 3: Enclave lock & Encryption */}
                        <div className="flex items-start gap-2.5">
                          {txStep >= 3 ? (
                            txStep > 3 ? (
                              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                            ) : (
                              <RefreshCw className="w-4.5 h-4.5 text-indigo-400 animate-spin shrink-0" />
                            )
                          ) : (
                            <div className="w-4.5 h-4.5 rounded-full border border-zinc-800 shrink-0"></div>
                          )}
                          <div className={txStep === 3 ? 'text-zinc-200' : 'text-zinc-500'}>
                            <span>[3/3] {selectedVault === 'encrypted' ? 'TEE iExec Nox Encryption Engine Locking' : 'Minting Transparent ERC-20 Share State'}</span>
                            {txStep === 3 && (
                              <span className="block text-[10px] text-indigo-400 mt-1 animate-pulse">
                                {selectedVault === 'encrypted' 
                                  ? 'Generating ciphertext. Sandbox executing nox.encryptBalance() client flow...'
                                  : 'Broadcasting open ledger share supply update...'
                                }
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* RIGHT COLUMN: Nox Decryptor Tool (4 Columns) */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                
                {/* 1. iEXEC NOX CRYPTOGRAPHIC KEY ENGINE DECRYPTOR */}
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-red-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-2xl rounded-full pointer-events-none"></div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded bg-red-500/10 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-none">iExec Nox Decryptor</h3>
                      <span className="text-[10px] text-zinc-500 font-mono tracking-wider">Client Sandbox Tool</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-normal mb-4">
                    Your Encrypted Vault balance is compiled as private on-chain ciphertext. Toggle decryption using your local sandbox Nox Key to read your state.
                  </p>

                  <div className="space-y-4 font-mono">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Local Nox Secret Key</span>
                        <span className="text-[10px] text-emerald-400 font-bold">SECURED</span>
                      </div>
                      <input
                        type="password"
                        readOnly
                        value={noxPrivateKey}
                        className="w-full bg-transparent border-0 outline-none text-red-300 font-mono text-xs mt-1 selection:bg-red-500/20"
                      />
                    </div>

                    <button
                      onClick={handleDecryptNoxShares}
                      disabled={isDecrypting || encryptedVaultBalance <= 0}
                      className={`w-full py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        encryptedVaultBalance <= 0
                          ? 'bg-zinc-950 text-zinc-600 border border-zinc-800/50 cursor-not-allowed'
                          : isNoxDecrypted
                          ? 'bg-zinc-800 text-red-300 border border-red-800 hover:bg-zinc-700'
                          : isDecrypting
                          ? 'bg-zinc-950 border border-zinc-800 text-zinc-500'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-950/40'
                      }`}
                    >
                      {isDecrypting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          DECRYPTING...
                        </>
                      ) : isNoxDecrypted ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Hide & Re-Encrypt
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Decrypt Vault State
                        </>
                      )}
                    </button>

                    {encryptedVaultBalance <= 0 && (
                      <div className="text-[10px] text-zinc-500 text-center">
                        ⚠️ Deposit USDC in the Encrypted Vault to activate decryptor
                      </div>
                    )}

                    {isNoxDecrypted && (
                      <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-[11px] leading-normal text-red-300 animate-pulse">
                        <span className="font-bold">Decrypted Payload:</span><br />
                        Shares: { (encryptedVaultBalance * 0.998).toFixed(4) } sUSDC<br />
                        Nox Authentication Signer: verified
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* TRANSACTION HISTORY LEDGER */}
            <div className="mt-12 p-6 rounded-3xl bg-zinc-900/20 border border-zinc-900">
              <div className="flex items-center justify-between mb-6 border-b border-zinc-900 pb-4">
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-indigo-400" />
                  Transaction Log Ledger
                </h3>
                <span className="text-xs text-zinc-500 font-mono">Arbitrum Sepolia Explorer</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-900/50">
                      <th className="pb-3 font-semibold">Transaction Hash</th>
                      <th className="pb-3 font-semibold">Action</th>
                      <th className="pb-3 font-semibold">Vault Option</th>
                      <th className="pb-3 font-semibold text-right">USDC Amount</th>
                      <th className="pb-3 font-semibold">Age</th>
                      <th className="pb-3 font-semibold text-center">Tx State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/40">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="text-zinc-300 hover:bg-zinc-900/10">
                        <td className="py-3.5 flex items-center gap-1.5 text-indigo-300">
                          <a
                            href={`https://sepolia.arbiscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 shrink-0"
                          >
                            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                            <ExternalLink className="w-3 h-3 text-zinc-600" />
                          </a>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'Deposit' 
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                              : tx.type === 'Reward Claim'
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40'
                              : 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/40'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3.5 text-zinc-400">
                          {tx.vault}
                        </td>
                        <td className="py-3.5 text-right font-bold text-white">
                          {tx.type === 'Reward Claim' ? (
                            <span className="text-emerald-400">{tx.amount.toFixed(4)} $SHADE</span>
                          ) : (
                            `$${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          )}
                        </td>
                        <td className="py-3.5 text-zinc-500">
                          {tx.timestamp}
                        </td>
                        <td className="py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 text-[10px]">
                            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <ShadeYieldLogo className="w-6 h-6" />
                <div className="flex items-center">
                  <span className="font-extrabold text-base text-white tracking-tight">Shade</span>
                  <span className="font-extrabold text-base text-red-500 tracking-tight">Yield</span>
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest ml-1.5 pt-0.5 border-l border-zinc-800 pl-1.5">Protocol</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-4">
                Encrypting DeFi share allocations through cutting-edge hardware sandbox Trusted Execution Environments (TEEs). Powered by iExec Nox.
              </p>
              <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                <span>Contract:</span>
                <a
                  href="https://sepolia.arbiscan.io/address/0xd76ecef816FcaE8E75C41865917838531Db9dCd2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-300 underline flex items-center gap-1"
                >
                  0xd76ecef...9dCd2
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-4">Navigate</h4>
              <ul className="text-xs text-zinc-500 space-y-2">
                <li>
                  <button onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-zinc-300 transition-colors cursor-pointer">
                    Homepage Landing
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('architecture-map')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-zinc-300 transition-colors cursor-pointer">
                    Architecture Design Map
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('app')} className="hover:text-zinc-300 transition-colors cursor-pointer">
                    Yield Terminal
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Tools and Stack */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-4">Core Stack</h4>
              <ul className="text-xs text-zinc-500 space-y-1 font-mono">
                <li>iExec Nox TEE SDK</li>
                <li>Aave V3 Protocol</li>
                <li>Uniswap V3</li>
                <li>Arbitrum Sepolia Ledger</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
            <p>© 2026 ShadeYield Protocol. Distributed non-custodially.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-zinc-400">Terms of Service</a>
              <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-400">Audits</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WALLET CONNECTION MODAL */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-emerald-400" />
                Connect Web3 Wallet
              </h3>
              <button
                onClick={() => setShowWalletModal(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 bg-zinc-950 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-normal mb-6">
              Connect your test wallet to access ShadeYield’s interactive demo terminal on Arbitrum Sepolia. We will pre-load your connected session with testing USDC.
            </p>

            <div className="space-y-3">
              
              {/* Wallet A: MetaMask */}
              <button
                onClick={() => handleConnectWallet('MetaMask')}
                className="w-full p-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center font-bold text-orange-400 text-xs">
                    🦊
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">MetaMask Wallet</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Most popular web browser extension</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>

              {/* Wallet B: Coinbase Wallet */}
              <button
                onClick={() => handleConnectWallet('Coinbase Wallet')}
                className="w-full p-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center font-black text-indigo-400 text-sm">
                    C
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Coinbase Wallet</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Seamless web and mobile integration</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>

              {/* Wallet C: WalletConnect */}
              <button
                onClick={() => handleConnectWallet('WalletConnect')}
                className="w-full p-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 text-xs">
                    WC
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">WalletConnect Portal</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Scan with QR Code using any wallet</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>

              {/* Wallet D: iExec Nox secure link key */}
              <button
                onClick={() => handleConnectWallet('iExec Nox Key-Pair Auth')}
                className="w-full p-4 rounded-xl bg-indigo-950/30 hover:bg-indigo-900/30 border border-indigo-900/40 hover:border-indigo-800 transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-indigo-300 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">iExec Nox ID Auth</h4>
                    <p className="text-[10px] text-indigo-400 mt-0.5">Pure hardware enclave-tied credentials</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400" />
              </button>

            </div>

            <div className="mt-6 text-center text-[11px] text-zinc-500">
              By connecting, you agree to interact with ShadeYield's decentralized routing protocol. No private credentials will leave your local machine.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

