'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ArrowLeft, Film } from 'lucide-react';
import { api } from '@/lib/apiClient';
import type { Drama } from '@/types';
import ScriptOutput from './ScriptOutput';

interface SharedViewProps {
  shareId: string;
}

export default function SharedView({ shareId }: SharedViewProps) {
  const [drama, setDrama] = useState<Drama | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getShared(shareId)
      .then(setDrama)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 size={24} className="animate-spin mx-auto text-amber-500/60" />
          <p className="text-sm text-ink-3">Loading the drama…</p>
        </div>
      </div>
    );
  }

  if (error ?? !drama) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-3">
          <AlertCircle size={32} className="mx-auto text-red-400/60" />
          <h2 className="text-ink-1 font-semibold text-base">Drama Not Found</h2>
          <p className="text-sm text-ink-3">
            {error ?? 'This shared drama does not exist or has been removed.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={13} /> Create your own drama
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Minimal header */}
      <header className="border-b border-white/7 bg-[#0c0c0f]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film size={16} className="text-amber-500" />
            <span className="font-display font-bold text-ink-1 text-sm tracking-wide">MASALAWOOD</span>
          </div>
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-ink-3 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft size={12} /> Create your own
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-2xs text-ink-4 uppercase tracking-widest font-semibold">Shared Drama</span>
        </motion.div>

        <ScriptOutput drama={drama} regenerating={false} onRegenerate={async () => {}} />
      </main>
    </div>
  );
}
