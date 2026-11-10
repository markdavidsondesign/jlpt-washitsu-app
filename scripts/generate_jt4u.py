# -*- coding: utf-8 -*-
"""
Generates src/data/jt4uN4Deck.ts containing ONLY the exact words from the Google Doc:
public/assets/aistudio/Japanese_Test_4_You_N4_Vocab_List_7ca7ea77
Total items: Exactly 536 items.
Example sentences: Excluded (as requested by user).
"""
import json
import re

ROMAJI_TO_HIRA = {
    'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
    'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
    'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
    'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
    'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
    'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
    'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
    'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
    'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ',
    'jya': 'じゃ', 'jyu': 'じゅ', 'jyo': 'じょ',
    'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
    'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
    'shi': 'し', 'chi': 'ち', 'tsu': 'つ', 'fu': 'ふ',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'sa': 'さ', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ta': 'た', 'te': 'て', 'to': 'と',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'he': 'へ', 'ho': 'ほ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'n': 'ん'
}

def romaji_to_hiragana(romaji):
    if not romaji:
        return ''
    s = romaji.lower().strip()
    s = re.sub(r"n['’](?=[aeiouy])", "ん", s)
    s = re.sub(r"n(?=[^aiueoyn]|$)", "ん", s)

    res = []
    i = 0
    n = len(s)
    while i < n:
        if s[i] == 'ん':
            res.append('ん')
            i += 1
            continue
        if i + 1 < n and s[i] == s[i+1] and s[i] in 'bcdfghjklmpqrstvwxyz' and s[i] != 'n':
            res.append('っ')
            i += 1
            continue
        if s[i:i+3] == 'tch':
            res.append('っ')
            i += 1
            continue
        if i + 3 <= n and s[i:i+3] in ROMAJI_TO_HIRA:
            res.append(ROMAJI_TO_HIRA[s[i:i+3]])
            i += 3
            continue
        if i + 2 <= n and s[i:i+2] in ROMAJI_TO_HIRA:
            res.append(ROMAJI_TO_HIRA[s[i:i+2]])
            i += 2
            continue
        if s[i] in ROMAJI_TO_HIRA:
            res.append(ROMAJI_TO_HIRA[s[i]])
            i += 1
            continue
        res.append(s[i])
        i += 1
    return "".join(res)

def determine_pos_and_category(expr, reading, meaning):
    m_lower = meaning.lower()
    
    if m_lower.startswith('to ') or reading.endswith('する') or reading.endswith('ます'):
        return 'verb', ['verb', 'JLPT_N4'], 'Core N4 Verb'
    if reading.endswith('い') and any(w in m_lower for w in ['adjective', 'shallow', 'deep', 'bitter', 'sweet', 'spicy', 'rare', 'sad', 'painful', 'fine', 'cold', 'warm', 'fast', 'slow']):
        return 'i-adjective', ['i-adjective', 'JLPT_N4'], 'N4 Adjective'
    if 'na-adjective' in m_lower or expr in ['安全', '安心', '不便', '親切', '盛ん', '便利', '適当', '特別', '丁寧', '熱心', '複雑', '必要']:
        return 'na-adjective', ['na-adjective', 'JLPT_N4'], 'N4 Adjective'
    if any(w in m_lower for w in ['very', 'surely', 'firmly', 'tightly', 'gradually', 'especially', 'always', 'at once']) or expr in ['きっと', 'しばらく', 'しっかり', 'はっきり', 'すっかり', 'ずいぶん', '特に', 'まず', 'やっと', 'やはり']:
        return 'adverb', ['adverb', 'JLPT_N4'], 'N4 Adverb'
    if 'counter' in m_lower or expr in ['倍', '匹', '杯', '冊', '台']:
        return 'counter', ['counter', 'JLPT_N4'], 'Counter'
        
    return 'noun', ['noun', 'JLPT_N4'], 'N4 Vocabulary'

# Process the input file
input_path = 'public/assets/aistudio/Japanese_Test_4_You_N4_Vocab_List_7ca7ea77'
with open(input_path, encoding='utf-8-sig') as f:
    raw_lines = [l.strip() for l in f if l.strip() and not l.strip().startswith('http')]

cards = []
for index, line in enumerate(raw_lines):
    m = re.match(r"^([^(:]+)(?:\s*\(([^)]+)\))?\s*:\s*(.+)$", line)
    if not m:
        continue
    
    # Strictly preserve the exact expression and meaning from the doc
    expr = m.group(1).strip()
    raw_romaji = (m.group(2) or "").strip()
    meaning = m.group(3).strip().replace("\u200b", "")

    # Convert romaji to pure hiragana reading, or use expr if pure kana
    reading = romaji_to_hiragana(raw_romaji) if raw_romaji else expr

    pos_tag, tags, category = determine_pos_and_category(expr, reading, meaning)

    slug = re.sub(r'[^a-z0-9]+', '_', raw_romaji.lower()) if raw_romaji else f"item_{index+1}"
    card_id = f"jt4u_n4_{index+1:03d}_{slug}"

    card = {
        'id': card_id,
        'deckId': 'jt4u_n4',
        'expression': expr,
        'reading': reading,
        'meaning': meaning,
        'level': 'N4',
        'tags': tags,
        'priority': index + 1,
        'category': category,
        # Strictly NO exampleSentence field as requested by the user
    }

    cards.append(card)

print(f"Generated {len(cards)} cards strictly from Google Doc.")
assert len(cards) == 536, f"Expected 536 cards, got {len(cards)}"

# Output to src/data/jt4uN4Deck.ts
ts_content = """import type { VocabCardItem } from './vocabTypes.ts';

/**
 * JT4U N4 Vocabulary Deck
 * Sourced strictly from the user's JapaneseTest4You.com JLPT N4 Vocabulary List document.
 * Contains only the exact words and definitions present in the source document.
 * Total: 536 vocabulary cards with pure Hiragana readings, part of speech tags, and category labels.
 */
export const JT4U_N4_VOCAB_DATA: VocabCardItem[] = """ + json.dumps(cards, ensure_ascii=False, indent=2) + ";\n"

with open('src/data/jt4uN4Deck.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Wrote src/data/jt4uN4Deck.ts successfully!")
