import type { Script, Mood, RegenerateSection, Character, Scene } from '@/types';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

const MOOD_DESCRIPTIONS: Record<Mood, string> = {
  dramatic: 'Over-the-top Bollywood masala — intense emotions, slow-motion hero walks, thunderclap sound effects, destiny speeches',
  romantic: 'Sweeping love story — rose petals falling, dramatic rain scenes, heartfelt confessions, destiny bringing two souls together',
  comedy:   'Slapstick chaos — mistaken identities, ridiculous misunderstandings, pratfalls, and laugh-out-loud absurdity',
  action:   'High-octane action — impossible stunts, gravity-defying fights, one-liners, explosions in slow motion',
  tragic:   'Gut-wrenching tragedy — violin swells, slow-motion tears, dramatic death speeches, ultimate sacrifice',
  thriller: 'Edge-of-your-seat suspense — shadowy conspiracies, double-crosses, dramatic reveals, shocking twists',
};

const SYSTEM_PROMPT = `You are MASALAWOOD — the world's most legendary Bollywood/Hollywood script writer AI. You transform ORDINARY, mundane, everyday situations into EPIC, dramatic, over-the-top movie masterpieces.

Your scripts MUST:
- Treat every trivial situation like the fate of the entire universe depends on it
- Include dramatic background music cues in square brackets e.g. [DHOL BEATS INTENSIFY], [VIOLIN SWELLS], [ITEM SONG BEGINS]
- Give characters flamboyant, dramatic names (e.g. "Vijay Kumar Sharma", "Rocky Bhai", "Senorita Rosalind")
- Reference classic Bollywood tropes: slow-motion reveals, dramatic close-ups, long-lost relatives, coincidental meetings
- Mix in Hindi/Urdu exclamations naturally: "NAHI!", "Yeh toh hona hi tha!", "Kabhi nahi!", "Bhai!"
- Make every dialogue line SO dramatic it could be a movie poster quote
- Be genuinely funny, absurd, and wildly entertaining

CRITICAL OUTPUT RULE: Return ONLY a valid JSON object. Zero markdown. Zero explanation. Zero text before or after the JSON.

The JSON MUST follow this EXACT schema:
{
  "title": "DRAMATIC MOVIE TITLE IN ALL CAPS",
  "tagline": "One unforgettable sentence that captures the drama",
  "characters": [
    {
      "name": "Character's dramatic full name",
      "role": "Hero OR Villain OR Love Interest OR Comic Relief OR Sidekick OR Mentor",
      "description": "2-3 sentences: personality, dramatic flaw, iconic look",
      "traits": ["trait1", "trait2", "trait3"]
    }
  ],
  "scenes": [
    {
      "index": 1,
      "title": "Dramatic Scene Title",
      "location": "Cinematic location description",
      "mood": "Intense OR Romantic OR Comedic OR Action OR Tragic OR Suspenseful",
      "description": "2-3 sentences of cinematic scene setting with camera directions",
      "dialogue": [
        {
          "character": "Character name",
          "action": "Stage direction in present tense",
          "line": "The spoken line — make it SO dramatic it belongs on a billboard"
        }
      ],
      "musicCue": "[SOUND EFFECT OR MUSIC DESCRIPTION]"
    }
  ]
}

Generate exactly 4 scenes. Include 3-4 characters. Every scene must have 3-6 dialogue exchanges. Make it GLORIOUSLY EPIC.`;

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function buildUserPrompt(situation: string, mood: Mood): string {
  return `Transform this situation into a ${mood.toUpperCase()} Bollywood/Hollywood cinematic masterpiece:

SITUATION: "${situation}"

TONE & STYLE: ${MOOD_DESCRIPTIONS[mood]}

The more absurd and over-the-top, the better. This is CINEMA at its most glorious!`;
}

function extractJSON(text: string): unknown {
  const s = text.trim();
  try { return JSON.parse(s); } catch {}

  const md = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (md) { try { return JSON.parse(md[1].trim()); } catch {} }

  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(s.slice(start, end + 1)); } catch {}
  }

  throw new Error('LLM returned a non-JSON response. Please try again.');
}

function validateAndFix(data: unknown): Script {
  if (!data || typeof data !== 'object') throw new Error('Invalid script structure');
  const d = data as Record<string, unknown>;

  if (!d.title || typeof d.title !== 'string') throw new Error('Script missing title');
  if (!d.tagline || typeof d.tagline !== 'string') throw new Error('Script missing tagline');
  if (!Array.isArray(d.characters) || !d.characters.length) throw new Error('Script missing characters');
  if (!Array.isArray(d.scenes) || !d.scenes.length) throw new Error('Script missing scenes');

  const scenes: Scene[] = (d.scenes as Record<string, unknown>[]).map((s, i) => ({
    index:       typeof s.index === 'number' ? s.index : i + 1,
    title:       typeof s.title === 'string' ? s.title : `Scene ${i + 1}`,
    location:    typeof s.location === 'string' ? s.location : 'A dramatic location',
    mood:        typeof s.mood === 'string' ? s.mood : 'Intense',
    description: typeof s.description === 'string' ? s.description : '',
    dialogue:    Array.isArray(s.dialogue) ? s.dialogue as Scene['dialogue'] : [],
    musicCue:    typeof s.musicCue === 'string' ? s.musicCue : '[DRAMATIC MUSIC SWELLS]',
  }));

  const characters: Character[] = (d.characters as Record<string, unknown>[]).map(c => ({
    name:        typeof c.name === 'string' ? c.name : 'Unknown',
    role:        typeof c.role === 'string' ? c.role : 'Supporting',
    description: typeof c.description === 'string' ? c.description : '',
    traits:      Array.isArray(c.traits) ? c.traits as string[] : [],
  }));

  return { title: d.title, tagline: d.tagline, characters, scenes };
}

async function callLLM(messages: LLMMessage[], maxTokens = 4000): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY is not set. Add it to .env.local');

  let res: Response;
  try {
    res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.9,
        max_tokens: maxTokens,
      }),
      cache: 'no-store',
    });
  } catch (fetchErr) {
    const cause = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
    throw new Error(`Network error: could not reach api.groq.com. Check your internet connection. Details: ${cause}`);
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }

  const data = await res.json() as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq');

  return content;
}

export async function generateScript(situation: string, mood: Mood): Promise<Script> {
  const content = await callLLM([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildUserPrompt(situation, mood) },
  ]);
  return validateAndFix(extractJSON(content));
}

export async function regenerateSection(
  situation: string,
  mood: Mood,
  section: RegenerateSection,
  existingScript: Script,
): Promise<Partial<Script>> {
  const prompts: Record<RegenerateSection, string> = {
    title: `Generate a NEW dramatic movie title and tagline for a ${mood} Bollywood drama about: "${situation}".
Make it completely different from the current title: "${existingScript.title}".
Return ONLY JSON: {"title": "NEW TITLE", "tagline": "new tagline"}`,

    characters: `Generate FRESH character profiles for a ${mood} Bollywood drama about: "${situation}".
Create entirely new characters with different names and personalities.
Return ONLY JSON: {"characters": [{name, role, description, traits}, ...]}`,

    scenes: `Rewrite all scenes for a ${mood} Bollywood drama about: "${situation}".
The characters are: ${existingScript.characters.map(c => c.name).join(', ')}.
Create 4 completely fresh scenes with new dialogue and locations.
Return ONLY JSON: {"scenes": [{index, title, location, mood, description, dialogue:[{character,action,line}], musicCue}, ...]}`,
  };

  const content = await callLLM([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompts[section] },
  ], 2500);

  return extractJSON(content) as Partial<Script>;
}
