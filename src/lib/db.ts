import path from 'path';
import fs from 'fs';
import type { Drama, DramaSummary, Script } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'dramas.json');

interface DBShape {
  dramas: Drama[];
}

function readDB(): DBShape {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) as DBShape;
    }
  } catch (err) {
    console.error('[db] Failed to parse database file, starting fresh:', err);
  }
  return { dramas: [] };
}

function writeDB(data: DBShape): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function insertDrama(drama: Drama): void {
  const db = readDB();
  db.dramas.unshift(drama);
  writeDB(db);
}

export function updateDramaScript(id: string, script: Script): void {
  const db = readDB();
  const idx = db.dramas.findIndex(d => d.id === id);
  if (idx !== -1) {
    db.dramas[idx] = { ...db.dramas[idx], script };
    writeDB(db);
  }
}

export function getDramaById(id: string): Drama | null {
  return readDB().dramas.find(d => d.id === id) ?? null;
}

export function getDramaByShareId(shareId: string): Drama | null {
  return readDB().dramas.find(d => d.shareId === shareId) ?? null;
}

export function getAllDramas(limit = 50): DramaSummary[] {
  return readDB()
    .dramas.slice(0, limit)
    .map(({ id, shareId, situation, mood, script, createdAt }) => ({
      id, shareId, situation, mood,
      title: script.title,
      tagline: script.tagline,
      createdAt,
    }));
}
