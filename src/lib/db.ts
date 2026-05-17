import path from 'path';
import fs from 'fs';
import type { Drama, DramaRecord, DramaSummary, Mood, Script } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'dramas.json');

interface DBShape {
  dramas: DramaRecord[];
}

function readDB(): DBShape {
  try {
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) as DBShape;
  } catch {}
  return { dramas: [] };
}

function writeDB(data: DBShape): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

interface InsertDramaParams {
  id: string;
  shareId: string;
  situation: string;
  mood: Mood;
  title: string;
  tagline: string;
  scriptJson: Script;
}

export function insertDrama({ id, shareId, situation, mood, title, tagline, scriptJson }: InsertDramaParams): void {
  const db = readDB();
  db.dramas.unshift({ id, shareId, situation, mood, title, tagline, script: scriptJson, createdAt: new Date().toISOString() });
  writeDB(db);
}

interface UpdateDramaParams {
  title: string;
  tagline: string;
  scriptJson: Script;
}

export function updateDrama(id: string, { title, tagline, scriptJson }: UpdateDramaParams): void {
  const db = readDB();
  const idx = db.dramas.findIndex(d => d.id === id);
  if (idx !== -1) {
    db.dramas[idx] = { ...db.dramas[idx], title, tagline, script: scriptJson };
    writeDB(db);
  }
}

export function getDramaById(id: string): Drama | null {
  const record = readDB().dramas.find(d => d.id === id);
  return record ?? null;
}

export function getDramaByShareId(shareId: string): Drama | null {
  const record = readDB().dramas.find(d => d.shareId === shareId);
  return record ?? null;
}

export function getAllDramas(limit = 50): DramaSummary[] {
  return readDB()
    .dramas.slice(0, limit)
    .map(({ id, shareId, situation, mood, title, tagline, createdAt }) => ({
      id, shareId, situation, mood, title, tagline, createdAt,
    }));
}
