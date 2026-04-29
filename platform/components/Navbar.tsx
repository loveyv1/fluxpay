'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, Activity, RefreshCw } from 'lucide-react';
import { useFreighter } from '@/hooks/useFreighter';
import { useContractEvents } from '@/hooks/useContractEvents';

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#swap', label: 'Swap' },
  { href: '#pool', label: 'Pool' },
  { href: '#dashboard', label: 'Dashboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, connect, publicKey, isLoading } = useFreighter();
  const { events } = useContractEvents();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-[80px] transition-colors duration-300 ${
        scrolled 
          ? 'bg-[var(--bg-void)] border-b border-[var(--border-subtle)]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="#hero" className="flex items-center gap-2 group">
          <span className="font-display font-[700] tracking-tighter text-[var(--flux)] text-xl">◈ FLUXSWAP</span>
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  active 
                    ? 'text-[var(--text-primary)]' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* Activity Badge */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
            <Activity size={12} />
            <span>{events.length}</span>
          </div>

          {/* Freighter Button */}
          <button
            onClick={connect}
            disabled={isLoading}
            className="hidden md:flex items-center gap-2 btn-primary px-5 py-2 text-xs disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : isConnected ? (
              <span className="font-mono">
                {typeof publicKey === 'string' && publicKey.length > 5 
                  ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
                  : 'Connected'}
              </span>
            ) : (
              <>
                <Wallet size={14} />
                <span>Connect</span>
              </>
            )}
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[80px] left-0 w-full bg-[var(--bg-void)] border-b border-[var(--border-subtle)] z-40 md:hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-2">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`py-3 text-sm font-medium transition-colors ${
                      active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <button
                onClick={() => { connect(); setMobileOpen(false); }}
                className="mt-4 w-full btn-primary py-3 text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : isConnected ? (
                  <span className="font-mono">
                    {typeof publicKey === 'string' && publicKey.length > 5 
                      ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` 
                      : 'Connected'}
                  </span>
                ) : (
                  <>
                    <Wallet size={16} />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
