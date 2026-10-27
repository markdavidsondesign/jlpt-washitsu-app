import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { VocabCardItem } from '../data/vocabTypes';
import { playMatchSuccessChime, playMatchErrorTone, playCelebratoryChime } from '../utils/audio';
import { speakJapanese } from '../utils/speech';
import { ArrowLeft, RotateCcw, CheckCircle2, Clock, Zap, Target, BookOpen } from 'lucide-react';

interface MatchingQuizProps {
  deck: VocabCardItem[];
  dueCardIds?: string[];
  unmasteredCardIds?: string[];
  onExit: () => void;
  onWordMatched?: (cardId: string) => void;
}

interface TileItem {
  id: string; // unique tile identifier
  cardId: string;
  side: 'japanese' | 'english';
  text: string;
  subText?: string;
  status: 'idle' | 'selected' | 'matched' | 'error' | 'solved';
  isMatched: boolean;
  disabled: boolean;
}

const ROUNDS_TOTAL = 5;
const WORDS_PER_ROUND = 5;
const TOTAL_WORDS = ROUNDS_TOTAL * WORDS_PER_ROUND; // 25 words

export const MatchingQuiz: React.FC<MatchingQuizProps> = ({
  deck,
  dueCardIds = [],
  unmasteredCardIds = [],
  onExit,
  onWordMatched,
}) => {
  // Stable refs to prevent parent re-renders/prop updates from triggering mid-round board refilling
  const deckRef = useRef(deck);
  deckRef.current = deck;
  const dueCardIdsRef = useRef(dueCardIds);
  dueCardIdsRef.current = dueCardIds;
  const unmasteredCardIdsRef = useRef(unmasteredCardIds);
  unmasteredCardIdsRef.current = unmasteredCardIds;

  // Quiz session pool state (25 distinct cards)
  const [sessionCards, setSessionCards] = useState<VocabCardItem[]>([]);
  const [roundIndex, setRoundIndex] = useState<number>(0); // 0 to 4
  const [roundMatchedCount, setRoundMatchedCount] = useState<number>(0); // Matched pairs in current 5-pair round (0 to 5)
  const [selectedJpId, setSelectedJpId] = useState<string | null>(null);
  const [selectedEnId, setSelectedEnId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false); // Lock taps during evaluation/animation

  // Session stats
  const [correctAttempts, setCorrectAttempts] = useState<number>(0);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [sessionEndTime, setSessionEndTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  // Furigana toggle state with localStorage persistence
  const [showFurigana, setShowFurigana] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jlpt_quiz_furigana');
      if (stored !== null) return stored === 'true';
    }
    return true; // Default ON
  });

  const toggleFurigana = useCallback(() => {
    setShowFurigana((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('jlpt_quiz_furigana', String(next));
      }
      return next;
    });
  }, []);

  // Tiles for current round: 5 Japanese tiles, 5 English tiles strictly capped at 5 pairs
  const [jpTiles, setJpTiles] = useState<TileItem[]>([]);
  const [enTiles, setEnTiles] = useState<TileItem[]>([]);

  // Setup 25-card pool prioritized by due items -> unmastered -> general deck
  // This initializes or resets the full 25-word quiz session. NEVER called mid-round.
  const setupSessionPool = useCallback(() => {
    const activeDeck = deckRef.current;
    if (activeDeck.length === 0) return;

    const dueSet = new Set(dueCardIdsRef.current);
    const unmasteredSet = new Set(unmasteredCardIdsRef.current);

    const dueItems: VocabCardItem[] = [];
    const unmasteredItems: VocabCardItem[] = [];
    const otherItems: VocabCardItem[] = [];

    // Categorize
    for (const card of activeDeck) {
      if (dueSet.has(card.id)) {
        dueItems.push(card);
      } else if (unmasteredSet.has(card.id)) {
        unmasteredItems.push(card);
      } else {
        otherItems.push(card);
      }
    }

    // Shuffle helper
    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const combinedPool = [
      ...shuffle(dueItems),
      ...shuffle(unmasteredItems),
      ...shuffle(otherItems),
    ];

    // Pick top 25 unique items (or loop if deck < 25)
    let selected: VocabCardItem[] = [];
    if (combinedPool.length >= TOTAL_WORDS) {
      selected = combinedPool.slice(0, TOTAL_WORDS);
    } else {
      while (selected.length < TOTAL_WORDS && combinedPool.length > 0) {
        selected = [...selected, ...shuffle(combinedPool)].slice(0, TOTAL_WORDS);
      }
    }

    setSessionCards(selected);
    setRoundIndex(0);
    setRoundMatchedCount(0);
    setCorrectAttempts(0);
    setWrongAttempts(0);
    setSessionStartTime(Date.now());
    setSessionEndTime(null);
    setElapsedSeconds(0);
    setIsQuizComplete(false);
  }, []); // Intentionally empty dependency array so mid-round parent prop changes never trigger refilling!

  // Initialize session pool ONCE on mount
  useEffect(() => {
    setupSessionPool();
  }, [setupSessionPool]);

  // Elapsed timer ticker
  useEffect(() => {
    if (isQuizComplete || sessionEndTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isQuizComplete, sessionStartTime, sessionEndTime]);

  // Build 10 tiles for the current 5-word round
  useEffect(() => {
    if (sessionCards.length === 0 || roundIndex >= ROUNDS_TOTAL) return;

    const startIndex = roundIndex * WORDS_PER_ROUND;
    const currentRoundCards = sessionCards.slice(startIndex, startIndex + WORDS_PER_ROUND);

    if (currentRoundCards.length === 0) return;

    // Japanese column tiles
    const rawJp: TileItem[] = currentRoundCards.map((card) => {
      const hasKanji = /[\u4e00-\u9faf]/.test(card.expression);
      return {
        id: `jp_${card.id}`,
        cardId: card.id,
        side: 'japanese',
        text: card.expression,
        subText: hasKanji ? card.reading : undefined,
        status: 'idle',
        isMatched: false,
        disabled: false,
      };
    });

    // English column tiles (shuffled independently)
    const rawEn: TileItem[] = currentRoundCards.map((card) => {
      // Clean, concise meaning: take first gloss and strip parentheses for mobile readability
      const firstGloss = card.meaning.split(/[;,]/)[0].trim();
      const cleanMeaning = firstGloss.replace(/\(.*?\)/g, '').trim() || firstGloss;
      return {
        id: `en_${card.id}`,
        cardId: card.id,
        side: 'english',
        text: cleanMeaning,
        subText: undefined,
        status: 'idle',
        isMatched: false,
        disabled: false,
      };
    });

    // Shuffle both columns independently
    const shuffleTiles = (arr: TileItem[]): TileItem[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    setJpTiles(shuffleTiles(rawJp));
    setEnTiles(shuffleTiles(rawEn));
    setRoundMatchedCount(0);
    setSelectedJpId(null);
    setSelectedEnId(null);
    setIsLocked(false);
  }, [sessionCards, roundIndex]);

  // Evaluate matching pair
  const evaluateMatch = useCallback(
    (jpTileId: string, enTileId: string) => {
      setIsLocked(true);

      const jpTile = jpTiles.find((t) => t.id === jpTileId);
      const enTile = enTiles.find((t) => t.id === enTileId);

      if (!jpTile || !enTile) {
        setIsLocked(false);
        return;
      }

      const isMatch = jpTile.cardId === enTile.cardId;

      if (isMatch) {
        // Correct Match!
        playMatchSuccessChime();
        setCorrectAttempts((prev) => prev + 1);

        // TTS Pronunciation for Japanese word
        const matchedCard = sessionCards.find((c) => c.id === jpTile.cardId);
        if (matchedCard) {
          speakJapanese(matchedCard.reading);
          if (onWordMatched) {
            onWordMatched(matchedCard.id);
          }
        }

        // Pulse green match animation without replenishing or moving tiles
        setJpTiles((prev) =>
          prev.map((t) => (t.id === jpTileId ? { ...t, status: 'matched', isMatched: true } : t))
        );
        setEnTiles((prev) =>
          prev.map((t) => (t.id === enTileId ? { ...t, status: 'matched', isMatched: true } : t))
        );

        // After 350ms, mark both as 'solved' (disabled, reduced opacity, fixed grid positions)
        setTimeout(() => {
          setJpTiles((prev) =>
            prev.map((t) =>
              t.id === jpTileId
                ? { ...t, status: 'solved', isMatched: true, disabled: true }
                : t
            )
          );
          setEnTiles((prev) =>
            prev.map((t) =>
              t.id === enTileId
                ? { ...t, status: 'solved', isMatched: true, disabled: true }
                : t
            )
          );
          setSelectedJpId(null);
          setSelectedEnId(null);
          setIsLocked(false);

          // Fixed 5-Pair Round Progression: Count matched pairs in current round
          setRoundMatchedCount((prevCount) => {
            const nextCount = prevCount + 1;
            // ONLY load a new set of 5 pairs and update the board when roundMatchedCount === 5
            if (nextCount === WORDS_PER_ROUND) {
              setTimeout(() => {
                if (roundIndex + 1 >= ROUNDS_TOTAL) {
                  // Session complete!
                  setSessionEndTime(Date.now());
                  setIsQuizComplete(true);
                  playCelebratoryChime();
                } else {
                  setRoundIndex((prev) => prev + 1);
                }
              }, 600);
            }
            return nextCount;
          });
        }, 350);
      } else {
        // Incorrect Match!
        playMatchErrorTone();
        setWrongAttempts((prev) => prev + 1);

        // Shake red animation
        setJpTiles((prev) =>
          prev.map((t) => (t.id === jpTileId ? { ...t, status: 'error' } : t))
        );
        setEnTiles((prev) =>
          prev.map((t) => (t.id === enTileId ? { ...t, status: 'error' } : t))
        );

        // After 400ms, auto-deselect both tiles back to idle
        setTimeout(() => {
          setJpTiles((prev) =>
            prev.map((t) => (t.id === jpTileId ? { ...t, status: 'idle' } : t))
          );
          setEnTiles((prev) =>
            prev.map((t) => (t.id === enTileId ? { ...t, status: 'idle' } : t))
          );
          setSelectedJpId(null);
          setSelectedEnId(null);
          setIsLocked(false);
        }, 400);
      }
    },
    [jpTiles, enTiles, sessionCards, onWordMatched, roundIndex]
  );

  // Two-way interactive tap selection logic
  const handleTileClick = useCallback(
    (tile: TileItem) => {
      if (isLocked || tile.status === 'solved' || tile.status === 'matched' || tile.isMatched || tile.disabled) return;

      if (tile.side === 'japanese') {
        // Tapping already-selected Japanese tile -> Deselect
        if (selectedJpId === tile.id) {
          setSelectedJpId(null);
          setJpTiles((prev) =>
            prev.map((t) => (t.id === tile.id ? { ...t, status: 'idle' } : t))
          );
          return;
        }

        // Tapping different tile in Japanese column -> Shift selection immediately
        setSelectedJpId(tile.id);
        setJpTiles((prev) =>
          prev.map((t) =>
            t.status === 'solved' || t.disabled || t.isMatched
              ? t
              : t.id === tile.id
              ? { ...t, status: 'selected' }
              : { ...t, status: 'idle' }
          )
        );

        // If English tile already selected -> Evaluate match!
        if (selectedEnId) {
          evaluateMatch(tile.id, selectedEnId);
        }
      } else {
        // Side is English
        // Tapping already-selected English tile -> Deselect
        if (selectedEnId === tile.id) {
          setSelectedEnId(null);
          setEnTiles((prev) =>
            prev.map((t) => (t.id === tile.id ? { ...t, status: 'idle' } : t))
          );
          return;
        }

        // Tapping different tile in English column -> Shift selection immediately
        setSelectedEnId(tile.id);
        setEnTiles((prev) =>
          prev.map((t) =>
            t.status === 'solved' || t.disabled || t.isMatched
              ? t
              : t.id === tile.id
              ? { ...t, status: 'selected' }
              : { ...t, status: 'idle' }
          )
        );

        // If Japanese tile already selected -> Evaluate match!
        if (selectedJpId) {
          evaluateMatch(selectedJpId, tile.id);
        }
      }
    },
    [isLocked, selectedJpId, selectedEnId, evaluateMatch]
  );

  // Total words solved so far in this quiz session
  const totalSolvedCount = roundIndex * WORDS_PER_ROUND + roundMatchedCount;
  const accuracyPercentage = Math.round(
    (correctAttempts / Math.max(1, correctAttempts + wrongAttempts)) * 100
  );

  // Format time (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col justify-between overflow-hidden box-border px-3 py-2 sm:px-4 sm:py-3 select-none">
      {/* Quiz Header Bar: Navigation, Furigana Toggle, Round Indicator, Live Match Tracker */}
      <div className="w-full max-w-[440px] mx-auto flex-shrink-0 flex items-center justify-between gap-1.5 sm:gap-2 mb-2 pb-1.5 border-b border-[#DED7CD]/70 dark:border-[#38312B]/70">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onExit}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] transition-colors cursor-pointer shrink-0"
            title="Return to Flashcards"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Exit</span>
          </button>

          {/* Compact Furigana Toggle Button */}
          <button
            onClick={toggleFurigana}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border shrink-0 ${
              showFurigana
                ? 'bg-[#F0F3ED] dark:bg-[#242F22] text-[#4A6B53] dark:text-[#8BAF95] border-[#CAD8C5] dark:border-[#384A33] shadow-2xs'
                : 'bg-transparent text-[#736B63] dark:text-[#A59E95] border-[#DED7CD] dark:border-[#38312B] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
            }`}
            title={showFurigana ? 'Furigana ON (click to hide readings)' : 'Furigana OFF (click to test raw kanji)'}
            aria-label="Toggle Furigana reading hints"
          >
            <span className="font-jp text-xs">あ/漢</span>
            <span className="text-[10px] font-mono tracking-tight">{showFurigana ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Round Progress Indicators (5 segments) */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {Array.from({ length: ROUNDS_TOTAL }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx < roundIndex
                    ? 'w-3 sm:w-4 bg-[#6B7F5E]'
                    : idx === roundIndex
                    ? 'w-5 sm:w-6 bg-[#6B7F5E] shadow-xs'
                    : 'w-1.5 sm:w-2 bg-[#DED7CD] dark:bg-[#38312B]'
                }`}
                title={`Round ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-[#736B63] dark:text-[#A59E95] tabular-nums ml-0.5">
            {roundIndex + 1}/{ROUNDS_TOTAL}
          </span>
        </div>

        {/* Live Match & Timer HUD */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-medium text-[#736B63] dark:text-[#A59E95] tabular-nums shrink-0">
          <div className="flex items-center gap-1 text-[#4A6B53] dark:text-[#8BAF95] font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>{totalSolvedCount}/{TOTAL_WORDS}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Strict Zero-Scroll Layout (10 Tiles Total) Centered in Viewport */}
      {!isQuizComplete ? (
        <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden my-auto py-1">
          {/* Card-Sized Outer Shell matching primary flashcard container width & washitsu aesthetic */}
          <div className="w-full max-w-[440px] mx-auto rounded-2xl sm:rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] shadow-lg shadow-[#332C27]/8 dark:shadow-black/40 p-3.5 sm:p-4.5 flex flex-col justify-center box-border">
            {/* Subtle Column Headers */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-2 px-1 text-[10px] uppercase tracking-wider font-bold text-[#736B63] dark:text-[#A59E95] shrink-0">
              <span className="text-left">Japanese Target</span>
              <span className="text-left">English Meaning</span>
            </div>

            {/* 2-Column Match Grid: Exactly 5 rows - tightly grouped with uniform 10px / 12px gaps */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full justify-center content-center">
              {/* Left Column: Japanese Cards */}
              <div className="flex flex-col gap-2.5 sm:gap-3 justify-center">
                {jpTiles.map((tile) => {
                  const isSelected = tile.status === 'selected';
                  const isMatched = tile.status === 'matched' || tile.isMatched;
                  const isError = tile.status === 'error';
                  const isSolved = tile.status === 'solved' || tile.disabled;

                  return (
                    <button
                      key={tile.id}
                      onClick={() => handleTileClick(tile)}
                      disabled={tile.disabled || isSolved || isMatched || isLocked}
                      className={`min-h-[50px] w-full px-3 py-2 sm:py-2.5 rounded-xl text-left border flex flex-col justify-center transition-all duration-150 relative overflow-hidden select-none shrink-0 ${
                        isSolved
                          ? 'opacity-30 pointer-events-none border-[#DED7CD]/60 dark:border-[#38312B]/60 bg-[#EFECE6]/50 dark:bg-[#24201D]/50 text-[#736B63] dark:text-[#A59E95] grayscale cursor-default'
                          : isError
                          ? 'animate-shake border-[#C84B31] dark:border-[#E88673] ring-2 ring-[#C84B31]/50 bg-[#FBF0EE] dark:bg-[#36221D] text-[#C84B31] dark:text-[#E88673] cursor-pointer'
                          : isMatched
                          ? 'animate-pulse-match border-[#4A6B53] dark:border-[#8BAF95] ring-2 ring-[#4A6B53]/60 bg-[#EDF3EF] dark:bg-[#202E24] text-[#4A6B53] dark:text-[#8BAF95] cursor-pointer'
                          : isSelected
                          ? 'border-[#6B7F5E] dark:border-[#8FA680] ring-2 ring-[#6B7F5E]/70 bg-[#F0F3ED] dark:bg-[#242F22] text-[#2B2B2B] dark:text-[#E6E1DA] shadow-sm shadow-[#6B7F5E]/20 cursor-pointer active:scale-[0.98]'
                          : 'border-[#DED7CD] dark:border-[#38312B] bg-white dark:bg-[#1E1B18] hover:border-[#6B7F5E]/60 hover:bg-[#F6F3EC] dark:hover:bg-[#2E2824] text-[#2B2B2B] dark:text-[#E6E1DA] shadow-2xs cursor-pointer active:scale-[0.98]'
                      }`}
                    >
                      {showFurigana && tile.subText && (
                        <span className="text-[10px] sm:text-[11px] leading-tight font-jp text-[#736B63] dark:text-[#A59E95] truncate">
                          {tile.subText}
                        </span>
                      )}
                      <span className="font-jp font-bold text-base sm:text-lg leading-tight tracking-tight truncate">
                        {tile.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: English Cards (Randomly Shuffled) */}
              <div className="flex flex-col gap-2.5 sm:gap-3 justify-center">
                {enTiles.map((tile) => {
                  const isSelected = tile.status === 'selected';
                  const isMatched = tile.status === 'matched' || tile.isMatched;
                  const isError = tile.status === 'error';
                  const isSolved = tile.status === 'solved' || tile.disabled;

                  return (
                    <button
                      key={tile.id}
                      onClick={() => handleTileClick(tile)}
                      disabled={tile.disabled || isSolved || isMatched || isLocked}
                      className={`min-h-[50px] w-full px-3 py-2 sm:py-2.5 rounded-xl text-left border flex flex-col justify-center transition-all duration-150 relative overflow-hidden select-none shrink-0 ${
                        isSolved
                          ? 'opacity-30 pointer-events-none border-[#DED7CD]/60 dark:border-[#38312B]/60 bg-[#EFECE6]/50 dark:bg-[#24201D]/50 text-[#736B63] dark:text-[#A59E95] grayscale cursor-default'
                          : isError
                          ? 'animate-shake border-[#C84B31] dark:border-[#E88673] ring-2 ring-[#C84B31]/50 bg-[#FBF0EE] dark:bg-[#36221D] text-[#C84B31] dark:text-[#E88673] cursor-pointer'
                          : isMatched
                          ? 'animate-pulse-match border-[#4A6B53] dark:border-[#8BAF95] ring-2 ring-[#4A6B53]/60 bg-[#EDF3EF] dark:bg-[#202E24] text-[#4A6B53] dark:text-[#8BAF95] cursor-pointer'
                          : isSelected
                          ? 'border-[#6B7F5E] dark:border-[#8FA680] ring-2 ring-[#6B7F5E]/70 bg-[#F0F3ED] dark:bg-[#242F22] text-[#2B2B2B] dark:text-[#E6E1DA] shadow-sm shadow-[#6B7F5E]/20 cursor-pointer active:scale-[0.98]'
                          : 'border-[#DED7CD] dark:border-[#38312B] bg-white dark:bg-[#1E1B18] hover:border-[#6B7F5E]/60 hover:bg-[#F6F3EC] dark:hover:bg-[#2E2824] text-[#2B2B2B] dark:text-[#E6E1DA] shadow-2xs cursor-pointer active:scale-[0.98]'
                      }`}
                    >
                      <span className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2">
                        {tile.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Washitsu Session Completion Overlay */
        <div className="flex-1 min-h-0 w-full max-w-[440px] mx-auto flex flex-col items-center justify-center py-3 px-2 text-center overflow-y-auto my-auto">
          {/* Card-Sized Shell for Completion View */}
          <div className="w-full rounded-2xl sm:rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] shadow-lg shadow-[#332C27]/8 dark:shadow-black/40 p-4 sm:p-6 flex flex-col items-center justify-center">
            {/* Completion Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#EDF3EF] dark:bg-[#202E24] border border-[#D1E1D6] dark:border-[#314838] text-[#4A6B53] dark:text-[#8BAF95] flex items-center justify-center mb-3 shadow-sm">
              <Zap className="w-7 h-7 text-[#6B7F5E]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-jp text-[#2B2B2B] dark:text-[#E6E1DA]">
              Quiz Session Complete!
            </h2>
            <p className="text-xs text-[#736B63] dark:text-[#A59E95] mt-1 mb-4">
              You successfully matched all 25 JLPT vocabulary items across 5 rounds.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 w-full mb-5">
              <div className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B]">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#736B63] dark:text-[#A59E95] font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#6B7F5E]" />
                  <span>Time</span>
                </div>
                <span className="text-base sm:text-lg font-bold font-mono text-[#2B2B2B] dark:text-[#E6E1DA]">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B]">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#736B63] dark:text-[#A59E95] font-medium mb-1">
                  <Target className="w-3.5 h-3.5 text-[#C84B31]" />
                  <span>Accuracy</span>
                </div>
                <span className="text-base sm:text-lg font-bold font-mono text-[#2B2B2B] dark:text-[#E6E1DA]">
                  {accuracyPercentage}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B]">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#736B63] dark:text-[#A59E95] font-medium mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B53]" />
                  <span>Matched</span>
                </div>
                <span className="text-base sm:text-lg font-bold font-mono text-[#2B2B2B] dark:text-[#E6E1DA]">
                  25/25
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={setupSessionPool}
                className="w-full py-2.5 px-4 rounded-xl bg-[#6B7F5E] hover:bg-[#5A6D4E] text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Another Quiz (25 Words)</span>
              </button>

              <button
                onClick={onExit}
                className="w-full py-2.5 px-4 rounded-xl border border-[#DED7CD] dark:border-[#38312B] bg-white dark:bg-[#1E1B18] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] text-[#2B2B2B] dark:text-[#E6E1DA] font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <BookOpen className="w-4 h-4 text-[#736B63] dark:text-[#A59E95]" />
                <span>Return to Flashcards</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation Tip */}
      {!isQuizComplete && (
        <div className="w-full max-w-[440px] mx-auto pt-1.5 flex items-center justify-between text-[10px] text-[#736B63] dark:text-[#A59E95] font-medium shrink-0">
          <span>Tap Japanese & English in any order</span>
          <span className="tabular-nums">
            Accuracy {accuracyPercentage}% ({correctAttempts}/{correctAttempts + wrongAttempts})
          </span>
        </div>
      )}
    </div>
  );
};
