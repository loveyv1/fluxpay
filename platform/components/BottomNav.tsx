'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ArrowUpDown, Droplets, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '#home', label: 'Home', icon: Home },
  { href: '#swap', label: 'Swap', icon: ArrowUpDown },
  { href: '#pool', label: 'Pool', icon: Droplets },
  { href: '#dashboard', label: 'Stats', icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] bg-[var(--bg-void)] border-t border-[var(--border-subtle)]">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="relative flex flex-col items-center justify-center gap-1 w-full h-full group">
              <Icon 
                size={20} 
                className={`transition-all duration-300 ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`} 
              />
              <span className={`text-[9px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                {label}
              </span>
              
              {active && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-[var(--flux)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
