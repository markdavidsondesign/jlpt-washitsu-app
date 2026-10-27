/**
 * Utility for Japanese text-to-speech using browser Web Speech API.
 * Ensures Hiragana (Furigana) reading strings are passed, utterance.lang is explicitly 'ja-JP',
 * and prioritizes natural, high-quality Japanese voices.
 */

// Cached voices
let cachedJaVoice: SpeechSynthesisVoice | null = null;

/**
 * Prioritizes high-quality, natural Japanese voices in exact order:
 * 1. "Google 日本語" or "Google Japanese"
 * 2. "Kyoko" or "Otoya" (Apple premium voices)
 * 3. "Nanami" or "Keita" (Microsoft online voices)
 * 4. localService === false (indicates cloud / natural voice)
 * 5. Fallback to any default ja-JP voice
 */
export function selectBestJapaneseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Filter for Japanese voices (ja-JP or ja_JP)
  const jaVoices = voices.filter((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    return lang === 'ja-jp' || lang === 'ja';
  });

  const candidates = jaVoices.length > 0 ? jaVoices : voices.filter(v => (v.lang || '').toLowerCase().includes('ja'));
  if (candidates.length === 0) return null;

  // 1. Voices containing "Google 日本語" or "Google Japanese"
  const googleVoice = candidates.find(
    (v) => v.name.includes('Google 日本語') || v.name.includes('Google Japanese')
  );
  if (googleVoice) return googleVoice;

  // 2. Voices containing "Kyoko" or "Otoya" (Apple premium voices)
  const appleVoice = candidates.find(
    (v) => v.name.includes('Kyoko') || v.name.includes('Otoya')
  );
  if (appleVoice) return appleVoice;

  // 3. Voices containing "Nanami" or "Keita" (Microsoft online voices)
  const msVoice = candidates.find(
    (v) => v.name.includes('Nanami') || v.name.includes('Keita')
  );
  if (msVoice) return msVoice;

  // 4. Any voice with localService === false (indicates cloud / natural voice)
  const cloudVoice = candidates.find((v) => v.localService === false);
  if (cloudVoice) return cloudVoice;

  // 5. Fallback to default ja-JP voice, or the first available Japanese voice
  const defaultVoice = candidates.find((v) => v.default) || candidates[0];
  return defaultVoice || null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const updateVoices = () => {
    try {
      const voices = window.speechSynthesis.getVoices();
      cachedJaVoice = selectBestJapaneseVoice(voices);
    } catch {
      // Ignore if getVoices fails
    }
  };

  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

/**
 * Cleans a furigana / reading string for natural Japanese TTS.
 * Extracts the primary reading if multiple are separated by '/' or ',',
 * and strips middle dots (・) used in okurigana notation.
 */
export function cleanHiraganaForTTS(raw: string): string {
  if (!raw) return '';
  // If multiple readings are listed with '/' (e.g. "う・まれる / い・きる / せい"), take primary reading
  const primary = raw.includes('/') ? raw.split('/')[0].trim() : raw;
  // Remove okurigana separator dots and redundant symbols
  return primary.replace(/[・･]/g, '').trim();
}

/**
 * Speaks Japanese text via SpeechSynthesis with explicitly configured 'ja-JP'
 * @param readingHiragana - The hiragana/furigana phonetic string (NOT raw kanji)
 */
export function speakJapanese(readingHiragana: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  const cleanText = cleanHiraganaForTTS(readingHiragana);
  if (!cleanText) return false;

  try {
    window.speechSynthesis.cancel(); // Stop any currently playing audio
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.pitch = 1.0; // Standard natural pitch
    utterance.rate = 0.9;  // Slightly slower for clear learning pronunciation

    // Ensure we have the best available ja-JP voice
    const voices = window.speechSynthesis.getVoices();
    const bestVoice = selectBestJapaneseVoice(voices) || cachedJaVoice;

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    return false;
  }
}
