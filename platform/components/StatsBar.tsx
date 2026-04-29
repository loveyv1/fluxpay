'use client';
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Droplets, RefreshCw, Activity, ArrowUpRight } from 'lucide-react';
import { useRexPrice } from '@/hooks/useRexPrice';
import { usePoolStats } from '@/hooks/usePoolStats';
import { stagger } from '@/lib/animations';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { SkeletonCard } from '@/components/Skeleton';
import useSWR from 'swr';

interface StatItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
  icon: React.ElementType;
}

const StatMetric = memo(function StatMetric({ item, index }: { item: StatItem; index: number }) {
  const { icon: Icon, label, value, prefix, suffix, decimals, delta } = item;
  const isPositive = delta?.startsWith('+');

  return (
    <motion.div
      variants={stagger(index)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-8 flex flex-col gap-6 hover:border-[var(--text-primary)] transition-colors group"
    >
      <div className="flex justify-between items-start">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{label}</div>
        <div className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
          <Icon size={14} />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="text-3xl font-medium text-[var(--text-primary)] tracking-tight font-mono">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </div>
        {delta && (
          <div className={`font-mono text-[10px] uppercase tracking-widest ${
            isPositive ? 'text-white' : 'text-[var(--text-secondary)]'
          }`}>
            {delta} 24h
          </div>
        )}
      </div>
    </motion.div>
  );
});

export const StatsBar = memo(function StatsBar() {
  const { price, change24h, isLoading: priceLoading } = useRexPrice();
  const { tvl, volume24h, apy, isLoading: poolLoading } = usePoolStats();
  const { isValidating: priceValidating } = useSWR('/api/price');
  const { isValidating: poolValidating }  = useSWR('/api/pool');
  const isValidating = priceValidating || poolValidating;
  const isLoading    = priceLoading || poolLoading;

  const stats: StatItem[] = [
    {
      label: 'REX Rate',
      value: parseFloat(price),
      prefix: '$',
      decimals: 4,
      delta: `${parseFloat(change24h) >= 0 ? '+' : ''}${change24h}%`,
      icon: TrendingUp,
    },
    {
      label: 'Network TVL',
      value: parseFloat(tvl),
      prefix: '$',
      decimals: 0,
      delta: '+4.2%',
      icon: Droplets,
    },
    {
      label: 'Protocol Volume',
      value: parseFloat(volume24h),
      prefix: '$',
      decimals: 0,
      delta: '-1.8%',
      icon: Activity,
    },
    {
      label: 'Pool APY',
      value: parseFloat(apy),
      suffix: '%',
      decimals: 1,
      delta: '+0.5%',
      icon: ArrowUpRight,
    },
  ];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-[0.3em]">Protocol Analytics</h2>
          <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Stellar Testnet Sync</span>
        </div>
        
        <RefreshCw
          size={14}
          className={`text-[var(--text-secondary)] transition-colors ${isValidating ? 'animate-spin text-[var(--text-primary)]' : ''}`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
          : stats.map((s, i) => <StatMetric key={s.label} item={s} index={i} />)
        }
      </div>
    </section>
  );
});
