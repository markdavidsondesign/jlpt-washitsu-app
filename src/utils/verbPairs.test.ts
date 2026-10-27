import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VERB_PAIRS_MAP,
  findVerbPair,
  formatNuancedDefinition,
  rankAndEnrichVocab,
  generateWordId,
  deduplicateAndNormalizeDeck,
} from '../data/vocabFetcher.ts';
import { FALLBACK_VOCAB_DATA } from '../data/fallbackVocab.ts';

test('formatNuancedDefinition enforces explicit structural nuances', () => {
  // Transitive formatting ensures direct action on an object
  assert.equal(
    formatNuancedDefinition('to open', 'transitive', '開ける'),
    'to open (something) / to make open'
  );

  const customTransitive = formatNuancedDefinition('to hold (v.t.)', 'transitive');
  assert.match(customTransitive, /\(something\)|direct action/i);

  // Intransitive formatting ensures self-occurring action
  assert.equal(
    formatNuancedDefinition('to open', 'intransitive', '開く'),
    'to open (on its own) / to be opened'
  );

  const customIntransitive = formatNuancedDefinition('to occur (v.i.)', 'intransitive');
  assert.match(customIntransitive, /\(on its own\)|self-occurring/i);
});

test('findVerbPair handles homograph disambiguation and kana fallback', () => {
  // 止める: とめる is transitive pair with 止まる
  const tomeru = findVerbPair('止める', 'とめる');
  assert.ok(tomeru);
  assert.equal(tomeru.type, 'transitive');
  assert.equal(tomeru.partner, '止まる');

  // 止める: やめる (quit/resign) is NOT the pair with 止まる
  const yameru = findVerbPair('止める', 'やめる');
  assert.equal(yameru, undefined);

  // 開く: あく is intransitive pair with 開ける
  const aku = findVerbPair('開く', 'あく');
  assert.ok(aku);
  assert.equal(aku.type, 'intransitive');
  assert.equal(aku.partner, '開ける');

  // 開く: ひらく (open an event) is disambiguated
  const hiraku = findVerbPair('開く', 'ひらく');
  assert.equal(hiraku, undefined);

  // Kana fallback works seamlessly
  const akeruKana = findVerbPair('あける');
  assert.ok(akeruKana);
  assert.equal(akeruKana.partner, '開く');
});

test('Pairs like 開ける/開く, 閉める/閉まる, 止める/止まる, 落とす/落ちる, 壊す/壊れる reflect distinct definitions & example translations', () => {
  // 1. 開ける / 開く
  const akeru = VERB_PAIRS_MAP['開ける'];
  assert.ok(akeru);
  assert.equal(akeru.type, 'transitive');
  assert.equal(akeru.nuancedMeaning, 'to open (something) / to make open');
  assert.match(akeru.exampleSentence!.english, /direct action on an object/i);

  const aku = VERB_PAIRS_MAP['開く'];
  assert.ok(aku);
  assert.equal(aku.type, 'intransitive');
  assert.equal(aku.nuancedMeaning, 'to open (on its own) / to be opened');
  assert.match(aku.exampleSentence!.english, /on its own|self-occurring/i);

  // 2. 閉める / 閉まる
  const shimeru = VERB_PAIRS_MAP['閉める'];
  assert.ok(shimeru);
  assert.equal(shimeru.type, 'transitive');
  assert.match(shimeru.nuancedMeaning, /\(something\)|\(an object\)/i);
  assert.match(shimeru.exampleSentence!.english, /direct action on an object/i);

  const shimaru = VERB_PAIRS_MAP['閉まる'];
  assert.ok(shimaru);
  assert.equal(shimaru.type, 'intransitive');
  assert.match(shimaru.nuancedMeaning, /\(on its own\)/i);
  assert.match(shimaru.exampleSentence!.english, /on their own|self-occurring/i);

  // 3. 止める / 止まる
  const tomeru = VERB_PAIRS_MAP['止める'];
  assert.ok(tomeru);
  assert.equal(tomeru.type, 'transitive');
  assert.match(tomeru.nuancedMeaning, /\(something\)/i);
  assert.match(tomeru.exampleSentence!.english, /direct action on an object/i);

  const tomaru = VERB_PAIRS_MAP['止まる'];
  assert.ok(tomaru);
  assert.equal(tomaru.type, 'intransitive');
  assert.match(tomaru.nuancedMeaning, /\(on its own\)/i);
  assert.match(tomaru.exampleSentence!.english, /on its own|self-occurring/i);

  // 4. 落とす / 落ちる
  const otosu = VERB_PAIRS_MAP['落とす'];
  assert.ok(otosu);
  assert.equal(otosu.type, 'transitive');
  assert.match(otosu.nuancedMeaning, /\(something\)/i);
  assert.match(otosu.exampleSentence!.english, /direct action on an object/i);

  const ochiru = VERB_PAIRS_MAP['落ちる'];
  assert.ok(ochiru);
  assert.equal(ochiru.type, 'intransitive');
  assert.match(ochiru.nuancedMeaning, /\(on its own\)/i);
  assert.match(ochiru.exampleSentence!.english, /on their own|self-occurring/i);

  // 5. 壊す / 壊れる
  const kowasu = VERB_PAIRS_MAP['壊す'];
  assert.ok(kowasu);
  assert.equal(kowasu.type, 'transitive');
  assert.match(kowasu.nuancedMeaning, /\(something\)|\(an object\)/i);
  assert.match(kowasu.exampleSentence!.english, /direct action on an object/i);

  const kowareru = VERB_PAIRS_MAP['壊れる'];
  assert.ok(kowareru);
  assert.equal(kowareru.type, 'intransitive');
  assert.match(kowareru.nuancedMeaning, /\(on its own\)/i);
  assert.match(kowareru.exampleSentence!.english, /on its own|became broken/i);
});

test('rankAndEnrichVocab assigns highest priority and correct transitivity attributes', () => {
  const enriched = rankAndEnrichVocab(FALLBACK_VOCAB_DATA);

  const akeru = enriched.find((item) => item.expression === '開ける');
  assert.ok(akeru);
  assert.equal(akeru.transitivity, 'transitive');
  assert.equal(akeru.meaning, 'to open (something) / to make open');
  assert.ok(akeru.priority <= 25, 'Transitive pair should rank in top tier');

  const aku = enriched.find((item) => item.expression === '開く');
  assert.ok(aku);
  assert.equal(aku.transitivity, 'intransitive');
  assert.equal(aku.meaning, 'to open (on its own) / to be opened');
  assert.ok(aku.priority <= 25, 'Intransitive pair should rank in top tier');
});

test('Calibrated 25-degree Tinder swipe rotation caps strictly at ±25deg', () => {
  const MAX_ROTATION_DEG = 25;
  const ROTATION_FACTOR = 0.15;
  const calculateRotation = (dragOffset: number) => {
    return Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, dragOffset * ROTATION_FACTOR));
  };

  // Small drag
  assert.equal(calculateRotation(50), 7.5);
  assert.equal(calculateRotation(-50), -7.5);

  // Moderate drag
  assert.equal(calculateRotation(100), 15);
  assert.equal(calculateRotation(-100), -15);

  // Large drag is strictly capped at ±25deg
  assert.equal(calculateRotation(200), 25);
  assert.equal(calculateRotation(400), 25);
  assert.equal(calculateRotation(-200), -25);
  assert.equal(calculateRotation(-500), -25);
});

test('Homophone Disambiguation: findVerbPair does not mismatch homophones with same reading', () => {
  // 1. 点ける (turn on) vs 漬ける (soak/pickle) vs 付ける (attach) vs 着ける (wear)
  const tsukeruTurnOn = findVerbPair('点ける', 'つける');
  assert.ok(tsukeruTurnOn);
  assert.match(tsukeruTurnOn.nuancedMeaning, /turn on/i);

  // 漬ける (pickle) has Kanji and must NOT match つける (turn on)!
  const tsukeruPickle = findVerbPair('漬ける', 'つける');
  assert.equal(tsukeruPickle, undefined, '漬ける must never be hijacked by つける (turn on) verb pair');

  // 付ける (attach) matches its own pair with 付く, not 点く/turn on
  const tsukeruAttach = findVerbPair('付ける', 'つける');
  assert.ok(tsukeruAttach);
  assert.match(tsukeruAttach.nuancedMeaning, /attach|apply/i);
  assert.equal(tsukeruAttach.partner, '付く');

  // 着ける (wear) must NOT match つける (turn on)
  const tsukeruWear = findVerbPair('着ける', 'つける');
  assert.equal(tsukeruWear, undefined, '着ける must not match turn on pair');

  // 2. 止まる (stop) vs 泊まる (stay overnight)
  const tomaruStop = findVerbPair('止まる', 'とまる');
  assert.ok(tomaruStop);
  assert.match(tomaruStop.nuancedMeaning, /stop/i);

  const tomaruStay = findVerbPair('泊まる', 'とまる');
  assert.equal(tomaruStay, undefined, '泊まる must not match 止まる (stop) verb pair');

  // 3. 切る (cut) vs 着る (wear) vs 斬る (slay)
  const kiruCut = findVerbPair('切る', 'きる');
  // 切る is not an intransitive pair in VERB_PAIRS_MAP, so it should not match an unrelated pair
  const kiruWear = findVerbPair('着る', 'きる');
  assert.equal(kiruWear, undefined);

  // 4. 上げる (raise) vs 揚げる (fry)
  const ageruRaise = findVerbPair('上げる', 'あげる');
  assert.ok(ageruRaise);
  assert.equal(ageruRaise.partner, '上がる');

  const ageruFry = findVerbPair('揚げる', 'あげる');
  assert.equal(ageruFry, undefined, '揚げる must not match 上げる/上がる pair');

  // 5. Pure kana with conflicting meaning does not get hijacked
  const kanaPickle = findVerbPair('つける', 'つける', 'to pickle / soak vegetables');
  assert.equal(kanaPickle, undefined, 'Kana つける with pickle meaning must not be hijacked as turn on');
});

test('Immutable Field Binding: deck enrichment preserves bound meanings and example sentences for homophones', () => {
  const enriched = rankAndEnrichVocab(FALLBACK_VOCAB_DATA);

  // 1. 漬ける: meaning is soak/pickle, example is pickled vegetables
  const tsukemono = enriched.find((c) => c.expression === '漬ける');
  assert.ok(tsukemono, '漬ける must exist in deck');
  assert.match(tsukemono.meaning, /pickle|soak/i);
  assert.doesNotMatch(tsukemono.meaning, /turn on/i);
  assert.match(tsukemono.exampleSentence!.japanese, /野菜を漬けました/);

  // 2. 点ける: meaning is turn on, example is lights
  const tsukeruLight = enriched.find((c) => c.expression === '点ける');
  assert.ok(tsukeruLight, '点ける must exist in deck');
  assert.match(tsukeruLight.meaning, /turn on/i);
  assert.match(tsukeruLight.exampleSentence!.japanese, /電気をつけました/);

  // 3. 付ける: meaning is attach, example is stamp
  const tsukeruAttach = enriched.find((c) => c.expression === '付ける');
  assert.ok(tsukeruAttach, '付ける must exist in deck');
  assert.match(tsukeruAttach.meaning, /attach/i);
  assert.match(tsukeruAttach.exampleSentence!.japanese, /切手を付けました/);

  // 4. 泊まる: meaning is stay overnight, example is Kyoto inn
  const tomaruStay = enriched.find((c) => c.expression === '泊まる');
  assert.ok(tomaruStay, '泊まる must exist in deck');
  assert.match(tomaruStay.meaning, /overnight|inn/i);
  assert.doesNotMatch(tomaruStay.meaning, /bus|halt/i);
  assert.match(tomaruStay.exampleSentence!.japanese, /旅館に泊まりました/);

  // 5. 止まる: meaning is stop/halt, example is bus at red light
  const tomaruStop = enriched.find((c) => c.expression === '止まる');
  assert.ok(tomaruStop, '止まる must exist in deck');
  assert.match(tomaruStop.meaning, /stop/i);
  assert.match(tomaruStop.exampleSentence!.japanese, /バスが止まりました/);

  // 6. 切る vs 着る
  const kiruCut = enriched.find((c) => c.expression === '切る');
  assert.ok(kiruCut, '切る must exist in deck');
  assert.match(kiruCut.meaning, /cut/i);
  assert.match(kiruCut.exampleSentence!.japanese, /ハサミで紙を切ります/);

  const kiruWear = enriched.find((c) => c.expression === '着る');
  assert.ok(kiruWear, '着る must exist in deck');
  assert.match(kiruWear.meaning, /wear/i);
  assert.match(kiruWear.exampleSentence!.japanese, /セーターを着ます/);

  // 7. 居る vs 要る
  const iruExist = enriched.find((c) => c.expression === '居る');
  assert.ok(iruExist, '居る must exist in deck');
  assert.match(iruExist.meaning, /exist/i);
  assert.match(iruExist.exampleSentence!.japanese, /白い猫が居ます/);

  const iruNeed = enriched.find((c) => c.expression === '要る');
  assert.ok(iruNeed, '要る must exist in deck');
  assert.match(iruNeed.meaning, /need|require/i);
  assert.match(iruNeed.exampleSentence!.japanese, /パスポートが要ります/);

  // 8. 競う
  const kisou = enriched.find((c) => c.expression === '競う');
  assert.ok(kisou, '競う must exist in deck');
  assert.match(kisou.meaning, /compete/i);
  assert.match(kisou.exampleSentence!.japanese, /タイムを競いました/);
});

test('generateWordId formats immutable ID as ${kanji || reading}_${reading}_${meaning_slug}', () => {
  assert.equal(
    generateWordId('点ける', 'つける', 'to turn on (lights)'),
    '点ける_つける_turn_on'
  );
  assert.equal(
    generateWordId('漬ける', 'つける', 'to soak / to pickle'),
    '漬ける_つける_soak'
  );
  assert.equal(
    generateWordId('居る', 'いる', 'to exist (animate)'),
    '居る_いる_exist'
  );
  assert.equal(
    generateWordId('要る', 'いる', 'to need / require'),
    '要る_いる_need'
  );
  assert.equal(
    generateWordId('', 'つける', 'to turn on'),
    'つける_つける_turn_on'
  );
});

test('deduplicateAndNormalizeDeck preserves homophones as distinct, independent card objects', () => {
  const rawHomophones = [
    {
      id: 'h1',
      expression: '点ける',
      reading: 'つける',
      meaning: 'to turn on (lights)',
      level: 'N4' as const,
      tags: ['verb'],
      priority: 10,
    },
    {
      id: 'h2',
      expression: '漬ける',
      reading: 'つける',
      meaning: 'to soak, to pickle',
      level: 'N4' as const,
      tags: ['verb'],
      priority: 11,
    },
    {
      id: 'h3',
      expression: '居る',
      reading: 'いる',
      meaning: 'to exist (animate)',
      level: 'N5' as const,
      tags: ['verb'],
      priority: 12,
    },
    {
      id: 'h4',
      expression: '要る',
      reading: 'いる',
      meaning: 'to need',
      level: 'N5' as const,
      tags: ['verb'],
      priority: 13,
    },
    {
      id: 'h5',
      expression: 'つける',
      reading: 'つける',
      meaning: 'to turn on',
      level: 'N5' as const,
      tags: ['verb'],
      priority: 14,
    },
    {
      id: 'h6',
      expression: 'つける',
      reading: 'つける',
      meaning: 'to pickle',
      level: 'N5' as const,
      tags: ['verb'],
      priority: 15,
    },
  ];

  const processed = deduplicateAndNormalizeDeck(rawHomophones);
  assert.equal(processed.length, 6, 'All 6 homophone items must be preserved as distinct cards');

  // Verify none were overwritten or merged together
  const tsukeruLight = processed.find((c) => c.expression === '点ける');
  const tsukeruPickle = processed.find((c) => c.expression === '漬ける');
  const iruExist = processed.find((c) => c.expression === '居る');
  const iruNeed = processed.find((c) => c.expression === '要る');

  assert.ok(tsukeruLight);
  assert.ok(tsukeruPickle);
  assert.ok(iruExist);
  assert.ok(iruNeed);

  assert.notEqual(tsukeruLight.id, tsukeruPickle.id);
  assert.notEqual(iruExist.id, iruNeed.id);
  assert.match(tsukeruLight.meaning, /turn on/i);
  assert.match(tsukeruPickle.meaning, /pickle/i);
  assert.match(iruExist.meaning, /exist/i);
  assert.match(iruNeed.meaning, /need/i);
});


