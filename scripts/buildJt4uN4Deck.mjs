import fs from 'node:fs';
import path from 'node:path';

// Load raw input
const rawPath = path.resolve('public/assets/aistudio/Japanese_Test_4_You_N4_Vocab_List_7ca7ea77');
const content = fs.readFileSync(rawPath, 'utf8');
const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

const ROMAJI_TO_HIRA = {
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ',
  jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  shi: 'し', chi: 'ち', tsu: 'つ', fu: 'ふ',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  n: 'ん',
};

function romajiToHiragana(romaji) {
  if (!romaji) return '';
  let s = romaji.toLowerCase().trim();
  s = s.replace(/n[’\x27](?=[aeiouy])/g, 'ん');
  s = s.replace(/n(?=[^aiueoyn]|$)/g, 'ん');

  let result = '';
  let i = 0;
  while (i < s.length) {
    if (s[i] === 'ん') {
      result += 'ん';
      i++;
      continue;
    }
    if (i + 1 < s.length && s[i] === s[i + 1] && /[bcdfghjklmpqrstvwxyz]/.test(s[i]) && s[i] !== 'n') {
      result += 'っ';
      i++;
      continue;
    }
    if (s.slice(i, i + 3) === 'tch') {
      result += 'っ';
      i += 1;
      continue;
    }
    const sub3 = s.slice(i, i + 3);
    if (ROMAJI_TO_HIRA[sub3]) {
      result += ROMAJI_TO_HIRA[sub3];
      i += 3;
      continue;
    }
    const sub2 = s.slice(i, i + 2);
    if (ROMAJI_TO_HIRA[sub2]) {
      result += ROMAJI_TO_HIRA[sub2];
      i += 2;
      continue;
    }
    const sub1 = s.slice(i, i + 1);
    if (ROMAJI_TO_HIRA[sub1]) {
      result += ROMAJI_TO_HIRA[sub1];
      i += 1;
      continue;
    }
    result += s[i];
    i++;
  }
  return result;
}

// Import existing VERB_PAIRS_MAP
const vocabFetcherModule = await import('../src/data/vocabFetcher.ts');
const VERB_PAIRS_MAP = vocabFetcherModule.VERB_PAIRS_MAP;

console.log('Building JT4U Deck from', lines.length, 'lines...');
