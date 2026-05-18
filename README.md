# 🎬 MASALAWOOD — Bollywood Script Generator

> Turn any ordinary situation into an epic Bollywood blockbuster. Powered by AI. Fueled by drama.

---

## Features

| Feature |
|---|
| Situation input → title, tagline, and full multi-scene script
| LLM agent with structured JSON output + extraction fallbacks
| Scene index, description, dialogue, and music cues
| Character cards with name, role, and traits
| Mood selector — 6 moods (Dramatic, Romantic, Comedy, Action, Tragic, Thriller)
| Regenerate title, characters, or scenes independently
| History drawer — persisted across sessions |
| Skeleton loading states, error handling, fully responsive |

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 18, Tailwind CSS v3, Framer Motion, Lucide |
| AI | Groq API (`llama-3.3-70b-versatile`) |
| Storage | JSON file — `./data/` locally, `/tmp/` on serverless |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                       # Root layout — fonts, Toaster
│   ├── page.tsx                         # Home page
│   ├── globals.css                      # Design tokens, skeleton animation
│   └── api/
│       ├── generate/route.ts            # POST /api/generate
│       ├── generate/[id]/regenerate/    # POST /api/generate/:id/regenerate
│       ├── history/route.ts             # GET  /api/history
│       └── history/[id]/route.ts        # GET  /api/history/:id
├── lib/
│   ├── scriptAgent.ts                   # Groq LLM agent — prompt + JSON parsing
│   ├── db.ts                            # JSON file storage (local or /tmp)
│   └── apiClient.ts                     # Browser-side typed fetch wrapper
├── hooks/
│   └── useScript.ts                     # useScript + useHistory React hooks
├── components/
│   ├── InputForm.tsx
│   ├── ScriptOutput.tsx
│   ├── ScriptSkeleton.tsx               # Shimmer skeleton while generating
│   ├── SceneCard.tsx
│   ├── CharacterCard.tsx
│   └── HistoryPanel.tsx
└── types/
    └── index.ts                         # Shared domain types
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- A Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Clone & install

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

`GROQ_MODEL` is optional — defaults to `llama-3.3-70b-versatile`.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎬

### Production build

```bash
npm run build
npm start
```

### Type check

```bash
npm run typecheck
```

---

## Architecture Diagram

```mermaid
graph TD
    subgraph Browser["🌐 Browser (Client)"]
        UI["page.tsx\nHome Page"]
        Hook["useScript.ts\nReact State Hooks"]
        AC["apiClient.ts\nTyped Fetch Wrapper"]
        C1["InputForm"]
        C2["ScriptOutput"]
        C3["SceneCard / CharacterCard"]
        C4["HistoryPanel"]
    end

    subgraph NextJS["⚡ Next.js — Single Deployment"]
        subgraph API["App Router — API Route Handlers"]
            R1["POST /api/generate"]
            R2["POST /api/generate/:id/regenerate"]
            R3["GET  /api/history"]
            R4["GET  /api/history/:id"]
        end

        subgraph Lib["src/lib/"]
            Agent["scriptAgent.ts\nGroq LLM Agent"]
            DB["db.ts\nJSON Storage"]
        end
    end

    subgraph External["☁️ External"]
        Groq["Groq API\nllama-3.3-70b-versatile"]
        FS["JSON File\n./data/ locally\n/tmp/ on serverless"]
    end

    UI --> Hook --> AC
    AC -->|"POST {situation, mood}"| R1
    AC -->|"POST {section}"| R2
    AC -->|GET| R3
    AC -->|GET| R4

    R1 --> Agent -->|chat/completions| Groq
    R2 --> Agent
    Groq -->|"Raw JSON response"| Agent

    R1 --> DB --> FS
    R2 --> DB
    R3 --> DB
    R4 --> DB

    C1 & C2 & C3 & C4 --- UI
```

---

## Sequence Diagram — Script Generation

```mermaid
sequenceDiagram
    actor User
    participant UI as page.tsx
    participant Hook as useScript.ts
    participant Client as apiClient.ts
    participant API as POST /api/generate
    participant Agent as scriptAgent.ts
    participant Groq as Groq API
    participant DB as db.ts

    User->>UI: Types situation + selects mood
    User->>UI: Clicks "Generate Script"
    UI->>Hook: generate(situation, mood)
    Hook->>Hook: setLoading(true), setDrama(null)
    Hook->>Client: api.generate(situation, mood)
    Client->>API: POST /api/generate {situation, mood}

    API->>API: Validate input (min 5 chars, valid mood enum)
    API->>Agent: generateScript(situation, mood)

    Agent->>Agent: Build system prompt + user prompt
    Agent->>Groq: POST /chat/completions {model, messages}
    Groq-->>Agent: Raw text response

    Agent->>Agent: extractJSON() — direct / markdown fence / substring
    Agent->>Agent: validateAndFix() — fill missing fields with safe defaults
    Agent-->>API: Typed Script object

    API->>API: Build Drama {id, shareId, situation, mood, script, createdAt}
    API->>DB: insertDrama(drama)
    DB->>DB: Write dramas.json (./data/ or /tmp/)
    API-->>Client: Full Drama object

    Client-->>Hook: Drama
    Hook->>Hook: setDrama(drama), setLoading(false)
    Hook-->>UI: drama state updated
    UI->>UI: Replace ScriptSkeleton with ScriptOutput
    UI-->>User: 🎬 Full Bollywood script displayed
```

---

## Sequence Diagram — Regenerate a Section

```mermaid
sequenceDiagram
    actor User
    participant UI as ScriptOutput.tsx
    participant Hook as useScript.ts
    participant Client as apiClient.ts
    participant API as POST /api/generate/:id/regenerate
    participant Agent as scriptAgent.ts
    participant Groq as Groq API
    participant DB as db.ts

    User->>UI: Clicks "Regenerate" on title / characters / scenes
    UI->>Hook: regenerate(id, section)
    Hook->>Hook: setRegenerating(true)
    Hook->>Client: api.regenerate(id, section)
    Client->>API: POST /api/generate/:id/regenerate {section}

    API->>API: Validate section enum
    API->>DB: getDramaById(id)
    DB-->>API: Existing Drama object

    API->>Agent: regenerateSection(situation, mood, section, existingScript)
    Agent->>Agent: Build section-specific targeted prompt
    Agent->>Groq: POST /chat/completions
    Groq-->>Agent: Raw text

    Agent->>Agent: extractJSON()
    Agent-->>API: Partial Script {title?, tagline?} | {characters?} | {scenes?}

    API->>API: Merge partial into existing Script
    API->>DB: updateDramaScript(id, updatedScript)
    DB->>DB: Patch dramas.json
    API-->>Client: {id, script: updatedScript}

    Client-->>Hook: updated script
    Hook->>Hook: setDrama(prev => merge script)
    Hook-->>UI: re-render with new section
    UI-->>User: Section refreshed in place
```
