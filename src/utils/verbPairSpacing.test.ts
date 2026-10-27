import test from 'node:test';
import assert from 'node:assert/strict';
import {
  areCardsVerbPair,
  getVerbPairKey,
  interleavePairDistance,
  getBatchQueue,
} from './srs.ts';
import { FALLBACK_VOCAB_DATA } from '../data/fallbackVocab.ts';
import { rankAndEnrichVocab } from '../data/vocabFetcher.ts';
import type { VocabCardItem } from '../data/vocabTypes.ts';

test('areCardsVerbPair detects verb pairs via multiple metadata vectors', () => {
  // 1. Explicit pairId match
  const cardA: VocabCardItem = {
    id: 'c_akeru',
    expression: '開ける',
    reading: 'あける',
    meaning: 'to open (something)',
    level: 'N4',
    tags: ['transitive'],
    priority: 1,
    pairId: 'pair_開く_開ける',
    transitivity: 'transitive',
  };
  const cardB: VocabCardItem = {
    id: 'c_aku',
    expression: '開く',
    reading: 'あく',
    meaning: 'to open (on its own)',
    level: 'N4',
    tags: ['intransitive'],
    priority: 2,
    pairId: 'pair_開く_開ける',
    transitivity: 'intransitive',
  };
  assert.equal(areCardsVerbPair(cardA, cardB), true);
  assert.equal(areCardsVerbPair(cardB, cardA), true);

  // 2. Cross-referenced relatedId
  const cardC: VocabCardItem = {
    id: 'c_shimeru',
    expression: '閉める',
    reading: 'しめる',
    meaning: 'to close (something)',
    level: 'N4',
    tags: [],
    priority: 3,
    relatedId: 'c_shimaru',
  };
  const cardD: VocabCardItem = {
    id: 'c_shimaru',
    expression: '閉まる',
    reading: 'しまる',
    meaning: 'to close (on its own)',
    level: 'N4',
    tags: [],
    priority: 4,
    relatedId: 'c_shimeru',
  };
  assert.equal(areCardsVerbPair(cardC, cardD), true);

  // 3. VERB_PAIRS_MAP dictionary lookup
  const cardE: VocabCardItem = {
    id: 'c_kesu',
    expression: '消す',
    reading: 'けす',
    meaning: 'to turn off (something)',
    level: 'N4',
    tags: [],
    priority: 5,
  };
  const cardF: VocabCardItem = {
    id: 'c_kieru',
    expression: '消える',
    reading: 'きえる',
    meaning: 'to go out (on its own)',
    level: 'N4',
    tags: [],
    priority: 6,
  };
  assert.equal(areCardsVerbPair(cardE, cardF), true);

  // 4. Opposing transitivity flags with matching kanji root
  const cardG: VocabCardItem = {
    id: 'c_kowasu',
    expression: '壊す',
    reading: 'こわす',
    meaning: 'to break',
    level: 'N4',
    tags: ['他動詞'],
    priority: 7,
    transitivity: 'transitive',
  };
  const cardH: VocabCardItem = {
    id: 'c_kowareru',
    expression: '壊れる',
    reading: 'こわれる',
    meaning: 'to get broken',
    level: 'N4',
    tags: ['自動詞'],
    priority: 8,
    transitivity: 'intransitive',
  };
  assert.equal(areCardsVerbPair(cardG, cardH), true);

  // 5. Negative cases: Unrelated cards or identical transitivity
  const cardI: VocabCardItem = {
    id: 'c_taberu',
    expression: '食べる',
    reading: 'たべる',
    meaning: 'to eat',
    level: 'N5',
    tags: [],
    priority: 9,
  };
  const cardJ: VocabCardItem = {
    id: 'c_nomu',
    expression: '飲む',
    reading: 'のむ',
    meaning: 'to drink',
    level: 'N5',
    tags: [],
    priority: 10,
  };
  assert.equal(areCardsVerbPair(cardA, cardI), false);
  assert.equal(areCardsVerbPair(cardI, cardJ), false);

  // Same card compared to itself
  assert.equal(areCardsVerbPair(cardA, cardA), false);
});

test('getVerbPairKey generates canonical pair identifiers', () => {
  const cardA: VocabCardItem = {
    id: 'c_akeru',
    expression: '開ける',
    reading: 'あける',
    meaning: 'to open',
    level: 'N4',
    tags: [],
    priority: 1,
    pairId: 'pair_開く_開ける',
  };
  assert.equal(getVerbPairKey(cardA), 'pair_開く_開ける');

  const cardB: VocabCardItem = {
    id: 'c_kesu',
    expression: '消す',
    reading: 'けす',
    meaning: 'to turn off',
    level: 'N4',
    tags: [],
    priority: 2,
  };
  assert.equal(getVerbPairKey(cardB), 'pair_消える_消す');
});

test('interleavePairDistance moves adjacent partner to index >= N + 6', () => {
  // Construct a mock deck of 25 cards
  const deck: VocabCardItem[] = [
    {
      id: 'c0_akeru',
      expression: '開ける',
      reading: 'あける',
      meaning: 'to open (something)',
      level: 'N4',
      tags: [],
      priority: 1,
      pairId: 'pair_開く_開ける',
      transitivity: 'transitive',
    },
    {
      id: 'c1_aku',
      expression: '開く',
      reading: 'あく',
      meaning: 'to open (on its own)',
      level: 'N4',
      tags: [],
      priority: 2,
      pairId: 'pair_開く_開ける',
      transitivity: 'intransitive',
    },
  ];

  // Add 23 neutral/non-paired words
  for (let i = 2; i < 25; i++) {
    deck.push({
      id: `c${i}_word`,
      expression: `単語${i}`,
      reading: `たんご${i}`,
      meaning: `meaning ${i}`,
      level: 'N4',
      tags: [],
      priority: i + 1,
    });
  }

  const initialQueue = deck.map((d) => d.id);
  // Initially, 'c0_akeru' is at index 0 and 'c1_aku' is at index 1 (distance = 1, violation!)
  assert.equal(initialQueue[0], 'c0_akeru');
  assert.equal(initialQueue[1], 'c1_aku');

  const interleaved = interleavePairDistance(initialQueue, deck, 6);

  // Requirement: Batch composition must be 100% preserved
  assert.equal(interleaved.length, 25);
  assert.deepEqual(new Set(interleaved), new Set(initialQueue));

  // Requirement: If card is at index N, partner placed no earlier than N + 6
  const idxAkeru = interleaved.indexOf('c0_akeru');
  const idxAku = interleaved.indexOf('c1_aku');
  const distance = Math.abs(idxAku - idxAkeru);

  assert.ok(
    distance >= 6,
    `Expected distance between partner cards to be >= 6, got ${distance} (indices: ${idxAkeru}, ${idxAku})`
  );
  assert.ok(
    idxAku >= idxAkeru + 6 || idxAkeru >= idxAku + 6,
    'Partner placed at index N + 6 or later'
  );
});

test('interleavePairDistance handles multiple pairs clustered in initial batch', () => {
  const deck: VocabCardItem[] = [
    // Pair 1
    {
      id: 'p1_akeru',
      expression: '開ける',
      reading: 'あける',
      meaning: 'to open (something)',
      level: 'N4',
      tags: [],
      priority: 1,
      pairId: 'pair_開く_開ける',
      transitivity: 'transitive',
    },
    {
      id: 'p1_aku',
      expression: '開く',
      reading: 'あく',
      meaning: 'to open (on its own)',
      level: 'N4',
      tags: [],
      priority: 2,
      pairId: 'pair_開く_開ける',
      transitivity: 'intransitive',
    },
    // Pair 2
    {
      id: 'p2_shimeru',
      expression: '閉める',
      reading: 'しめる',
      meaning: 'to close (something)',
      level: 'N4',
      tags: [],
      priority: 3,
      pairId: 'pair_閉まる_閉める',
      transitivity: 'transitive',
    },
    {
      id: 'p2_shimaru',
      expression: '閉まる',
      reading: 'しまる',
      meaning: 'to close (on its own)',
      level: 'N4',
      tags: [],
      priority: 4,
      pairId: 'pair_閉まる_閉める',
      transitivity: 'intransitive',
    },
    // Pair 3
    {
      id: 'p3_kesu',
      expression: '消す',
      reading: 'けす',
      meaning: 'to turn off (something)',
      level: 'N4',
      tags: [],
      priority: 5,
      pairId: 'pair_消える_消す',
      transitivity: 'transitive',
    },
    {
      id: 'p3_kieru',
      expression: '消える',
      reading: 'きえる',
      meaning: 'to go out (on its own)',
      level: 'N4',
      tags: [],
      priority: 6,
      pairId: 'pair_消える_消す',
      transitivity: 'intransitive',
    },
  ];

  // Add 19 neutral items to make 25
  for (let i = 6; i < 25; i++) {
    deck.push({
      id: `neutral_${i}`,
      expression: `名詞${i}`,
      reading: `めいし${i}`,
      meaning: `noun ${i}`,
      level: 'N4',
      tags: [],
      priority: i + 1,
    });
  }

  const initialQueue = deck.map((d) => d.id);
  const interleaved = interleavePairDistance(initialQueue, deck, 6);

  // Verify batch size and composition
  assert.equal(interleaved.length, 25);
  assert.deepEqual(new Set(interleaved), new Set(initialQueue));

  // Verify pair 1 distance
  const p1Dist = Math.abs(interleaved.indexOf('p1_akeru') - interleaved.indexOf('p1_aku'));
  assert.ok(p1Dist >= 6, `Pair 1 distance must be >= 6, got ${p1Dist}`);

  // Verify pair 2 distance
  const p2Dist = Math.abs(interleaved.indexOf('p2_shimeru') - interleaved.indexOf('p2_shimaru'));
  assert.ok(p2Dist >= 6, `Pair 2 distance must be >= 6, got ${p2Dist}`);

  // Verify pair 3 distance
  const p3Dist = Math.abs(interleaved.indexOf('p3_kesu') - interleaved.indexOf('p3_kieru'));
  assert.ok(p3Dist >= 6, `Pair 3 distance must be >= 6, got ${p3Dist}`);
});

test('getBatchQueue on enriched master deck enforces distance >= 6 between verb pairs', () => {
  const masterDeck = rankAndEnrichVocab(FALLBACK_VOCAB_DATA);
  const progressMap = {};

  const batch = getBatchQueue(masterDeck, progressMap, 25, 0);
  assert.equal(batch.length, 25);

  const cardMap = new Map(masterDeck.map((c) => [c.id, c]));

  // Check every pair in the generated batch
  for (let i = 0; i < batch.length; i++) {
    const cardA = cardMap.get(batch[i]);
    for (let j = i + 1; j < batch.length; j++) {
      const cardB = cardMap.get(batch[j]);
      if (areCardsVerbPair(cardA, cardB)) {
        const dist = j - i;
        assert.ok(
          dist >= 6,
          `Batch pair violation between "${cardA?.expression}" (idx ${i}) and "${cardB?.expression}" (idx ${j}): distance is ${dist} < 6`
        );
      }
    }
  }
});
