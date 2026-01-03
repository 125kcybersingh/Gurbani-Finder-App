/**
 * Shabad-related type definitions
 */

export interface Shabad {
  id: number;
  start_ang: number;
  end_ang: number;
  sources?: Source | null;
  writers?: Writer | null;
  raags?: Raag | null;
}

export interface Source {
  id: number;
  name_english: string;
  name_gurmukhi: string;
}

export interface Writer {
  id: number;
  name_english: string;
  name_gurmukhi: string;
}

export interface Raag {
  id: number;
  name_english: string;
  name_gurmukhi: string;
}

export interface Line {
  id: number;
  shabad_id: number;
  gurmukhi: string;
  transliteration: string | null;
  translation_english: string | null;
  source_page: number;
  source_line: number;
}

export interface ShabadDetail {
  shabad: Shabad;
  matchedLine: Line;
  allLines: Line[];
}

export interface ShabadMatch {
  lineId: number;
  shabadId: number;
  gurmukhi: string;
  transliteration: string | null;
  translation: string | null;
  sourcePage: number;
  confidence: number;
  shabad?: Shabad;
}

