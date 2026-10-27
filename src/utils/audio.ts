/**
 * Web Audio API synthesizer for traditional Japanese celebratory chime
 * Uses pentatonic harmonic frequencies (Hirajoshi / Koto chime) and haptics
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a resonant, pentatonic teahouse temple chime
 */
export function playCelebratoryChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Trigger subtle haptic pulse if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([40, 50, 40, 50, 80]);
      } catch {
        // Ignore haptics error
      }
    }

    const now = ctx.currentTime;
    // Japanese Hirajoshi / Insen pentatonic frequencies: E5, G5, A5, B5, E6
    const notes = [
      { freq: 659.25, time: 0.00, duration: 0.9 }, // E5
      { freq: 783.99, time: 0.12, duration: 0.9 }, // G5
      { freq: 880.00, time: 0.24, duration: 1.0 }, // A5
      { freq: 987.77, time: 0.36, duration: 1.2 }, // B5
      { freq: 1318.51, time: 0.48, duration: 1.6 }, // E6
    ];

    notes.forEach(({ freq, time, duration }) => {
      const startTime = now + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with soft attack and exponential decay for bell/koto effect
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Subtle overtone richness with harmonic detune
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  } catch (err) {
    console.warn('Celebratory chime audio not available:', err);
  }
}

/**
 * Plays a bright, light Web Audio chime for correct quiz matches with haptic feedback
 */
export function playMatchSuccessChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([15, 40, 15]);
      } catch {}
    }

    const now = ctx.currentTime;
    // Ascending pure bell tones (A5 -> E6)
    const notes = [
      { freq: 880.00, time: 0.00, duration: 0.18 }, // A5
      { freq: 1318.51, time: 0.06, duration: 0.28 }, // E6
    ];

    notes.forEach(({ freq, time, duration }) => {
      const startTime = now + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.14, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    });
  } catch (err) {
    console.warn('Success chime audio error:', err);
  }
}

/**
 * Plays a gentle, low failure tone for incorrect quiz matches with haptic feedback
 */
export function playMatchErrorTone(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([45]);
      } catch {}
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(196.00, now); // G3
    osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.22); // D3

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.27);
  } catch (err) {
    console.warn('Error tone audio error:', err);
  }
}
