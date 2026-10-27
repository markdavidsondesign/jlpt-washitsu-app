import { describe, it } from 'node:test';
import assert from 'node:assert';
import { decomposeWord, parseSingleRadicalString } from './kanjiDecomposer.ts';

describe('kanjiDecomposer', () => {
  it('decomposes "語" into speech, five, and mouth', () => {
    const result = decomposeWord('日本語');
    const goEntry = result.find(r => r.kanji === '語');
    assert.ok(goEntry, 'Should contain entry for 語');
    assert.strictEqual(goEntry.components.length, 3);
    assert.deepStrictEqual(goEntry.components, [
      { char: '言', meaning: 'speech' },
      { char: '五', meaning: 'five' },
      { char: '口', meaning: 'mouth' },
    ]);
  });

  it('decomposes multi-kanji compound "病院" grouping both characters', () => {
    const result = decomposeWord('病院');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].kanji, '病');
    assert.deepStrictEqual(result[0].components, [
      { char: '疒', meaning: 'sickness' },
      { char: '丙', meaning: 'third rank' },
    ]);
    assert.strictEqual(result[1].kanji, '院');
    assert.deepStrictEqual(result[1].components, [
      { char: '阝', meaning: 'hill / mound' },
      { char: '宀', meaning: 'roof' },
      { char: '元', meaning: 'origin' },
    ]);
  });

  it('gracefully returns empty array for pure Kana words', () => {
    assert.deepStrictEqual(decomposeWord('あげる'), []);
    assert.deepStrictEqual(decomposeWord('くれる'), []);
    assert.deepStrictEqual(decomposeWord('もらう'), []);
    assert.deepStrictEqual(decomposeWord('すっと'), []);
    assert.deepStrictEqual(decomposeWord(''), []);
  });

  it('decomposes verbs with okurigana like "落ちる" and "開ける"', () => {
    const ochiRes = decomposeWord('落ちる');
    assert.strictEqual(ochiRes.length, 1);
    assert.strictEqual(ochiRes[0].kanji, '落');
    assert.deepStrictEqual(ochiRes[0].components, [
      { char: '艹', meaning: 'grass / plant' },
      { char: '氵', meaning: 'water' },
      { char: '各', meaning: 'each' },
    ]);

    const akeruRes = decomposeWord('開ける');
    assert.strictEqual(akeruRes.length, 1);
    assert.strictEqual(akeruRes[0].kanji, '開');
    assert.deepStrictEqual(akeruRes[0].components, [
      { char: '門', meaning: 'gate' },
      { char: '开', meaning: 'hands opening' },
    ]);
  });

  it('gracefully omits single-element primitive kanji without sub-radicals', () => {
    const res = decomposeWord('止まる');
    assert.deepStrictEqual(res, []);
  });

  it('parses fallback single radical string format', () => {
    assert.deepStrictEqual(parseSingleRadicalString('門 (gate)'), {
      char: '門',
      meaning: 'gate',
    });
    assert.deepStrictEqual(parseSingleRadicalString('言（speech）'), {
      char: '言',
      meaning: 'speech',
    });
  });
});
