import { NextResponse } from 'next/server';
import { getDramaByShareId } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: { shareId: string } }) {
  try {
    const drama = getDramaByShareId(params.shareId);
    if (!drama) return NextResponse.json({ error: 'Shared drama not found' }, { status: 404 });
    return NextResponse.json(drama);
  } catch (err) {
    console.error('[GET /api/share/:shareId]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to fetch shared drama' }, { status: 500 });
  }
}
