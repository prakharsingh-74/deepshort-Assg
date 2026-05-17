import { NextResponse } from 'next/server';
import { getDramaById } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const drama = getDramaById(params.id);
    if (!drama) return NextResponse.json({ error: 'Drama not found' }, { status: 404 });
    return NextResponse.json(drama);
  } catch (err) {
    console.error('[GET /api/history/:id]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to fetch drama' }, { status: 500 });
  }
}
