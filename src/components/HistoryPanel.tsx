'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, Loader2, X, Film } from 'lucide-react';
import type { DramaSummary } from '@/types';

const MOOD_EMOJIS: Record<string, string> = {
  dramatic: '🎭', romantic: '🌹', comedy: '😂', action: '💥', tragic: '😭', thriller: '🕵️',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface HistoryPanelProps {
  history: DramaSummary[];
  loading: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function HistoryPanel({ history, loading, onSelect, onClose }: HistoryPanelProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[360px] bg-[#111115] border-l border-white/7 z-40 flex flex-col shadow-modal"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/7">
        <div className="flex items-center gap-2">
          <Film size={16} className="text-ink-3" />
          <span className="text-sm font-semibold text-ink-1">Past Dramas</span>
          {history.length > 0 && (
            <span className="text-2xs bg-white/6 text-ink-3 px-1.5 py-0.5 rounded-full font-medium">
              {history.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-ink-4 hover:text-ink-1 hover:bg-white/6 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-4">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Film size={28} className="mx-auto text-ink-4 opacity-50" />
            <p className="text-sm text-ink-3">No dramas yet.</p>
            <p className="text-xs text-ink-4">Your scripts will appear here.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                onClick={() => onSelect(item.id)}
                className="w-full text-left p-3.5 rounded-xl border border-white/7 bg-white/2 hover:bg-white/5 hover:border-white/12 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">{MOOD_EMOJIS[item.mood] ?? '🎬'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink-1 truncate group-hover:text-amber-400 transition-colors leading-snug">
                      {item.title}
                    </p>
                    <p className="text-2xs text-ink-4 mt-1 line-clamp-2 leading-relaxed italic">
                      &ldquo;{item.situation}&rdquo;
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-2xs text-ink-4">
                      <Clock size={9} />
                      <span>{timeAgo(item.createdAt)}</span>
                      <span>·</span>
                      <span className="capitalize">{item.mood}</span>
                    </div>
                  </div>
                  <ChevronRight
                    size={13}
                    className="flex-shrink-0 text-ink-4 group-hover:text-amber-400 mt-0.5 transition-colors"
                  />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
