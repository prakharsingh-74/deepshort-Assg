import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generateScript } from '@/lib/scriptAgent';
import { insertDrama } from '@/lib/db';
import type { Drama, Mood } from '@/types';

const VALID_MOODS: Mood[] = ['dramatic', 'romantic', 'comedy', 'action', 'tragic', 'thriller'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { situation?: string; mood?: string };
    const { situation, mood = 'dramatic' } = body;

    if (!situation || typeof situation !== 'string' || situation.trim().length < 5)
      return NextResponse.json({ error: 'Situation must be at least 5 characters long' }, { status: 400 });

    if (situation.trim().length > 500)
      return NextResponse.json({ error: 'Situation must be under 500 characters' }, { status: 400 });

    if (!VALID_MOODS.includes(mood as Mood))
      return NextResponse.json({ error: `Mood must be one of: ${VALID_MOODS.join(', ')}` }, { status: 400 });

    const script = await generateScript(situation.trim(), mood as Mood);

    const drama: Drama = {
      id: uuidv4(),
      shareId: uuidv4().replace(/-/g, '').slice(0, 12),
      situation: situation.trim(),
      mood: mood as Mood,
      script,
      createdAt: new Date().toISOString(),
    };

    insertDrama(drama);

    return NextResponse.json(drama);
  } catch (err) {
    console.error('[POST /api/generate]', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate script' },
      { status: 500 },
    );
  }
}
