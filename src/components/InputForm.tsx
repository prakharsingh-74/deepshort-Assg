'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import type { Mood } from '@/types';

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'dramatic', label: 'Dramatic',  emoji: '🎭' },
  { value: 'romantic', label: 'Romantic',  emoji: '🌹' },
  { value: 'comedy',   label: 'Comedy',    emoji: '😂' },
  { value: 'action',   label: 'Action',    emoji: '💥' },
  { value: 'tragic',   label: 'Tragic',    emoji: '😭' },
  { value: 'thriller', label: 'Thriller',  emoji: '🕵️' },
];

const EXAMPLES = [
  'Fight between two founders over putting sugar in coffee',
  'Claude Mythos (robot form) entering an AI conference to fight Sam Altman and Elon Musk',
  'Two engineers arguing about tabs vs spaces at 3am',
  'Office intern accidentally hits reply-all on a company-wide email',
  'Mother calling her son 47 times during his final exam',
  'Two aunties competing over whose biryani is the best at a wedding',
];

interface InputFormProps {
  onSubmit: (situation: string, mood: Mood) => void;
  loading: boolean;
}

export default function InputForm({ onSubmit, loading }: InputFormProps) {
  const [situation, setSituation] = useState('');
  const [mood, setMood] = useState<Mood>('dramatic');
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || loading) return;
    onSubmit(situation.trim(), mood);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Textarea */}
      <div className="relative rounded-xl border border-white/7 bg-[#111115] transition-colors focus-within:border-amber-500/40 focus-within:shadow-glow-sm">
        <textarea
          value={situation}
          onChange={e => setSituation(e.target.value)}
          placeholder="Describe any ordinary situation…"
          maxLength={500}
          rows={4}
          disabled={loading}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-10 text-sm text-ink-1 placeholder-ink-4 focus:outline-none disabled:opacity-50"
        />
        {/* Toolbar row inside textarea card */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2.5 border-t border-white/7">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExamples(v => !v)}
              className="flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink-2 transition-colors"
            >
              <Sparkles size={11} />
              <span>Examples</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${showExamples ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showExamples && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 bottom-7 w-80 rounded-xl border border-white/7 bg-[#1f1f26] shadow-modal overflow-hidden z-20"
                >
                  {EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setSituation(ex); setShowExamples(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-ink-2 hover:bg-white/5 hover:text-ink-1 transition-colors border-b border-white/5 last:border-0 leading-snug"
                    >
                      {ex}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-2xs text-ink-4 tabular-nums">{situation.length} / 500</span>
        </div>
      </div>

      {/* Mood pills */}
      <div>
        <p className="text-2xs font-semibold uppercase tracking-widest text-ink-3 mb-2.5">Mood</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${mood === m.value
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                  : 'border border-white/7 bg-[#111115] text-ink-3 hover:border-white/12 hover:text-ink-2'
                }`}
            >
              <span className="text-base leading-none">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={!situation.trim() || loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl
                   bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm tracking-wide
                   transition-all duration-200 shadow-glow-sm hover:shadow-glow
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating script…
          </>
        ) : (
          <>
            Generate Script
            <ArrowRight size={16} />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
