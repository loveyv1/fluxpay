'use client';
import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Loader2, RefreshCw, Coins, Droplets } from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';
import { BottomNav } from '@/components/BottomNav';
import { fadeIn } from '@/lib/animations';

// --- Subcomponents ---

const MintCard = memo(function MintCard({ publicKey }: { publicKey: string }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const mint = async () => {
    if (!recipient || !amount) {
      setResult({ ok: false, msg: 'Recipient and Amount are required' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/mint', {
        method: 'POST',
        body: JSON.stringify({ recipient, amount, callerPubKey: publicKey }),
      });
      const data = await res.json();
      setResult({ ok: !!data.hash, msg: data.hash ? `Transaction confirmed: ${data.hash.slice(0, 16)}...` : data.error || 'Mint execution failed' });
    } catch {
      setResult({ ok: false, msg: 'Network failure' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <div className="p-3 border border-[var(--border-subtle)] text-[var(--text-primary)]">
          <Coins size={20} />
        </div>
        <div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-[var(--text-primary)]">Asset Issuance</h2>
          <p className="text-[10px] font-mono uppercase text-[var(--text-secondary)] mt-1">Stellar Testnet Minting</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)]">Destination Address</label>
            <button 
              onClick={() => setRecipient(publicKey)}
              className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Set To self
            </button>
          </div>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="G..."
            className="bg-transparent border border-[var(--border-subtle)] px-4 py-3 text-[10px] font-mono text-[var(--text-primary)] focus:border-[var(--text-primary)] outline-none transition-colors uppercase"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)]">Quantity</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent border border-[var(--border-subtle)] px-4 py-3 text-lg font-mono text-[var(--text-primary)] focus:border-[var(--text-primary)] outline-none transition-colors"
          />
        </div>
      </div>

      <button
        onClick={mint}
        disabled={loading}
        className="w-full btn-primary h-[52px] disabled:opacity-20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] font-bold"
      >
        {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Confirm Mint'}
      </button>

      {result && (
        <div className={`p-4 border font-mono text-[9px] uppercase tracking-widest ${result.ok ? 'border-[var(--border-subtle)] text-[var(--text-primary)]' : 'border-red-900 text-red-500'}`}>
          {result.msg}
        </div>
      )}
    </div>
  );
});

const PoolStatsCard = memo(function PoolStatsCard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try { setStats(await (await fetch('/api/pool')).json()); } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 border border-[var(--border-subtle)] text-[var(--text-primary)]">
            <Droplets size={20} />
          </div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-[var(--text-primary)]">Pool Metrics</h2>
        </div>
        <button onClick={refresh} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        </button>
      </div>

      {!stats && !loading ? (
        <div className="py-20 text-center text-[var(--text-secondary)] text-[9px] font-mono uppercase tracking-[0.3em]">No Data Available</div>
      ) : stats && (
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'REX Reserve', val: stats.rexReserve, unit: 'REX' },
            { label: 'XLM Reserve', val: stats.xlmReserve, unit: 'XLM' },
            { label: 'Network Price', val: stats.price, unit: 'XLM/REX' },
          ].map((s) => (
            <div key={s.label} className="border border-[var(--border-subtle)] p-6 flex flex-col gap-2">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)]">{s.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-mono text-[var(--text-primary)]">{parseFloat(s.val || 0).toLocaleString()}</p>
                <p className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">{s.unit}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// --- Main Page ---

export default function AdminPage() {
  const { isConnected, connect, publicKey, isLoading } = useFreighter();

  if (isLoading) return (
    <main className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center p-6">
      <Loader2 size={32} className="animate-spin text-[var(--text-secondary)]" />
    </main>
  );

  if (!isConnected) return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-void)] p-6">
      <motion.div variants={fadeIn} initial="initial" animate="animate" className="border border-[var(--border-subtle)] max-w-[420px] w-full text-center flex flex-col items-center gap-10 p-12 bg-[var(--bg-surface)]">
        <div className="border border-[var(--border-subtle)] p-8">
          <Lock size={32} className="text-[var(--text-primary)]" />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-display font-medium uppercase tracking-widest text-[var(--text-primary)]">Restricted</h1>
          <p className="text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-widest">Connect administrative wallet to access the console.</p>
        </div>
        <button className="w-full btn-primary h-[52px] uppercase tracking-widest text-[10px] font-bold" onClick={connect}>
          Initiate Authentication
        </button>
      </motion.div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[var(--bg-void)] p-6 pt-32 pb-32">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="flex items-center gap-6">
          <div className="border border-[var(--border-subtle)] p-5 text-[var(--text-primary)]">
            <Shield size={24} />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-display font-medium uppercase tracking-tight text-[var(--text-primary)]">Console</h1>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
              <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-widest break-all">
                {typeof publicKey === 'string' 
                  ? publicKey 
                  : (publicKey as any)?.address || (publicKey as any)?.publicKey || String(publicKey)}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <MintCard publicKey={publicKey} />
          </motion.div>
          <motion.div variants={fadeIn} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
            <PoolStatsCard />
          </motion.div>
        </div>
        
      </div>
      <BottomNav />
    </main>
  );
}
