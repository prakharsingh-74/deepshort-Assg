import type { Drama, DramaSummary } from '@/types';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
    ...options,
  });
  const data = await res.json() as T & { error?: string };
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed with status ${res.status}`);
  return data;
}

interface GenerateResponse {
  id: string;
  shareId: string;
  situation: string;
  mood: string;
  script: Drama['script'];
  createdAt?: string;
}

interface RegenerateResponse {
  id: string;
  script: Drama['script'];
}

export const api = {
  generate: (situation: string, mood: string): Promise<GenerateResponse> =>
    request<GenerateResponse>('/generate', { method: 'POST', body: JSON.stringify({ situation, mood }) }),

  regenerate: (id: string, section: string): Promise<RegenerateResponse> =>
    request<RegenerateResponse>(`/generate/${id}/regenerate`, { method: 'POST', body: JSON.stringify({ section }) }),

  history: (): Promise<DramaSummary[]> =>
    request<DramaSummary[]>('/history'),

  getDrama: (id: string): Promise<Drama> =>
    request<Drama>(`/history/${id}`),

  getShared: (shareId: string): Promise<Drama> =>
    request<Drama>(`/share/${shareId}`),
};
