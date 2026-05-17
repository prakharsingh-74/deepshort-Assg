import { NextResponse } from 'next/server';
import { getAllDramas } from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json(getAllDramas(50));
  } catch (err) {
    console.error('[GET /api/history]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
