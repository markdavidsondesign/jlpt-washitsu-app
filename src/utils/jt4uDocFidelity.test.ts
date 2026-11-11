import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JT4U_N4_VOCAB_DATA } from '../data/jt4uN4Deck.ts';
import { getDeckById, DECKS, getAllRegisteredCards } from '../data/vocabFetcher.ts';
import { filterDeckByDecks, filterDeckByMode } from './srs.ts';

test('JT4U N4 deck contains strictly the 536 words from the Google Doc', () => {
  const docPath = path.resolve('public/assets/aistudio/Japanese_Test_4_You_N4_Vocab_List_7ca7ea77');
  const content = fs.readFileSync(docPath, 'utf8');
  const lines = content.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('http'));

  assert.equal(lines.length, 536, 'Google doc must have exactly 536 vocab lines');
  assert.equal(JT4U_N4_VOCAB_DATA.length, 536, 'JT4U_N4_VOCAB_DATA must have exactly 536 cards');

  // Verify each card matches doc expression and meaning
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^([^(:]+)(?:\s*\(([^)]+)\))?\s*:\s*(.+)$/);
    assert.ok(match, `Line ${i + 1} must match parse pattern: ${line}`);

    const expectedExpr = match[1].trim();
    const expectedMeaning = match[3].trim().replace(/\u200b/g, '');

    const card = JT4U_N4_VOCAB_DATA[i];
    assert.equal(card.expression, expectedExpr, `Card ${i + 1} expression must match doc verbatim`);
    assert.equal(card.meaning, expectedMeaning, `Card ${i + 1} meaning must match doc verbatim`);
    assert.equal(card.deckId, 'jt4u_n4', `Card ${i + 1} must have deckId jt4u_n4`);
    assert.equal(card.level, 'N4', `Card ${i + 1} must have level N4`);
    assert.ok(card.reading, `Card ${i + 1} must have a pure hiragana reading`);
    // CRITICAL USER REQUIREMENT: Zero sentences
    assert.equal(card.exampleSentence, undefined, `Card ${i + 1} (${card.expression}) must NOT have an exampleSentence`);
  }
});

test('JT4U deck cards have strictly zero exampleSentence objects', () => {
  const cardsWithSentence = JT4U_N4_VOCAB_DATA.filter((c) => c.exampleSentence !== undefined);
  assert.equal(cardsWithSentence.length, 0, 'No cards in JT4U N4 deck may have an exampleSentence');
});

test('Deck filtering strictly isolates jt4u_n4 from other decks without bleed', () => {
  const allCards = getAllRegisteredCards();
  assert.equal(allCards.length, 50 + 20 + 536 + 139, 'Combined master cards must equal 745');

  // Filter only jt4u_n4
  const jt4uOnly = filterDeckByDecks(allCards, ['jt4u_n4']);
  assert.equal(jt4uOnly.length, 536, 'Only the 536 JT4U cards must be selected');
  assert.ok(jt4uOnly.every((c) => c.deckId === 'jt4u_n4'), 'Every card must have deckId jt4u_n4');
  assert.ok(!jt4uOnly.some((c) => c.deckId === 'elzup_n4'), 'No elzup_n4 cards may bleed into jt4u_n4');
  assert.ok(!jt4uOnly.some((c) => c.deckId === 'elzup_n5'), 'No elzup_n5 cards may bleed into jt4u_n4');

  // Filter only elzup_n4
  const elzupN4Only = filterDeckByDecks(allCards, ['elzup_n4']);
  assert.equal(elzupN4Only.length, 50, 'Only the 50 elzup N4 cards must be selected');
  assert.ok(elzupN4Only.every((c) => c.deckId === 'elzup_n4'), 'Every card must have deckId elzup_n4');
  assert.ok(!elzupN4Only.some((c) => c.deckId === 'jt4u_n4'), 'No jt4u_n4 cards may bleed into elzup_n4');

  // Filter both elzup_n4 and jt4u_n4
  const combinedN4 = filterDeckByDecks(allCards, ['elzup_n4', 'jt4u_n4']);
  assert.equal(combinedN4.length, 50 + 536, 'Must combine exactly 586 cards');
});
