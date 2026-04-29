'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto bg-[rgba(4,5,10,0.8)] backdrop-blur-md border-t border-[var(--border-subtle)] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em]">
          FluxSwap · Built on Stellar Soroban · MIT License
        </div>

        <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest">
          <Link href="#hero" className="text-[var(--text-secondary)] hover:text-[var(--flux)] transition-colors">Home</Link>
          <Link href="#swap" className="text-[var(--text-secondary)] hover:text-[var(--flux)] transition-colors">Swap</Link>
          <Link href="#pool" className="text-[var(--text-secondary)] hover:text-[var(--flux)] transition-colors">Pool</Link>
          <Link href="#dashboard" className="text-[var(--text-secondary)] hover:text-[var(--flux)] transition-colors">Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
