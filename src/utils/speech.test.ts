import test from 'node:test';
import assert from 'node:assert/strict';
import { selectBestJapaneseVoice, cleanHiraganaForTTS } from './speech.ts';

// Mock helper to create SpeechSynthesisVoice objects
function createMockVoice(params: {
  name: string;
  lang: string;
  localService?: boolean;
  default?: boolean;
}): SpeechSynthesisVoice {
  return {
    name: params.name,
    lang: params.lang,
    localService: params.localService ?? true,
    default: params.default ?? false,
    voiceURI: params.name,
  } as SpeechSynthesisVoice;
}

test('selectBestJapaneseVoice prioritizes Google 日本語 / Google Japanese first', () => {
  const voices = [
    createMockVoice({ name: 'Kyoko', lang: 'ja-JP' }),
    createMockVoice({ name: 'Google 日本語', lang: 'ja-JP' }),
    createMockVoice({ name: 'Nanami', lang: 'ja-JP' }),
  ];

  const selected = selectBestJapaneseVoice(voices);
  assert.equal(selected?.name, 'Google 日本語');
});

test('selectBestJapaneseVoice prioritizes Kyoko / Otoya second if Google voice not available', () => {
  const voices = [
    createMockVoice({ name: 'Nanami Online (Natural)', lang: 'ja-JP' }),
    createMockVoice({ name: 'Kyoko Premium', lang: 'ja-JP' }),
    createMockVoice({ name: 'Standard Voice', lang: 'ja-JP' }),
  ];

  const selected = selectBestJapaneseVoice(voices);
  assert.equal(selected?.name, 'Kyoko Premium');
});

test('selectBestJapaneseVoice prioritizes Nanami / Keita third', () => {
  const voices = [
    createMockVoice({ name: 'Standard Local Voice', lang: 'ja-JP', localService: true }),
    createMockVoice({ name: 'Nanami', lang: 'ja-JP' }),
    createMockVoice({ name: 'English Voice', lang: 'en-US' }),
  ];

  const selected = selectBestJapaneseVoice(voices);
  assert.equal(selected?.name, 'Nanami');
});

test('selectBestJapaneseVoice prioritizes localService === false (cloud voice) fourth', () => {
  const voices = [
    createMockVoice({ name: 'Robotic System Voice', lang: 'ja-JP', localService: true }),
    createMockVoice({ name: 'High-Res Natural Voice', lang: 'ja-JP', localService: false }),
  ];

  const selected = selectBestJapaneseVoice(voices);
  assert.equal(selected?.name, 'High-Res Natural Voice');
});

test('selectBestJapaneseVoice falls back to default ja-JP or first ja voice', () => {
  const defaultVoice = createMockVoice({ name: 'Default JA', lang: 'ja-JP', default: true });
  const otherVoice = createMockVoice({ name: 'Other JA', lang: 'ja-JP', default: false });
  const enVoice = createMockVoice({ name: 'English', lang: 'en-US' });

  const selected = selectBestJapaneseVoice([enVoice, otherVoice, defaultVoice]);
  assert.equal(selected?.name, 'Default JA');
});

test('cleanHiraganaForTTS formats reading strings accurately for speech utterance', () => {
  // Strips okurigana dots and extracts primary reading from multiple options
  assert.equal(cleanHiraganaForTTS('う・まれる / い・きる / せい'), 'うまれる');
  assert.equal(cleanHiraganaForTTS('つよ・い'), 'つよい');
  assert.equal(cleanHiraganaForTTS('ま・つ'), 'まつ');
  assert.equal(cleanHiraganaForTTS('がくせい'), 'がくせい');
  assert.equal(cleanHiraganaForTTS('わたしは にほんで うまれました。'), 'わたしは にほんで うまれました。');
  assert.equal(cleanHiraganaForTTS(''), '');
});
