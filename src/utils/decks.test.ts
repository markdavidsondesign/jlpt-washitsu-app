import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DECKS,
  getDeckById,
  getAvailableDecks,
} from '../data/vocabFetcher.ts';
import {
  FALLBACK_VOCAB_DATA,
  ELZUP_N4_VOCAB_DATA,
  ELZUP_N5_VOCAB_DATA,
  JT4U_N4_VOCAB_DATA,
} from '../data/fallbackVocab.ts';
import type { DeckMetadata, VocabCardItem } from '../data/vocabTypes.ts';

test('DECKS registry contains elzup_n4, elzup_n5, and jt4u_n4 with exact metadata specifications', () => {
  assert.ok(DECKS['elzup_n4'], 'elzup_n4 deck must exist in registry');
  assert.ok(DECKS['elzup_n5'], 'elzup_n5 deck must exist in registry');
  assert.ok(DECKS['jt4u_n4'], 'jt4u_n4 deck must exist in registry');

  // Verify elzup_n4 metadata
  const metaN4 = DECKS['elzup_n4'].metadata;
  assert.equal(metaN4.id, 'elzup_n4');
  assert.equal(metaN4.name, 'elzup N4');
  assert.equal(metaN4.description, 'JLPT N4 vocabulary sourced from elzup GitHub dataset.');
  assert.equal(metaN4.level, 'N4');
  assert.equal(metaN4.cardCount, 50);
  assert.equal(DECKS['elzup_n4'].cards.length, 50);

  // Verify elzup_n5 metadata
  const metaN5 = DECKS['elzup_n5'].metadata;
  assert.equal(metaN5.id, 'elzup_n5');
  assert.equal(metaN5.name, 'elzup N5');
  assert.equal(metaN5.description, 'JLPT N5 vocabulary sourced from elzup GitHub dataset.');
  assert.equal(metaN5.level, 'N5');
  assert.equal(metaN5.cardCount, 20);
  assert.equal(DECKS['elzup_n5'].cards.length, 20);

  // Verify jt4u_n4 metadata
  const metaJT4U = DECKS['jt4u_n4'].metadata;
  assert.equal(metaJT4U.id, 'jt4u_n4');
  assert.equal(metaJT4U.name, 'JT4U N4');
  assert.equal(metaJT4U.description, 'JLPT N4 vocabulary sourced from JapaneseTest4You.com dataset.');
  assert.equal(metaJT4U.level, 'N4');
  assert.equal(metaJT4U.cardCount, 536);
  assert.equal(DECKS['jt4u_n4'].cards.length, 536);
});

test('getAvailableDecks returns metadata array for all registered decks', () => {
  const decks: DeckMetadata[] = getAvailableDecks();
  assert.equal(decks.length, 3);

  const n4 = decks.find((d) => d.id === 'elzup_n4');
  const n5 = decks.find((d) => d.id === 'elzup_n5');
  const jt4u = decks.find((d) => d.id === 'jt4u_n4');

  assert.ok(n4, 'elzup_n4 metadata must be returned');
  assert.ok(n5, 'elzup_n5 metadata must be returned');
  assert.ok(jt4u, 'jt4u_n4 metadata must be returned');
  assert.equal(n4.level, 'N4');
  assert.equal(n5.level, 'N5');
  assert.equal(jt4u.level, 'N4');
  assert.equal(n4.cardCount, 50);
  assert.equal(n5.cardCount, 20);
  assert.equal(jt4u.cardCount, 536);
});

test('getDeckById returns the correct card arrays with deckId tags', () => {
  const n4Cards = getDeckById('elzup_n4');
  assert.equal(n4Cards.length, 50);
  for (const card of n4Cards) {
    assert.equal(card.deckId, 'elzup_n4');
    assert.equal(card.level, 'N4');
  }

  const n5Cards = getDeckById('elzup_n5');
  assert.equal(n5Cards.length, 20);
  for (const card of n5Cards) {
    assert.equal(card.deckId, 'elzup_n5');
    assert.equal(card.level, 'N5');
  }

  const jt4uCards = getDeckById('jt4u_n4');
  assert.equal(jt4uCards.length, 536);
  for (const card of jt4uCards) {
    assert.equal(card.deckId, 'jt4u_n4');
    assert.equal(card.level, 'N4');
    assert.ok(card.reading, `Card ${card.expression} must have a furigana reading`);
    assert.ok(card.meaning, `Card ${card.expression} must have a meaning`);
    assert.equal(card.exampleSentence, undefined, `Card ${card.expression} must not have an exampleSentence`);
  }
  // Verify specific verbatim Google Doc words are intact without okurigana corruption or alterations
  assert.ok(jt4uCards.some((c) => c.expression === '集る'), 'Must include 集る verbatim from doc');
  assert.ok(jt4uCards.some((c) => c.expression === '楽む'), 'Must include 楽む verbatim from doc');
  assert.ok(jt4uCards.some((c) => c.expression === 'きっと'), 'Must include きっと verbatim from doc');
  assert.ok(jt4uCards.some((c) => c.expression === 'しばらく'), 'Must include しばらく verbatim from doc');
  assert.ok(jt4uCards.some((c) => c.expression === 'しっかり'), 'Must include しっかり verbatim from doc');

  // Gracefully handles non-existent deck IDs
  const unknown = getDeckById('non_existent');
  assert.deepEqual(unknown, []);
});

test('FALLBACK_VOCAB_DATA preserves backward compatibility and combines both decks', () => {
  assert.equal(FALLBACK_VOCAB_DATA.length, 70);

  const n4Count = FALLBACK_VOCAB_DATA.filter((c) => c.deckId === 'elzup_n4').length;
  const n5Count = FALLBACK_VOCAB_DATA.filter((c) => c.deckId === 'elzup_n5').length;

  assert.equal(n4Count, 50);
  assert.equal(n5Count, 20);

  // Re-exported arrays match direct imports
  assert.equal(ELZUP_N4_VOCAB_DATA.length, 50);
  assert.equal(ELZUP_N5_VOCAB_DATA.length, 20);
});

import {
  filterDeckByMode,
  filterDeckByDecks,
  calculateDeckStats,
  calculateSRSStats,
  loadSelectedDeckIdsFromStorage,
  saveSelectedDeckIdsToStorage,
  SELECTED_DECKS_STORAGE_KEY,
  CardProgress,
} from './srs.ts';

test('filterDeckByMode and filterDeckByDecks correctly filter by selectedDeckIds array', () => {
  const masterDeck = FALLBACK_VOCAB_DATA;

  // Single deck: elzup_n4
  const n4Only = filterDeckByMode(masterDeck, ['elzup_n4']);
  assert.equal(n4Only.length, 50);
  assert.ok(n4Only.every((c) => c.level === 'N4' || c.deckId === 'elzup_n4'));

  // Single deck: elzup_n5
  const n5Only = filterDeckByDecks(masterDeck, ['elzup_n5']);
  assert.equal(n5Only.length, 20);
  assert.ok(n5Only.every((c) => c.level === 'N5' || c.deckId === 'elzup_n5'));

  // Multi-deck: both elzup_n4 and elzup_n5
  const both = filterDeckByDecks(masterDeck, ['elzup_n4', 'elzup_n5']);
  assert.equal(both.length, 70);

  // Single deck: jt4u_n4 with combined deck
  const combinedDeck = [...masterDeck, ...JT4U_N4_VOCAB_DATA];
  const jt4uOnly = filterDeckByDecks(combinedDeck, ['jt4u_n4']);
  assert.equal(jt4uOnly.length, 536);
  assert.ok(jt4uOnly.every((c) => c.deckId === 'jt4u_n4'));

  // Multi-deck with JT4U
  const multiWithJT4U = filterDeckByDecks(combinedDeck, ['elzup_n4', 'jt4u_n4']);
  assert.equal(multiWithJT4U.length, 50 + 536);

  // By short level tag: ['n4']
  const shortN4 = filterDeckByMode(masterDeck, ['n4']);
  assert.equal(shortN4.length, 50);

  // Legacy string modes still work
  assert.equal(filterDeckByMode(masterDeck, 'all').length, 70);
  assert.equal(filterDeckByMode(masterDeck, 'n4').length, 50);
  assert.equal(filterDeckByMode(masterDeck, 'n5').length, 20);
});

test('calculateDeckStats correctly derives per-deck progress metrics for JT4U N4', () => {
  const combinedDeck = [...FALLBACK_VOCAB_DATA, ...JT4U_N4_VOCAB_DATA];
  const progressMap: Record<string, CardProgress> = {};

  // Master 50 cards in JT4U deck
  const jt4uCards = JT4U_N4_VOCAB_DATA;
  for (let i = 0; i < 50; i++) {
    progressMap[jt4uCards[i].id] = {
      level: 3,
      srsLevel: 3,
      reviewsCount: 3,
      streak: 3,
      lastReviewedAt: Date.now(),
      mastered: true,
    };
  }

  const jt4uStats = calculateDeckStats('jt4u_n4', combinedDeck, progressMap);
  assert.equal(jt4uStats.masteredCount, 50);
  assert.equal(jt4uStats.totalCount, 536);
  assert.equal(jt4uStats.masteryPercentage, Math.round((50 / 536) * 100)); // 9%
});

test('calculateDeckStats correctly derives per-deck progress metrics', () => {
  const masterDeck = FALLBACK_VOCAB_DATA;
  const progressMap: Record<string, CardProgress> = {};

  // Mark 16 N4 cards as mastered
  const n4Cards = masterDeck.filter((c) => c.deckId === 'elzup_n4');
  for (let i = 0; i < 16; i++) {
    progressMap[n4Cards[i].id] = {
      level: 3,
      srsLevel: 3,
      reviewsCount: 3,
      streak: 3,
      lastReviewedAt: Date.now(),
      mastered: true,
    };
  }

  // Mark 5 N5 cards as mastered
  const n5Cards = masterDeck.filter((c) => c.deckId === 'elzup_n5');
  for (let i = 0; i < 5; i++) {
    progressMap[n5Cards[i].id] = {
      level: 3,
      srsLevel: 3,
      reviewsCount: 3,
      streak: 3,
      lastReviewedAt: Date.now(),
      mastered: true,
    };
  }

  // Calculate stats for N4 deck
  const statsN4 = calculateDeckStats('elzup_n4', masterDeck, progressMap);
  assert.equal(statsN4.masteredCount, 16);
  assert.equal(statsN4.totalCount, 50);
  assert.equal(statsN4.masteryPercentage, Math.round((16 / 50) * 100)); // 32%

  // Calculate stats for N5 deck
  const statsN5 = calculateDeckStats('elzup_n5', masterDeck, progressMap);
  assert.equal(statsN5.masteredCount, 5);
  assert.equal(statsN5.totalCount, 20);
  assert.equal(statsN5.masteryPercentage, 25); // 5/20 = 25%

  // calculateSRSStats with deckIdFilter
  const filteredStats = calculateSRSStats(masterDeck, progressMap, [], Date.now(), 'elzup_n4');
  assert.equal(filteredStats.masteredCount, 16);
  assert.equal(filteredStats.totalCount, 50);
});

test('Multi-deck progress retention: deselecting a deck does not erase card progress', () => {
  const masterDeck = FALLBACK_VOCAB_DATA;
  const progressMap: Record<string, CardProgress> = {};

  // Master 10 cards in N4
  const n4Cards = masterDeck.filter((c) => c.deckId === 'elzup_n4');
  for (let i = 0; i < 10; i++) {
    progressMap[n4Cards[i].id] = {
      level: 3,
      srsLevel: 3,
      reviewsCount: 2,
      streak: 2,
      lastReviewedAt: Date.now(),
      mastered: true,
    };
  }

  // Deselect N4 (switch active view to only N5)
  const activeDeckCards = filterDeckByDecks(masterDeck, ['elzup_n5']);
  assert.equal(activeDeckCards.length, 20);

  // Even though only N5 is active, N4 progress is 100% retained in progressMap
  const retainedN4Stats = calculateDeckStats('elzup_n4', masterDeck, progressMap);
  assert.equal(retainedN4Stats.masteredCount, 10);
  assert.equal(retainedN4Stats.totalCount, 50);

  // Reselecting N4 restores exact state
  const reselectedCards = filterDeckByDecks(masterDeck, ['elzup_n4', 'elzup_n5']);
  assert.equal(reselectedCards.length, 70);
  const reselectedCombinedStats = calculateSRSStats(reselectedCards.map((c) => c.id), progressMap);
  assert.equal(reselectedCombinedStats.masteredCount, 10);
});

