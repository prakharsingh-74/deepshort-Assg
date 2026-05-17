import type { Drama, DramaSummary, Mood, RegenerateSection, Script } from '@/types';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
    ...options,
  });
  const data = await res.json() as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Request failed with status ${res.status}`);
  return data;
}

interface RegenerateResponse {
  id: string;
  script: Script;
}

export const api = {
  generate: (situation: string, mood: Mood): Promise<Drama> =>
    request<Drama>('/generate', { method: 'POST', body: JSON.stringify({ situation, mood }) }),

  regenerate: (id: string, section: RegenerateSection): Promise<RegenerateResponse> =>
    request<RegenerateResponse>(`/generate/${id}/regenerate`, { method: 'POST', body: JSON.stringify({ section }) }),

  history: (): Promise<DramaSummary[]> =>
    request<DramaSummary[]>('/history'),

  getDrama: (id: string): Promise<Drama> =>
    request<Drama>(`/history/${id}`),

  getShared: (shareId: string): Promise<Drama> =>
    request<Drama>(`/share/${shareId}`),
};
