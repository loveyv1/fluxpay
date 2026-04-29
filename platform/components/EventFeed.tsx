'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ExternalLink, RefreshCw } from 'lucide-react';
import { useContractEvents, ContractEvent } from '@/hooks/useContractEvents';
import { listContainer, listItem } from '@/lib/animations';
import useSWR from 'swr';

const EventRow = memo(function EventRow({ event }: { event: ContractEvent }) {
  return (
    <motion.div
      variants={listItem}
      className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
    >
      <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--text-secondary)] group-hover:bg-[var(--text-primary)] transition-colors" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs text-[var(--text-primary)] uppercase tracking-wide">{event.type}</span>
          <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-widest bg-[var(--bg-void)] px-1.5 py-0.5 border border-[var(--border-subtle)]">
            #{event.ledger}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-mono text-[var(--text-secondary)]">
            {parseFloat(event.amount || '0').toLocaleString(undefined, { maximumFractionDigits: 4 })} REX
          </span>
          <span className="text-[9px] text-[var(--border-subtle)]">•</span>
          <span className="text-[9px] text-[var(--text-secondary)] font-mono">
            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      <a
        href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2"
      >
        <ExternalLink size={12} />
      </a>
    </motion.div>
  );
});

export const EventFeed = memo(function EventFeed() {
  const { events, isLoading, isError } = useContractEvents();
  const { isValidating } = useSWR('/api/events');

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between bg-[var(--bg-void)]">
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-[var(--text-secondary)]" />
          <h2 className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-[0.2em]">Live Protocol Feed</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <RefreshCw
            size={12}
            className={`text-[var(--text-secondary)] transition-colors ${isValidating ? 'animate-spin text-[var(--text-primary)]' : ''}`}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
            <RefreshCw size={24} className="animate-spin text-[var(--text-secondary)]" />
            <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">Polling Network</span>
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <span className="text-[10px] font-mono text-red-500 uppercase">Sync Error</span>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
            <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">No Recent Activity</span>
          </div>
        ) : (
          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {events.slice(0, 15).map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
});
