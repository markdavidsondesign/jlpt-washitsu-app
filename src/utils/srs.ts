import type { VocabCardItem, StudyMode } from '../data/vocabTypes.ts';
import { VERB_PAIRS_MAP } from '../data/vocabFetcher.ts';
import { FALLBACK_VOCAB_DATA } from '../data/fallbackVocab.ts';

export type SRSLevel = 1 | 2 | 3;
export type SRSAction = 'again' | 'good' | 'easy';

export interface CardProgress {
  level: SRSLevel;
  srsLevel?: SRSLevel;
  reviewsCount: number;
  streak: number;
  lastReviewedAt: number;
  nextReviewDate?: number;
  mastered?: boolean;
}

export interface SRSStats {
  totalCount: number;
  masteredCount: number;
  mediumCount: number;
  hardCount: number;
  dueTodayCount: number;
  masteryPercentage: number;
}

export interface ProcessActionResult {
  updatedProgressMap: Record<string, CardProgress>;
  nextQueue: string[];
  newLevel: SRSLevel;
}

export const SRS_STORAGE_KEY = 'jlpt_app_progress_v1';
export const LEGACY_STORAGE_KEY = 'jlpt_n4_kanji_srs_progress_v2';

export interface StoredAppState {
  version: 1;
  progressMap: Record<string, CardProgress>;
  stats?: SRSStats;
  lastUpdated: number;
  totalFlips?: number;
}

/**
 * Filters the master deck according to user's selected study mode
 */
export function filterDeckByMode(deck: VocabCardItem[], mode: StudyMode): VocabCardItem[] {
  if (mode === 'n4') {
    return deck.filter((item) => item.level === 'N4');
  }
  if (mode === 'n5') {
    return deck.filter((item) => item.level === 'N5');
  }
  // 'all' includes both N4 and N5 sorted by frequency priority
  return deck;
}

/**
 * Calculates the next review date timestamp based on Leitner SRS intervals:
 * - Unstudied / New cards: Infinity (not due)
 * - Level 1 (Needs Review / Again): Interval 0ms (due immediately after review)
 * - Level 2 (Good / Medium): Interval 24 hours (86,400,000 ms)
 * - Level 3 (Mastered): Interval 3 days (259,200,000 ms)
 */
export function getNextReviewDate(progress: CardProgress | undefined): number {
  if (!progress) return Number.POSITIVE_INFINITY;

  // A card must have been previously studied to have a review date
  const isPreviouslyStudied = Boolean(
    (progress.lastReviewedAt && progress.lastReviewedAt > 0) ||
    progress.level > 1 ||
    (progress.reviewsCount && progress.reviewsCount > 0)
  );

  if (!isPreviouslyStudied) {
    return Number.POSITIVE_INFINITY;
  }

  if (typeof progress.nextReviewDate === 'number' && progress.nextReviewDate > 0) {
    return progress.nextReviewDate;
  }

  const last = progress.lastReviewedAt || 0;
  if (progress.level === 1) {
    return last; // Level 1 is due immediately
  }
  if (progress.level === 2) {
    return last + 24 * 60 * 60 * 1000; // 24 hours
  }
  return last + 3 * 24 * 60 * 60 * 1000; // 3 days
}

/**
 * Strict SRS "Due Item" Calculation:
 * - A card is classified as "Due" ONLY if it has been previously studied
 *   (has a lastReviewedAt timestamp or srsLevel > 1) AND nextReviewDate <= Date.now().
 * - Unstudied / New cards (Level 1) must NEVER be flagged as "Due". They remain strictly in the unlearned pool.
 */
export function isCardDue(progress: CardProgress | undefined, now = Date.now()): boolean {
  if (!progress) return false;

  const isPreviouslyStudied = Boolean(
    (progress.lastReviewedAt && progress.lastReviewedAt > 0) ||
    progress.level > 1 ||
    (progress.reviewsCount && progress.reviewsCount > 0)
  );

  if (!isPreviouslyStudied) {
    return false;
  }

  const nextReviewDate = getNextReviewDate(progress);
  return nextReviewDate <= now;
}

/**
 * Returns strictly overdue review cards in the deck, sorted by SRS urgency:
 * 1. Level 1 (Needs Review / Overdue) first, sorted by oldest lastReviewedAt
 * 2. Level 2 (Medium) next, sorted by oldest lastReviewedAt
 * 3. Level 3 (Mastered) next, sorted by oldest lastReviewedAt
 */
export function getDueReviewCards(
  deck: VocabCardItem[],
  progressMap: Record<string, CardProgress>,
  now = Date.now()
): VocabCardItem[] {
  // Classified as "Due" ONLY if previously studied AND nextReviewDate <= Date.now()
  const due = deck.filter((item) => {
    const p = progressMap[item.id];
    return isCardDue(p, now);
  });

  return due.sort((a, b) => {
    const pA = progressMap[a.id];
    const pB = progressMap[b.id];
    const levelA = pA ? pA.level : 1;
    const levelB = pB ? pB.level : 1;

    // Lowest level (Level 1) first
    if (levelA !== levelB) {
      return levelA - levelB;
    }

    // Within same level, oldest review date first (most overdue)
    const timeA = pA ? pA.lastReviewedAt : 0;
    const timeB = pB ? pB.lastReviewedAt : 0;
    if (timeA !== timeB) {
      return timeA - timeB;
    }

    // Fall back to frequency priority
    return a.priority - b.priority;
  });
}

/**
 * Detects if two vocabulary cards constitute a Transitive / Intransitive verb pair
 * using metadata attributes: pairId, relatedId, VERB_PAIRS_MAP, pairNote,
 * or matching kanji roots with opposing transitivity flags.
 */
export function areCardsVerbPair(
  a: VocabCardItem | undefined,
  b: VocabCardItem | undefined
): boolean {
  if (!a || !b || a.id === b.id) return false;

  // 1. Explicit pairId match
  if (a.pairId && b.pairId && a.pairId === b.pairId) {
    return true;
  }

  // 2. Cross-referenced relatedId
  if (a.relatedId && a.relatedId === b.id) return true;
  if (b.relatedId && b.relatedId === a.id) return true;

  // 3. Direct dictionary lookup in VERB_PAIRS_MAP
  const pairA = VERB_PAIRS_MAP[a.expression];
  if (pairA && (pairA.partner === b.expression || (pairA.partnerReading && pairA.partnerReading === b.reading))) {
    return true;
  }
  const pairB = VERB_PAIRS_MAP[b.expression];
  if (pairB && (pairB.partner === a.expression || (pairB.partnerReading && pairB.partnerReading === a.reading))) {
    return true;
  }

  // Pure kana expression check
  if (a.reading && VERB_PAIRS_MAP[a.reading]?.partner === b.expression) return true;
  if (b.reading && VERB_PAIRS_MAP[b.reading]?.partner === a.expression) return true;

  // 4. Pair note cross-reference
  if (a.pairNote && (a.pairNote.includes(b.expression) || (b.reading && a.pairNote.includes(b.reading)))) {
    return true;
  }
  if (b.pairNote && (b.pairNote.includes(a.expression) || (a.reading && b.pairNote.includes(a.reading)))) {
    return true;
  }

  // 5. Opposing transitivity flags with shared kanji root
  const isTransA = a.transitivity === 'transitive' || a.category?.includes('他動詞') || a.tags?.some((t) => /transitive|他動詞/i.test(t));
  const isIntransA = a.transitivity === 'intransitive' || a.category?.includes('自動詞') || a.tags?.some((t) => /intransitive|自動詞/i.test(t));
  const isTransB = b.transitivity === 'transitive' || b.category?.includes('他動詞') || b.tags?.some((t) => /transitive|他動詞/i.test(t));
  const isIntransB = b.transitivity === 'intransitive' || b.category?.includes('自動詞') || b.tags?.some((t) => /intransitive|自動詞/i.test(t));

  const opposingTransitivity = (isTransA && isIntransB) || (isIntransA && isTransB);
  if (opposingTransitivity) {
    const kanjiA = a.expression.match(/[\u4e00-\u9faf]/g);
    const kanjiB = b.expression.match(/[\u4e00-\u9faf]/g);
    if (kanjiA && kanjiB && kanjiA.some((k) => kanjiB.includes(k))) {
      return true;
    }
  }

  return false;
}

/**
 * Returns a canonical identifier key for a verb pair, or undefined if the card is not paired.
 */
export function getVerbPairKey(card: VocabCardItem | undefined): string | undefined {
  if (!card) return undefined;
  if (card.pairId) return card.pairId;
  if (card.relatedId) return `rel_${[card.id, card.relatedId].sort().join('_')}`;
  const pair = VERB_PAIRS_MAP[card.expression];
  if (pair) {
    const sorted = [card.expression, pair.partner].sort();
    return `pair_${sorted[0]}_${sorted[1]}`;
  }
  const kanji = card.expression.match(/[\u4e00-\u9faf]/g);
  if ((card.transitivity === 'transitive' || card.transitivity === 'intransitive') && kanji) {
    return `pair_kanji_${kanji.join('')}`;
  }
  return undefined;
}

/**
 * Dynamic Spacing Interleaving Algorithm for Transitive / Intransitive Verb Pairs:
 * - Detects verb pairs using metadata attributes (pairId, relatedId, VERB_PAIRS_MAP, matching kanji roots).
 * - Enforces a minimum spacing buffer of at least 5 to 8 cards between a verb and its partner.
 * - When constructing a batch (e.g., 25 cards), if an incoming card belongs to a pair with a card
 *   already placed at index N, places the pair card no earlier than index N + 6.
 * - Swaps position with non-paired cards further down the queue to preserve queue variety without
 *   altering the overall batch composition (exact same set of cards is preserved).
 */
export function interleavePairDistance(
  queueIds: string[],
  deckOrMap: VocabCardItem[] | Record<string, VocabCardItem> | Map<string, VocabCardItem>,
  minSpacing = 6
): string[] {
  if (!queueIds || queueIds.length <= 1) return [...(queueIds || [])];

  const cardMap = new Map<string, VocabCardItem>();
  if (Array.isArray(deckOrMap)) {
    for (const item of deckOrMap) {
      if (item?.id) cardMap.set(item.id, item);
    }
  } else if (deckOrMap instanceof Map) {
    for (const [k, v] of deckOrMap.entries()) {
      if (v) cardMap.set(k, v);
    }
  } else if (deckOrMap && typeof deckOrMap === 'object') {
    for (const [k, v] of Object.entries(deckOrMap)) {
      if (v) cardMap.set(k, v);
    }
  }

  // Supplement missing IDs from FALLBACK_VOCAB_DATA if needed
  for (const item of FALLBACK_VOCAB_DATA) {
    if (!cardMap.has(item.id)) {
      cardMap.set(item.id, item);
    }
  }

  // For queues shorter than minSpacing + 2, adapt effective buffer
  const effectiveSpacing = Math.min(minSpacing, Math.max(1, Math.floor(queueIds.length / 2)));
  const result = [...queueIds];

  // Multi-pass interleaving (up to 4 passes) to resolve cascaded swaps
  for (let pass = 0; pass < 4; pass++) {
    let swappedInPass = false;

    for (let i = 0; i < result.length; i++) {
      const currentCard = cardMap.get(result[i]);
      if (!currentCard) continue;

      // Check if currentCard conflicts with any card placed at index prev where i - prev < effectiveSpacing
      let conflictPrevIdx = -1;
      const searchBackStart = Math.max(0, i - effectiveSpacing + 1);
      for (let prev = i - 1; prev >= searchBackStart; prev--) {
        const prevCard = cardMap.get(result[prev]);
        if (areCardsVerbPair(currentCard, prevCard)) {
          conflictPrevIdx = prev;
          break;
        }
      }

      if (conflictPrevIdx !== -1) {
        // Violates distance constraint! Target index must be >= conflictPrevIdx + effectiveSpacing
        const targetMinIdx = conflictPrevIdx + effectiveSpacing;
        let bestSwapIdx = -1;

        // Pass A: Find candidate j >= targetMinIdx that does NOT conflict at i,
        // and currentCard does NOT conflict at j
        for (let j = targetMinIdx; j < result.length; j++) {
          const candidate = cardMap.get(result[j]);
          if (!candidate) continue;

          // Candidate at j cannot conflict with cards before i
          let conflictAtI = false;
          for (let k = Math.max(0, i - effectiveSpacing + 1); k < i; k++) {
            if (areCardsVerbPair(candidate, cardMap.get(result[k]))) {
              conflictAtI = true;
              break;
            }
          }
          if (conflictAtI) continue;

          // currentCard placed at j cannot conflict with cards around j
          let conflictAtJ = false;
          for (
            let k = Math.max(0, j - effectiveSpacing + 1);
            k <= Math.min(result.length - 1, j + effectiveSpacing - 1);
            k++
          ) {
            if (k !== i && k !== j && areCardsVerbPair(currentCard, cardMap.get(result[k]))) {
              conflictAtJ = true;
              break;
            }
          }
          if (conflictAtJ) continue;

          bestSwapIdx = j;
          break;
        }

        // Pass B: Any candidate j >= targetMinIdx that doesn't conflict at i
        if (bestSwapIdx === -1) {
          for (let j = targetMinIdx; j < result.length; j++) {
            const candidate = cardMap.get(result[j]);
            if (!candidate) continue;

            let conflictAtI = false;
            for (let k = Math.max(0, i - effectiveSpacing + 1); k < i; k++) {
              if (areCardsVerbPair(candidate, cardMap.get(result[k]))) {
                conflictAtI = true;
                break;
              }
            }
            if (!conflictAtI) {
              bestSwapIdx = j;
              break;
            }
          }
        }

        // Pass C: If targetMinIdx is at or past end of queue, find furthest card down that doesn't conflict at i
        if (bestSwapIdx === -1) {
          for (let j = result.length - 1; j > i; j--) {
            const candidate = cardMap.get(result[j]);
            if (!candidate) continue;

            let conflictAtI = false;
            for (let k = Math.max(0, i - effectiveSpacing + 1); k < i; k++) {
              if (areCardsVerbPair(candidate, cardMap.get(result[k]))) {
                conflictAtI = true;
                break;
              }
            }
            if (!conflictAtI) {
              bestSwapIdx = j;
              break;
            }
          }
        }

        // Swap positions
        if (bestSwapIdx !== -1 && bestSwapIdx !== i) {
          const temp = result[i];
          result[i] = result[bestSwapIdx];
          result[bestSwapIdx] = temp;
          swappedInPass = true;
        }
      }
    }

    if (!swappedInPass) {
      break;
    }
  }

  return result;
}

/**
 * Returns a dedicated Review Mode queue containing ONLY previously studied/learned cards,
 * sorted strictly by SRS urgency (overdue items first) with dynamic verb pair spacing.
 */
export function getReviewModeQueue(
  deck: VocabCardItem[],
  progressMap: Record<string, CardProgress>,
  limit = 25
): string[] {
  const sortedDue = getDueReviewCards(deck, progressMap);
  const rawQueue = sortedDue.slice(0, limit).map((c) => c.id);
  return interleavePairDistance(rawQueue, deck, 6);
}

/**
 * Creates an active daily SRS batch (25 cards) in Learn Mode:
 * Dynamically interleaves due spaced-repetition review cards alongside unlearned/new JLPT N5/N4 cards:
 * 1. Prioritize overdue SRS cards (loaded from LocalStorage) first.
 * 2. Fill remaining batch slots with unlearned cards from the master list (sorted by priority).
 * 3. Enforces dynamic spacing for transitive/intransitive verb pairs (minimum spacing buffer >= 6).
 */
export function getBatchQueue(
  deck: VocabCardItem[],
  progressMap: Record<string, CardProgress>,
  batchSize = 25,
  batchIndex = 0
): string[] {
  if (!deck || deck.length === 0) return [];

  // Group into unlearned vs due review vs mastered
  const unlearned: VocabCardItem[] = [];
  const dueReview: VocabCardItem[] = [];
  const mastered: VocabCardItem[] = [];

  for (const item of deck) {
    const progress = progressMap[item.id];
    if (!progress || progress.reviewsCount === 0) {
      unlearned.push(item);
    } else if (progress.level === 3) {
      mastered.push(item);
    } else {
      // Level 1 or 2 with reviewsCount > 0 is due for review
      dueReview.push(item);
    }
  }

  // Sort unlearned by priority ascending (1 = highest priority)
  unlearned.sort((a, b) => a.priority - b.priority);

  // Sort due review cards strictly by SRS urgency (Level 1 first, oldest review date first)
  dueReview.sort((a, b) => {
    const pA = progressMap[a.id];
    const pB = progressMap[b.id];
    const lvlA = pA ? pA.level : 1;
    const lvlB = pB ? pB.level : 1;
    if (lvlA !== lvlB) return lvlA - lvlB;
    return (pA?.lastReviewedAt ?? 0) - (pB?.lastReviewedAt ?? 0);
  });

  // If there are unlearned cards or due review cards:
  if (unlearned.length > 0 || dueReview.length > 0) {
    // Determine how many due cards to interleave
    const maxDueSlots = Math.min(dueReview.length, Math.max(5, Math.floor(batchSize * 0.4)));
    const dueBatchSlice = dueReview.slice(0, maxDueSlots);
    const remainingNeededForNew = batchSize - dueBatchSlice.length;

    // Pull unlearned cards slice for this batchIndex
    let newBatchSlice: VocabCardItem[] = [];
    if (unlearned.length > 0) {
      const start = (batchIndex * remainingNeededForNew) % unlearned.length;
      newBatchSlice = unlearned.slice(start, start + remainingNeededForNew);
      if (newBatchSlice.length < remainingNeededForNew && unlearned.length > newBatchSlice.length) {
        const wrapCount = remainingNeededForNew - newBatchSlice.length;
        newBatchSlice = [...newBatchSlice, ...unlearned.slice(0, wrapCount)];
      }
    }

    // Combine overdue cards first, then new unlearned cards
    const combinedIds = Array.from(
      new Set([...dueBatchSlice.map((c) => c.id), ...newBatchSlice.map((c) => c.id)])
    );

    // If still short of batchSize (e.g. at the tail of deck), fill with other unmastered items
    if (combinedIds.length < batchSize) {
      const remainingFill = deck
        .filter((c) => (progressMap[c.id]?.level ?? 1) < 3 && !combinedIds.includes(c.id))
        .map((c) => c.id);
      combinedIds.push(...remainingFill.slice(0, batchSize - combinedIds.length));
    }

    if (combinedIds.length > 0) {
      const rawBatch = combinedIds.slice(0, batchSize);
      return interleavePairDistance(rawBatch, deck, 6);
    }
  }

  // If all cards in this mode are mastered, allow practicing a batch of mastered cards
  mastered.sort((a, b) => a.priority - b.priority);
  const start = (batchIndex * batchSize) % (mastered.length || 1);
  const rawMasteredBatch = mastered.slice(start, start + batchSize).map((i) => i.id);
  return interleavePairDistance(rawMasteredBatch, deck, 6);
}

/**
 * Calculates the next SRS level based on user feedback:
 * - Again / Hard: Drops to Level 1
 * - Good: Moves to or stays at Level 2
 * - Easy / Mastered: Advances to Level 3
 */
export function calculateNextLevel(currentLevel: SRSLevel, action: SRSAction): SRSLevel {
  switch (action) {
    case 'again':
      return 1;
    case 'good':
      return 2;
    case 'easy':
      return 3;
    default:
      return currentLevel;
  }
}

/**
 * Re-queues the current card according to SRS intervals:
 * - Level 1 (Again/Hard): Reappears immediately (after 1 other card or at end if < 2 cards)
 * - Level 2 (Good): Reappears after 3 other cards (or at end if <= 3 cards)
 * - Level 3 (Easy/Mastered): Removed from the immediate queue
 */
export function getNextQueue(
  currentQueue: string[],
  currentCardId: string,
  action: SRSAction
): string[] {
  if (currentQueue.length === 0) return [];

  // Remove the active head card
  const remaining = currentQueue.filter((id, idx) => idx !== 0 || id !== currentCardId);

  if (action === 'easy') {
    // Removed from the immediate queue
    return remaining;
  }

  if (action === 'again') {
    // Reappear immediately in current deck session:
    // If there's 1 card left, place after it: [next, again]
    // If there are 2 or more cards left, insert at index 1 so user recalls it very soon
    if (remaining.length === 0) {
      return [currentCardId];
    }
    if (remaining.length === 1) {
      return [remaining[0], currentCardId];
    }
    // Reappear after 1 other card
    return [remaining[0], currentCardId, ...remaining.slice(1)];
  }

  if (action === 'good') {
    // Reappear after 3 other cards
    if (remaining.length <= 3) {
      return [...remaining, currentCardId];
    }
    return [
      ...remaining.slice(0, 3),
      currentCardId,
      ...remaining.slice(3),
    ];
  }

  return remaining;
}

/**
 * Processes an SRS review action on a card and returns the updated state
 */
export function processSRSAction(
  cardId: string,
  action: SRSAction,
  currentQueue: string[],
  progressMap: Record<string, CardProgress>
): ProcessActionResult {
  const cardKey = String(cardId);
  const currentCardProgress = progressMap[cardKey] || progressMap[cardId] || {
    level: 1,
    srsLevel: 1,
    reviewsCount: 0,
    streak: 0,
    lastReviewedAt: 0,
    mastered: false,
  };

  const currentLevel = (currentCardProgress.srsLevel ?? currentCardProgress.level ?? 1) as SRSLevel;
  const newLevel = calculateNextLevel(currentLevel, action);
  const now = Date.now();
  let intervalMs = 0;
  if (newLevel === 2) intervalMs = 24 * 60 * 60 * 1000;
  else if (newLevel === 3) intervalMs = 3 * 24 * 60 * 60 * 1000;
  const nextReviewDate = now + intervalMs;

  const isMastered = action !== 'again' && (newLevel >= 2 || action === 'good' || action === 'easy');

  const updatedProgress: CardProgress = {
    level: newLevel,
    srsLevel: newLevel,
    reviewsCount: (currentCardProgress.reviewsCount ?? 0) + 1,
    streak: action === 'again' ? 0 : (currentCardProgress.streak ?? 0) + 1,
    lastReviewedAt: now,
    nextReviewDate,
    mastered: isMastered,
  };

  const updatedProgressMap: Record<string, CardProgress> = {
    ...progressMap,
    [cardKey]: updatedProgress,
  };

  const nextQueue = getNextQueue(currentQueue, cardId, action);

  return {
    updatedProgressMap,
    nextQueue,
    newLevel,
  };
}

/**
 * Initializes default progress for cards
 */
export function initializeDefaultProgress(allCardIds: string[]): Record<string, CardProgress> {
  const progressMap: Record<string, CardProgress> = {};
  for (const id of allCardIds) {
    const stringId = String(id);
    progressMap[stringId] = {
      level: 1,
      srsLevel: 1,
      reviewsCount: 0,
      streak: 0,
      lastReviewedAt: 0,
      mastered: false,
    };
  }
  return progressMap;
}

/**
 * Derives aggregate stats from progress map:
 * - dueTodayCount strictly counts cards that have been previously studied AND nextReviewDate <= Date.now()
 * - Unstudied / New cards (Level 1) are NEVER counted as due
 */
export function calculateSRSStats(
  allCardIds: string[],
  progressMap: Record<string, CardProgress>,
  currentQueue: string[] = [],
  now = Date.now()
): SRSStats {
  const totalCount = allCardIds.length;
  let masteredCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  let dueTodayCount = 0;

  for (const id of allCardIds) {
    const cardKey = String(id);
    const p = progressMap[cardKey] || progressMap[id];
    const level = p ? (p.srsLevel ?? p.level ?? 1) : 1;
    if (level === 3 || p?.mastered) masteredCount++;
    else if (level === 2) mediumCount++;
    else hardCount++;

    if (p && isCardDue(p, now)) {
      dueTodayCount++;
    }
  }

  const masteryPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return {
    totalCount,
    masteredCount,
    mediumCount,
    hardCount,
    dueTodayCount,
    masteryPercentage,
  };
}

/**
 * Merges loaded saved states with fetched JSON cards using explicit string ID conversion
 * (String(card.id) === String(savedCard.id)) to avoid type mismatches.
 */
export function mergeProgressWithDeck(
  deck: VocabCardItem[],
  savedProgress: Record<string, CardProgress> | null
): Record<string, CardProgress> {
  const merged: Record<string, CardProgress> = {};
  
  // Normalize savedProgress keys to strings for exact matching
  const savedEntries = savedProgress ? Object.entries(savedProgress) : [];
  const savedMap = new Map<string, CardProgress>();
  for (const [key, val] of savedEntries) {
    savedMap.set(String(key), val);
  }

  for (const card of deck) {
    const cardIdStr = String(card.id);
    let foundProgress: CardProgress | undefined = savedMap.get(cardIdStr);

    // Fallback search with explicit string ID conversion and semantic matching
    if (!foundProgress && savedProgress) {
      for (const [savedId, val] of savedEntries) {
        const savedIdStr = String(savedId);
        if (
          savedIdStr === cardIdStr ||
          savedIdStr === `jlpt_${card.level.toLowerCase()}_${card.expression}_${card.reading}` ||
          savedIdStr.includes(`_${card.expression}_`) ||
          savedIdStr.endsWith(`_${card.expression}`) ||
          savedIdStr.includes(encodeURIComponent(card.expression))
        ) {
          foundProgress = val;
          break;
        }
      }
    }

    if (foundProgress) {
      const lvl = (foundProgress.srsLevel ?? foundProgress.level ?? 1) as SRSLevel;
      const cardEntry: CardProgress = {
        level: lvl,
        srsLevel: lvl,
        reviewsCount: typeof foundProgress.reviewsCount === 'number' ? foundProgress.reviewsCount : 0,
        streak: typeof foundProgress.streak === 'number' ? foundProgress.streak : 0,
        lastReviewedAt: typeof foundProgress.lastReviewedAt === 'number' ? foundProgress.lastReviewedAt : 0,
        mastered: typeof foundProgress.mastered === 'boolean' ? foundProgress.mastered : (lvl >= 3),
      };
      if (typeof foundProgress.nextReviewDate === 'number') {
        cardEntry.nextReviewDate = foundProgress.nextReviewDate;
      }
      merged[cardIdStr] = cardEntry;
    } else {
      merged[cardIdStr] = {
        level: 1,
        srsLevel: 1,
        reviewsCount: 0,
        streak: 0,
        lastReviewedAt: 0,
        mastered: false,
      };
    }
  }

  // Preserve any cards in saved progress that might not be in the current slice
  if (savedProgress) {
    for (const [savedId, val] of savedEntries) {
      const savedIdStr = String(savedId);
      if (!merged[savedIdStr]) {
        const lvl = (val.srsLevel ?? val.level ?? 1) as SRSLevel;
        merged[savedIdStr] = {
          ...val,
          level: lvl,
          srsLevel: lvl,
          mastered: typeof val.mastered === 'boolean' ? val.mastered : (lvl >= 3),
        };
      }
    }
  }

  return merged;
}

/**
 * Storage helpers saving under jlpt_app_progress_v1 with complete error handling & diagnostics
 */
export function loadProgressFromStorage(): Record<string, CardProgress> | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('[SRS Loaded 0 cards from localStorage]');
      return null;
    }
    let item = window.localStorage.getItem(SRS_STORAGE_KEY);
    if (!item) {
      item = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!item) {
      console.log('[SRS Loaded 0 cards from localStorage]');
      return null;
    }
    const parsed = JSON.parse(item);
    if (typeof parsed === 'object' && parsed !== null) {
      const rawMap = ('progressMap' in parsed && typeof parsed.progressMap === 'object' && parsed.progressMap !== null)
        ? (parsed.progressMap as Record<string, CardProgress>)
        : (parsed as Record<string, CardProgress>);

      const normalizedMap: Record<string, CardProgress> = {};
      let count = 0;
      for (const [key, value] of Object.entries(rawMap)) {
        if (value && typeof value === 'object') {
          const stringKey = String(key);
          const lvl = (value.srsLevel ?? value.level ?? 1) as SRSLevel;
          const cardEntry: CardProgress = {
            level: lvl,
            srsLevel: lvl,
            reviewsCount: typeof value.reviewsCount === 'number' ? value.reviewsCount : 0,
            streak: typeof value.streak === 'number' ? value.streak : 0,
            lastReviewedAt: typeof value.lastReviewedAt === 'number' ? value.lastReviewedAt : 0,
            mastered: typeof value.mastered === 'boolean' ? value.mastered : (lvl >= 3),
          };
          if (typeof value.nextReviewDate === 'number') {
            cardEntry.nextReviewDate = value.nextReviewDate;
          }
          normalizedMap[stringKey] = cardEntry;
          count++;
        }
      }
      console.log(`[SRS Loaded ${count} cards from localStorage]`);
      return normalizedMap;
    }
    console.log('[SRS Loaded 0 cards from localStorage]');
  } catch (err) {
    console.warn('Failed to load SRS progress from localStorage:', err);
    console.log('[SRS Loaded 0 cards from localStorage]');
  }
  return null;
}

export function saveProgressToStorage(
  progressMap: Record<string, CardProgress>,
  stats?: SRSStats,
  totalFlips?: number
): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;

    // Safety guard: Never overwrite existing studied cards with empty/unstudied progress
    const existingRaw = window.localStorage.getItem(SRS_STORAGE_KEY);
    if (existingRaw) {
      try {
        const parsedExisting = JSON.parse(existingRaw);
        const existingMap = parsedExisting?.progressMap || parsedExisting;
        if (existingMap && typeof existingMap === 'object') {
          const existingStudiedCount = Object.values(existingMap).filter(
            (p: any) => p && (p.reviewsCount > 0 || (p.lastReviewedAt && p.lastReviewedAt > 0) || p.level > 1 || (p.srsLevel && p.srsLevel > 1))
          ).length;

          const incomingStudiedCount = Object.values(progressMap).filter(
            (p: any) => p && (p.reviewsCount > 0 || (p.lastReviewedAt && p.lastReviewedAt > 0) || p.level > 1 || (p.srsLevel && p.srsLevel > 1))
          ).length;

          // If storage already has studied cards but incoming has none, preserve existing studied cards
          if (existingStudiedCount > 0 && incomingStudiedCount === 0) {
            console.warn('[SRS Safety] Prevented overwriting existing studied cards with unstudied state. Merging stored data.');
            progressMap = { ...existingMap, ...progressMap };
            for (const [key, exVal] of Object.entries(existingMap)) {
              const ex = exVal as CardProgress;
              if (ex && (ex.reviewsCount > 0 || ex.lastReviewedAt > 0 || ex.level > 1 || (ex.srsLevel && ex.srsLevel > 1))) {
                progressMap[String(key)] = ex;
              }
            }
          }
        }
      } catch {
        // Continue if parsing existing fails
      }
    }

    const payload: StoredAppState = {
      version: 1,
      progressMap,
      stats,
      lastUpdated: Date.now(),
      totalFlips,
    };
    window.localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save SRS progress to localStorage:', err);
  }
}

export const saveProgress = saveProgressToStorage;

export const ACTIVE_SESSION_STORAGE_KEY = 'jlpt_active_session_v1';

export interface ActiveSessionState {
  version: 1;
  primaryMode: 'learn' | 'review' | 'quiz';
  studyMode: StudyMode;
  batchIndex: number;
  currentCardIndex: number;
  queueCardIds: string[];
  activeBatchIds: string[];
  masteredCardIds: string[];
  missedCardIds: string[];
  isReviewingMissed?: boolean;
  lastUpdated: number;
}

export function saveActiveSession(session: Omit<ActiveSessionState, 'version' | 'lastUpdated'>): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const payload: ActiveSessionState = {
      ...session,
      version: 1,
      lastUpdated: Date.now(),
    };
    window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save active session state:', err);
  }
}

export function loadActiveSession(): ActiveSessionState | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || !Array.isArray(data.queueCardIds)) return null;
    return data as ActiveSessionState;
  } catch (err) {
    console.warn('Failed to load active session state:', err);
    return null;
  }
}

export function clearActiveSession(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear active session state:', err);
  }
}

export function clearProgressFromStorage(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(SRS_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear SRS progress from localStorage:', err);
  }
}
