/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatUnits, parseUnits, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
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

// ── Sepolia Deployments ──
const SEPOLIA = {
  RPC: 'https://ethereum-sepolia.publicnode.com',
  USDC: '0xa77d034ff9801337814e47a2843056c6bb99582e',
  SIMPLE: '0x2d5c88b952aaaa71457a22071e1b9f04d47977e0',
  ENC: '0x39a54acda9c9b8deaf3e569bcf87eebf8e7a15d5',
  SIMPLE_STRAT: '0x8adb1d9f04328c355db13276f2be81fcf2710ff9',
  ENC_STRAT: '0x1cf89361e70211f0b9ee879826908880bc5ab5ab',
  USDC_DECIMALS: 18, // TestUSDC uses 18 decimals
  CHAIN: sepolia,
  CHAIN_NAME: 'ETH Sepolia',
};

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
      ctx.fillStyle = 'rgba(9, 9, 11, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
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
    { text: 'ROUTER: Listening for events...', type: 'code', timestamp: '10:30:04' },
    { text: 'LEDGER: Encrypted Share ledger is currently LOCKED.', type: 'warning', timestamp: '10:30:05' }
  ];

  useEffect(() => {
    if (!isDecrypting && !isDecrypted) setLines(idleLogs);
  }, [isDecrypting, isDecrypted]);

  useEffect(() => {
    if (isDecrypting) {
      setLines([{ text: '🔐 NOX DECRYPTION INITIATED VIA USER SIGNATURE...', type: 'warning', timestamp: 'NOW' }]);
      const sequence = [
        { text: '⚡ CONNECTING TO INTEL SGX TRUSTED EXECUTION ENVIRONMENT...', type: 'system', delay: 250 },
        { text: '🔑 RETRIEVING CIPHERTEXT SHARES FROM ETH SEPOLIA...', type: 'code', delay: 500 },
        { text: '🛡️ VALIDATING CRYPTOGRAPHIC PROOF & ATTESTATION...', type: 'security', delay: 800 },
        { text: '🗝️ DECRYPTING VAULT SHARE LEDGER VIA LOCAL PRIVATE KEY...', type: 'security', delay: 1100 },
        { text: '📊 RECONCILING CO-LOCATED REWARDS AND BALANCE PROOFS...', type: 'code', delay: 1400 },
        { text: '✅ SHADEYIELD STATE UNLOCKED. BALANCE VERIFIED OK.', type: 'success', delay: 1700 }
      ];
      const timers: NodeJS.Timeout[] = [];
      sequence.forEach((item) => {
        const timer = setTimeout(() => {
          setLines(prev => [...prev, { text: item.text, type: item.type as any, timestamp: new Date().toLocaleTimeString() }]);
        }, item.delay);
        timers.push(timer);
      });
      return () => timers.forEach(clearTimeout);
    }
  }, [isDecrypting]);

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

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden font-mono text-[10px] h-48 flex flex-col mt-4">
      <div className="bg-zinc-900/60 px-3 py-2 border-b border-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isDecrypting ? 'bg-amber-500 animate-pulse' : isDecrypted ? 'bg-red-500 animate-ping' : 'bg-red-600 animate-pulse'}`}></span>
          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Nox Cryptographic Enclave Terminal</span>
        </div>
        <span className="text-[7px] text-zinc-500 font-bold tracking-widest uppercase">{isDecrypting ? 'DECRYPTING' : isDecrypted ? 'DECRYPTED' : 'ENCRYPTED'}</span>
      </div>
      <div ref={terminalRef} className="p-3 overflow-y-auto space-y-2 flex-1 scrollbar-thin scrollbar-thumb-zinc-800 scroll-smooth">
        <AnimatePresence initial={false}>
          {lines.map((line, idx) => (
            <motion.div key={idx + line.text} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="flex items-start gap-1.5 leading-normal">
              <span className="text-[8px] text-zinc-600 shrink-0 select-none">[{line.timestamp}]</span>
              <span className={`font-semibold shrink-0 select-none ${line.type === 'system' ? 'text-zinc-500' : line.type === 'security' ? 'text-red-400' : line.type === 'success' ? 'text-red-400' : line.type === 'warning' ? 'text-amber-500' : 'text-indigo-400'}`}>
                {line.type === 'success' ? '✓' : line.type === 'warning' ? '⚠️' : line.type === 'security' ? '🛡️' : '›'}
              </span>
              <span className={`break-words ${line.type === 'success' ? 'text-red-400 font-bold' : 'text-zinc-300'}`}>{line.text}</span>
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
  const isNoxDecryptedRef = useRef(false);
  useEffect(() => { isNoxDecryptedRef.current = isNoxDecrypted; }, [isNoxDecrypted]);
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

  // Transaction Log
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try { const saved = localStorage.getItem('shade-txs'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('shade-txs', JSON.stringify(transactions)); }, [transactions]);

  // Architecture visualizer
  const [activeArchitectureFlow, setActiveArchitectureFlow] = useState<'simple' | 'encrypted'>('encrypted');
  const [activeNodeId, setActiveNodeId] = useState<string>('nox-engine');
  const [activeCompareCard, setActiveCompareCard] = useState<'simple' | 'encrypted'>('encrypted');

  const totalTVL = simpleTotalAssets + encryptedTotalAssets;
  const D = SEPOLIA.USDC_DECIMALS;

  // ── Real Chain Data Fetch ──
  useEffect(() => {
    if (!isConnected || !address) return;
    const pc = createPublicClient({ chain: sepolia, transport: http(SEPOLIA.RPC) });
    const stratABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;
    const tokenABI = [{ type: 'function', name: 'balanceOf', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
                       { type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' }] as const;
    const vaultABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
                       { type: 'function', name: 'balanceOfShares', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;

    const readAll = async () => {
      try {
        const [usdcBal, stBal, sShares, sStratBal, eStratBal] = await Promise.all([
          pc.readContract({ address: SEPOLIA.USDC as `0x${string}`, abi: tokenABI, functionName: 'balanceOf', args: [address] }),
          pc.readContract({ address: SEPOLIA.SIMPLE as `0x${string}`, abi: vaultABI, functionName: 'totalAssets' }),
          pc.readContract({ address: SEPOLIA.SIMPLE as `0x${string}`, abi: vaultABI, functionName: 'balanceOfShares', args: [address] }).catch(() => 0n),
          pc.readContract({ address: SEPOLIA.SIMPLE_STRAT as `0x${string}`, abi: stratABI, functionName: 'totalAssets' }).catch(() => 0n),
          pc.readContract({ address: SEPOLIA.ENC_STRAT as `0x${string}`, abi: stratABI, functionName: 'totalAssets' }).catch(() => 0n),
        ]);
        setUsdcBalance(usdcBal as bigint);
        setWalletBalanceUSDC(parseFloat(formatUnits(usdcBal as bigint, D)));
        setSimpleTotalAssets(stBal as bigint);
        if (!isNoxDecryptedRef.current) {
          setEncryptedTotalAssets(0n);
          setEncryptedVaultPrincipal(0);
          setEncryptedVaultBalance(0);
        }
        setSimpleVaultPrincipal(parseFloat(formatUnits(sShares as bigint, D)));
        setSimpleVaultBalance(parseFloat(formatUnits(sShares as bigint, D)));
        setAaveTotalAssets(sStratBal as bigint);
        setSimpleAaveTotalAssets(sStratBal as bigint);
        setUniTotalAssets(eStratBal as bigint);
        setSimpleUniTotalAssets(eStratBal as bigint);
        if (!contractsLoaded) setContractsLoaded(true);
      } catch (e) { console.warn('chain read error', e); }
    };
    readAll();
    const interval = setInterval(readAll, 15000);
    return () => clearInterval(interval);
  }, [isConnected, address, refreshKey]);

  // ── Public Chain Reads ──
  useEffect(() => {
    const pc = createPublicClient({ chain: sepolia, transport: http(SEPOLIA.RPC) });
    const vaultABI = [{ type: 'function', name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' }] as const;
    const readPublic = async () => {
      try {
        const [stBal] = await Promise.all([
          pc.readContract({ address: SEPOLIA.SIMPLE as `0x${string}`, abi: vaultABI, functionName: 'totalAssets' }),
        ]);
        setSimpleTotalAssets(stBal as bigint);
        if (!contractsLoaded) setContractsLoaded(true);
      } catch (e) { console.warn('public read error', e); }
    };
    readPublic();
  }, [refreshKey]);

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
      const vaultAddr = selectedVault === 'simple' ? SEPOLIA.SIMPLE : SEPOLIA.ENC;
      const amountWei = parseUnits(amountInput, D);
      const pc = createPublicClient({ chain: sepolia, transport: http(SEPOLIA.RPC) });
      const actions = await import('wagmi/actions');
      const wcfg = (await import('./wagmi')).config;
      const erc20ABI = [{ type: 'function', name: 'approve', inputs: [{ type: 'address' }, { type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable' },
                         { type: 'function', name: 'allowance', inputs: [{ type: 'address' }, { type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' }];
      const vaultABI = [{ type: 'function', name: 'deposit', inputs: [{ type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
                        { type: 'function', name: 'requestWithdraw', inputs: [{ type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' }];

      if (activeTab === 'deposit') {
        const allowance = await pc.readContract({ address: SEPOLIA.USDC as `0x${string}`, abi: erc20ABI, functionName: 'allowance', args: [address, vaultAddr as `0x${string}`] }) as bigint;
        if (allowance < amountWei) {
          setTxStep(2);
          const { request } = await pc.simulateContract({ address: SEPOLIA.USDC as `0x${string}`, abi: erc20ABI, functionName: 'approve', args: [vaultAddr as `0x${string}`, amountWei], account: address });
          const h = await actions.writeContract(wcfg, request); setTxHash(h);
          await pc.waitForTransactionReceipt({ hash: h });
        }
        setTxStep(3);
        const { request } = await pc.simulateContract({ address: vaultAddr as `0x${string}`, abi: vaultABI, functionName: 'deposit', args: [amountWei], account: address });
        const h = await actions.writeContract(wcfg, request); setTxHash(h);
        await pc.waitForTransactionReceipt({ hash: h });
      } else {
        setTxStep(2);
        const { request } = await pc.simulateContract({ address: vaultAddr as `0x${string}`, abi: vaultABI, functionName: 'requestWithdraw', args: [amountWei], account: address });
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
      const pc = createPublicClient({ chain: sepolia, transport: http(SEPOLIA.RPC) });
      const harvestABI = [{ type: 'function', name: 'harvestAll', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'nonpayable' }];
      const { request } = await pc.simulateContract({ address: SEPOLIA.ENC as `0x${string}`, abi: harvestABI, functionName: 'harvestAll', account: address });
      const actions = await import('wagmi/actions');
      const wcfg = (await import('./wagmi')).config;
      const h = await actions.writeContract(wcfg, request); setTxHash(h);
      await pc.waitForTransactionReceipt({ hash: h });
      setRefreshKey(k => k + 1);
      triggerNotification('✅ Yield harvested!', 'success');
    } catch (err: any) {
      triggerNotification('Harvest: ' + (err?.shortMessage || err?.message || 'no yield yet'), 'info');
    }
    setTimeout(() => { setIsProcessingTx(false); setTxStep(0); }, 1500);
  };

  // Nox decrypt
  const handleDecryptNoxShares = async () => {
    if (!address) return;
    if (isNoxDecrypted) {
      setIsNoxDecrypted(false);
      setIsDecrypting(false);
      triggerNotification('🔒 Vault state re-encrypted.', 'info');
      return;
    }
    try {
      setIsDecrypting(true);
      triggerNotification('🔐 Decrypting encrypted vault state via Nox TEE...', 'info');
      const apiUrl = import.meta.env.VITE_NOX_API_URL || '';
      if (!apiUrl) {
        triggerNotification('🔐 Nox API not configured (VITE_NOX_API_URL). Set it up to decrypt encrypted balances.', 'info');
        setIsDecrypting(false);
        return;
      }
      const [tvlRes, balRes] = await Promise.all([
        fetch(`${apiUrl}/vault/tvl`).then(r => r.json()),
        fetch(`${apiUrl}/vault/balance?address=${address}`).then(r => r.json()),
      ]);
      if (tvlRes.tvl) {
        setEncryptedTotalAssets(BigInt(tvlRes.tvl));
        triggerNotification(`✅ Encrypted vault TVL: ${(Number(tvlRes.tvl) / 1e18).toFixed(2)} USDC`, 'success');
      }
      if (balRes.balance) {
        const bal = Number(balRes.balance) / 1e18;
        setEncryptedVaultBalance(bal);
        setEncryptedVaultPrincipal(bal);
        triggerNotification(`✅ Your encrypted balance: ${bal.toFixed(4)} shares`, 'success');
      }
      setIsNoxDecrypted(true);
      setIsDecrypting(false);
    } catch (e: any) {
      console.error('Nox decrypt error:', e);
      setIsDecrypting(false);
      triggerNotification('Nox decrypt unavailable. Is the decrypt API running?', 'error');
    }
  };

  // Technical Node Details
  const nodeDetails: Record<string, NodeDetail> = {
    'user-wallet': {
      id: 'user-wallet', title: 'User Wallet', category: 'Client Interface',
      description: 'Standard EIP-1193 compatible Web3 wallet (e.g. MetaMask). Connects to ETH Sepolia.',
      details: 'The client-side dApp manages interactions with the user wallet. Deposits require USDC approval followed by vault deposit.',
      codeSnippet: `const vault = new ethers.Contract(SHADE_VAULT, VAULT_ABI, signer);\nawait vault.deposit(depositAmount);`
    },
    'shade-gateway': {
      id: 'shade-gateway', title: 'ShadeYield Vault', category: 'Smart Contract',
      description: 'Non-custodial vault that aggregates user funds and auto-allocates to strategies.',
      details: 'Acts as the single point of entry. It routes between transparent (ERC-20 shares) and encrypted (iExec Nox) logic, then deploys capital into yield strategies.',
      codeSnippet: `function deposit(uint256 amount) external {\n    IERC20(usdc).safeTransferFrom(msg.sender, address(this), amount);\n    _mintShares(msg.sender, amount);\n    if (strategies.length > 0) autoAllocate(amount);\n}`
    },
    'nox-engine': {
      id: 'nox-engine', title: 'iExec Nox Secure Sandbox', category: 'Privacy Enclave (TEE)',
      description: 'Hardware-secured execution environment (TEE) managing encrypted balances on ETH Sepolia.',
      details: 'iExec Nox encrypts user balance states so they are unreadable on-chain. When a user deposits, Nox computes the updated share value within a secure enclave and stores only ciphertext.',
      codeSnippet: `const encryptedBalance = await noxClient.encryptBalance({\n    address: userAddress,\n    balance: currentShares + newShares\n});`
    },
    'aave-yield': {
      id: 'aave-yield', title: 'Hold Strategy', category: 'Yield Strategy',
      description: 'Simple vault strategy that holds deposited assets. Replaceable with Aave V3, Morpho, or any yield source.',
      details: 'For this hackathon demo, the strategy holds assets idle to show the full Nox encrypted deposit/withdraw flow. In production, swap in Aave V3 for real yield.',
      codeSnippet: `function deposit(uint256 amount) external onlyVault {\n    // Forward to Aave V3 in production\n    IERC20(asset).safeTransferFrom(vault, address(this), amount);\n}`
    },
    'decrypted-client': {
      id: 'decrypted-client', title: 'Client-Side Nox Decryptor', category: 'Client SDK',
      description: 'Browser-side cryptographic engine that decrypts share balances using the Nox API.',
      details: 'Because the ledger stores encrypted ciphertext, standard block explorers see zero balance. The ShadeYield UI retrieves ciphertext and decrypts it via the Nox TEE API.',
      codeSnippet: `const ciphertext = await vault.getEncryptedShares(user);\nconst decrypted = await noxClient.decrypt({ ciphertext, privateKey });`
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {notification && (
        <div id="toast-notif" className="fixed bottom-6 right-6 z-50 animate-bounce flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl backdrop-blur-md max-w-sm">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {notification.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />}
          {notification.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />}
          <p className="text-sm text-zinc-300 font-medium">{notification.message}</p>
        </div>
      )}

      {/* Floating Navbar */}
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
                <span className="font-extrabold text-xl tracking-tight text-white">Shade</span>
                <span className="font-extrabold text-xl tracking-tight text-red-500">Yield</span>
                <span className="block text-[10px] text-zinc-500 font-mono tracking-wider uppercase leading-none">Privacy DeFi Wrapper</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('about-decentralization')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-red-400 transition-colors cursor-pointer">Protocol Pillars</button>
              <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('architecture-map')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-red-400 transition-colors cursor-pointer">Architecture</button>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                ETH Sepolia
              </div>

              {walletConnected ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentView('app')} className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-red-400 transition-all flex items-center gap-1.5 cursor-pointer">
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> Terminal
                  </button>
                  <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
                    <span className="px-2.5 text-xs font-mono font-bold text-zinc-300">
                      {walletBalanceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                    </span>
                    <button onClick={handleDisconnectWallet} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 hover:text-rose-400 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer" title="Disconnect Wallet">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </button>
                  </div>
                </div>
              ) : (
                <button id="connect-wallet-nav" onClick={() => setShowWalletModal(true)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/10 cursor-pointer flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5" /> Connect Wallet
                </button>
              )}
            </div>

            <div className="flex md:hidden items-center gap-2">
              {walletConnected && (
                <button onClick={() => setCurrentView('app')} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 hover:text-red-300 transition-colors cursor-pointer" title="Terminal">
                  <Activity className="w-4 h-4 animate-pulse" />
                </button>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer" aria-label="Toggle Menu">
                {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="md:hidden border-t border-zinc-900 px-4 py-4 space-y-4 text-sm font-medium text-zinc-400">
                <button onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('about-decentralization')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="block w-full text-left py-2 hover:text-red-400 transition-colors cursor-pointer">Protocol Pillars</button>
                <button onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); setTimeout(() => document.getElementById('architecture-map')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="block w-full text-left py-2 hover:text-red-400 transition-colors cursor-pointer">Architecture</button>
                <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> ETH Sepolia
                  </div>
                  {walletConnected ? (
                    <div className="space-y-3">
                      <button onClick={() => { setCurrentView('app'); setMobileMenuOpen(false); }} className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-red-400 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <Activity className="w-4 h-4 animate-pulse" /> Go to Terminal
                      </button>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                        <span className="text-xs font-bold text-zinc-300">{walletBalanceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC</span>
                        <button onClick={() => { handleDisconnectWallet(); setMobileMenuOpen(false); }} className="px-3 py-1.5 bg-zinc-855 hover:bg-zinc-800 hover:text-rose-400 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer">
                          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} (Disconnect)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setShowWalletModal(true); setMobileMenuOpen(false); }} className="w-full px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/10 cursor-pointer flex items-center justify-center gap-2">
                      <Wallet className="w-4 h-4" /> Connect Wallet
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>

      {/* Main View */}
      <main className="grow">
        {currentView === 'home' && (
          <div className="animate-fade-in">
            <section id="hero" className="relative py-20 lg:py-32 overflow-hidden border-b border-zinc-900 bg-zinc-950">
              <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-red-950/10 via-red-900/5 to-transparent blur-[140px] rounded-full pointer-events-none" />
              <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-950/10 via-zinc-900/5 to-transparent blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-start mb-8">
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-mono tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>NOX SHIELD ACTIVE · ETH SEPOLIA</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-8 text-left">
                    <div className="space-y-6 max-w-xl">
                      <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
                          THE PRIVACY <br />
                          <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.25)]">WRAPPER</span> <br />
                          <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">FOR PUBLIC DEFI</span>
                        </h1>
                        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                          Securely deposit USDC into ShadeYield. Our smart contracts automatically route liquidity into yield strategies while wrapping and encrypting your shares using <strong className="text-red-400">iExec Nox Trusted Execution Environments</strong>. Not even the smart contract knows what you own.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <button id="hero-cta-enter" onClick={() => setCurrentView('app')} className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 group cursor-pointer">
                          Launch ShadeYield Terminal
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-red-200" />
                        </button>
                        <button onClick={() => { const archSection = document.getElementById('architecture-map'); if (archSection) archSection.scrollIntoView({ behavior: 'smooth' }); }} className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                          <Layers className="w-4 h-4 text-red-400" /> Architecture
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center">
                    <div onClick={() => setIsArtCardFlipped(!isArtCardFlipped)} className="relative cursor-pointer select-none w-full max-w-[340px]" style={{ perspective: '1200px' }}>
                      <motion.div animate={{ rotateY: isArtCardFlipped ? 180 : 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} style={{ transformStyle: 'preserve-3d' }} className="relative w-full h-[450px] rounded-2xl">
                        <div className="absolute inset-0 w-full h-full rounded-2xl border border-zinc-900 bg-zinc-950/90 overflow-hidden flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: 'hidden' }}>
                          <NoxHexDecryptionRain />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[120%] h-[2px] bg-red-600/10 blur-[3px] rotate-[-12deg] absolute" />
                            <div className="w-[120%] h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/40 to-red-500/0 rotate-[-12deg] absolute animate-pulse" />
                            <div className="w-[240px] h-[240px] rounded-full border-2 border-red-600/10 border-t-red-600/20 blur-[2px] rotate-[45deg] absolute" />
                          </div>
                          <div className="relative mb-6 select-none group scale-90">
                            <div className={`absolute -inset-8 rounded-full bg-red-600/20 blur-3xl transition-all duration-700 ${isNoxDecrypted ? 'bg-red-600/15' : 'bg-red-600/20'}`} />
                            <div className="relative z-10 flex flex-col items-center">
                              <motion.div initial={{ y: 0 }} animate={{ y: isNoxDecrypted ? -12 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }} className={`w-20 h-14 rounded-t-full border-8 bg-transparent transition-colors duration-700 ${isNoxDecrypted ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]'}`} />
                              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} className={`w-28 h-20 rounded-2xl p-[2px] -mt-1 shadow-2xl transition-all duration-700 ${isNoxDecrypted ? 'bg-gradient-to-b from-red-400 to-red-600 shadow-red-500/20' : 'bg-gradient-to-b from-red-600 to-red-800 shadow-red-600/30'}`}>
                                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex flex-col items-center justify-center p-3 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                  <div className={`w-4 h-8 rounded-full relative flex flex-col items-center justify-between py-1 shadow-inner transition-colors duration-700 ${isNoxDecrypted ? 'bg-red-500/20' : 'bg-red-600/20'}`}>
                                    <div className={`w-2 h-2 rounded-full transition-colors duration-700 ${isNoxDecrypted ? 'bg-red-400' : 'bg-red-600'}`} />
                                    <div className={`w-1 h-4 rounded-sm transition-colors duration-700 ${isNoxDecrypted ? 'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]' : 'bg-red-600 shadow-[0_0_6px_rgba(239,68,68,0.6)]'}`} />
                                  </div>
                                  <span className="text-[6px] font-mono tracking-widest text-zinc-600 uppercase mt-1">NOX CHIP</span>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                          <div className="w-full rounded-xl border bg-zinc-950/80 backdrop-blur-md p-4 border-red-500/20 overflow-hidden relative">
                            <motion.div animate={{ top: ['-20%', '120%'] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }} className="absolute left-0 w-full h-[2px] bg-red-500/40 shadow-[0_0_8px_#ef4444] pointer-events-none" />
                            <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-900/60">
                              <div className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span><span className="text-[7px] font-mono font-bold tracking-widest text-red-400 uppercase">NOX PROTOCOL</span></div>
                              <div className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20"><span className="text-[5px] text-red-400 font-mono">SECURE</span></div>
                            </div>
                            <div className="text-center space-y-1">
                              <span className="text-[7px] font-mono tracking-widest text-zinc-500 uppercase font-bold">CRYPTO SHIELD</span>
                              <h3 className="text-xs font-black tracking-tight text-white uppercase leading-none">
                                {isNoxDecrypted ? <span className="text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]">DECRYPTED OK</span> : <span className="text-red-600 drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]">ENCRYPTED STATE</span>}
                              </h3>
                              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/15 to-transparent" />
                              <p className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider">iExec TEE SHIELDED</p>
                            </div>
                          </div>
                          <div className="absolute bottom-4 text-[10px] text-zinc-500 font-mono flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-red-500 animate-spin-slow" /><span>Click Card to Flip</span></div>
                        </div>
                        <div className="absolute inset-0 w-full h-full rounded-2xl border border-red-500/40 bg-gradient-to-br from-black via-red-950/40 to-zinc-950 overflow-hidden flex flex-col p-6 shadow-2xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                          <NoxHexDecryptionRain />
                          <div className="h-full flex flex-col justify-between relative z-10">
                            <div className="flex items-center justify-between pb-2 border-b border-red-950/60">
                              <div className="flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-red-500" /><span className="text-[9px] font-mono font-bold text-red-400 tracking-widest uppercase">NOX CORE</span></div>
                              <span className="text-[8px] text-zinc-500 font-mono">ENCLAVE SECURE</span>
                            </div>
                            <div className="space-y-3 my-auto">
                              <div className="p-3 bg-black/70 rounded-lg border border-red-950/40 space-y-1">
                                <span className="text-[8px] font-mono text-zinc-500 uppercase font-black block">PUBLIC-SHARE COMPONENT</span>
                                <div className="font-mono text-[9px] text-zinc-400 leading-none truncate">Pubkey: <span className="text-red-400">0x03a893c8df9e8...9a21</span></div>
                                <div className="font-mono text-[9px] text-zinc-400 leading-none truncate mt-0.5">Proof: <span className="text-red-500">0xf3e28...ad73bc</span></div>
                              </div>
                              <div className="p-3 bg-black/70 rounded-lg border border-red-950/40 space-y-1">
                                <span className="text-[8px] font-mono text-zinc-500 uppercase font-black block">ENCLAVE ATTESTATION</span>
                                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400"><span>SGX-MRENCLAVE:</span><span className="text-red-400 font-bold">VERIFIED</span></div>
                                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400"><span>ATTESTATION LEVEL:</span><span className="text-red-500 font-bold">HARDENED</span></div>
                              </div>
                            </div>
                            <div className="border-t border-red-950/50 pt-2 flex items-center justify-between text-[8px] font-mono text-zinc-500"><span>CLICK TO RE-FLIP</span><span className="text-red-500 font-bold">NOX CHIP</span></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto p-1.5 rounded-2xl bg-zinc-900/40 border border-zinc-900 backdrop-blur-sm mt-16">
                  <div className="p-4 text-center rounded-xl bg-zinc-950/50 border border-zinc-900/50">
                    <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Total Value Locked</span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">
                      ${contractsLoaded ? (parseFloat(formatUnits(simpleTotalAssets, D))).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '—'} USDC
                    </span>
                    <span className="block text-[10px] text-red-500 font-medium mt-1">Live · ETH Sepolia · Nox Encrypted</span>
                  </div>
                  <div className="p-4 text-center rounded-xl bg-zinc-950/50 border border-zinc-900/50">
                    <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Network</span>
                    <span className="text-xl sm:text-2xl font-black text-red-500 font-mono">ETH Sepolia</span>
                    <span className="block text-[10px] text-zinc-500 font-medium mt-1">Chain ID: 11155111</span>
                  </div>
                  <div className="p-4 text-center rounded-xl bg-zinc-950/50 border border-zinc-900/50">
                    <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Vault Type</span>
                    <span className="text-xl sm:text-2xl font-black text-red-400 font-mono">Dual</span>
                    <span className="block text-[10px] text-red-500/70 font-medium mt-1">Simple + Nox Encrypted</span>
                  </div>
                  <div className="p-4 text-center rounded-xl bg-zinc-950/50 border border-zinc-900/50">
                    <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Privacy</span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">Nox TEE</span>
                    <span className="block text-[10px] text-emerald-400 font-medium mt-1">iExec Confidential</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Three Pillars Section */}
            <section id="about-decentralization" className="py-20 lg:py-28 bg-gradient-to-br from-white via-red-50 to-red-100 border-b border-red-200 relative overflow-hidden">
              <div className="absolute top-10 left-10 w-96 h-96 bg-red-200/20 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-red-100/30 blur-[130px] rounded-full pointer-events-none animate-pulse" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">Architected for <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Maximum Privacy & Security</span></h2>
                  <p className="text-zinc-600 font-medium">ShadeYield bridges the gap between public ledger capital efficiency and absolute financial privacy by wrapping standard yield pools inside cryptographic enclaves.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: <Cpu className="w-6 h-6 text-red-500" />, title: 'Non-Custodial & Decentralized', desc: 'Capital routes directly from your wallet to underlying smart contracts. ShadeYield maintains no custody, utilizes non-upgradeable base contracts, and allows instantaneous withdrawals at any time.' },
                    { icon: <ShieldCheck className="w-6 h-6 text-red-600" />, title: 'Cryptographic TEE Security', desc: 'By utilizing iExec Nox technology, balance modifications execute securely inside hardware-enforced Trusted Execution Environments (TEEs).' },
                    { icon: <Lock className="w-6 h-6 text-red-500" />, title: 'User-Owned Encrypted Shares', desc: 'Your share state is encrypted using Nox encrypted types. Not even the smart contract owner or block explorers can view how much you hold.' },
                  ].map((pillar, i) => (
                    <motion.div key={i} initial={{ y: 0 }} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: i * 0.4 }}
                      whileHover={{ y: -14, scale: 1.025, boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.12)", borderColor: "rgba(239, 68, 68, 0.25)" }}
                      className="p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-red-100 shadow-[0_10px_30px_rgba(239,68,68,0.03)] transition-all group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{pillar.icon}</div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-3">{pillar.title}</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed mb-4">{pillar.desc}</p>
                      <ul className="text-xs font-mono space-y-2 mt-4 border-t border-red-100 pt-4">
                        <li className="flex items-center gap-2 text-zinc-500"><Check className="w-3 h-3 text-red-500" /> {i === 0 ? 'Zero protocol custody' : i === 1 ? 'Intel SGX Hardware Enclaves' : 'Local key derivation'}</li>
                        <li className="flex items-center gap-2 text-zinc-500"><Check className="w-3 h-3 text-red-500" /> {i === 0 ? 'Direct strategy routing' : i === 1 ? 'Real-time state verification' : 'Complete transaction stealth'}</li>
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Architecture Section */}
            <section id="architecture-map" className="py-20 lg:py-28 bg-zinc-950/60 border-b border-zinc-900 relative">
              <div className="absolute top-1/2 left-1/4 w-[450px] h-[250px] bg-red-950/15 blur-[120px] rounded-full pointer-events-none animate-pulse" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                  <div className="w-full lg:w-5/12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400 mb-4 font-mono"><Layers className="w-3.5 h-3.5 text-red-500" /> Dynamic Flowchart</div>
                    <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Protocol Flow Design</h2>
                    <p className="text-zinc-400 mb-6 text-sm leading-relaxed">Track how tokens and encryption keys flow between smart contracts, liquidity pools, and the iExec Nox secure enclave.</p>
                    <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-8">
                      <button onClick={() => { setActiveArchitectureFlow('simple'); setActiveNodeId('shade-gateway'); }} className={`py-3 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeArchitectureFlow === 'simple' ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'}`}>
                        <Unlock className="w-3.5 h-3.5 text-red-400" /> Simple Vault
                      </button>
                      <button onClick={() => { setActiveArchitectureFlow('encrypted'); setActiveNodeId('nox-engine'); }} className={`py-3 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeArchitectureFlow === 'encrypted' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-500/20 border border-red-500/30' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'}`}>
                        <Lock className="w-3.5 h-3.5 text-red-100 animate-pulse" /> Encrypted Vault
                      </button>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-900/90 border border-red-950/40 shadow-xl shadow-red-950/5 hover:border-red-500/20 transition-all">
                      <div className="flex items-center justify-between mb-3"><span className="text-xs font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/40">{nodeDetails[activeNodeId]?.category}</span><span className="text-xs text-zinc-500 font-mono">ID: #{nodeDetails[activeNodeId]?.id}</span></div>
                      <h3 className="text-lg font-bold text-white mb-2">{nodeDetails[activeNodeId]?.title}</h3>
                      <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{nodeDetails[activeNodeId]?.description}</p>
                      <div className="text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 font-sans leading-relaxed mb-4"><p className="font-semibold text-zinc-400 mb-1">Architecture Impact:</p>{nodeDetails[activeNodeId]?.details}</div>
                      <div className="mt-3"><span className="text-[10px] text-zinc-500 font-mono block mb-1">Integration Sample</span><pre className="text-[11px] font-mono text-red-300 bg-zinc-950 p-3 rounded-lg overflow-x-auto border border-red-950/30 max-h-40">{nodeDetails[activeNodeId]?.codeSnippet}</pre></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-7/12">
                    <span className="text-xs font-mono text-zinc-500 mb-3 block text-center lg:text-left">💡 Click any component below</span>
                    <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/30 border border-zinc-900/80 hover:border-red-950/50 backdrop-blur-sm relative overflow-hidden flex flex-col gap-6 transition-all shadow-[0_4px_30px_rgba(239,68,68,0.02)]">
                      {activeArchitectureFlow === 'encrypted' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />}
                      <div className="flex flex-col items-center">
                        <button onClick={() => setActiveNodeId('user-wallet')} className={`w-full max-w-sm p-4 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${activeNodeId === 'user-wallet' ? 'bg-zinc-800/90 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-900/50 hover:scale-[1.02]'}`}>
                          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center"><Wallet className="w-4.5 h-4.5 text-red-400" /></div><div><p className="text-xs text-zinc-400 leading-none">External Interface</p><h4 className="text-sm font-bold text-white mt-1">User Wallet</h4></div></div>
                          <ChevronRight className={`w-4 h-4 transition-transform ${activeNodeId === 'user-wallet' ? 'text-red-400 translate-x-1' : 'text-zinc-600'}`} />
                        </button>
                      </div>
                      <div className="flex justify-center -my-3"><div className="w-[1.5px] h-6 bg-gradient-to-b from-red-500 to-red-600 animate-pulse"></div></div>
                      <div className="flex flex-col items-center">
                        <button onClick={() => setActiveNodeId('shade-gateway')} className={`w-full max-w-sm p-4 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${activeNodeId === 'shade-gateway' ? 'bg-gradient-to-br from-red-950/20 to-zinc-900 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-900/50 hover:scale-[1.02]'}`}>
                          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center"><Cpu className="w-4.5 h-4.5 text-red-400 animate-spin-slow" /></div><div><p className="text-xs text-zinc-400 leading-none">Smart Contract</p><h4 className="text-sm font-bold text-white mt-1">ShadeYield Vault</h4></div></div>
                          <ChevronRight className={`w-4 h-4 transition-transform ${activeNodeId === 'shade-gateway' ? 'text-red-400 translate-x-1' : 'text-zinc-600'}`} />
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono text-center block">Yield Strategy</span>
                          <button onClick={() => setActiveNodeId('aave-yield')} className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${activeNodeId === 'aave-yield' ? 'bg-zinc-800/90 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-red-900/50 hover:scale-[1.02]'}`}>
                            <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-xs text-red-400 font-bold font-mono">S</span><div><h5 className="text-xs font-bold text-white">HoldStrategy</h5><p className="text-[10px] text-zinc-500">Replaceable yield source</p></div></div>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeNodeId === 'aave-yield' ? 'text-red-400 translate-x-1' : 'text-zinc-600'}`} />
                          </button>
                        </div>
                        <div className="flex flex-col gap-4">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono text-center block">Share State</span>
                          {activeArchitectureFlow === 'simple' ? (
                            <div className="grow p-4 rounded-xl border border-dashed border-red-900/40 bg-zinc-950 flex flex-col justify-center items-center text-center">
                              <Unlock className="w-7 h-7 text-red-400 mb-2" /><p className="text-xs font-bold text-white">Public Balance Registry</p><p className="text-[10px] text-zinc-500 mt-1">Shares stored as normal ERC-20 balances.</p>
                            </div>
                          ) : (
                            <button onClick={() => setActiveNodeId('nox-engine')} className={`grow p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${activeNodeId === 'nox-engine' ? 'bg-gradient-to-br from-red-950/20 to-zinc-900 border-red-500 ring-1 ring-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]' : 'bg-red-950/10 hover:bg-red-950/25 border-red-900/50 hover:border-red-500/40 hover:scale-[1.02]'}`}>
                              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-xl rounded-full"></div>
                              <div className="flex items-center justify-between mb-2"><span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-800">iExec TEE Active</span><Lock className="w-4 h-4 text-red-400 animate-pulse" /></div>
                              <div><h5 className="text-xs font-bold text-white">Nox Encrypted State</h5><p className="text-[10px] text-zinc-400 mt-1">Shares encrypted as Nox euint256. Only you can decrypt.</p></div>
                              <div className="mt-4 flex items-center justify-between border-t border-red-950/40 pt-2 text-[9px] text-red-300 font-mono w-full"><span>TEE State</span><span className="text-red-400 font-bold animate-pulse">SECURE</span></div>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-zinc-950/40 border-b border-zinc-900 relative overflow-hidden">
              <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-red-950/60 via-zinc-950/95 to-red-900/30 border border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.22)] relative overflow-hidden group">
                      <span className="text-xs text-red-400 font-mono font-extrabold uppercase tracking-widest block mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>iExec Nox Secured</span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 leading-tight">Privacy Yield <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Revolution</span></h2>
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">Deposit USDC into ShadeYield and earn yield while your balances stay encrypted. No one sees what you hold — not even the vault.</p>
                      <div className="space-y-3 border-t border-red-950/60 pt-6">
                        <div className="flex items-start gap-2.5 text-xs text-zinc-300"><Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /><span>No custody of private keys or credentials</span></div>
                        <div className="flex items-start gap-2.5 text-xs text-zinc-300"><Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /><span>Hardware TEE Isolation prevents frontrunning</span></div>
                        <div className="flex items-start gap-2.5 text-xs text-zinc-300"><Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /><span>Fully compatible with standard Web3 workflows</span></div>
                      </div>
                      <div className="mt-8 flex items-center gap-4 text-[10px] text-zinc-500 font-mono">
                        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-red-500/60" /> TEE Sealed</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-red-500/60" /> ETH Sepolia</span>
                      </div>
                    </motion.div>
                  </div>
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-zinc-400 font-semibold uppercase tracking-wider">Compare Vaults:</span>
                      <div className="flex gap-2">
                        <button onClick={() => setActiveCompareCard('simple')} className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${activeCompareCard === 'simple' ? 'bg-zinc-800 border border-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>Simple</button>
                        <button onClick={() => setActiveCompareCard('encrypted')} className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${activeCompareCard === 'encrypted' ? 'bg-gradient-to-r from-red-950/60 to-red-900/40 border border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'text-zinc-500 hover:text-zinc-300'}`}>Encrypted</button>
                      </div>
                    </div>
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-red-500/20 via-zinc-950 to-red-950/40 border border-red-900/30 shadow-2xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                      <div className="p-6 sm:p-8 grow flex flex-col justify-between">
                        <motion.div key={activeCompareCard} initial={{ opacity: 0, x: activeCompareCard === 'simple' ? -50 : 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: activeCompareCard === 'simple' ? 50 : -50 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeCompareCard === 'simple' ? 'bg-zinc-900 border border-zinc-800 text-zinc-400' : 'bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse'}`}>
                                {activeCompareCard === 'simple' ? <Unlock className="w-5 h-5 text-red-400" /> : <Lock className="w-5 h-5 text-red-500" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2"><h3 className="text-xl font-bold text-white">{activeCompareCard === 'simple' ? 'Simple Vault' : 'Encrypted Vault'}</h3><span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${activeCompareCard === 'simple' ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-red-500/20 text-red-300 border border-red-800'}`}>{activeCompareCard === 'simple' ? 'Transparent' : 'Nox Wrapped'}</span></div>
                                <p className="text-xs text-zinc-400 mt-0.5">Yield vault with on-chain allocation</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-[10px] text-zinc-500 uppercase block font-mono">Privacy</span><span className={`text-xs font-bold font-mono block mt-1 ${activeCompareCard === 'simple' ? 'text-red-400' : 'text-emerald-400'}`}>{activeCompareCard === 'simple' ? 'Public' : 'Encrypted'}</span></div>
                            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-[10px] text-zinc-500 uppercase block font-mono">Shares</span><span className={`text-xs font-bold font-mono block mt-1 ${activeCompareCard === 'simple' ? 'text-red-400' : 'text-emerald-400'}`}>{activeCompareCard === 'simple' ? 'ERC-20' : 'Nox euint256'}</span></div>
                            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-[10px] text-zinc-500 uppercase block font-mono">MEV Shield</span><span className={`text-xs font-bold font-mono block mt-1 ${activeCompareCard === 'simple' ? 'text-zinc-500' : 'text-emerald-400'}`}>{activeCompareCard === 'simple' ? 'Vulnerable' : 'Protected'}</span></div>
                            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900"><span className="text-[10px] text-zinc-500 uppercase block font-mono">Decrypt</span><span className="text-xs font-bold font-mono text-white block mt-1">{activeCompareCard === 'simple' ? 'N/A' : 'Nox API'}</span></div>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 leading-relaxed">
                            {activeCompareCard === 'simple' ? (
                              <p><strong className="text-white">On-chain exposure:</strong> Share balances and holdings are written directly in public smart contract variables. Any block explorer can link your identity and balances.</p>
                            ) : (
                              <p><strong className="text-white">Confidential state:</strong> Your shares are encrypted as Nox euint256 ciphertext. Only you can trigger decryption via the Nox TEE. Outside watchers see zero linked balance metrics.</p>
                            )}
                          </div>
                          <div><div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1"><span>Privacy Score</span><span>{activeCompareCard === 'simple' ? '1 / 10' : '10 / 10'}</span></div>
                            <div className="h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800"><motion.div initial={{ width: 0 }} animate={{ width: activeCompareCard === 'simple' ? '10%' : '100%' }} transition={{ duration: 0.8, ease: "easeOut" }} className={`h-full rounded-full ${activeCompareCard === 'simple' ? 'bg-red-500' : 'bg-gradient-to-r from-red-600 via-red-500 to-emerald-500'}`} /></div>
                          </div>
                        </motion.div>
                      </div>
                      <div className="border-t border-red-950/40 p-4 bg-zinc-950/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 ml-4">
                          <button onClick={() => setActiveCompareCard('simple')} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeCompareCard === 'simple' ? 'bg-red-500 w-6' : 'bg-zinc-700 hover:bg-zinc-600'}`} />
                          <button onClick={() => setActiveCompareCard('encrypted')} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeCompareCard === 'encrypted' ? 'bg-red-500 w-6' : 'bg-zinc-700 hover:bg-zinc-600'}`} />
                        </div>
                        <button onClick={() => setActiveCompareCard(prev => prev === 'simple' ? 'encrypted' : 'simple')} className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5 border border-zinc-800 cursor-pointer">
                          {activeCompareCard === 'simple' ? 'See Encrypted' : 'See Simple'} <ChevronRight className="w-4 h-4 text-red-500 animate-pulse" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: Terminal Dashboard */}
        {currentView === 'app' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
              <div><h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">ShadeYield Terminal</h1><p className="text-xs text-zinc-400 mt-1">Manage vaults, watch yield, decrypt balances.</p></div>
              {!walletConnected && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-300 max-w-md">
                  <Info className="w-5 h-5 shrink-0 text-red-400" />
                  <div><span className="font-bold">Wallet not connected.</span> Connect to view vault positions and deposit USDC on ETH Sepolia.
                    <button onClick={() => setShowWalletModal(true)} className="ml-2 underline hover:text-white font-semibold cursor-pointer">Connect now</button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Simple Vault Card */}
                  <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-900 hover:border-zinc-800 transition-all relative overflow-hidden flex flex-col min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">Simple Vault</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-900"><Unlock className="w-3 h-3" /> Transparent</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-6">
                          <span className="text-[10px] text-zinc-400 font-mono block">Deposited Balance</span>
                          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1 tracking-tight">
                            ${simpleVaultBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-[10px] text-zinc-500 font-normal ml-1">USDC</span>
                          </div>
                        </div>
                        <div className="md:col-span-6 grid grid-cols-2 gap-2 border-l border-zinc-850 pl-4">
                          <div><span className="text-[9px] text-zinc-500 font-mono uppercase block">Shares</span><span className="text-xs font-bold font-mono text-white block mt-0.5">{simpleVaultPrincipal.toFixed(4)} sUSDC</span></div>
                          <div><span className="text-[9px] text-zinc-500 font-mono uppercase block">Strategy TVL</span><span className="text-xs font-bold font-mono text-emerald-400 block mt-0.5">{formatUnits(aaveTotalAssets, D)} USDC</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-950/50 flex items-center justify-between text-xs">
                      <div><span className="text-zinc-500 block">Auto-Allocate</span><span className="font-bold text-white font-mono">Active ✅</span></div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-zinc-950/50">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Strategy</span>
                      <div className="mt-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-900 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-white block mb-1">HoldStrategy</span>
                        <span className="text-[9px] font-mono text-zinc-400">{formatUnits(aaveTotalAssets || 0n, D)} USDC managed</span>
                      </div>
                    </div>
                  </div>

                  {/* Encrypted Vault Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900/60 to-red-950/25 border border-red-900/30 hover:border-red-800/40 transition-all relative overflow-hidden flex flex-col min-h-[220px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-xl rounded-full"></div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">Encrypted Vault</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-900"><Lock className="w-3 h-3" /> Nox Protected</span>
                      </div>
                      {isNoxDecrypted ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-6">
                            <span className="text-[10px] text-zinc-400 font-mono block">Deposited Balance</span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-red-400 mt-1 tracking-tight animate-fade-in">
                              ${encryptedVaultBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              <span className="text-[10px] text-zinc-500 font-normal ml-1">USDC</span>
                            </div>
                          </div>
                          <div className="md:col-span-6 grid grid-cols-2 gap-2 border-l border-red-950/40 pl-4">
                            <div><span className="text-[9px] text-zinc-500 font-mono uppercase block">Shares</span><span className="text-xs font-bold font-mono text-white block mt-0.5">{encryptedVaultPrincipal.toFixed(4)} vUSDC</span></div>
                            <div><span className="text-[9px] text-zinc-500 font-mono uppercase block">Decrypted</span><span className="text-xs font-bold font-mono text-red-400 block mt-0.5 animate-pulse">Visible ✅</span></div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-6">
                            <span className="text-[10px] text-zinc-400 font-mono block">Deposited Balance</span>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm sm:text-base font-mono font-extrabold text-zinc-600 tracking-wider">🔒 Encrypted</span>
                              <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-900">Nox euint256</span>
                            </div>
                          </div>
                          <div className="md:col-span-6 grid grid-cols-2 gap-2 border-l border-red-950/40 pl-4">
                            <div><span className="text-[9px] text-zinc-500 font-mono uppercase block">Shares</span><span className="text-xs font-bold font-mono text-zinc-600 block mt-0.5">🔒 ENCRYPTED</span></div>
                            <div><span className="text-[9px] text-zinc-500 font-mono uppercase block">Yield</span><span className="text-xs font-bold font-mono text-zinc-600 block mt-0.5">🔒 ENCRYPTED</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-red-950/60 flex items-center justify-between text-xs">
                      <div><span className="text-zinc-500 block">Auto-Allocate</span><span className="font-bold text-white font-mono">Active ✅</span></div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-red-950/60">
                      <span className="text-[10px] text-red-400/80 font-mono uppercase tracking-wider block">Strategy</span>
                      <div className="mt-2 p-3 rounded-xl bg-zinc-950/60 border border-red-950/20">
                        <span className="text-[10px] font-bold text-white block mb-1">HoldStrategy (Enc)</span>
                        <span className="text-[9px] font-mono text-zinc-400">{formatUnits(uniTotalAssets || 0n, D)} USDC managed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deposit/Withdraw Panel */}
                <div id="defi-action-panel" className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-900 relative">
                  <div className="flex border-b border-zinc-800 mb-6">
                    <button onClick={() => { setActiveTab('deposit'); setAmountInput(''); }} className={`pb-3.5 px-6 font-bold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'deposit' ? 'border-red-500 text-red-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
                      <ArrowDownRight className="w-4 h-4" /> Deposit
                    </button>
                    <button onClick={() => { setActiveTab('withdraw'); setAmountInput(''); }} className={`pb-3.5 px-6 font-bold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'withdraw' ? 'border-red-500 text-red-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
                      <ArrowUpRight className="w-4 h-4" /> Withdraw
                    </button>
                  </div>

                  <form onSubmit={handleExecuteTransaction}>
                    <div className="mb-6">
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2.5">Choose Vault</label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div onClick={() => setSelectedVault('simple')} className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${selectedVault === 'simple' ? 'bg-red-950/25 border-red-500/80 ring-1 ring-red-500/20' : 'bg-zinc-950/30 border-zinc-800 hover:border-zinc-700'}`}>
                          <div className="flex items-center justify-between mb-2"><h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">Simple Vault <Unlock className="w-3.5 h-3.5 text-zinc-500" /></h4><span className="text-[10px] text-zinc-500 font-mono">Transparent</span></div>
                          <p className="text-[11px] text-zinc-400 leading-normal mb-2">Standard ERC-20 tracking. Wallet balances are publicly queryable.</p>
                          <div className="flex items-center justify-between border-t border-zinc-800 pt-2 mt-1 text-[11px] text-zinc-500"><span>Auto-Allocate: ✅</span><span>Gas: Normal</span></div>
                        </div>
                        <div onClick={() => setSelectedVault('encrypted')} className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${selectedVault === 'encrypted' ? 'bg-red-950/25 border-red-500/80 ring-1 ring-red-500/20' : 'bg-zinc-950/30 border-zinc-800 hover:border-zinc-700'}`}>
                          <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/5 blur-md rounded-full"></div>
                          <div className="flex items-center justify-between mb-2"><h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">Encrypted Vault <Lock className="w-3.5 h-3.5 text-red-400" /></h4><span className="text-[10px] text-red-400 font-mono font-bold">Nox Secure</span></div>
                          <p className="text-[11px] text-zinc-400 leading-normal mb-2">Balances encrypted inside iExec TEE. Private share allocation.</p>
                          <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 mt-1 text-[11px] text-zinc-500"><span className="text-red-400 font-semibold">Auto-Allocate: ✅</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">Amount to {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}</label>
                        <span className="text-xs text-zinc-500">
                          {activeTab === 'deposit' ? <>Wallet USDC: <strong className="text-zinc-300 font-mono">{walletBalanceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></>
                            : <>Balance: <strong className="text-zinc-300 font-mono">{selectedVault === 'simple' ? `${simpleVaultBalance.toFixed(2)}` : isNoxDecrypted ? `${encryptedVaultBalance.toFixed(2)}` : '🔒 Encrypted'}</strong></>}
                        </span>
                      </div>
                      <div className="flex items-center rounded-xl bg-zinc-950 border border-zinc-800 p-2 focus-within:border-red-500/50 transition-colors">
                        <input type="number" step="any" required value={amountInput} onChange={(e) => setAmountInput(e.target.value)} placeholder="0.00" disabled={isProcessingTx} className="grow bg-transparent border-0 outline-none text-lg font-mono text-white px-3 py-1.5" />
                        <div className="flex items-center gap-2 px-3">
                          <button type="button" onClick={() => { setAmountInput(activeTab === 'deposit' ? walletBalanceUSDC.toString() : String(selectedVault === 'simple' ? simpleVaultBalance : encryptedVaultBalance)); }} className="px-2 py-1 text-[10px] font-bold text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 transition-colors cursor-pointer">MAX</button>
                          <span className="text-sm font-mono font-bold text-zinc-300">USDC</span>
                        </div>
                      </div>
                    </div>

                    {activeTab === 'deposit' && (
                      <div className="mb-4 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 flex items-center gap-3">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div><span className="text-xs font-bold text-emerald-300">Auto-deploy to Strategy</span><p className="text-[10px] text-zinc-400 mt-0.5">Deposited USDC automatically allocated to strategy.</p></div>
                      </div>
                    )}

                    <button type="submit" disabled={isProcessingTx} className={`w-full py-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${isProcessingTx ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/20'}`}>
                      {isProcessingTx ? <><RefreshCw className="w-4.5 h-4.5 animate-spin" /> Processing...</>
                        : activeTab === 'deposit' ? <><ArrowDownRight className="w-4.5 h-4.5" /> Deposit & Auto-Deploy</>
                          : <><ArrowUpRight className="w-4.5 h-4.5" /> Request Withdraw</>}
                    </button>
                  </form>

                  {walletConnected && (
                    <button type="button" onClick={handleHarvest} className="mt-3 w-full py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer">
                      <Zap className="w-4 h-4" /> Harvest Yield
                    </button>
                  )}

                  {isProcessingTx && txStep > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-zinc-950 border border-zinc-900 animate-fade-in text-xs">
                      <p className="font-mono font-bold text-zinc-400 uppercase tracking-wider mb-3">Transaction Progress</p>
                      <div className="space-y-3 font-mono">
                        {txStep >= 1 && (
                          <div className="flex items-start gap-2.5">
                            {txStep > 1 ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" /> : <RefreshCw className="w-4.5 h-4.5 text-indigo-400 animate-spin shrink-0" />}
                            <div className={txStep === 1 ? 'text-zinc-200' : 'text-zinc-500'}><span>[1/2] USDC Approval</span>{txStep === 1 && <span className="block text-[10px] text-zinc-500 mt-1">Approving USDC spending...</span>}</div>
                          </div>
                        )}
                        {txStep >= 2 && (
                          <div className="flex items-start gap-2.5">
                            {txStep > 2 ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" /> : <RefreshCw className="w-4.5 h-4.5 text-indigo-400 animate-spin shrink-0" />}
                            <div className={txStep === 2 ? 'text-zinc-200' : 'text-zinc-500'}><span>[2/2] {activeTab === 'deposit' ? 'Deposit & Auto-Allocate' : 'Withdraw Request'}</span>{txStep === 2 && <span className="block text-[10px] text-zinc-500 mt-1">Executing on ETH Sepolia...</span>}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Nox Decryptor */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-red-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-2xl rounded-full pointer-events-none"></div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded bg-red-500/10 flex items-center justify-center"><Lock className="w-4 h-4 text-red-400" /></div>
                    <div><h3 className="text-sm font-bold text-white leading-none">Nox Decryptor</h3><span className="text-[10px] text-zinc-500 font-mono tracking-wider">TEE Client</span></div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-normal mb-4">Your encrypted vault balance is stored as private ciphertext. Decrypt using the Nox API to view your state.</p>
                  <div className="space-y-4 font-mono">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                      <div className="flex items-center justify-between mb-1"><span className="text-[10px] text-zinc-500 uppercase font-bold">Nox Key</span><span className="text-[10px] text-emerald-400 font-bold">SECURED</span></div>
                      <input type="password" readOnly value={noxPrivateKey} className="w-full bg-transparent border-0 outline-none text-red-300 font-mono text-xs mt-1 selection:bg-red-500/20" />
                    </div>

                    <button onClick={handleDecryptNoxShares} disabled={isDecrypting}
                      className={`w-full py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isNoxDecrypted
                          ? 'bg-zinc-800 text-red-300 border border-red-800 hover:bg-zinc-700'
                          : isDecrypting
                          ? 'bg-zinc-950 border border-zinc-800 text-zinc-500'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-950/40'
                      }`}>
                      {isDecrypting ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> DECRYPTING...</>
                        : isNoxDecrypted ? <><EyeOff className="w-3.5 h-3.5" /> Hide & Re-Encrypt</>
                          : <><Eye className="w-3.5 h-3.5" /> Decrypt Vault State</>}
                    </button>

                    {!isNoxDecrypted && !isDecrypting && (
                      <div className="text-[10px] text-zinc-500 text-center">💡 Click "Decrypt Vault State" to reveal your encrypted balance via Nox TEE</div>
                    )}

                    {isNoxDecrypted && (
                      <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-[11px] leading-normal text-red-300 animate-pulse">
                        <span className="font-bold">Decrypted:</span><br />
                        Shares: {encryptedVaultPrincipal.toFixed(4)} vUSDC<br />
                        Nox Auth: verified
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="mt-12 p-6 rounded-3xl bg-zinc-900/20 border border-zinc-900">
              <div className="flex items-center justify-between mb-6 border-b border-zinc-900 pb-4">
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2"><Activity className="w-4.5 h-4.5 text-indigo-400" /> Transaction Log</h3>
                <span className="text-xs text-zinc-500 font-mono">ETH Sepolia</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead><tr className="text-zinc-500 border-b border-zinc-900/50"><th className="pb-3 font-semibold">Hash</th><th className="pb-3 font-semibold">Action</th><th className="pb-3 font-semibold">Vault</th><th className="pb-3 font-semibold text-right">Amount</th><th className="pb-3 font-semibold">Time</th><th className="pb-3 font-semibold text-center">Status</th></tr></thead>
                  <tbody className="divide-y divide-zinc-900/40">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="text-zinc-300 hover:bg-zinc-900/10">
                        <td className="py-3.5 flex items-center gap-1.5 text-indigo-300">
                          <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 shrink-0">{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}<ExternalLink className="w-3 h-3 text-zinc-600" /></a>
                        </td>
                        <td className="py-3.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === 'Deposit' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/40'}`}>{tx.type}</span></td>
                        <td className="py-3.5 text-zinc-400">{tx.vault}</td>
                        <td className="py-3.5 text-right font-bold text-white">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3.5 text-zinc-500">{tx.timestamp}</td>
                        <td className="py-3.5 text-center"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 text-[10px]"><span className="w-1 h-1 rounded-full bg-emerald-400"></span>{tx.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <ShadeYieldLogo className="w-6 h-6" />
                <div className="flex items-center"><span className="font-extrabold text-base text-white tracking-tight">Shade</span><span className="font-extrabold text-base text-red-500 tracking-tight">Yield</span><span className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest ml-1.5 pt-0.5 border-l border-zinc-800 pl-1.5">Protocol</span></div>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-4">Encrypting DeFi share allocations through hardware TEEs. Powered by iExec Nox.</p>
              <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono"><span>Chain:</span><span className="text-red-400">ETH Sepolia · 11155111</span></div>
            </div>
            <div><span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-4">Contracts</span>
              <ul className="space-y-2 text-xs text-zinc-500 font-mono">
                <li>Simple Vault: <span className="text-zinc-400">0x2d5c88...77e0</span></li>
                <li>Encrypted Vault: <span className="text-zinc-400">0x39a54a...15d5</span></li>
                <li>TestUSDC: <span className="text-zinc-400">0xa77d03...82e</span></li>
              </ul>
            </div>
            <div><span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-4">Links</span>
              <ul className="space-y-2 text-xs text-zinc-500 font-mono">
                <li><a href="https://github.com/norbert351/ShadeYield" target="_blank" className="hover:text-red-400">GitHub</a></li>
                <li><a href="https://iex.ec" target="_blank" className="hover:text-red-400">iExec</a></li>
                <li><a href={`https://sepolia.etherscan.io/address/${SEPOLIA.SIMPLE}`} target="_blank" className="hover:text-red-400">Explorer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-zinc-600 font-mono">
            <span>© 2026 ShadeYield. Built on iExec Nox.</span>
            <span>WTF Hackathon · ETH Sepolia</span>
          </div>
        </div>
      </footer>

      {/* Wallet Connect Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowWalletModal(false)}>
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-black text-white">Connect Wallet</h3><button onClick={() => setShowWalletModal(false)} className="p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"><X className="w-5 h-5 text-zinc-400" /></button></div>
            <div className="space-y-3">
              {connectors.map((c) => (
                <button key={c.id} onClick={() => handleConnectWallet(c.name)} className="w-full p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-all text-left flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-zinc-700/50 flex items-center justify-center"><Wallet className="w-5 h-5 text-red-400" /></div>
                  <div><p className="text-sm font-bold text-white">{c.name}</p><p className="text-[10px] text-zinc-500">Connect to ETH Sepolia</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
