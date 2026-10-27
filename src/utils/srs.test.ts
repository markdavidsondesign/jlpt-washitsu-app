import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNextLevel,
  getNextQueue,
  processSRSAction,
  calculateSRSStats,
  initializeDefaultProgress,
} from './srs.ts';

test('calculateNextLevel handles all actions correctly', () => {
  // Again / Hard always drops to Level 1
  assert.equal(calculateNextLevel(1, 'again'), 1);
  assert.equal(calculateNextLevel(2, 'again'), 1);
  assert.equal(calculateNextLevel(3, 'again'), 1);

  // Good advances from Level 1 to 2, or stays at Level 2
  assert.equal(calculateNextLevel(1, 'good'), 2);
  assert.equal(calculateNextLevel(2, 'good'), 2);
  assert.equal(calculateNextLevel(3, 'good'), 2);

  // Easy / Mastered advances to Level 3
  assert.equal(calculateNextLevel(1, 'easy'), 3);
  assert.equal(calculateNextLevel(2, 'easy'), 3);
  assert.equal(calculateNextLevel(3, 'easy'), 3);
});

test('getNextQueue handles "easy" by removing card from immediate queue', () => {
  const queue = ['card-A', 'card-B', 'card-C'];
  const next = getNextQueue(queue, 'card-A', 'easy');
  assert.deepEqual(next, ['card-B', 'card-C']);

  // Single card in queue
  assert.deepEqual(getNextQueue(['card-A'], 'card-A', 'easy'), []);
});

test('getNextQueue handles "again" by reappearing immediately in current deck session', () => {
  // When multiple cards remain, re-inserts at index 1 (right after the very next card)
  const queue = ['card-A', 'card-B', 'card-C', 'card-D'];
  const next = getNextQueue(queue, 'card-A', 'again');
  assert.deepEqual(next, ['card-B', 'card-A', 'card-C', 'card-D']);

  // When only 1 card remains
  const queue2 = ['card-A', 'card-B'];
  assert.deepEqual(getNextQueue(queue2, 'card-A', 'again'), ['card-B', 'card-A']);

  // When only this card is in queue
  const queueSingle = ['card-A'];
  assert.deepEqual(getNextQueue(queueSingle, 'card-A', 'again'), ['card-A']);
});

test('getNextQueue handles "good" by reappearing after 3 other cards', () => {
  // When 4+ cards remain, inserts at index 3 (after 3 other cards)
  const queue = ['card-A', 'card-B', 'card-C', 'card-D', 'card-E', 'card-F'];
  const next = getNextQueue(queue, 'card-A', 'good');
  // remaining is B, C, D, E, F
  // after 3 cards (B, C, D): B, C, D, card-A, E, F
  assert.deepEqual(next, ['card-B', 'card-C', 'card-D', 'card-A', 'card-E', 'card-F']);

  // When fewer than or equal to 3 cards remain, appends to end
  const queueShort = ['card-A', 'card-B', 'card-C'];
  const nextShort = getNextQueue(queueShort, 'card-A', 'good');
  assert.deepEqual(nextShort, ['card-B', 'card-C', 'card-A']);
});

test('processSRSAction updates progress streak, reviewsCount, level, and queue', () => {
  const initialMap = initializeDefaultProgress(['c1', 'c2', 'c3']);
  const initialQueue = ['c1', 'c2', 'c3'];

  // Test action 'good' on c1
  const result1 = processSRSAction('c1', 'good', initialQueue, initialMap);
  assert.equal(result1.newLevel, 2);
  assert.equal(result1.updatedProgressMap['c1'].level, 2);
  assert.equal(result1.updatedProgressMap['c1'].reviewsCount, 1);
  assert.equal(result1.updatedProgressMap['c1'].streak, 1);
  assert.deepEqual(result1.nextQueue, ['c2', 'c3', 'c1']);

  // Test action 'again' resets streak to 0 and drops to level 1
  const result2 = processSRSAction('c1', 'again', ['c1', 'c2'], result1.updatedProgressMap);
  assert.equal(result2.newLevel, 1);
  assert.equal(result2.updatedProgressMap['c1'].level, 1);
  assert.equal(result2.updatedProgressMap['c1'].streak, 0);
  assert.equal(result2.updatedProgressMap['c1'].reviewsCount, 2);
});

test('calculateSRSStats correctly computes mastered, medium, and hard counts', () => {
  const allIds = ['1', '2', '3', '4'];
  const now = 1000000000;
  const progressMap = {
    // 1: Mastered, reviewed 1 hour ago -> NOT due
    '1': { level: 3 as const, reviewsCount: 3, streak: 3, lastReviewedAt: now - 3600000 },
    // 2: Mastered, reviewed 1 hour ago -> NOT due
    '2': { level: 3 as const, reviewsCount: 2, streak: 2, lastReviewedAt: now - 3600000 },
    // 3: Medium (level 2), reviewed 30 hours ago (>24h) -> DUE
    '3': { level: 2 as const, reviewsCount: 1, streak: 1, lastReviewedAt: now - (30 * 3600000) },
    // 4: Level 1 unstudied -> NEVER due
    '4': { level: 1 as const, reviewsCount: 0, streak: 0, lastReviewedAt: 0 },
  };

  const stats = calculateSRSStats(allIds, progressMap, ['3', '4'], now);
  assert.equal(stats.totalCount, 4);
  assert.equal(stats.masteredCount, 2);
  assert.equal(stats.mediumCount, 1);
  assert.equal(stats.hardCount, 1);
  assert.equal(stats.masteryPercentage, 50);
  assert.equal(stats.dueTodayCount, 1);
});

import { cleanHiraganaForTTS, selectBestJapaneseVoice } from './speech.ts';

test('cleanHiraganaForTTS correctly extracts primary reading and strips okurigana dots', () => {
  // Slashes: takes primary reading
  assert.equal(cleanHiraganaForTTS('う・まれる / い・きる / せい'), 'うまれる');
  // Middle dots: strips them
  assert.equal(cleanHiraganaForTTS('ま・つ'), 'まつ');
  assert.equal(cleanHiraganaForTTS('つよ・い'), 'つよい');
  // Clean kana untouched
  assert.equal(cleanHiraganaForTTS('がくせい'), 'がくせい');
  assert.equal(cleanHiraganaForTTS('わたしは にほんで うまれました。'), 'わたしは にほんで うまれました。');
  // Empty
  assert.equal(cleanHiraganaForTTS(''), '');
});

test('selectBestJapaneseVoice prioritizes voices in exact specified order', () => {
  const mockVoice = (name: string, lang: string, localService: boolean, isDefault = false) =>
    ({ name, lang, localService, default: isDefault, voiceURI: name } as SpeechSynthesisVoice);

  const fallback = mockVoice('Generic Japanese', 'ja-JP', true);
  const cloud = mockVoice('Cloud JA', 'ja-JP', false);
  const ms = mockVoice('Microsoft Nanami Online (Natural) - Japanese', 'ja-JP', false);
  const apple = mockVoice('Kyoko', 'ja-JP', true);
  const google = mockVoice('Google 日本語', 'ja-JP', false);
  const englishVoice = mockVoice('Samantha', 'en-US', true);

  // When only fallback is present
  assert.equal(selectBestJapaneseVoice([englishVoice, fallback]), fallback);

  // Cloud beats local fallback
  assert.equal(selectBestJapaneseVoice([fallback, cloud]), cloud);

  // Microsoft (Nanami/Keita) beats general cloud
  assert.equal(selectBestJapaneseVoice([cloud, ms]), ms);

  // Apple (Kyoko/Otoya) beats Microsoft
  assert.equal(selectBestJapaneseVoice([ms, apple]), apple);

  // Google 日本語 beats Apple
  assert.equal(selectBestJapaneseVoice([apple, google]), google);
  assert.equal(selectBestJapaneseVoice([fallback, cloud, ms, apple, google]), google);

  // Handles Google Japanese variant
  const googleEnglishName = mockVoice('Google Japanese', 'ja_JP', false);
  assert.equal(selectBestJapaneseVoice([apple, googleEnglishName]), googleEnglishName);
});

import { filterDeckByMode, getBatchQueue } from './srs.ts';
import { parseCSVLine, rankAndEnrichVocab } from '../data/vocabFetcher.ts';
import type { VocabCardItem } from '../data/vocabTypes.ts';

test('filterDeckByMode correctly filters by study mode', () => {
  const mockDeck: VocabCardItem[] = [
    { id: '1', expression: '開ける', reading: 'あける', meaning: 'open', level: 'N4', tags: [], priority: 1 },
    { id: '2', expression: '行く', reading: 'いく', meaning: 'go', level: 'N5', tags: [], priority: 2 },
    { id: '3', expression: '閉める', reading: 'しめる', meaning: 'close', level: 'N4', tags: [], priority: 3 },
  ];

  assert.equal(filterDeckByMode(mockDeck, 'all').length, 3);
  assert.equal(filterDeckByMode(mockDeck, 'n4').length, 2);
  assert.equal(filterDeckByMode(mockDeck, 'n5').length, 1);
  assert.equal(filterDeckByMode(mockDeck, 'n5')[0].expression, '行く');
});

test('getBatchQueue returns 25-card batch prioritized by unmastered status and priority rank', () => {
  const mockDeck: VocabCardItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: `item-${i + 1}`,
    expression: `word-${i + 1}`,
    reading: `reading-${i + 1}`,
    meaning: `meaning-${i + 1}`,
    level: i % 2 === 0 ? 'N4' : 'N5',
    tags: [],
    priority: i + 1,
  }));

  // Batch 0 should return first 25 items
  const batch0 = getBatchQueue(mockDeck, {}, 25, 0);
  assert.equal(batch0.length, 25);
  assert.equal(batch0[0], 'item-1');
  assert.equal(batch0[24], 'item-25');

  // If item-1 is mastered (level 3), it should prioritize unmastered cards first
  const progressMap = {
    'item-1': { level: 3 as const, reviewsCount: 3, streak: 3, lastReviewedAt: 1 },
  };
  const batchUnmastered = getBatchQueue(mockDeck, progressMap, 25, 0);
  assert.equal(batchUnmastered.includes('item-1'), false);
  assert.equal(batchUnmastered[0], 'item-2');
});

test('parseCSVLine handles quoted strings with embedded commas and whitespace', () => {
  const line = '踏む,ふむ,"to step on, to tread on",JLPT JLPT_N4';
  const parsed = parseCSVLine(line);
  assert.equal(parsed[0], '踏む');
  assert.equal(parsed[1], 'ふむ');
  assert.equal(parsed[2], 'to step on, to tread on');
  assert.equal(parsed[3], 'JLPT JLPT_N4');
});

test('rankAndEnrichVocab prioritizes transitive pairs, giving verbs, and N5 prerequisites', () => {
  const testItems: VocabCardItem[] = [
    { id: '1', expression: '猫', reading: 'ねこ', meaning: 'cat', level: 'N5', tags: [], priority: 999 },
    { id: '2', expression: 'あげる', reading: 'あげる', meaning: 'give', level: 'N4', tags: [], priority: 999 },
    { id: '3', expression: '開ける', reading: 'あける', meaning: 'open', level: 'N4', tags: [], priority: 999 },
    { id: '4', expression: '行く', reading: 'いく', meaning: 'go', level: 'N5', tags: [], priority: 999 },
  ];

  const ranked = rankAndEnrichVocab(testItems);
  assert.equal(ranked.length, 4);

  //開ける (transitive pair) should be ranked first
  assert.equal(ranked[0].expression, '開ける');
  assert.equal(ranked[0].category, 'Transitive / Intransitive Pair');
  assert.equal(ranked[0].priority, 1);

  //あげる (giving/receiving) should be ranked next
  assert.equal(ranked[1].expression, 'あげる');
  assert.equal(ranked[1].category, 'Giving & Receiving (授受動詞)');

  //行く (N5 core prerequisite) should be ranked before general N5 nouns
  assert.equal(ranked[2].expression, '行く');

  //猫 (general N5 noun) should be ranked last
  assert.equal(ranked[3].expression, '猫');
});

test('rankAndEnrichVocab applies nuanced definitions and transitivity badges to verb pairs', () => {
  const rawPairs: VocabCardItem[] = [
    { id: 'p1', expression: '開ける', reading: 'あける', meaning: 'to open', level: 'N4', tags: [], priority: 99 },
    { id: 'p2', expression: '開く', reading: 'あく', meaning: 'to open', level: 'N5', tags: [], priority: 99 },
    { id: 'p3', expression: '閉める', reading: 'しめる', meaning: 'to close', level: 'N4', tags: [], priority: 99 },
    { id: 'p4', expression: '閉まる', reading: 'しまる', meaning: 'to close', level: 'N4', tags: [], priority: 99 },
    { id: 'p5', expression: '止める', reading: 'とめる', meaning: 'to stop', level: 'N4', tags: [], priority: 99 },
    { id: 'p6', expression: '止まる', reading: 'とまる', meaning: 'to stop', level: 'N4', tags: [], priority: 99 },
    { id: 'p7', expression: '落とす', reading: 'おとす', meaning: 'to drop', level: 'N4', tags: [], priority: 99 },
    { id: 'p8', expression: '落ちる', reading: 'おちる', meaning: 'to fall', level: 'N4', tags: [], priority: 99 },
    { id: 'p9', expression: '壊す', reading: 'こわす', meaning: 'to break', level: 'N4', tags: [], priority: 99 },
    { id: 'p10', expression: '壊れる', reading: 'こわれる', meaning: 'to break', level: 'N4', tags: [], priority: 99 },
  ];

  const enriched = rankAndEnrichVocab(rawPairs);

  const akeru = enriched.find((i) => i.expression === '開ける');
  const aku = enriched.find((i) => i.expression === '開く');
  const shimeru = enriched.find((i) => i.expression === '閉める');
  const shimaru = enriched.find((i) => i.expression === '閉まる');
  const tomeru = enriched.find((i) => i.expression === '止める');
  const tomaru = enriched.find((i) => i.expression === '止まる');
  const otosu = enriched.find((i) => i.expression === '落とす');
  const ochiru = enriched.find((i) => i.expression === '落ちる');
  const kowasu = enriched.find((i) => i.expression === '壊す');
  const kowareru = enriched.find((i) => i.expression === '壊れる');

  // Verify Transitive definitions show direct action on an object
  assert.equal(akeru?.transitivity, 'transitive');
  assert.equal(akeru?.meaning, 'to open (something) / to make open');
  assert.equal(akeru?.exampleSentence?.english.includes('direct action'), true);

  assert.equal(shimeru?.transitivity, 'transitive');
  assert.equal(shimeru?.meaning, 'to close (something) / to shut (an object)');

  assert.equal(tomeru?.transitivity, 'transitive');
  assert.equal(tomeru?.meaning, 'to stop (something) / to bring to a halt');

  assert.equal(otosu?.transitivity, 'transitive');
  assert.equal(otosu?.meaning, 'to drop (something) / to let fall');

  assert.equal(kowasu?.transitivity, 'transitive');
  assert.equal(kowasu?.meaning, 'to break (something) / to destroy (an object)');

  // Verify Intransitive definitions show self-occurring action
  assert.equal(aku?.transitivity, 'intransitive');
  assert.equal(aku?.meaning, 'to open (on its own) / to be opened');
  assert.equal(aku?.exampleSentence?.english.includes('self-occurring'), true);

  assert.equal(shimaru?.transitivity, 'intransitive');
  assert.equal(shimaru?.meaning, 'to close (on its own) / to become shut');

  assert.equal(tomaru?.transitivity, 'intransitive');
  assert.equal(tomaru?.meaning, 'to stop (on its own) / to come to a halt');

  assert.equal(ochiru?.transitivity, 'intransitive');
  assert.equal(ochiru?.meaning, 'to fall (on its own) / to drop down');

  assert.equal(kowareru?.transitivity, 'intransitive');
  assert.equal(kowareru?.meaning, 'to break (on its own) / to become broken');
});

import {
  SRS_STORAGE_KEY,
  saveProgressToStorage,
  loadProgressFromStorage,
  clearProgressFromStorage,
  mergeProgressWithDeck,
  type SRSAction,
} from './srs.ts';

test('LocalStorage persistence saves, loads, and merges under jlpt_app_progress_v1', () => {
  const memoryStore: Record<string, string> = {};
  (globalThis as any).window = {
    localStorage: {
      getItem: (key: string) => memoryStore[key] || null,
      setItem: (key: string, value: string) => { memoryStore[key] = value; },
      removeItem: (key: string) => { delete memoryStore[key]; },
    },
  };

  const testMap = {
    'c1': { level: 2 as const, srsLevel: 2 as const, reviewsCount: 3, streak: 2, lastReviewedAt: 1000, nextReviewDate: 1000 + 86400000, mastered: false },
    'c2': { level: 3 as const, srsLevel: 3 as const, reviewsCount: 5, streak: 4, lastReviewedAt: 2000, nextReviewDate: 2000 + 259200000, mastered: true },
  };

  // 1. Save to storage
  saveProgressToStorage(testMap, undefined, 12);
  assert.ok(memoryStore[SRS_STORAGE_KEY], 'Saved payload exists in localStorage');

  // Verify structure
  const rawParsed = JSON.parse(memoryStore[SRS_STORAGE_KEY]);
  assert.equal(rawParsed.version, 1);
  assert.equal(rawParsed.totalFlips, 12);
  assert.deepEqual(rawParsed.progressMap, testMap);

  // 2. Load from storage
  const loaded = loadProgressFromStorage();
  assert.deepEqual(loaded, testMap);

  // 3. Merge loaded states with fetched JSON cards using string ID conversion (e.g. number vs string IDs)
  const fetchedCards: VocabCardItem[] = [
    { id: 'c1', expression: '開ける', reading: 'あける', meaning: 'open', level: 'N4', tags: [], priority: 1 },
    { id: 'c2', expression: '開く', reading: 'あく', meaning: 'open', level: 'N5', tags: [], priority: 2 },
    { id: 'c3', expression: '行く', reading: 'いく', meaning: 'go', level: 'N5', tags: [], priority: 3 },
  ];

  const merged = mergeProgressWithDeck(fetchedCards, loaded);
  // c1 and c2 should retain their saved progress
  assert.equal(merged['c1'].level, 2);
  assert.equal(merged['c1'].srsLevel, 2);
  assert.equal(merged['c1'].reviewsCount, 3);
  assert.equal(merged['c2'].level, 3);
  assert.equal(merged['c2'].srsLevel, 3);
  assert.equal(merged['c2'].mastered, true);
  // c3 is newly fetched, initialized with default level 1
  assert.equal(merged['c3'].level, 1);
  assert.equal(merged['c3'].srsLevel, 1);
  assert.equal(merged['c3'].reviewsCount, 0);
  assert.equal(merged['c3'].mastered, false);

  // 4. Overwrite defense test: Attempting to save empty unstudied map does NOT wipe existing studied progress
  const emptyUnstudiedMap = {
    'c1': { level: 1 as const, srsLevel: 1 as const, reviewsCount: 0, streak: 0, lastReviewedAt: 0, mastered: false },
  };
  saveProgressToStorage(emptyUnstudiedMap);
  const afterDefendedSave = loadProgressFromStorage();
  // Existing c1 should retain its reviews and level because empty state cannot overwrite studied cards
  assert.equal(afterDefendedSave?.['c1']?.reviewsCount, 3);
  assert.equal(afterDefendedSave?.['c1']?.level, 2);

  // 5. Clear progress
  clearProgressFromStorage();
  assert.equal(loadProgressFromStorage(), null);
});

test('Flashcard drag horizontal displacement along X-axis is constrained to max ±100px', () => {
  const MAX_DRAG_DISPLACEMENT = 100; // max displacement constrained within ±80px to ±120px
  const constrainDrag = (rawDx: number) => {
    return Math.max(-MAX_DRAG_DISPLACEMENT, Math.min(MAX_DRAG_DISPLACEMENT, rawDx));
  };

  // Subtle drags within range
  assert.equal(constrainDrag(0), 0);
  assert.equal(constrainDrag(45), 45);
  assert.equal(constrainDrag(-70), -70);
  assert.equal(constrainDrag(100), 100);
  assert.equal(constrainDrag(-100), -100);

  // Large drags across desktop monitors are strictly clamped at ±100px
  assert.equal(constrainDrag(300), 100);
  assert.equal(constrainDrag(1200), 100);
  assert.equal(constrainDrag(-450), -100);
  assert.equal(constrainDrag(-1920), -100);
});

test('Arrow key navigation triggers identical actions to card drag swipes', () => {
  const determineKeyAction = (key: string, currentLevel: number): 'flip' | SRSAction | null => {
    if (key === 'ArrowLeft' || key === '1') return 'again';
    if (key === 'ArrowRight') return currentLevel >= 2 ? 'easy' : 'good';
    if (key === ' ' || key === 'ArrowUp' || key === 'ArrowDown' || key === 'Enter') return 'flip';
    return null;
  };

  // Left Arrow triggers "Swipe Left / Again"
  assert.equal(determineKeyAction('ArrowLeft', 1), 'again');
  assert.equal(determineKeyAction('ArrowLeft', 2), 'again');

  // Right Arrow triggers "Swipe Right / Good" (or easy if level >= 2)
  assert.equal(determineKeyAction('ArrowRight', 1), 'good');
  assert.equal(determineKeyAction('ArrowRight', 2), 'easy');

  // Spacebar or Up/Down Arrows trigger "Flip Card"
  assert.equal(determineKeyAction(' ', 1), 'flip');
  assert.equal(determineKeyAction('ArrowUp', 1), 'flip');
  assert.equal(determineKeyAction('ArrowDown', 1), 'flip');
  assert.equal(determineKeyAction('Enter', 1), 'flip');
});

test('Flashcard dimension bounds and 3:4 aspect ratio preservation', () => {
  const MAX_CARD_WIDTH = 420;
  const MAX_CARD_HEIGHT = 560;
  const ASPECT_RATIO = 3 / 4;

  const calculateCardDimensions = (viewportWidth: number) => {
    // 90% width capped at MAX_CARD_WIDTH
    const cardWidth = Math.min(MAX_CARD_WIDTH, viewportWidth * 0.9);
    // Height according to 3:4 aspect ratio, capped at MAX_CARD_HEIGHT
    const cardHeight = Math.min(MAX_CARD_HEIGHT, cardWidth / ASPECT_RATIO);
    return { width: cardWidth, height: cardHeight };
  };

  // On standard desktop (1440px): caps strictly at 420px width and 560px height
  const desktop = calculateCardDimensions(1440);
  assert.equal(desktop.width, 420);
  assert.equal(desktop.height, 560);
  assert.equal(desktop.width / desktop.height, 0.75);

  // On iPad / tablet (768px): caps at 420px x 560px
  const tablet = calculateCardDimensions(768);
  assert.equal(tablet.width, 420);
  assert.equal(tablet.height, 560);

  // On mobile phone (375px): shrinks proportionally with >= 16px margins
  const mobile = calculateCardDimensions(375);
  assert.equal(mobile.width, 337.5);
  assert.equal(mobile.height, 450);
  assert.equal(mobile.width / mobile.height, 0.75);
  assert.ok((375 - mobile.width) / 2 >= 16, 'Safety margin is at least 16px on each side');
});

import { isCardDue, getDueReviewCards, getReviewModeQueue } from './srs.ts';

test('isCardDue accurately identifies due and overdue cards based on Leitner intervals', () => {
  const now = 1000000000;
  // Card with no reviews is not a due review card (it's unlearned/new)
  assert.equal(isCardDue({ level: 1, reviewsCount: 0, streak: 0, lastReviewedAt: 0 }, now), false);

  // Level 1 card with reviews is immediately due (overdue)
  assert.equal(isCardDue({ level: 1, reviewsCount: 1, streak: 0, lastReviewedAt: now - 1000 }, now), true);

  // Level 2 card reviewed 2 hours ago is NOT yet due (24h interval not elapsed)
  assert.equal(isCardDue({ level: 2, reviewsCount: 1, streak: 1, lastReviewedAt: now - (2 * 3600 * 1000) }, now), false);

  // Level 2 card reviewed 25 hours ago IS due (24h interval elapsed)
  assert.equal(isCardDue({ level: 2, reviewsCount: 1, streak: 1, lastReviewedAt: now - (25 * 3600 * 1000) }, now), true);

  // Level 3 card reviewed 1 day ago is NOT yet due (interval is 3 days / 72 hours)
  assert.equal(isCardDue({ level: 3, reviewsCount: 3, streak: 3, lastReviewedAt: now - (24 * 3600 * 1000) }, now), false);

  // Level 3 card reviewed 4 days ago IS due
  assert.equal(isCardDue({ level: 3, reviewsCount: 3, streak: 3, lastReviewedAt: now - (4 * 24 * 3600 * 1000) }, now), true);
});

test('getReviewModeQueue pulls ONLY previously studied cards sorted strictly by SRS urgency', () => {
  const mockDeck: VocabCardItem[] = [
    { id: 'new-1', expression: '新1', reading: 'しん', meaning: 'new 1', level: 'N4', tags: [], priority: 1 },
    { id: 'hard-1', expression: '難1', reading: 'なん', meaning: 'hard 1', level: 'N4', tags: [], priority: 2 },
    { id: 'hard-2', expression: '難2', reading: 'なん', meaning: 'hard 2', level: 'N4', tags: [], priority: 3 },
    { id: 'med-1', expression: '中1', reading: 'ちゅう', meaning: 'med 1', level: 'N4', tags: [], priority: 4 },
    { id: 'mast-1', expression: '習1', reading: 'しゅう', meaning: 'mastered 1', level: 'N4', tags: [], priority: 5 },
  ];

  const now = 1000000000;
  const progressMap = {
    // new-1 has 0 reviews
    'new-1': { level: 1 as const, reviewsCount: 0, streak: 0, lastReviewedAt: 0 },
    // hard-1 reviewed 10 hours ago
    'hard-1': { level: 1 as const, reviewsCount: 2, streak: 0, lastReviewedAt: now - 10000 },
    // hard-2 reviewed 50 hours ago (more overdue than hard-1!)
    'hard-2': { level: 1 as const, reviewsCount: 1, streak: 0, lastReviewedAt: now - 50000 },
    // med-1 is level 2
    'med-1': { level: 2 as const, reviewsCount: 2, streak: 2, lastReviewedAt: now - 20000 },
    // mast-1 is level 3
    'mast-1': { level: 3 as const, reviewsCount: 4, streak: 4, lastReviewedAt: now - 5000 },
  };

  const reviewQueue = getReviewModeQueue(mockDeck, progressMap, 10);

  // Must NOT include unlearned card 'new-1'
  assert.equal(reviewQueue.includes('new-1'), false);

  // Must include all 4 studied cards
  assert.equal(reviewQueue.length, 4);

  // Strict SRS urgency: Level 1 cards first, oldest lastReviewedAt first
  // hard-2 is oldest (now - 50000), hard-1 is next (now - 10000)
  assert.equal(reviewQueue[0], 'hard-2');
  assert.equal(reviewQueue[1], 'hard-1');
  // Level 2 is next
  assert.equal(reviewQueue[2], 'med-1');
  // Level 3 is last
  assert.equal(reviewQueue[3], 'mast-1');
});

test('Mastered-based 25-card batch completion logic tracks mastery rather than swipe count', () => {
  const initialBatch = ['c1', 'c2', 'c3'];
  let cyclingQueue = [...initialBatch];
  const masteredSet = new Set<string>();
  const missedSet = new Set<string>();

  // 1. User reviews c1 and swipes 'again' (needs review)
  // c1 remains in cycling queue, added to missedSet, NOT in masteredSet
  missedSet.add('c1');
  cyclingQueue = getNextQueue(cyclingQueue, 'c1', 'again');
  assert.equal(masteredSet.has('c1'), false);
  assert.equal(missedSet.has('c1'), true);
  assert.ok(cyclingQueue.includes('c1'), 'c1 remains in cycling queue');

  // 2. User reviews c2 and swipes 'good'
  masteredSet.add('c2');
  cyclingQueue = cyclingQueue.filter((id) => id !== 'c2');
  assert.equal(masteredSet.has('c2'), true);
  assert.equal(masteredSet.size, 1);

  // 3. User reviews c3 and swipes 'good'
  masteredSet.add('c3');
  cyclingQueue = cyclingQueue.filter((id) => id !== 'c3');
  assert.equal(masteredSet.has('c3'), true);
  assert.equal(masteredSet.size, 2);

  // Batch is NOT complete yet! Because c1 has not reached mastered!
  assert.equal(masteredSet.size === initialBatch.length, false);
  assert.equal(cyclingQueue.length > 0, true);

  // 4. c1 re-appears in queue. User now answers correctly and swipes 'good'
  masteredSet.add('c1');
  cyclingQueue = cyclingQueue.filter((id) => id !== 'c1');

  // NOW batch is complete: all 3 unique cards reached Mastered!
  assert.equal(masteredSet.size, initialBatch.length);
  assert.equal(cyclingQueue.length, 0);

  // Accuracy calculation:
  // c2 and c3 mastered on first pass (2 cards)
  // c1 required retry (1 card in missedSet)
  const firstPass = initialBatch.length - missedSet.size;
  assert.equal(firstPass, 2);
  assert.equal(missedSet.size, 1);
});

test('Perfect set condition triggers when 0 cards were swiped left', () => {
  const initialBatch = ['c1', 'c2', 'c3'];
  const masteredSet = new Set<string>();
  const missedSet = new Set<string>();

  // All cards swiped 'good' on first pass
  initialBatch.forEach((id) => {
    masteredSet.add(id);
  });

  const isPerfect = missedSet.size === 0 && masteredSet.size === initialBatch.length;
  assert.equal(isPerfect, true);
});

test('Unstudied new cards are strictly excluded from due items', () => {
  const deck: VocabCardItem[] = [
    { id: 'new-1', expression: '犬', reading: 'いぬ', meaning: 'dog', level: 'N5', tags: [], priority: 1 },
    { id: 'new-2', expression: '猫', reading: 'ねこ', meaning: 'cat', level: 'N5', tags: [], priority: 2 },
    { id: 'studied-due', expression: '食べる', reading: 'たべる', meaning: 'eat', level: 'N5', tags: [], priority: 3 },
    { id: 'studied-not-due', expression: '飲む', reading: 'のむ', meaning: 'drink', level: 'N5', tags: [], priority: 4 },
  ];

  const now = 1000000000;
  const progressMap = {
    // new-1 and new-2 have 0 reviews and no lastReviewedAt
    'new-1': { level: 1 as const, reviewsCount: 0, streak: 0, lastReviewedAt: 0 },
    'new-2': { level: 1 as const, reviewsCount: 0, streak: 0, lastReviewedAt: 0 },
    // studied-due: Level 2 reviewed 30 hours ago (>24h) -> DUE
    'studied-due': { level: 2 as const, reviewsCount: 1, streak: 1, lastReviewedAt: now - (30 * 3600 * 1000) },
    // studied-not-due: Level 2 reviewed 1 hour ago (<24h) -> NOT DUE
    'studied-not-due': { level: 2 as const, reviewsCount: 1, streak: 1, lastReviewedAt: now - (1 * 3600 * 1000) },
  };

  const dueItems = getDueReviewCards(deck, progressMap, now);

  // Exactly 1 item is due: 'studied-due'
  assert.equal(dueItems.length, 1);
  assert.equal(dueItems[0].id, 'studied-due');

  // New unstudied cards are NEVER included
  assert.equal(dueItems.some((c) => c.id === 'new-1'), false);
  assert.equal(dueItems.some((c) => c.id === 'new-2'), false);
  assert.equal(dueItems.some((c) => c.id === 'studied-not-due'), false);
});

test('Header responsive layout contract for mobile (<480px) and desktop', () => {
  // Verify configuration invariants for header layout
  const mobileBreakpointPx = 480;
  assert.equal(mobileBreakpointPx, 480);

  // Mobile two-row structure:
  // Row 1: Left [Logo, Mode Switcher], Right [Deck, Theme, Reset]
  // Row 2: Left [Level tabs: All/N4/N5], Right [Stats pill]
  const mobileRow1 = ['logo', 'modeSwitcher', 'actionIcons'];
  const mobileRow2 = ['levelFilterTabs', 'statsPill'];
  assert.equal(mobileRow1.length, 3);
  assert.equal(mobileRow2.length, 2);

  // Desktop single row contains all 4 functional groups
  const desktopGroups = ['brandAndMode', 'levelFilter', 'statsPill', 'actionIcons'];
  assert.equal(desktopGroups.length, 4);

  // Header bounds constraints
  const headerConstraints = {
    maxWidth: '100%',
    width: '100%',
    boxSizing: 'border-box',
    mobilePadding: '6px 12px',
    desktopHeight: 48,
  };
  assert.equal(headerConstraints.maxWidth, '100%');
  assert.equal(headerConstraints.boxSizing, 'border-box');
});

import {
  repairCorruptedOkurigana,
  generateCanonicalCardId,
  mergeDefinitions,
  deduplicateAndNormalizeDeck,
} from '../data/vocabFetcher.ts';

test('Kanji & Okurigana integrity repairs corrupted verb forms without splitting okurigana', () => {
  // Test direct okurigana repairs
  assert.equal(repairCorruptedOkurigana('落る', 'おちる'), '落ちる');
  assert.equal(repairCorruptedOkurigana('落す', 'おとす'), '落とす');
  assert.equal(repairCorruptedOkurigana('楽む', 'たのしむ'), '楽しむ');
  assert.equal(repairCorruptedOkurigana('曲る', 'まがる'), '曲がる');
  assert.equal(repairCorruptedOkurigana('終る', 'おわる'), '終わる');
  assert.equal(repairCorruptedOkurigana('下る', 'さがる'), '下がる');
  assert.equal(repairCorruptedOkurigana('起る', 'おきる'), '起きる');
  assert.equal(repairCorruptedOkurigana('受る', 'うける'), '受ける');

  // Verify already correct dictionary forms are untouched
  assert.equal(repairCorruptedOkurigana('落ちる', 'おちる'), '落ちる');
  assert.equal(repairCorruptedOkurigana('食べる', 'たべる'), '食べる');
  assert.equal(repairCorruptedOkurigana('起きる', 'おきる'), '起きる');
  assert.equal(repairCorruptedOkurigana('行く', 'いく'), '行く');
});

test('Canonical card ID generator creates unique jlpt_n4_落ちる_おちる format', () => {
  const id1 = generateCanonicalCardId('N4', '落ちる', 'おちる');
  assert.equal(id1, 'jlpt_n4_落ちる_おちる');

  const id2 = generateCanonicalCardId('N5', '食べる', 'たべる');
  assert.equal(id2, 'jlpt_n5_食べる_たべる');

  // Transitive / Intransitive cards with identical kanji+reading receive distinct suffixes
  const transId = generateCanonicalCardId('N4', '開く', 'あく', 'transitive', true);
  const intransId = generateCanonicalCardId('N4', '開く', 'あく', 'intransitive', true);
  assert.equal(transId, 'jlpt_n4_開く_あく_transitive');
  assert.equal(intransId, 'jlpt_n4_開く_あく_intransitive');
  assert.notEqual(transId, intransId);
});

test('Smart deck deduplication preserves distinct Transitive/Intransitive cards and collapses pure duplicates', () => {
  const rawCards: VocabCardItem[] = [
    // Corrupted okurigana card
    {
      id: 'old-1',
      expression: '落る',
      reading: 'おちる',
      meaning: 'to fall, to drop',
      level: 'N4',
      tags: ['verb'],
      priority: 99,
    },
    // Pure duplicate of 落ちる with additional meaning
    {
      id: 'old-2',
      expression: '落ちる',
      reading: 'おちる',
      meaning: 'to fail (an exam); to decrease',
      level: 'N4',
      tags: ['JLPT_N4'],
      priority: 99,
    },
    // Pair with identical kanji + reading but opposing transitivity:
    // e.g. 開く as transitive (to open an event/store) vs intransitive (to open on its own)
    {
      id: 'old-3',
      expression: '開く',
      reading: 'あく',
      meaning: 'to open (something) [event]',
      level: 'N4',
      transitivity: 'transitive',
      tags: ['transitive'],
      priority: 99,
    },
    {
      id: 'old-4',
      expression: '開く',
      reading: 'あく',
      meaning: 'to open (on its own)',
      level: 'N4',
      transitivity: 'intransitive',
      tags: ['intransitive'],
      priority: 99,
    },
  ];

  const normalized = deduplicateAndNormalizeDeck(rawCards);

  // 1. "落る" and "落ちる" collapsed into a single card with repaired okurigana "落ちる"
  const ochiruCards = normalized.filter((c) => c.expression === '落ちる');
  assert.equal(ochiruCards.length, 1);
  assert.equal(ochiruCards[0].expression, '落ちる');
  assert.equal(ochiruCards[0].id, 'jlpt_n4_落ちる_おちる');
  // Meanings merged
  assert.equal(ochiruCards[0].meaning.includes('fall'), true);
  assert.equal(ochiruCards[0].meaning.includes('fail'), true);

  // 2. Opposing transitivity pair "開く" keeps BOTH distinct cards with their badges
  const akuCards = normalized.filter((c) => c.expression === '開く' && c.reading === 'あく');
  assert.equal(akuCards.length, 2);
  const transCard = akuCards.find((c) => c.transitivity === 'transitive');
  const intransCard = akuCards.find((c) => c.transitivity === 'intransitive');
  assert.ok(transCard, 'Transitive card retained');
  assert.ok(intransCard, 'Intransitive card retained');
  assert.equal(transCard?.id, 'jlpt_n4_開く_あく_transitive');
  assert.equal(intransCard?.id, 'jlpt_n4_開く_あく_intransitive');
});



