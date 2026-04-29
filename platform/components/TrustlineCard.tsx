'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Link2, RefreshCw, Coins } from 'lucide-react';
import { useTrustline } from '@/hooks/useTrustline';
import { fadeIn } from '@/lib/animations';
import { useState } from 'react';
import useSWR from 'swr';

export function TrustlineCard({ publicKey }: { publicKey: string }) {
  const { hasTrustline, rexBalance, rexLimit, isLoading, isAdding, addTrustline } =
    useTrustline(publicKey);
  const { isValidating } = useSWR(publicKey ? `/api/balance/${publicKey}` : null);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = async () => {
    await addTrustline();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 5000);
  };

  if (isLoading) {
    return (
      <div className="border border-[var(--border-subtle)] p-8 flex items-center gap-6 animate-pulse bg-[var(--bg-surface)]">
        <RefreshCw size={20} className="animate-spin text-[var(--text-secondary)]" />
        <div className="flex flex-col gap-3 w-full">
          <div className="h-4 bg-[var(--border-subtle)] w-1/3" />
          <div className="h-3 bg-[var(--border-subtle)] w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!hasTrustline ? (
        <motion.div
          key="warning"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border border-[var(--border-subtle)] p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center bg-[var(--bg-surface)]"
        >
          <div className="border border-[var(--border-subtle)] p-4 flex-shrink-0">
            <AlertCircle size={24} className="text-[var(--text-primary)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-medium text-lg text-[var(--text-primary)] uppercase tracking-widest">Trustline Required</h3>
            <p className="font-body text-[var(--text-secondary)] text-xs mt-2 leading-relaxed">
              To receive and swap REX tokens on the Stellar Network, you must first establish a trustline in your wallet.
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="btn-primary w-full sm:w-auto px-10 py-4 disabled:opacity-20 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]"
          >
            {isAdding ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <>
                <Link2 size={16} />
                <span>Establish Trust</span>
              </>
            )}
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="active"
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="border border-[var(--border-subtle)] p-8 flex flex-col gap-10 bg-[var(--bg-surface)]"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-2 border border-[var(--border-subtle)]">
                <CheckCircle2 size={20} className="text-[var(--text-primary)]" />
              </div>
              <h3 className="font-display text-sm font-medium text-[var(--text-primary)] uppercase tracking-widest">Trustline Active</h3>
            </div>
            <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase border border-[var(--border-subtle)] px-3 py-1">
              Limit: {parseFloat(rexLimit).toLocaleString()}
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-[var(--border-subtle)] pt-8">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Asset Balance</span>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-4xl font-medium text-[var(--text-primary)] leading-none">
                  {parseFloat(rexBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
                <span className="font-display text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">REX</span>
              </div>
            </div>
            <RefreshCw
              size={14}
              className={`text-[var(--text-secondary)] transition-colors ${isValidating ? 'animate-spin text-[var(--text-primary)]' : ''}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
