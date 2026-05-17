'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/apiClient';
import type { Drama, DramaSummary, Mood, RegenerateSection } from '@/types';

interface UseScriptReturn {
  loading: boolean;
  error: string | null;
  drama: Drama | null;
  regenerating: boolean;
  generate: (situation: string, mood: Mood) => Promise<Drama>;
  regenerate: (id: string, section: RegenerateSection) => Promise<void>;
  setDrama: (drama: Drama) => void;
}

export function useScript(): UseScriptReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drama, setDramaState] = useState<Drama | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const generate = useCallback(async (situation: string, mood: Mood): Promise<Drama> => {
    setLoading(true);
    setError(null);
    setDramaState(null);
    try {
      const drama = await api.generate(situation, mood);
      setDramaState(drama);
      return drama;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const regenerate = useCallback(async (id: string, section: RegenerateSection): Promise<void> => {
    setRegenerating(true);
    setError(null);
    try {
      const { script } = await api.regenerate(id, section);
      setDramaState(prev => prev ? { ...prev, script } : prev);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw err;
    } finally {
      setRegenerating(false);
    }
  }, []);

  const setDrama = useCallback((d: Drama) => setDramaState(d), []);

  return { loading, error, drama, regenerating, generate, regenerate, setDrama };
}

interface UseHistoryReturn {
  history: DramaSummary[];
  loadingHistory: boolean;
  fetchHistory: () => Promise<void>;
  addToHistory: (drama: Drama) => void;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<DramaSummary[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = useCallback(async (): Promise<void> => {
    setLoadingHistory(true);
    try {
      setHistory(await api.history());
    } catch {
      // History is non-critical — silently fail so it doesn't block the main flow
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const addToHistory = useCallback((drama: Drama): void => {
    const entry: DramaSummary = {
      id: drama.id,
      shareId: drama.shareId,
      situation: drama.situation,
      mood: drama.mood,
      title: drama.script.title,
      tagline: drama.script.tagline,
      createdAt: drama.createdAt,
    };
    setHistory(prev => [entry, ...prev.filter(x => x.id !== drama.id)]);
  }, []);

  return { history, loadingHistory, fetchHistory, addToHistory };
}
