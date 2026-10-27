import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Volume2, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { VocabCardItem } from '../data/vocabTypes';
import { SRSAction, SRSLevel } from '../utils/srs';
import { speakJapanese } from '../utils/speech';
import { decomposeWord } from '../utils/kanjiDecomposer';

export interface KanjiCardRef {
  swipeLeft: () => void;
  swipeRight: () => void;
  flip: () => void;
}

interface KanjiCardProps {
  card: VocabCardItem;
  level: SRSLevel;
  streak: number;
  isFlipped: boolean;
  onFlip: () => void;
  onSwipe: (action: SRSAction) => void;
  isModalOpen?: boolean;
}

export const KanjiCard = forwardRef<KanjiCardRef, KanjiCardProps>(({
  card,
  level,
  streak,
  isFlipped,
  onFlip,
  onSwipe,
  isModalOpen = false,
}, ref) => {
  // Drag / Swipe gesture state
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFlyingOut, setIsFlyingOut] = useState<boolean>(false);
  const [flyDirection, setFlyDirection] = useState<'left' | 'right' | null>(null);

  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const rawDxRef = useRef<number>(0);
  const lastFlipTimeRef = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Physics constants:
  // - Constrain maximum horizontal displacement along X-axis to subtle distance (max ±100px, within ±80px to ±120px)
  // - Keep 25-degree rotation tilt intact
  // - 60px swipe release threshold
  const MAX_DRAG_DISPLACEMENT = 100;
  const SWIPE_THRESHOLD = 60;
  const MAX_ROTATION_DEG = 25;
  const ROTATION_FACTOR = 0.15;

  // Reset drag and animation position when card changes
  useEffect(() => {
    setDragOffset(0);
    setIsDragging(false);
    setIsFlyingOut(false);
    setFlyDirection(null);
    hasMovedRef.current = false;
    rawDxRef.current = 0;
  }, [card.id]);

  // Memoized decomposition of constituent radicals and sub-elements
  const decompositions = React.useMemo(() => {
    return decomposeWord(card.expression, card.radical);
  }, [card.expression, card.radical]);

  // Handle TTS pronunciation with clean Hiragana readings (not raw Kanji)
  const handlePlayReadingAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakJapanese(card.reading);
  };

  const handlePlaySentenceAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.exampleSentence) {
      speakJapanese(card.exampleSentence.furigana);
    }
  };

  // Safe flip function to avoid double-triggers
  const safeFlip = useCallback(() => {
    const now = Date.now();
    if (now - lastFlipTimeRef.current > 200) {
      lastFlipTimeRef.current = now;
      onFlip();
    }
  }, [onFlip]);

  // Quick, clean swipe execution routine (shared identically by Drag, Arrow keys, and SRS buttons)
  const executeSwipe = useCallback((direction: 'left' | 'right') => {
    if (isFlyingOut) return;
    setIsFlyingOut(true);
    setFlyDirection(direction);
    setIsDragging(false);
    // Move cleanly off container (360px completely exits the 450px card box without infinite dragging)
    setDragOffset(direction === 'right' ? 360 : -360);

    setTimeout(() => {
      const action: SRSAction = direction === 'left' ? 'again' : (level >= 2 ? 'easy' : 'good');
      onSwipe(action);
    }, 220);
  }, [isFlyingOut, level, onSwipe]);

  // Expose imperative handle so parent (and buttons/shortcuts) can run the exact same routine
  useImperativeHandle(ref, () => ({
    swipeLeft: () => executeSwipe('left'),
    swipeRight: () => executeSwipe('right'),
    flip: () => safeFlip(),
  }), [executeSwipe, safeFlip]);

  // Arrow Key & Keyboard Controls:
  // - Left Arrow (←): Trigger "Swipe Left / Again"
  // - Right Arrow (→): Trigger "Swipe Right / Good"
  // - Spacebar or Up/Down Arrows (↑ / ↓): Trigger "Flip Card"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        executeSwipe('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        executeSwipe('right');
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        safeFlip();
      } else if (e.key === '1') {
        e.preventDefault();
        executeSwipe('left');
      } else if (e.key === '2' || e.key === '3') {
        e.preventDefault();
        executeSwipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, executeSwipe, safeFlip]);

  // Pointer drag event handlers for calibrated swipe physics
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startTimeRef.current = Date.now();
    hasMovedRef.current = false;
    rawDxRef.current = 0;
    setIsDragging(false);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || isFlyingOut) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    rawDxRef.current = dx;

    // Only engage horizontal drag if movement is intentional and primarily horizontal
    if (!hasMovedRef.current) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        hasMovedRef.current = true;
        setIsDragging(true);
        // Constrain horizontal displacement along X-axis to subtle distance (max ±100px)
        const constrainedOffset = Math.max(-MAX_DRAG_DISPLACEMENT, Math.min(MAX_DRAG_DISPLACEMENT, dx));
        setDragOffset(constrainedOffset);
      }
    } else {
      // Constrain horizontal displacement along X-axis to subtle distance (max ±100px)
      const constrainedOffset = Math.max(-MAX_DRAG_DISPLACEMENT, Math.min(MAX_DRAG_DISPLACEMENT, dx));
      setDragOffset(constrainedOffset);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const elapsed = Date.now() - startTimeRef.current;
    const rawDx = rawDxRef.current;

    // If it's a tap or small movement, cleanly trigger card flip
    if (!hasMovedRef.current || Math.abs(rawDx) < 16 || (elapsed < 300 && Math.abs(rawDx) < SWIPE_THRESHOLD)) {
      safeFlip();
      setDragOffset(0);
      setIsDragging(false);
      hasMovedRef.current = false;
      return;
    }

    if (rawDx < -SWIPE_THRESHOLD) {
      // Swiping LEFT -> "Again / Hard" (Level 1)
      executeSwipe('left');
    } else if (rawDx > SWIPE_THRESHOLD) {
      // Swiping RIGHT -> "Good / Mastered" (Level 2/3)
      executeSwipe('right');
    } else {
      // Under threshold -> cleanly snap back to center
      setDragOffset(0);
      setIsDragging(false);
    }
    hasMovedRef.current = false;
  };

  const handlePointerCancel = () => {
    isPointerDownRef.current = false;
    setDragOffset(0);
    setIsDragging(false);
    hasMovedRef.current = false;
    rawDxRef.current = 0;
  };

  // Calibrated 25-Degree Tinder Swipe Rotation capped at ±25deg
  const calculatedRotation = isDragging
    ? Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, rawDxRef.current * ROTATION_FACTOR))
    : Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, dragOffset * ROTATION_FACTOR));

  const rotationDeg = isFlyingOut
    ? (flyDirection === 'right' ? MAX_ROTATION_DEG : -MAX_ROTATION_DEG)
    : calculatedRotation;

  const dragIntensity = Math.min(1, Math.abs(isDragging ? rawDxRef.current : dragOffset) / 80);
  const isDraggingLeft = (isDragging && rawDxRef.current < 0) || dragOffset < 0;
  const isDraggingRight = (isDragging && rawDxRef.current > 0) || dragOffset > 0;

  // Level badges with traditional Japanese palette: Vermilion (L1), Ochre (L2), Bamboo (L3)
  const levelBadges: Record<SRSLevel, { label: string; bg: string; text: string; dot: string }> = {
    1: {
      label: 'Level 1 · Hard / New',
      bg: 'bg-[#FBF0EE] dark:bg-[#36221D] border-[#F2D1CA] dark:border-[#522F26]',
      text: 'text-[#C84B31] dark:text-[#E88673]',
      dot: 'bg-[#C84B31]',
    },
    2: {
      label: 'Level 2 · Medium',
      bg: 'bg-[#F7F4EC] dark:bg-[#332E23] border-[#E8DFC9] dark:border-[#504734]',
      text: 'text-[#8C6D3B] dark:text-[#DEC88E]',
      dot: 'bg-[#8C6D3B]',
    },
    3: {
      label: 'Level 3 · Mastered',
      bg: 'bg-[#EDF3EF] dark:bg-[#202E24] border-[#D1E1D6] dark:border-[#314838]',
      text: 'text-[#4A6B53] dark:text-[#8BAF95]',
      dot: 'bg-[#4A6B53]',
    },
  };

  const currentBadge = levelBadges[level];

  // Dynamic front typography based on word length
  const getFrontFontSize = (str: string) => {
    const len = str.length;
    if (len <= 1) return 'text-8xl sm:text-9xl';
    if (len <= 2) return 'text-6xl sm:text-7xl';
    if (len <= 4) return 'text-4xl sm:text-5xl';
    return 'text-3xl sm:text-4xl';
  };

  return (
    <div className="w-[90%] max-w-[420px] h-full max-h-[560px] aspect-[3/4] mx-auto select-none relative box-border overflow-visible touch-pan-y flex flex-col items-center justify-center my-0 min-h-0">
      {/* Outer Drag & Swipe Container */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          transform: `translateX(${dragOffset}px) rotate(${rotationDeg}deg)`,
          opacity: isFlyingOut ? 0 : 1,
          transition: isDragging
            ? 'none'
            : isFlyingOut
            ? 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out'
            : 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out',
        }}
        className="w-full h-full max-h-[560px] aspect-[3/4] cursor-grab active:cursor-grabbing relative box-border flex flex-col items-center justify-center min-h-0"
      >
        {/* Swipe Stamp Overlays with Traditional Bamboo (Good) and Vermilion (Again) */}
        {(isDraggingRight || (isFlyingOut && flyDirection === 'right')) && dragIntensity > 0.05 && (
          <div
            style={{ opacity: isFlyingOut ? 1 : dragIntensity }}
            className="absolute top-6 left-6 z-30 pointer-events-none border-4 border-[#4A6B53] text-[#4A6B53] dark:text-[#8BAF95] bg-[#FAF8F5]/95 dark:bg-[#28231F]/95 rounded-2xl px-3 py-1 font-black text-lg tracking-wider shadow-lg -rotate-12 transition-opacity font-jp"
          >
            {level >= 2 ? 'MASTERED' : 'GOOD'}
          </div>
        )}

        {(isDraggingLeft || (isFlyingOut && flyDirection === 'left')) && dragIntensity > 0.05 && (
          <div
            style={{ opacity: isFlyingOut ? 1 : dragIntensity }}
            className="absolute top-6 right-6 z-30 pointer-events-none border-4 border-[#C84B31] text-[#C84B31] dark:text-[#E88673] bg-[#FAF8F5]/95 dark:bg-[#28231F]/95 rounded-2xl px-3 py-1 font-black text-lg tracking-wider shadow-lg rotate-12 transition-opacity font-jp"
          >
            AGAIN
          </div>
        )}

        {/* Card Frame Container - Tight padding, fluid clamp, aspect-ratio 3/4 */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              safeFlip();
            }
          }}
          aria-label={`Vocabulary card ${card.expression}. ${isFlipped ? 'Showing card back details' : 'Showing card front. Click or tap to flip, swipe left for Again, swipe right for Good'}`}
          className="relative w-full h-full max-h-[560px] aspect-[3/4] rounded-2xl sm:rounded-3xl box-border focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6B7F5E]/30 overflow-hidden flex flex-col shadow-lg shadow-[#332C27]/8 dark:shadow-black/40 min-h-0"
        >
          {/* Real-time Tint Overlay during Drag: Bamboo for right, Vermilion for left */}
          {dragOffset !== 0 && (
            <div
              style={{
                backgroundColor: isDraggingRight ? 'rgb(74, 107, 83)' : 'rgb(200, 75, 49)',
                opacity: Math.min(0.20, (Math.abs(dragOffset) / 180) * 0.20),
              }}
              className="absolute inset-0 z-20 pointer-events-none rounded-2xl sm:rounded-3xl transition-opacity"
            />
          )}

          {/* ================= FRONT OF CARD (Warm Washi Paper / Dark Cedar Wood) ================= */}
          {!isFlipped ? (
            <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] flex flex-col justify-between p-3 sm:p-4 gap-2 animate-in fade-in duration-200 box-border text-left min-h-0 overflow-hidden">
              {/* Top metadata row: Level badge (top left) and JLPT badge (top right) */}
              <div className="flex items-center justify-between w-full shrink-0">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${currentBadge.bg} ${currentBadge.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentBadge.dot}`} />
                  <span>{currentBadge.label}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    card.level === 'N4'
                      ? 'bg-[#FBF0EE] dark:bg-[#36221D] text-[#C84B31] dark:text-[#E88673] border-[#F2D1CA]/60 dark:border-[#522F26]'
                      : 'bg-[#EEF3F8] dark:bg-[#1E2E40] text-[#2B4C6F] dark:text-[#8CB4DE] border-[#CAD8E6]/60 dark:border-[#2B4C6F]'
                  }`}>
                    JLPT {card.level}
                  </span>
                </div>
              </div>

              {/* Center: ONLY the target Kanji or Vocabulary expression in Sumi Black with fluid clamp font */}
              <div className="flex flex-col items-center justify-center my-auto py-2 text-center px-1">
                <span className="font-jp font-bold tracking-tight text-[#2B2B2B] dark:text-[#E6E1DA] text-[clamp(2.5rem,7.5vh,4.75rem)] transition-transform duration-200 leading-tight">
                  {card.expression}
                </span>
              </div>

              {/* Simple footer hints ("Tap to flip", "Swipe left/right") */}
              <div className="border-t border-[#DED7CD]/70 dark:border-[#38312B]/80 pt-2 flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-[#736B63] dark:text-[#A59E95] shrink-0">
                <span className="text-[#C84B31] dark:text-[#E88673] flex items-center gap-0.5">
                  <ArrowLeft className="w-3 h-3" /> Swipe Left (Again)
                </span>
                <span className="text-[#2B2B2B] dark:text-[#E6E1DA] font-semibold">
                  Tap to flip
                </span>
                <span className="text-[#4A6B53] dark:text-[#8BAF95] flex items-center gap-0.5">
                  Swipe Right (Good) <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ) : (
            /* ================= BACK OF CARD (Warm Washi Paper / Dark Cedar Wood) ================= */
            <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] flex flex-col justify-start p-3.5 sm:p-4 gap-3 animate-in fade-in duration-200 text-left box-border min-h-0 overflow-hidden">
              {/* Back Header: Target Word avatar, Furigana reading & Clean Listen button */}
              <div className="flex items-center justify-between border-b border-[#DED7CD]/70 dark:border-[#38312B]/80 pb-2 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="min-w-9 h-9 px-2.5 py-1 rounded-xl bg-[#FBF0EE] dark:bg-[#36221D] text-[#C84B31] dark:text-[#E88673] border border-[#F2D1CA] dark:border-[#522F26] flex items-center justify-center font-jp text-sm sm:text-base font-bold shrink-0 shadow-2xs whitespace-nowrap">
                    {card.expression}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-jp text-[clamp(1.2rem,3.2vh,1.5rem)] font-bold text-[#2B2B2B] dark:text-[#E6E1DA] tracking-wide leading-none">
                        {card.reading}
                      </span>
                      {/* Audio Button */}
                      <button
                        onClick={handlePlayReadingAudio}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold text-[#2B2B2B] dark:text-[#E6E1DA] hover:text-[#6B7F5E] dark:hover:text-[#A6C09C] bg-[#EAE4DC] hover:bg-[#DDD6CC] dark:bg-[#342D27] dark:hover:bg-[#403730] transition-colors pointer-events-auto border border-[#DED7CD]/60 dark:border-[#38312B] cursor-pointer"
                        title="Listen to pronunciation"
                        aria-label="Listen to pronunciation"
                      >
                        <Volume2 className="w-3 h-3 text-[#6B7F5E]" />
                        <span>Listen</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-[#736B63] dark:text-[#A59E95] mt-0.5">
                      Furigana / Reading (JLPT {card.level})
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-medium text-[#736B63] dark:text-[#A59E95] shrink-0">
                  Tap to flip
                </span>
              </div>

              {/* Natural Top-to-Bottom Content Flow (gap: 12px, justify-start) */}
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-start gap-3 pr-0.5">
                {/* Meaning & Verb Tag Group (Eliminating full-width box, inline pill tag) */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#736B63] dark:text-[#A59E95]">
                      English Meaning
                    </span>
                    <p className="text-[clamp(1rem,2.4vh,1.2rem)] font-bold text-[#2B2B2B] dark:text-[#E6E1DA] mt-0.5 leading-snug">
                      {card.meaning}
                    </p>
                  </div>

                  {/* Compact Inline Pill Tag for Transitive / Intransitive Verb Pairs */}
                  {card.transitivity === 'transitive' && (
                    <div className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.85rem] font-bold font-jp bg-[#EEF3F8] dark:bg-[#1E2E40] text-[#2B4C6F] dark:text-[#8CB4DE] border border-[#CAD8E6] dark:border-[#2B4C6F] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2B4C6F] dark:bg-[#8CB4DE] shrink-0" />
                      <span>他動詞 (Transitive - Takes Object)</span>
                    </div>
                  )}

                  {card.transitivity === 'intransitive' && (
                    <div className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.85rem] font-bold font-jp bg-[#F1F4EE] dark:bg-[#263123] text-[#5B7051] dark:text-[#A6C09C] border border-[#D2DDCF] dark:border-[#3B4D36] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5B7051] dark:bg-[#A6C09C] shrink-0" />
                      <span>自動詞 (Intransitive - No Object)</span>
                    </div>
                  )}

                  {card.category && !card.transitivity && card.category !== 'Transitive / Intransitive' && (
                    <div className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.85rem] font-bold font-jp bg-[#F7F4EC] dark:bg-[#332E23] text-[#8C6D3B] dark:text-[#DEC88E] border border-[#E8DFC9] dark:border-[#504734] shadow-2xs">
                      <Sparkles className="w-3 h-3 text-[#8C6D3B] dark:text-[#DEC88E] shrink-0" />
                      <span>{card.category}</span>
                    </div>
                  )}
                </div>

                {/* Compact Washitsu Component Pill Row: All Constituent Radicals & Sub-elements */}
                {decompositions.length > 0 && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#736B63] dark:text-[#A59E95]">
                      Constituent Elements
                    </span>
                    <div className="flex flex-wrap items-center" style={{ gap: '6px' }}>
                      {decompositions.map((group) => (
                        <div key={group.kanji} className="flex flex-wrap items-center" style={{ gap: '6px' }}>
                          {decompositions.length > 1 && (
                            <span className="font-jp font-bold text-xs text-[#C84B31] dark:text-[#E88673] px-1.5 py-0.5 rounded bg-[#FBF0EE] dark:bg-[#36221D] border border-[#F2D1CA]/60 dark:border-[#522F26]">
                              {group.kanji}
                            </span>
                          )}
                          {group.components.map((comp) => (
                            <span
                              key={group.kanji + '-' + comp.char}
                              className="inline-flex items-center rounded-md font-medium bg-[#EFECE6] dark:bg-[#322B25] text-[#3B322A] dark:text-[#D5CEC5] border border-[#DDD6CC] dark:border-[#423A32] shadow-2xs whitespace-nowrap"
                              style={{ padding: '3px 8px', fontSize: '0.8rem' }}
                            >
                              <strong className="font-jp font-bold mr-1 text-[#2B2B2B] dark:text-[#FAF8F5]">
                                {comp.char}
                              </strong>
                              <span>({comp.meaning})</span>
                            </span>
                          ))}
                          {decompositions.length > 1 && (
                            <span className="text-[#DDD6CC] dark:text-[#423A32] mx-0.5 last:hidden select-none">
                              ·
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compact Subtle Metadata Row: Exam Priority & Streak */}
                <div className="flex items-center gap-2.5 text-[11px] text-[#736B63] dark:text-[#A59E95] font-medium shrink-0 pt-0.5">
                  <span>Exam Priority #{card.priority}</span>
                  {streak > 0 && (
                    <>
                      <span className="opacity-40">·</span>
                      <span className="text-[#4A6B53] dark:text-[#8BAF95] font-semibold">
                        {streak} streak
                      </span>
                    </>
                  )}
                </div>

                {/* Example Sentence Section directly beneath metadata with tight padding */}
                {card.exampleSentence && (
                  <div className="shrink-0 mt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#736B63] dark:text-[#A59E95]">
                        Example Sentence
                      </span>
                      <button
                        onClick={handlePlaySentenceAudio}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-[#736B63] dark:text-[#A59E95] hover:text-[#6B7F5E] dark:hover:text-[#A6C09C] transition-colors pointer-events-auto cursor-pointer"
                        title="Play sentence audio"
                        aria-label="Play example sentence audio"
                      >
                        <Volume2 className="w-3 h-3 text-[#6B7F5E]" />
                        <span>Listen</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F5F2EC] dark:bg-[#201C18] border border-[#DED7CD] dark:border-[#38312B]">
                      <p className="font-jp text-[clamp(0.85rem,2.1vh,0.95rem)] font-medium text-[#2B2B2B] dark:text-[#E6E1DA] leading-snug">
                        {card.exampleSentence.japanese}
                      </p>
                      <p className="font-jp text-[11px] text-[#736B63] dark:text-[#A59E95] mt-0.5 leading-tight">
                        {card.exampleSentence.furigana}
                      </p>
                      <p className="text-[11px] text-[#554D46] dark:text-[#BDB6AC] mt-1 italic leading-tight">
                        "{card.exampleSentence.english}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

KanjiCard.displayName = 'KanjiCard';
