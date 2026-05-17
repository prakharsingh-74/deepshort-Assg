'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Users, Clapperboard } from 'lucide-react';
import toast from 'react-hot-toast';
import CharacterCard from './CharacterCard';
import SceneCard from './SceneCard';
import type { Drama, RegenerateSection } from '@/types';

const MOOD_EMOJIS: Record<string, string> = {
  dramatic: '🎭', romantic: '🌹', comedy: '😂', action: '💥', tragic: '😭', thriller: '🕵️',
};

interface ScriptOutputProps {
  drama: Drama;
  regenerating: boolean;
  onRegenerate: (id: string, section: RegenerateSection) => Promise<void>;
}

export default function ScriptOutput({ drama, regenerating, onRegenerate }: ScriptOutputProps) {
  const { id, situation, mood, script } = drama;

  const handleRegen = async (section: RegenerateSection) => {
    const labels: Record<RegenerateSection, string> = {
      title: 'title & tagline', characters: 'characters', scenes: 'scenes',
    };
    const p = toast.loading(`Regenerating ${labels[section]}…`);
    try {
      await onRegenerate(id, section);
      toast.success(`${labels[section]} regenerated!`, { id: p });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed', { id: p });
    }
  };

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-white/7 bg-[#111115] overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

        <div className="px-6 py-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/7 bg-white/3 text-2xs text-ink-3">
            <span>{MOOD_EMOJIS[mood] ?? '🎬'}</span>
            <span className="capitalize">{mood}</span>
            <span className="text-ink-4">·</span>
            <span className="italic truncate max-w-[180px]">&ldquo;{situation}&rdquo;</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black text-gold-gradient leading-tight">
            {script.title}
          </h1>
          <p className="text-sm text-ink-3 italic max-w-sm mx-auto leading-relaxed">
            &ldquo;{script.tagline}&rdquo;
          </p>

          <div className="pt-2">
            <button
              onClick={() => handleRegen('title')}
              disabled={regenerating}
              className="flex items-center gap-1.5 mx-auto px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/7 bg-white/3 text-ink-3 hover:text-ink-1 hover:bg-white/6 transition-all disabled:opacity-40"
            >
              <RefreshCw size={11} className={regenerating ? 'animate-spin' : ''} />
              New Title
            </button>
          </div>
        </div>
      </motion.div>

      {/* Characters */}
      {script.characters.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-ink-3" />
              <p className="text-2xs font-semibold uppercase tracking-widest text-ink-3">Characters</p>
            </div>
            <button
              onClick={() => handleRegen('characters')}
              disabled={regenerating}
              className="flex items-center gap-1 text-2xs text-ink-4 hover:text-amber-400 transition-colors disabled:opacity-30"
            >
              <RefreshCw size={10} className={regenerating ? 'animate-spin' : ''} />
              Regenerate
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {script.characters.map((char, i) => (
              <CharacterCard key={i} character={char} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Scenes */}
      {script.scenes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clapperboard size={14} className="text-ink-3" />
              <p className="text-2xs font-semibold uppercase tracking-widest text-ink-3">Scenes</p>
              <span className="text-2xs text-ink-4">({script.scenes.length})</span>
            </div>
            <button
              onClick={() => handleRegen('scenes')}
              disabled={regenerating}
              className="flex items-center gap-1 text-2xs text-ink-4 hover:text-amber-400 transition-colors disabled:opacity-30"
            >
              <RefreshCw size={10} className={regenerating ? 'animate-spin' : ''} />
              Regenerate
            </button>
          </div>
          <div className="space-y-2">
            {script.scenes.map((scene, i) => (
              <SceneCard key={scene.index} scene={scene} index={i} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
