import { NextRequest, NextResponse } from 'next/server';
import { regenerateSection } from '@/lib/scriptAgent';
import { getDramaById, updateDramaScript } from '@/lib/db';
import type { RegenerateSection, Script } from '@/types';

const VALID_SECTIONS: RegenerateSection[] = ['title', 'characters', 'scenes'];

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json() as { section?: string };
    const section = (body.section ?? 'scenes') as RegenerateSection;

    if (!VALID_SECTIONS.includes(section))
      return NextResponse.json(
        { error: `Section must be one of: ${VALID_SECTIONS.join(', ')}` },
        { status: 400 },
      );

    const drama = getDramaById(id);
    if (!drama) return NextResponse.json({ error: 'Drama not found' }, { status: 404 });

    const partial = await regenerateSection(drama.situation, drama.mood, section, drama.script);
    const updatedScript: Script = { ...drama.script };

    if (section === 'title') {
      if (partial.title) updatedScript.title = partial.title;
      if (partial.tagline) updatedScript.tagline = partial.tagline;
    } else if (section === 'characters' && partial.characters) {
      updatedScript.characters = partial.characters;
    } else if (section === 'scenes' && partial.scenes) {
      updatedScript.scenes = partial.scenes;
    }

    updateDramaScript(id, updatedScript);

    return NextResponse.json({ id, script: updatedScript });
  } catch (err) {
    console.error('[POST /api/generate/:id/regenerate]', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to regenerate section' },
      { status: 500 },
    );
  }
}
