'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wallet, CheckCircle2, ExternalLink } from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';
import { useRexBalance } from '@/hooks/useRexBalance';
import { usePoolStats } from '@/hooks/usePoolStats';
import { useRexPrice } from '@/hooks/useRexPrice';
import { fadeIn } from '@/lib/animations';
import { AnimatedNumber } from '@/components/AnimatedNumber';

export function LiquidityCard() {
  const { isConnected, connect, publicKey } = useFreighter();
  const { rexBalance, xlmBalance, mutate: mutateREX } = useRexBalance(publicKey);
  const { tvl, xlmReserve, rexReserve, apy, isLoading, mutate: mutatePool } = usePoolStats();
  const { price } = useRexPrice();
  
  const [tab, setTab] = useState<'add' | 'remove'>('add');
  const [rexAmt, setRexAmt] = useState('');
  const [xlmAmt, setXlmAmt] = useState('');
  const [lpAmt, setLpAmt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ txHash: string } | null>(null);

  const rexReserveNum = parseFloat(rexReserve) || 0;
  const xlmReserveNum = parseFloat(xlmReserve) || 0;
  
  const priceVal = parseFloat(price) || 0.05;
  const ratio = (rexReserveNum > 0 && xlmReserveNum > 0) 
    ? xlmReserveNum / rexReserveNum 
    : priceVal;

  const handleRexChange = (v: string) => {
    setRexAmt(v);
    if (!v) {
      setXlmAmt('');
    } else {
      setXlmAmt((parseFloat(v) * ratio).toFixed(6));
    }
  };

  const handleXlmChange = (v: string) => {
    setXlmAmt(v);
    if (!v) {
      setRexAmt('');
    } else {
      setRexAmt((parseFloat(v) / ratio).toFixed(6));
    }
  };

  const submit = async () => {
    if (!isConnected || !publicKey) return connect();
    if (tab === 'add' && (!rexAmt || parseFloat(rexAmt) <= 0)) return;
    if (tab === 'remove' && (!lpAmt || parseFloat(lpAmt) <= 0)) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/liquidity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey,
          action: tab,
          rexAmt,
          xlmAmt,
          lpAmt
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to prepare liquidity transaction');

      const { signTransaction } = await import('@stellar/freighter-api');
      const signedResult = await signTransaction(data.xdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
      });
      const signedXDR = typeof signedResult === 'string' 
        ? signedResult 
        : (signedResult as any)?.signedTxXdr;

      if (!signedXDR) throw new Error('Signing failed or rejected by user');

      const { Horizon, TransactionBuilder } = await import('@stellar/stellar-sdk');
      const horizon = new Horizon.Server('https://horizon-testnet.stellar.org');
      const tx = TransactionBuilder.fromXDR(signedXDR, 'Test SDF Network ; September 2015');
      const submitRes = await horizon.submitTransaction(tx as any);
      
      setSuccess({ txHash: submitRes.hash });
      setRexAmt(''); setXlmAmt(''); setLpAmt('');
      mutateREX();
      mutatePool();
    } catch (e: any) {
      console.error(e);
      alert("Transaction failed: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto relative">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="border border-[var(--border-subtle)] p-12 text-center flex flex-col items-center gap-8 bg-[var(--bg-surface)]"
          >
            <div className="p-4 border border-[var(--border-subtle)]">
              <CheckCircle2 size={32} className="text-[var(--text-primary)]" />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] uppercase tracking-tight">POOL UPDATED</h2>
              <p className="font-body text-sm text-[var(--text-secondary)]">Your liquidity position has been successfully adjusted.</p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <a href={`https://stellar.expert/explorer/testnet/tx/${success.txHash}`} target="_blank" className="flex items-center justify-center gap-2 text-[var(--text-primary)] text-xs font-medium border border-[var(--border-subtle)] py-3 hover:bg-[rgba(255,255,255,0.05)] transition-all">
                VIEW ON EXPLORER <ExternalLink size={14} />
              </a>
              <button onClick={() => setSuccess(null)} className="text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">
                Back to Pool
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="border border-[var(--border-subtle)] p-8 flex flex-col gap-8 relative z-10 bg-[var(--bg-surface)]"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-display text-sm font-medium text-[var(--text-primary)] uppercase tracking-widest">Liquidity</h2>
              <div className="font-mono text-[10px] text-[var(--text-primary)] border border-[var(--border-subtle)] px-2 py-0.5">
                {apy}% APY
              </div>
            </div>

            <div className="flex border-b border-[var(--border-subtle)]">
              {(['add', 'remove'] as const).map((t) => {
                const isActive = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 pb-3 text-[10px] font-mono uppercase tracking-widest transition-colors relative ${
                      isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {t === 'add' ? 'Deposit' : 'Withdraw'}
                    {isActive && (
                      <motion.div
                        layoutId="poolTab"
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--text-primary)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                {tab === 'add' ? (
                  <>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">REX</span>
                        <button 
                          onClick={() => handleRexChange(rexBalance)}
                          className="font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          Bal: {parseFloat(rexBalance).toFixed(2)}
                        </button>
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={rexAmt}
                        onChange={(e) => handleRexChange(e.target.value)}
                        className="font-mono text-3xl text-[var(--text-primary)] bg-transparent border-none outline-none w-full border-b border-[var(--border-subtle)] pb-4 focus:border-[var(--text-primary)] transition-colors placeholder:text-[rgba(255,255,255,0.05)]"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">XLM</span>
                        <button 
                          onClick={() => handleXlmChange(xlmBalance)}
                          className="font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          Bal: {parseFloat(xlmBalance).toFixed(2)}
                        </button>
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={xlmAmt}
                        onChange={(e) => handleXlmChange(e.target.value)}
                        className="font-mono text-3xl text-[var(--text-primary)] bg-transparent border-none outline-none w-full border-b border-[var(--border-subtle)] pb-4 focus:border-[var(--text-primary)] transition-colors placeholder:text-[rgba(255,255,255,0.05)]"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">LP Tokens</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={lpAmt}
                      onChange={(e) => setLpAmt(e.target.value)}
                      className="font-mono text-3xl text-[var(--text-primary)] bg-transparent border-none outline-none w-full border-b border-[var(--border-subtle)] pb-4 focus:border-[var(--text-primary)] transition-colors placeholder:text-[rgba(255,255,255,0.05)]"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center py-4 border-t border-[var(--border-subtle)]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Est. Share</span>
              <span className="font-mono text-[10px] text-[var(--text-primary)]">
                <AnimatedNumber value={tab === 'add' ? 1.25 : 0.85} suffix="%" decimals={2} />
              </span>
            </div>

            <button
              onClick={submit}
              disabled={isSubmitting || (tab === 'add' && !rexAmt) || (tab === 'remove' && !lpAmt)}
              className="w-full btn-primary h-[52px] flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-widest text-xs font-bold"
            >
              {isSubmitting ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : isConnected ? (
                <span>{tab === 'add' ? 'Confirm Deposit' : 'Confirm Withdrawal'}</span>
              ) : (
                <>
                  <Wallet size={16} />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
