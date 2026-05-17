'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Film } from 'lucide-react';
import toast from 'react-hot-toast';

import InputForm from '@/components/InputForm';
import ScriptOutput from '@/components/ScriptOutput';
import ScriptSkeleton from '@/components/ScriptSkeleton';
import HistoryPanel from '@/components/HistoryPanel';
import { useScript, useHistory } from '@/hooks/useScript';
import { api } from '@/lib/apiClient';
import type { Mood, RegenerateSection } from '@/types';

export default function Home() {
  const { loading, error, drama, regenerating, generate, regenerate, setDrama } = useScript();
  const { history, loadingHistory, fetchHistory, addToHistory } = useHistory();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleGenerate = async (situation: string, mood: Mood) => {
    try {
      const data = await generate(situation, mood);
      addToHistory(data);
      setTimeout(
        () => document.getElementById('output')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        300,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed');
    }
  };

  const handleSelectHistory = async (id: string) => {
    setShowHistory(false);
    try {
      const data = await api.getDrama(id);
      setDrama(data);
      setTimeout(
        () => document.getElementById('output')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        300,
      );
    } catch (err) {
      toast.error('Failed to load drama: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleRegenerate = async (id: string, section: RegenerateSection) => {
    await regenerate(id, section);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0c0c0f]/80 backdrop-blur-xl border-b border-white/7">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Film size={17} className="text-amber-500" />
            <span className="font-display font-bold text-ink-1 text-sm tracking-wide">MASALAWOOD</span>
            <span className="hidden sm:block text-2xs text-ink-4 ml-0.5">AI Script Generator</span>
          </div>

          <button
            onClick={() => { setShowHistory(true); fetchHistory(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-ink-3 hover:text-ink-1 border border-white/7 hover:border-white/12 hover:bg-white/4 transition-all"
          >
            <History size={13} />
            <span className="hidden sm:inline">History</span>
            {history.length > 0 && (
              <span className="text-2xs bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-full font-medium">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4"
        >
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-gold-gradient leading-tight">
            Bollywood Script<br />Generator
          </h1>
          <p className="text-sm text-ink-3 max-w-md mx-auto leading-relaxed">
            Turn any ordinary situation into an epic, over-the-top Bollywood blockbuster.{' '}
            <span className="text-ink-4">NAHI!</span> We don&apos;t do ordinary here.
          </p>
        </motion.div>

        {/* Input */}
        <InputForm onSubmit={handleGenerate} loading={loading} />

        {/* Error */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl border border-red-500/20 bg-red-500/8 text-red-400 text-sm"
            >
              <strong className="font-semibold">Error:</strong> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output area */}
        <div id="output">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ScriptSkeleton />
              </motion.div>
            )}
            {drama && !loading && (
              <ScriptOutput
                key={drama.id}
                drama={drama}
                regenerating={regenerating}
                onRegenerate={handleRegenerate}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* History drawer */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setShowHistory(false)}
            />
            <HistoryPanel
              history={history}
              loading={loadingHistory}
              onSelect={handleSelectHistory}
              onClose={() => setShowHistory(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
