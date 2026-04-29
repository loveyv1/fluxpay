'use client';
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || 'Something went wrong' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-8 bg-[var(--bg-void)]">
          <div className="border border-[var(--border-subtle)] p-6">
            <AlertTriangle size={24} className="text-[var(--text-primary)]" />
          </div>
          <div className="text-center max-w-[420px]">
            <h2 className="font-display text-xl font-medium text-[var(--text-primary)] uppercase tracking-widest mb-4">
              Protocol Error
            </h2>
            <p className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-10 leading-relaxed">
              {this.state.message}
            </p>
            <button
              className="btn-primary w-full max-w-[200px] h-[52px] flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] font-bold"
              onClick={this.handleReset}
            >
              <RefreshCw size={14} />
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
