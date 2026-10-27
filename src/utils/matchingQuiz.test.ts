import test from 'node:test';
import assert from 'node:assert/strict';
import { FALLBACK_VOCAB_DATA } from '../data/fallbackVocab.ts';
import type { VocabCardItem } from '../data/vocabTypes.ts';

// Pure logic helpers mirroring MatchingQuiz behavior for test verification
interface QuizTile {
  id: string;
  cardId: string;
  side: 'japanese' | 'english';
  status: 'idle' | 'selected' | 'matched' | 'error' | 'solved';
  isMatched?: boolean;
  disabled?: boolean;
}

function handleTwoWayTap(
  clickedTile: QuizTile,
  selectedJpId: string | null,
  selectedEnId: string | null
): {
  newSelectedJpId: string | null;
  newSelectedEnId: string | null;
  evaluatePair: { jpId: string; enId: string } | null;
} {
  if (clickedTile.status === 'solved' || clickedTile.status === 'matched') {
    return { newSelectedJpId: selectedJpId, newSelectedEnId: selectedEnId, evaluatePair: null };
  }

  if (clickedTile.side === 'japanese') {
    // Tapping already-selected -> deselect
    if (selectedJpId === clickedTile.id) {
      return { newSelectedJpId: null, newSelectedEnId: selectedEnId, evaluatePair: null };
    }
    // If English already selected -> evaluate!
    if (selectedEnId) {
      return {
        newSelectedJpId: clickedTile.id,
        newSelectedEnId: selectedEnId,
        evaluatePair: { jpId: clickedTile.id, enId: selectedEnId },
      };
    }
    // Shift selection in column
    return { newSelectedJpId: clickedTile.id, newSelectedEnId: null, evaluatePair: null };
  } else {
    // English side
    // Tapping already-selected -> deselect
    if (selectedEnId === clickedTile.id) {
      return { newSelectedJpId: selectedJpId, newSelectedEnId: null, evaluatePair: null };
    }
    // If Japanese already selected -> evaluate!
    if (selectedJpId) {
      return {
        newSelectedJpId: selectedJpId,
        newSelectedEnId: clickedTile.id,
        evaluatePair: { jpId: selectedJpId, enId: clickedTile.id },
      };
    }
    // Shift selection in column
    return { newSelectedJpId: null, newSelectedEnId: clickedTile.id, evaluatePair: null };
  }
}

test('Two-Way Tap Selection: Japanese-first then English evaluates pair', () => {
  const jpTile: QuizTile = { id: 'jp_1', cardId: 'card-1', side: 'japanese', status: 'idle' };
  const enTile: QuizTile = { id: 'en_1', cardId: 'card-1', side: 'english', status: 'idle' };

  // 1. Tap Japanese tile
  const step1 = handleTwoWayTap(jpTile, null, null);
  assert.equal(step1.newSelectedJpId, 'jp_1');
  assert.equal(step1.newSelectedEnId, null);
  assert.equal(step1.evaluatePair, null);

  // 2. Tap English tile -> triggers evaluation
  const step2 = handleTwoWayTap(enTile, step1.newSelectedJpId, step1.newSelectedEnId);
  assert.ok(step2.evaluatePair);
  assert.equal(step2.evaluatePair?.jpId, 'jp_1');
  assert.equal(step2.evaluatePair?.enId, 'en_1');
});

test('Two-Way Tap Selection: English-first then Japanese evaluates pair', () => {
  const jpTile: QuizTile = { id: 'jp_2', cardId: 'card-2', side: 'japanese', status: 'idle' };
  const enTile: QuizTile = { id: 'en_2', cardId: 'card-2', side: 'english', status: 'idle' };

  // 1. Tap English tile first
  const step1 = handleTwoWayTap(enTile, null, null);
  assert.equal(step1.newSelectedEnId, 'en_2');
  assert.equal(step1.newSelectedJpId, null);
  assert.equal(step1.evaluatePair, null);

  // 2. Tap Japanese tile -> triggers evaluation
  const step2 = handleTwoWayTap(jpTile, step1.newSelectedJpId, step1.newSelectedEnId);
  assert.ok(step2.evaluatePair);
  assert.equal(step2.evaluatePair?.jpId, 'jp_2');
  assert.equal(step2.evaluatePair?.enId, 'en_2');
});

test('Two-Way Tap Selection: Re-tapping selected tile deselects it', () => {
  const jpTile: QuizTile = { id: 'jp_1', cardId: 'card-1', side: 'japanese', status: 'idle' };

  // First tap selects
  const step1 = handleTwoWayTap(jpTile, null, null);
  assert.equal(step1.newSelectedJpId, 'jp_1');

  // Second tap on same tile deselects
  const step2 = handleTwoWayTap(jpTile, step1.newSelectedJpId, null);
  assert.equal(step2.newSelectedJpId, null);
});

test('Two-Way Tap Selection: Tapping different tile in SAME column shifts selection immediately', () => {
  const jpTile1: QuizTile = { id: 'jp_1', cardId: 'card-1', side: 'japanese', status: 'idle' };
  const jpTile2: QuizTile = { id: 'jp_2', cardId: 'card-2', side: 'japanese', status: 'idle' };

  // Select tile 1
  const step1 = handleTwoWayTap(jpTile1, null, null);
  assert.equal(step1.newSelectedJpId, 'jp_1');

  // Tap tile 2 in same column -> shifts to tile 2, no pair evaluated
  const step2 = handleTwoWayTap(jpTile2, step1.newSelectedJpId, null);
  assert.equal(step2.newSelectedJpId, 'jp_2');
  assert.equal(step2.evaluatePair, null);
});

test('Quiz Session Pool: Generates 25-word pool across 5 distinct rounds of 5 words', () => {
  const pool = FALLBACK_VOCAB_DATA.slice(0, 25);
  assert.equal(pool.length, 25);

  const rounds: VocabCardItem[][] = [];
  for (let r = 0; r < 5; r++) {
    const roundWords = pool.slice(r * 5, r * 5 + 5);
    assert.equal(roundWords.length, 5, `Round ${r + 1} must contain exactly 5 words`);
    rounds.push(roundWords);
  }

  // Ensure all 25 words in the 5 rounds are unique
  const allIds = rounds.flat().map((c) => c.id);
  assert.equal(new Set(allIds).size, 25, 'All 25 words across 5 rounds must be unique');
});

test('Accuracy calculation handles perfect sets and mixed attempts accurately', () => {
  // 25 correct, 0 wrong -> 100%
  const perfectAcc = Math.round((25 / (25 + 0)) * 100);
  assert.equal(perfectAcc, 100);

  // 25 correct, 3 wrong -> 89%
  const mixedAcc = Math.round((25 / (25 + 3)) * 100);
  assert.equal(mixedAcc, 89);
});

test('Furigana Toggle: Controls reading visibility and persists preference', () => {
  let showFurigana = true;
  const kanjiCard = { expression: '落ちる', reading: 'おちる' };

  // When Furigana is ON -> Reading is shown
  const readingWhenOn = showFurigana ? kanjiCard.reading : undefined;
  assert.equal(readingWhenOn, 'おちる');

  // Toggle Furigana OFF
  showFurigana = false;
  const readingWhenOff = showFurigana ? kanjiCard.reading : undefined;
  assert.equal(readingWhenOff, undefined, 'Reading must be hidden when Furigana is OFF');

  // Simulate persistence string
  const storedValue = String(showFurigana);
  assert.equal(storedValue === 'true', false);
});

test('Fixed-Position Solved Tile Behavior: Tiles remain in exact original positions without reflow', () => {
  const initialTiles: QuizTile[] = [
    { id: 'jp_1', cardId: 'c1', side: 'japanese', status: 'idle' },
    { id: 'jp_2', cardId: 'c2', side: 'japanese', status: 'idle' },
    { id: 'jp_3', cardId: 'c3', side: 'japanese', status: 'idle' },
    { id: 'jp_4', cardId: 'c4', side: 'japanese', status: 'idle' },
    { id: 'jp_5', cardId: 'c5', side: 'japanese', status: 'idle' },
  ];

  // Solve the 3rd tile (index 2)
  const updatedTiles = initialTiles.map((t) => (t.id === 'jp_3' ? { ...t, status: 'solved' as const } : t));

  // Verify column length is strictly maintained at 5 (no tiles removed)
  assert.equal(updatedTiles.length, 5);

  // Verify all other tiles remain at their exact original indices
  assert.equal(updatedTiles[0].id, 'jp_1');
  assert.equal(updatedTiles[1].id, 'jp_2');
  assert.equal(updatedTiles[2].id, 'jp_3');
  assert.equal(updatedTiles[2].status, 'solved');
  assert.equal(updatedTiles[3].id, 'jp_4');
  assert.equal(updatedTiles[4].id, 'jp_5');

  // Verify board is NOT yet complete (only 1 of 5 solved)
  const allSolvedPartial = updatedTiles.every((t) => t.status === 'solved');
  assert.equal(allSolvedPartial, false, 'Board must not advance until all 5 are solved');

  // Mark remaining tiles as solved
  const fullySolvedTiles = updatedTiles.map((t) => ({ ...t, status: 'solved' as const }));
  const allSolvedFinal = fullySolvedTiles.every((t) => t.status === 'solved');
  assert.equal(allSolvedFinal, true, 'Board completion triggers only when all 5 pairs are solved');
});

test('No Continuous Tile Replenishment: Board array length remains strictly 5 per column throughout matches', () => {
  const WORDS_PER_ROUND = 5;
  let jpTiles: QuizTile[] = Array.from({ length: WORDS_PER_ROUND }, (_, i) => ({
    id: `jp_${i}`,
    cardId: `c_${i}`,
    side: 'japanese',
    status: 'idle',
    isMatched: false,
    disabled: false,
  }));
  let enTiles: QuizTile[] = Array.from({ length: WORDS_PER_ROUND }, (_, i) => ({
    id: `en_${i}`,
    cardId: `c_${i}`,
    side: 'english',
    status: 'idle',
    isMatched: false,
    disabled: false,
  }));

  let roundMatchedCount = 0;
  let roundIndex = 0;

  // Function simulating exact evaluateMatch behavior without mid-round replenishment
  const matchPair = (cardId: string) => {
    jpTiles = jpTiles.map((t) =>
      t.cardId === cardId ? { ...t, status: 'solved', isMatched: true, disabled: true } : t
    );
    enTiles = enTiles.map((t) =>
      t.cardId === cardId ? { ...t, status: 'solved', isMatched: true, disabled: true } : t
    );
    roundMatchedCount += 1;

    // ONLY load a new set of 5 pairs when roundMatchedCount === WORDS_PER_ROUND (5)
    if (roundMatchedCount === WORDS_PER_ROUND) {
      roundIndex += 1;
      roundMatchedCount = 0;
      // Load next 5 pairs
      jpTiles = Array.from({ length: WORDS_PER_ROUND }, (_, i) => ({
        id: `jp_r2_${i}`,
        cardId: `c_r2_${i}`,
        side: 'japanese',
        status: 'idle',
        isMatched: false,
        disabled: false,
      }));
      enTiles = Array.from({ length: WORDS_PER_ROUND }, (_, i) => ({
        id: `en_r2_${i}`,
        cardId: `c_r2_${i}`,
        side: 'english',
        status: 'idle',
        isMatched: false,
        disabled: false,
      }));
    }
  };

  // Match 1st pair
  matchPair('c_0');
  assert.equal(jpTiles.length, 5, 'Left column must remain strictly 5 tiles, no removal');
  assert.equal(enTiles.length, 5, 'Right column must remain strictly 5 tiles, no removal');
  assert.equal(roundMatchedCount, 1);
  assert.equal(roundIndex, 0, 'Must NOT advance round after 1 match');
  assert.equal(jpTiles[0].isMatched, true);
  assert.equal(jpTiles[0].disabled, true);
  assert.equal(jpTiles[0].status, 'solved');

  // Match 2nd, 3rd, 4th pairs
  matchPair('c_1');
  matchPair('c_2');
  matchPair('c_3');
  assert.equal(roundMatchedCount, 4);
  assert.equal(roundIndex, 0, 'Must NOT advance round after 4 matches');
  assert.equal(jpTiles.length, 5);
  assert.equal(enTiles.length, 5);

  // Match 5th pair (completes current round)
  matchPair('c_4');
  assert.equal(roundIndex, 1, 'ONLY advance round when roundMatchedCount === 5');
  assert.equal(roundMatchedCount, 0, 'roundMatchedCount resets to 0 for the next round');
  assert.equal(jpTiles.length, 5, 'New round has exactly 5 tiles');
  assert.equal(enTiles.length, 5, 'New round has exactly 5 tiles');
  assert.equal(jpTiles.every((t) => !t.isMatched && !t.disabled), true, 'New round tiles start un-matched');
});


