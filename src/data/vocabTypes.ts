export type JLPTLevel = 'N4' | 'N5';
export type StudyMode = 'all' | 'n4' | 'n5';
export type DataSyncStatus = 'loading' | 'synced-json' | 'synced-csv' | 'fallback';

export interface ExampleSentence {
  japanese: string;
  furigana: string;
  english: string;
}

export interface VocabCardItem {
  id: string;
  expression: string; // The target word (Kanji, Kana, or Compound)
  reading: string;    // Pure Hiragana phonetic reading for TTS & furigana
  meaning: string;    // English definition
  level: JLPTLevel;   // 'N4' or 'N5'
  tags: string[];     // e.g. ['verb', 'transitive', 'JLPT_N4']
  priority: number;   // Calculated frequency & exam priority rank (1 = highest)
  category?: string;  // e.g., 'Transitive/Intransitive Pair', 'Giving/Receiving', 'Core N4 Verb'
  pairNote?: string;  // e.g., 'Intransitive pair: 開く (あく)'
  transitivity?: 'transitive' | 'intransitive'; // 'transitive' (他動詞) or 'intransitive' (自動詞)
  exampleSentence?: ExampleSentence;
  radical?: string;   // Optional radical if primary kanji identified
}

export interface FetchResult {
  items: VocabCardItem[];
  status: DataSyncStatus;
  statusMessage: string;
}
