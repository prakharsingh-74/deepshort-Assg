export type Mood = 'dramatic' | 'romantic' | 'comedy' | 'action' | 'tragic' | 'thriller';

export type RegenerateSection = 'title' | 'characters' | 'scenes';

export interface Dialogue {
  character: string;
  action?: string;
  line: string;
}

export interface Scene {
  index: number;
  title: string;
  location: string;
  mood: string;
  description: string;
  dialogue: Dialogue[];
  musicCue: string;
}

export interface Character {
  name: string;
  role: string;
  description: string;
  traits: string[];
}

export interface Script {
  title: string;
  tagline: string;
  characters: Character[];
  scenes: Scene[];
}

export interface Drama {
  id: string;
  shareId: string;
  situation: string;
  mood: Mood;
  script: Script;
  createdAt: string;
}

export interface DramaSummary {
  id: string;
  shareId: string;
  situation: string;
  mood: Mood;
  title: string;
  tagline: string;
  createdAt: string;
}

// Raw shape stored in dramas.json
export interface DramaRecord {
  id: string;
  shareId: string;
  situation: string;
  mood: Mood;
  title: string;
  tagline: string;
  script: Script;
  createdAt: string;
}
