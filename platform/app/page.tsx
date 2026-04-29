'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowDown, Copy, Check, RefreshCw, Wallet, Activity, ArrowUpRight } from 'lucide-react';
import { SwapCard } from '@/components/SwapCard';
import { LiquidityCard } from '@/components/LiquidityCard';
import { TrustlineCard } from '@/components/TrustlineCard';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useFreighter } from '@/hooks/useFreighter';
import { useRexBalance } from '@/hooks/useRexBalance';
import { useContractEvents } from '@/hooks/useContractEvents';
import { usePoolStats } from '@/hooks/usePoolStats';
import { motion } from 'framer-motion';
import { listContainer, listItem } from '@/lib/animations';

const CONTRACTS = [
  { name: 'Liquidity Pool', address: 'CCQZXG3QGFPLRS6LJJ4XALJGUGVNLISYN6BJSVOH57ED6FYJH7KGKXAR' },
  { name: 'VOLT Token', address: 'CCHLK4RHSS27U4K6VRIP6QW2N5IGBJJES4GA4CI3RRUGP54G4FH5HL7P' },
  { name: 'Asset Wrapper', address: 'CBMGE6BSHIGBXAUMW32D542POCBMI3DHP7ZZGI6RTGPRECJQA3S5ZFDI' },
  { name: 'Protocol Issuer', address: 'GCNDTZPBGK5CBWN4BSCQRVC3UWQ7MXZJRVHFFUV5L65EUZFCW3YOBXG4' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 border border-[var(--border-subtle)] min-h-[40px] font-mono text-[10px]">
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'COPIED' : 'COPY'}</span>
    </button>
  );
}

export default function HomePage() {
  const { isConnected, connect, publicKey } = useFreighter();
  const { rexBalance, xlmBalance } = useRexBalance(publicKey);
  const { events, isLoading: eventsLoading } = useContractEvents();
  const { tvl, apy } = usePoolStats();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex flex-col">
      {/* SECTION 1: Hero */}
      <section id="hero" className="relative h-[100svh] flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[var(--flux)] rounded-full blur-[80px] opacity-20 pointer-events-none animate-float -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--purple)] rounded-full blur-[80px] opacity-15 pointer-events-none animate-float-delayed -z-10" />

        <div className="max-w-4xl w-full text-center z-10 flex flex-col items-center gap-8">
          <div className="reveal" data-delay="0">
            <h1 className="font-display font-bold text-[52px] md:text-[88px] leading-[1] text-[var(--text-primary)] tracking-tighter uppercase">
              Decentralized Liquidity <br />
              <span className="text-[var(--flux)]">On Stellar Soroban</span>
            </h1>
          </div>

          <div className="reveal" data-delay="100">
            <p className="font-body text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Swap assets, provide liquidity, and track your portfolio — all in one place, powered by Soroban smart contracts.
            </p>
          </div>

          <div className="reveal flex flex-wrap items-center justify-center gap-4" data-delay="200">
            <Link href="#swap" className="btn-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2">
              Start Swapping <ArrowDown size={14} />
            </Link>
            <Link href="#pool" className="btn-ghost px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2">
              View Pool <ArrowDown size={14} />
            </Link>
          </div>

          <div className="reveal flex flex-wrap items-center justify-center gap-6 mt-8" data-delay="300">
            <div className="glass-pill">3 Smart Contracts</div>
            <div className="glass-pill">XLM / VOLT Pair</div>
            <div className="glass-pill">Testnet Live</div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* SECTION 2: Swap */}
      <section id="swap" className="py-32 px-6 bg-[var(--bg-deep)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="reveal text-center flex flex-col gap-4">
            <span className="section-label">◈ TOKEN SWAP</span>
            <h2 className="text-[40px] font-display font-bold text-[var(--text-primary)] uppercase">Swap Instantly</h2>
            <p className="text-[var(--text-secondary)] text-lg">On-chain AMM swaps between VOLT and XLM</p>
          </div>

          <div className="reveal w-full max-w-[480px]" data-delay="100">
            <div className="glass-card p-1">
              <SwapCard />
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* SECTION 3: Pool */}
      <section id="pool" className="py-32 px-6 bg-[var(--bg-void)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="reveal text-center flex flex-col gap-4">
            <span className="section-label">◈ LIQUIDITY POOL</span>
            <h2 className="text-[40px] font-display font-bold text-[var(--text-primary)] uppercase">Provide Liquidity</h2>
            <p className="text-[var(--text-secondary)] text-lg">Deposit assets, earn protocol fees</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[
              { label: 'TVL', value: parseFloat(tvl), prefix: '$' },
              { label: 'Your Share', value: 0, suffix: '%' },
              { label: 'APY', value: parseFloat(apy), suffix: '%' },
            ].map((stat, i) => (
              <div key={stat.label} className="reveal glass-card p-8 flex flex-col gap-2" data-delay={i * 100}>
                <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.2em]">{stat.label}</span>
                <div className="font-mono text-2xl text-[var(--flux)]">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.label === 'TVL' ? 0 : 2} />
                </div>
              </div>
            ))}
          </div>

          <div className="reveal w-full max-w-[540px]" data-delay="300">
            <div className="glass-card p-1">
              <LiquidityCard />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
            {[
              { title: 'Provision', desc: 'Deposit VOLT and XLM in equal proportions to the AMM.' },
              { title: 'Yield', desc: 'Accrue a proportional share of every swap fee automatically.' },
              { title: 'Redeem', desc: 'Liquidate your LP tokens to claim original assets and fees.' },
            ].map((step, i) => (
              <div key={i} className="reveal border border-[var(--border-subtle)] p-6 bg-[rgba(255,255,255,0.02)]" data-delay={i * 100}>
                <span className="font-mono text-[10px] text-[var(--flux)] mb-4 block">STEP 0{i + 1}</span>
                <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-2">{step.title}</h3>
                <p className="font-mono text-[10px] text-[var(--text-secondary)] uppercase leading-relaxed tracking-wider">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* SECTION 4: Dashboard */}
      <section id="dashboard" className="py-32 px-6 bg-[var(--bg-deep)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="reveal text-center flex flex-col gap-4">
            <span className="section-label">◈ PORTFOLIO</span>
            <h2 className="text-[40px] font-display font-bold text-[var(--text-primary)] uppercase">Your Portfolio</h2>
            <p className="text-[var(--text-secondary)] text-lg">Real-time balances and protocol activity</p>
          </div>

          {!isConnected ? (
            <div className="reveal w-full max-w-md" data-delay="100">
              <div className="glass-card p-12 flex flex-col items-center gap-8 text-center">
                <Wallet size={48} className="text-[var(--text-secondary)] opacity-50" />
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">Connect your wallet to view your portfolio assets and activity stream.</p>
                <button onClick={connect} className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest">Connect Freighter</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 w-full">
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Native Balance (XLM)', value: parseFloat(xlmBalance) },
                    { label: 'Protocol Balance (VOLT)', value: parseFloat(rexBalance) },
                  ].map((card, i) => (
                    <div key={card.label} className="reveal glass-card p-8 flex flex-col gap-4" data-delay={i * 100}>
                      <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">{card.label}</span>
                      <div className="font-mono text-3xl text-[var(--text-primary)]">
                        <AnimatedNumber value={card.value} decimals={4} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="reveal" data-delay="200">
                  <TrustlineCard publicKey={publicKey} />
                </div>
              </div>

              <div className="reveal glass-card flex flex-col overflow-hidden" data-delay="300">
                <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-3">
                    <Activity size={14} className="text-[var(--flux)]" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Event Feed</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[500px]">
                  {eventsLoading ? (
                    <div className="py-20 flex justify-center"><RefreshCw size={20} className="animate-spin text-[var(--text-secondary)]" /></div>
                  ) : events.length === 0 ? (
                    <div className="py-20 text-center font-mono text-[10px] text-[var(--text-secondary)] uppercase">No activity found</div>
                  ) : (
                    <motion.div variants={listContainer} className="flex flex-col">
                      {events.slice(0, 8).map((event) => (
                        <motion.div key={event.id} variants={listItem} className="px-6 py-4 flex items-center justify-between border-b border-[var(--border-subtle)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase">{event.type}</span>
                            <span className="font-mono text-[10px] text-[var(--text-secondary)]">{parseFloat(event.amount).toLocaleString()} VOLT</span>
                          </div>
                          <a href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--flux)]"><ArrowUpRight size={14} /></a>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* SECTION 5: Contracts */}
      <section id="contracts" className="py-32 px-6 bg-[var(--bg-void)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="reveal text-center flex flex-col gap-4">
            <span className="section-label">◈ ON-CHAIN</span>
            <h2 className="text-[40px] font-display font-bold text-[var(--text-primary)] uppercase">Smart Contracts</h2>
            <p className="text-[var(--text-secondary)] text-lg">Deployed on Stellar Testnet</p>
          </div>

          <div className="reveal w-full border border-[var(--border-subtle)] glass-card" data-delay="100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)]">
                    <th className="py-5 px-8 font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Contract</th>
                    <th className="py-5 px-8 font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Address</th>
                    <th className="py-5 px-8 font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {CONTRACTS.map((contract) => (
                    <tr key={contract.name} className="hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                      <td className="py-6 px-8 font-display font-bold text-xs uppercase tracking-widest text-[var(--text-primary)]">{contract.name}</td>
                      <td className="py-6 px-8 font-mono text-[10px] text-[var(--text-secondary)]">{contract.address}</td>
                      <td className="py-6 px-8 text-right"><CopyButton text={contract.address} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="reveal px-4 py-2 border border-[var(--flux-glow)] bg-[var(--flux-glow)] text-[10px] font-mono text-[var(--flux)] uppercase tracking-widest" data-delay="200">
            Verified on Stellar Testnet
          </div>
        </div>
      </section>
    </main>
  );
}
