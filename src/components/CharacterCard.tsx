'use client';

import { motion } from 'framer-motion';
import type { Character } from '@/types';

const ROLE_META: Record<string, { emoji: string; accent: string; badge: string }> = {
  'Hero':          { emoji: '🦸', accent: 'border-blue-400/25 bg-blue-500/8',   badge: 'text-blue-300 bg-blue-500/10' },
  'Villain':       { emoji: '😈', accent: 'border-red-400/25 bg-red-500/8',     badge: 'text-red-300 bg-red-500/10' },
  'Love Interest': { emoji: '💕', accent: 'border-pink-400/25 bg-pink-500/8',   badge: 'text-pink-300 bg-pink-500/10' },
  'Comic Relief':  { emoji: '🤣', accent: 'border-amber-400/25 bg-amber-500/8', badge: 'text-amber-300 bg-amber-500/10' },
  'Sidekick':      { emoji: '🤝', accent: 'border-green-400/25 bg-green-500/8', badge: 'text-green-300 bg-green-500/10' },
  'Mentor':        { emoji: '🧙', accent: 'border-purple-400/25 bg-purple-500/8',badge: 'text-purple-300 bg-purple-500/10' },
};
const DEFAULT_META = { emoji: '🎭', accent: 'border-white/7 bg-white/3', badge: 'text-ink-3 bg-white/5' };

interface CharacterCardProps {
  character: Character;
  index: number;
}

export default function CharacterCard({ character, index }: CharacterCardProps) {
  const meta = ROLE_META[character.role] ?? DEFAULT_META;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-xl border ${meta.accent} p-4 space-y-3`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/6 border border-white/7 flex items-center justify-center text-lg flex-shrink-0">
          {meta.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-1 truncate leading-tight">{character.name}</p>
          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-2xs font-medium ${meta.badge}`}>
            {character.role}
          </span>
        </div>
      </div>

      <p className="text-xs text-ink-3 leading-relaxed line-clamp-3">{character.description}</p>

      {character.traits.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {character.traits.slice(0, 3).map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-2xs text-ink-3 bg-white/4 border border-white/7">
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
