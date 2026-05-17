# 🎬 Bollywood Script Generator — MASALAWOOD

> Turn any ordinary situation into an epic Bollywood blockbuster. Powered by AI. Fueled by drama.

---

## Features

| Feature | |
|---|---|
| Situation input → title + tagline + multi-scene script 
| LLM agent with structured JSON output + extraction fallbacks 
| Scene index, description, dialogue, music cues 
| Character cards (name, role, traits)
| Scene mood selector (6 moods)
| Regenerate title, characters, or scenes independently
| History drawer (persisted to local JSON file)
| Shareable public link `/share/:id`
| Error handling (client + server)
| Responsive UI

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS, Framer Motion, Lucide |
| AI | OpenRouter API (any free or paid model) |
| Storage | JSON file (`data/dramas.json`) — zero setup |

---

## Project Structure

```
src/
├── app/
│   ├── layout.jsx                      # Root layout (fonts, Toaster)
│   ├── page.jsx                        # Home page
│   ├── globals.css
│   ├── share/[shareId]/page.jsx        # Public share page
│   └── api/
│       ├── generate/route.js           # POST /api/generate
│       ├── generate/[id]/regenerate/   # POST /api/generate/:id/regenerate
│       ├── history/route.js            # GET  /api/history
│       ├── history/[id]/route.js       # GET  /api/history/:id
│       └── share/[shareId]/route.js    # GET  /api/share/:shareId
├── lib/
│   ├── scriptAgent.js                  # LLM agent (prompt + JSON extraction)
│   ├── db.js                           # JSON file storage
│   └── apiClient.js                    # Browser-side fetch wrapper
├── hooks/
│   └── useScript.js                    # React state hooks
└── components/
    ├── InputForm.jsx
    ├── ScriptOutput.jsx
    ├── SceneCard.jsx
    ├── CharacterCard.jsx
    ├── HistoryPanel.jsx
    ├── ShareModal.jsx
    └── SharedView.jsx
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- An OpenRouter API key — free at [openrouter.ai](https://openrouter.ai)

### 1. Clone

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=google/gemma-4-31b-it:free
```

**Free models on OpenRouter:**
- `google/gemma-4-31b-it:free`
- `openrouter/openai/gpt-oss-120b:free`
- `nvidia/nemotron-3-super-120b-a12b:free`

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎬

### Production build

```bash
npm run build
npm start
```

---

## Architecture Diagram

```mermaid
graph TD
    subgraph Browser["🌐 Browser (Client)"]
        UI["page.jsx\nHome Page"]
        Hook["useScript.js\nReact State Hooks"]
        AC["apiClient.js\nFetch Wrapper"]
        C1["InputForm"]
        C2["ScriptOutput"]
        C3["SceneCard / CharacterCard"]
        C4["HistoryPanel"]
        C5["ShareModal"]
        SV["SharedView\n/share/:id"]
    end

    subgraph NextJS["⚡ Next.js 14 — Single Deployment"]
        subgraph API["App Router — API Route Handlers"]
            R1["POST /api/generate"]
            R2["POST /api/generate/:id/regenerate"]
            R3["GET  /api/history"]
            R4["GET  /api/history/:id"]
            R5["GET  /api/share/:shareId"]
        end

        subgraph Lib["src/lib/"]
            Agent["scriptAgent.js\nLLM Agent"]
            DB["db.js\nJSON Storage"]
        end
    end

    subgraph External["☁️ External"]
        OR["OpenRouter API\ngoogle/gemma-4-31b-it:free"]
        FS["data/dramas.json\nLocal File System"]
    end

    UI --> Hook --> AC
    AC -->|POST situation + mood| R1
    AC -->|POST section| R2
    AC -->|GET| R3
    AC -->|GET| R4
    AC -->|GET| R5

    R1 --> Agent --> OR
    R2 --> Agent
    OR -->|JSON script| Agent

    R1 --> DB --> FS
    R2 --> DB
    R3 --> DB
    R4 --> DB
    R5 --> DB

    C1 & C2 & C3 & C4 & C5 --- UI
    SV -->|GET| R5
```

---

## Sequence Diagram — Script Generation

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI<br/>(page.jsx)
    participant Hook as useScript.js
    participant Client as apiClient.js
    participant API as /api/generate<br/>(Route Handler)
    participant Agent as scriptAgent.js
    participant OR as OpenRouter API
    participant DB as db.js<br/>(JSON file)

    User->>UI: Types situation + selects mood
    User->>UI: Clicks "LIGHTS, CAMERA, ACTION!"
    UI->>Hook: generate(situation, mood)
    Hook->>Hook: setLoading(true)
    Hook->>Client: api.generate(situation, mood)
    Client->>API: POST /api/generate {situation, mood}

    API->>API: Validate input (length, mood enum)
    API->>Agent: generateScript(situation, mood)

    Agent->>Agent: Build system + user prompt
    Agent->>OR: POST /chat/completions (model, messages)
    OR-->>Agent: Raw LLM text response

    Agent->>Agent: extractJSON() — parse / strip markdown
    Agent->>Agent: validateAndFix() — fill missing fields
    Agent-->>API: Structured script object

    API->>API: Generate UUID id + 12-char shareId
    API->>DB: insertDrama({id, shareId, script, ...})
    DB->>DB: Write to data/dramas.json
    API-->>Client: {id, shareId, mood, script}

    Client-->>Hook: drama data
    Hook->>Hook: setDrama(data), setLoading(false)
    Hook-->>UI: drama state updated
    UI->>UI: Render ScriptOutput, SceneCards, CharacterCards
    UI-->>User: 🎬 Full Bollywood script displayed
```

---

## Sequence Diagram — Regenerate a Section

```mermaid
sequenceDiagram
    actor User
    participant UI as ScriptOutput
    participant Hook as useScript.js
    participant Client as apiClient.js
    participant API as /api/generate/:id/regenerate
    participant Agent as scriptAgent.js
    participant OR as OpenRouter API
    participant DB as db.js

    User->>UI: Clicks "Regenerate" on title / characters / scenes
    UI->>Hook: regenerate(id, section)
    Hook->>Hook: setRegenerating(true)
    Hook->>Client: api.regenerate(id, section)
    Client->>API: POST /api/generate/:id/regenerate {section}

    API->>DB: getDramaById(id)
    DB-->>API: Existing drama object

    API->>Agent: regenerateSection(situation, mood, section, existingScript)
    Agent->>Agent: Build targeted section-specific prompt
    Agent->>OR: POST /chat/completions
    OR-->>Agent: Raw LLM text

    Agent->>Agent: extractJSON()
    Agent-->>API: Partial {title?} | {characters?} | {scenes?}

    API->>API: Merge partial into existing script
    API->>DB: updateDrama(id, updatedScript)
    API-->>Client: {id, script: updatedScript}

    Client-->>Hook: updated script
    Hook->>Hook: merge into drama state
    Hook-->>UI: re-render with new section
    UI-->>User: ✅ Section refreshed in place
```

---

## AI Engineering Notes

- **Prompt:** System prompt establishes the MASALAWOOD persona with explicit Bollywood tropes, Hindi exclamations, and music cue formatting. User prompt injects mood-specific style guidance.
- **Structured output:** LLM is instructed to return raw JSON only. `extractJSON()` in `scriptAgent.js` handles markdown fences and partial extraction gracefully.
- **Validation:** `validateAndFix()` gives safe defaults to any missing fields so the UI never crashes on a partial LLM response.
- **Targeted regeneration:** Each section (title, characters, scenes) has its own focused prompt so token usage stays low and responses stay relevant.
