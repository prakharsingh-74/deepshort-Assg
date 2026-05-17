'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Music2, ChevronDown, MessageCircle } from 'lucide-react';
import type { Scene } from '@/types';

const MOOD_STYLES: Record<string, string> = {
  Intense:     'text-red-300 bg-red-500/10 border-red-500/20',
  Romantic:    'text-pink-300 bg-pink-500/10 border-pink-500/20',
  Comedic:     'text-amber-300 bg-amber-500/10 border-amber-500/20',
  Action:      'text-orange-300 bg-orange-500/10 border-orange-500/20',
  Tragic:      'text-blue-300 bg-blue-500/10 border-blue-500/20',
  Suspenseful: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
};

interface SceneCardProps {
  scene: Scene;
  index: number;
}

export default function SceneCard({ scene, index: animIndex }: SceneCardProps) {
  const [open, setOpen] = useState(animIndex === 0);
  const moodStyle = MOOD_STYLES[scene.mood] ?? 'text-amber-300 bg-amber-500/10 border-amber-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animIndex * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-white/7 bg-[#111115] overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left flex items-center gap-4 px-4 py-3.5 hover:bg-white/3 transition-colors"
      >
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
          {scene.index}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium border ${moodStyle}`}>
              {scene.mood}
            </span>
          </div>
          <p className="text-sm font-semibold text-ink-1 mt-1 leading-snug truncate">{scene.title}</p>
          <div className="flex items-center gap-1 mt-0.5 text-2xs text-ink-4">
            <MapPin size={9} />
            <span className="truncate">{scene.location}</span>
          </div>
        </div>

        <ChevronDown
          size={15}
          className={`flex-shrink-0 text-ink-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-4">
              <p className="text-xs text-ink-3 leading-relaxed italic mt-3 pl-3 border-l-2 border-amber-500/20">
                {scene.description}
              </p>

              {scene.musicCue && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/7 text-xs text-ink-3">
                  <Music2 size={11} className="flex-shrink-0 text-amber-500/60" />
                  <span className="font-mono tracking-wide">{scene.musicCue}</span>
                </div>
              )}

              {scene.dialogue.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-2xs text-ink-4 uppercase tracking-widest font-semibold mb-3">
                    <MessageCircle size={10} />
                    Dialogue
                  </div>
                  <div className="space-y-2">
                    {scene.dialogue.map((d, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-white/3 border border-white/5 px-3 py-2.5"
                      >
                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-semibold text-amber-400">{d.character}</span>
                          {d.action && (
                            <span className="text-2xs text-ink-4 italic">— {d.action}</span>
                          )}
                        </div>
                        <p className="text-xs text-ink-2 leading-relaxed">&ldquo;{d.line}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
