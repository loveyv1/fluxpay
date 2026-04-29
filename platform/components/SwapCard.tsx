'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Wallet, CheckCircle2, RefreshCw, ExternalLink, ChevronDown } from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';
import { useRexBalance } from '@/hooks/useRexBalance';
import { useRexPrice } from '@/hooks/useRexPrice';
import { fadeIn } from '@/lib/animations';
import useSWR from 'swr';

export function SwapCard() {
  const { isConnected, connect, publicKey } = useFreighter();
  const { rexBalance, xlmBalance } = useRexBalance(publicKey);
  const { price, isLoading: priceLoading } = useRexPrice();
  const { isValidating } = useSWR('/api/price');

  const [dir, setDir] = useState<'REX_TO_XLM' | 'XLM_TO_REX'>('REX_TO_XLM');
  const [amountIn, setAmountIn] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [success, setSuccess] = useState<{ txHash: string } | null>(null);

  const fromToken = dir === 'REX_TO_XLM' ? 'REX' : 'XLM';
  const toToken   = dir === 'REX_TO_XLM' ? 'XLM' : 'REX';
  const fromBal   = dir === 'REX_TO_XLM' ? rexBalance : xlmBalance;
  const priceVal  = parseFloat(price) || 0.05;
  const amountOut = amountIn
    ? (dir === 'REX_TO_XLM'
        ? (parseFloat(amountIn) * priceVal).toFixed(6)
        : (parseFloat(amountIn) / priceVal).toFixed(6))
    : '';

  const flip = () => {
    setDir((d) => (d === 'REX_TO_XLM' ? 'XLM_TO_REX' : 'REX_TO_XLM'));
    setAmountIn('');
  };

  const doSwap = async () => {
    if (!isConnected) return connect();
    if (!amountIn || parseFloat(amountIn) <= 0) return;
    
    setIsSwapping(true);
    try {
      const res = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey,
          dir,
          amountIn,
          amountOut
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to prepare swap');

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
      setAmountIn('');
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Swap failed");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto">
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
              <h2 className="font-display text-2xl font-medium text-[var(--text-primary)] tracking-tight">TRANSACTION CONFIRMED</h2>
              <p className="font-body text-sm text-[var(--text-secondary)]">The swap has been successfully executed on the Stellar Network.</p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${success.txHash}`} 
                target="_blank" 
                className="flex items-center justify-center gap-2 text-[var(--text-primary)] text-xs font-medium border border-[var(--border-subtle)] py-3 hover:bg-[rgba(255,255,255,0.05)] transition-all"
              >
                VIEW ON EXPLORER <ExternalLink size={14} />
              </a>
              <button 
                onClick={() => setSuccess(null)}
                className="text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest"
              >
                Back to Swap
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-1 relative z-10 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-display text-sm font-medium text-[var(--text-primary)] uppercase tracking-widest">Swap Assets</h2>
              <RefreshCw 
                size={14} 
                className={`text-[var(--text-secondary)] transition-colors ${isValidating ? 'animate-spin text-[var(--text-primary)]' : ''}`}
              />
            </div>

            {/* Sell Box */}
            <div className="flex flex-col gap-4 mb-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Sell</span>
                <button 
                  onClick={() => setAmountIn(fromBal)}
                  className="font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Balance: {parseFloat(fromBal).toFixed(4)}
                </button>
              </div>
              <div className="flex items-center gap-4 border-b border-[var(--border-subtle)] pb-4 focus-within:border-[var(--text-primary)] transition-colors">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  className="font-mono text-3xl text-[var(--text-primary)] bg-transparent border-none outline-none w-full placeholder:text-[rgba(255,255,255,0.05)]"
                />
                <div className="flex items-center gap-2 border border-[var(--border-subtle)] px-3 py-1.5 min-w-[90px] justify-between cursor-default">
                  <span className="font-display font-medium text-xs text-[var(--text-primary)]">{fromToken}</span>
                  <ChevronDown size={12} className="text-[var(--text-secondary)]" />
                </div>
              </div>
            </div>

            {/* Swap Direction */}
            <div className="flex justify-center -my-3 z-20 relative">
              <button
                onClick={flip}
                className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
              >
                <ArrowUpDown size={14} />
              </button>
            </div>

            {/* Buy Box */}
            <div className="flex flex-col gap-4 mt-2 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">Buy (Estimated)</span>
              </div>
              <div className="flex items-center gap-4 border-b border-[var(--border-subtle)] pb-4">
                <div className={`font-mono text-3xl w-full ${amountOut ? 'text-[var(--text-primary)]' : 'text-[rgba(255,255,255,0.05)]'}`}>
                  {amountOut || '0.00'}
                </div>
                <div className="flex items-center gap-2 border border-[var(--border-subtle)] px-3 py-1.5 min-w-[90px] justify-between cursor-default">
                  <span className="font-display font-medium text-xs text-[var(--text-primary)]">{toToken}</span>
                  <ChevronDown size={12} className="text-[var(--text-secondary)]" />
                </div>
              </div>
            </div>

            {/* Rate Info */}
            <div className="flex justify-between items-center mb-10 py-2">
              <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase">Exchange Rate</span>
              <span className="font-mono text-[10px] text-[var(--text-primary)]">1 {fromToken} = {priceVal.toFixed(4)} {toToken}</span>
            </div>

            {/* Submit */}
            <button
              onClick={doSwap}
              disabled={isSwapping || !amountIn}
              className="w-full btn-primary h-[52px] flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-widest text-xs font-bold"
            >
              {isSwapping ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : isConnected ? (
                <span>Confirm Swap</span>
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
