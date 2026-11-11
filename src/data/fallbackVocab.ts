import type { VocabCardItem } from './vocabTypes.ts';
import { ELZUP_N4_VOCAB_DATA } from './elzupN4Deck.ts';
import { ELZUP_N5_VOCAB_DATA } from './elzupN5Deck.ts';

export { ELZUP_N4_VOCAB_DATA } from './elzupN4Deck.ts';
export { ELZUP_N5_VOCAB_DATA } from './elzupN5Deck.ts';
export { JT4U_N4_VOCAB_DATA } from './jt4uN4Deck.ts';
export { N4_GRAMMAR_VOCAB_DATA } from './n4GrammarDeck.ts';

/**
 * Combined fallback vocabulary dataset containing both N4 and N5 items.
 * Maintained for backward compatibility across existing components.
 * Combines both arrays while grouping the N5 pair verb 開く (あく) alongside
 * its N4 partner 開ける (あける) to preserve pedagogical ranking and pair spacing.
 */
export const FALLBACK_VOCAB_DATA: VocabCardItem[] = (() => {
  const n5Aku = ELZUP_N5_VOCAB_DATA.find((c) => c.expression === '開く');
  const otherN5 = ELZUP_N5_VOCAB_DATA.filter((c) => c.expression !== '開く');
  const akeruIdx = ELZUP_N4_VOCAB_DATA.findIndex((c) => c.expression === '開ける');

  if (!n5Aku || akeruIdx === -1) {
    return [...ELZUP_N4_VOCAB_DATA, ...ELZUP_N5_VOCAB_DATA];
  }

  return [
    ...ELZUP_N4_VOCAB_DATA.slice(0, akeruIdx + 1),
    n5Aku,
    ...ELZUP_N4_VOCAB_DATA.slice(akeruIdx + 1),
    ...otherN5,
  ];
})();
