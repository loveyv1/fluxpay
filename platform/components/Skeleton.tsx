'use client';
import { cn } from '@/lib/utils';

interface SkeletonProps { className?: string }

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-shimmer bg-gradient-to-r from-[rgba(255,255,255,0.02)] via-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] bg-[length:200%_100%]",
        className
      )} 
    />
  );
}

export function SkeletonCard({ className, rows = 3 }: { className?: string; rows?: number }) {
  return (
    <div className={cn("bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-8 flex flex-col gap-6", className)}>
      <Skeleton className="h-6 w-1/2" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full last:w-3/4" />
      ))}
    </div>
  );
}
