import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { VocabCardItem, StudyMode } from './data/vocabTypes';
import { fetchUnifiedDeck, rankAndEnrichVocab } from './data/vocabFetcher';
import { FALLBACK_VOCAB_DATA } from './data/fallbackVocab';
import {
  CardProgress,
  SRSAction,
  SRSStats,
  calculateSRSStats,
  initializeDefaultProgress,
  loadProgressFromStorage,
  saveProgressToStorage,
  saveProgress as srsSaveProgress,
  clearProgressFromStorage,
  processSRSAction,
  filterDeckByMode,
  getBatchQueue,
  getReviewModeQueue,
  getDueReviewCards,
  mergeProgressWithDeck,
  getNextQueue,
  SRS_STORAGE_KEY,
} from './utils/srs';
import { Header, AppPrimaryMode } from './components/Header';
import { KanjiCard, KanjiCardRef } from './components/KanjiCard';
import { SRSControls } from './components/SRSControls';
import { SessionComplete } from './components/SessionComplete';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { DeckOverviewModal } from './components/DeckOverviewModal';
import { MatchingQuiz } from './components/MatchingQuiz';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';

const BATCH_SIZE = 25;

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('jlpt_kanji_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jlpt_kanji_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jlpt_kanji_theme', 'light');
    }
  }, [isDarkMode]);

  // Master deck state & fetching initialized with normalized canonical cards
  const [masterDeck, setMasterDeck] = useState<VocabCardItem[]>(() => rankAndEnrichVocab(FALLBACK_VOCAB_DATA));
  const [, setIsLoadingDeck] = useState<boolean>(true);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string>('Syncing JLPT N5 + N4...');

  // Navigation mode states: Primary Mode ('learn' | 'review') and Level Filter ('all' | 'n4' | 'n5')
  const [primaryMode, setPrimaryMode] = useState<AppPrimaryMode>('learn');
  const [studyMode, setStudyMode] = useState<StudyMode>('all');

  // Daily batch index for Learn Mode (0 = batch 1, 1 = batch 2, etc.)
  const [batchIndex, setBatchIndex] = useState<number>(0);

  // Card flip state
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Modals state
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isDeckListOpen, setIsDeckListOpen] = useState<boolean>(false);

  // Ref to active KanjiCard component
  const cardRef = useRef<KanjiCardRef>(null);

  // Track previous studyMode and batchIndex to avoid resetting batch on deck re-fetch
  const prevStudyModeRef = useRef<StudyMode>(studyMode);
  const prevBatchIndexRef = useRef<number>(batchIndex);

  // Total flips counter tracked and persisted to LocalStorage under jlpt_app_progress_v1
  const totalFlipsRef = useRef<number>(
    (() => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const item = window.localStorage.getItem(SRS_STORAGE_KEY);
          if (item) {
            const parsed = JSON.parse(item);
            return typeof parsed.totalFlips === 'number' ? parsed.totalFlips : 0;
          }
        }
      } catch {}
      return 0;
    })()
  );

  // Filtered deck for active study mode (all / n4 / n5)
  const modeDeck = useMemo(() => {
    return filterDeckByMode(masterDeck, studyMode);
  }, [masterDeck, studyMode]);

  const modeCardIds = useMemo(() => {
    return modeDeck.map((c) => c.id);
  }, [modeDeck]);

  // SRS Progress Map state (persisted to localStorage under jlpt_app_progress_v1)
  const [progressMap, setProgressMap] = useState<Record<string, CardProgress>>(() => {
    const initialCards = rankAndEnrichVocab(FALLBACK_VOCAB_DATA);
    const stored = loadProgressFromStorage();
    if (stored && Object.keys(stored).length > 0) {
      return mergeProgressWithDeck(initialCards, stored);
    }
    return initializeDefaultProgress(initialCards.map((c) => c.id));
  });

  // =========================================================================
  // BATCH & SESSION QUEUE MANAGEMENT
  // =========================================================================
  // Learn Mode State:
  const [learnQueue, setLearnQueue] = useState<string[]>(() => {
    const initialCards = rankAndEnrichVocab(FALLBACK_VOCAB_DATA);
    return getBatchQueue(initialCards, progressMap, BATCH_SIZE, 0);
  });
  const [learnActiveBatchIds, setLearnActiveBatchIds] = useState<string[]>(() => {
    const initialCards = rankAndEnrichVocab(FALLBACK_VOCAB_DATA);
    return getBatchQueue(initialCards, progressMap, BATCH_SIZE, 0);
  });
  const [learnMasteredIds, setLearnMasteredIds] = useState<Set<string>>(new Set());
  const [learnMissedIds, setLearnMissedIds] = useState<Set<string>>(new Set());
  const [isReviewingMissed, setIsReviewingMissed] = useState<boolean>(false);
  const [isMiniDeckCleared, setIsMiniDeckCleared] = useState<boolean>(false);

  // Review Mode State:
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [reviewActiveBatchIds, setReviewActiveBatchIds] = useState<string[]>([]);
  const [reviewMasteredIds, setReviewMasteredIds] = useState<Set<string>>(new Set());
  const [reviewMissedIds, setReviewMissedIds] = useState<Set<string>>(new Set());

  // Cards currently due for spaced repetition review across modeDeck
  const dueReviewCards = useMemo(() => {
    return getDueReviewCards(modeDeck, progressMap);
  }, [modeDeck, progressMap]);

  // Memoized Quiz ID arrays
  const quizDueCardIds = useMemo(() => {
    return dueReviewCards.map((c) => c.id);
  }, [dueReviewCards]);

  const quizUnmasteredCardIds = useMemo(() => {
    return modeDeck.filter((c) => !progressMap[c.id]?.mastered).map((c) => c.id);
  }, [modeDeck, progressMap]);

  // Active session variables based on current primary mode ('learn' vs 'review')
  const sessionQueue = primaryMode === 'learn' ? learnQueue : reviewQueue;
  const activeBatchIds = primaryMode === 'learn' ? learnActiveBatchIds : reviewActiveBatchIds;
  const sessionMasteredIds = primaryMode === 'learn' ? learnMasteredIds : reviewMasteredIds;
  const sessionMissedIds = primaryMode === 'learn' ? learnMissedIds : reviewMissedIds;

  // Centralized save progress function wrapped in try/catch to protect storage integrity
  const saveProgress = useCallback(
    (
      updatedMap: Record<string, CardProgress>,
      updatedStats?: SRSStats,
      flips?: number
    ) => {
      try {
        const currentStats =
          updatedStats || calculateSRSStats(modeCardIds, updatedMap, sessionQueue);
        const totalFlips = typeof flips === 'number' ? flips : totalFlipsRef.current;
        saveProgressToStorage(updatedMap, currentStats, totalFlips);
      } catch (err) {
        console.warn('Failed to save progress in App:', err);
      }
    },
    [modeCardIds, sessionQueue]
  );

  // Fetch unified N5 + N4 word lists on mount & merge with saved LocalStorage state
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingDeck(true);
      try {
        const result = await fetchUnifiedDeck();
        if (isMounted) {
          setMasterDeck(result.items);
          setSyncStatusMessage(result.statusMessage);

          // Update progress map: merge saved LocalStorage states with fetched JSON cards using string ID conversion
          let mergedProgress: Record<string, CardProgress> = {};
          setProgressMap((prev) => {
            const stored = loadProgressFromStorage() || prev;
            mergedProgress = mergeProgressWithDeck(result.items, stored);
            const currentStats = calculateSRSStats(result.items.map((i) => i.id), mergedProgress, sessionQueue);
            saveProgressToStorage(mergedProgress, currentStats, totalFlipsRef.current);
            return mergedProgress;
          });

          // Initialize active learn batch queue with newly loaded deck and merged progress
          const filtered = filterDeckByMode(result.items, studyMode);
          const initialBatch = getBatchQueue(filtered, mergedProgress, BATCH_SIZE, 0);
          setLearnQueue(initialBatch);
          setLearnActiveBatchIds(initialBatch);
          setLearnMasteredIds(new Set());
          setLearnMissedIds(new Set());
        }
      } catch (err) {
        console.warn('Failed to load unified deck:', err);
        if (isMounted) {
          setSyncStatusMessage('Offline High-Frequency Deck');
        }
      } finally {
        if (isMounted) {
          setIsLoadingDeck(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update learn batch queue when studyMode (All/N4/N5) or batchIndex genuinely changes
  useEffect(() => {
    if (modeDeck.length > 0 && primaryMode === 'learn' && !isReviewingMissed) {
      const isModeOrIndexChange =
        prevStudyModeRef.current !== studyMode || prevBatchIndexRef.current !== batchIndex;
      prevStudyModeRef.current = studyMode;
      prevBatchIndexRef.current = batchIndex;

      if (isModeOrIndexChange) {
        const newBatch = getBatchQueue(modeDeck, progressMap, BATCH_SIZE, batchIndex);
        setLearnQueue(newBatch);
        setLearnActiveBatchIds(newBatch);
        setLearnMasteredIds(new Set());
        setLearnMissedIds(new Set());
        setIsFlipped(false);
        setIsMiniDeckCleared(false);
      }
    }
  }, [studyMode, batchIndex, modeDeck, primaryMode, isReviewingMissed, progressMap]);

  // Current active card
  const currentCardId = sessionQueue[0] || null;
  const currentCard: VocabCardItem | undefined = useMemo(() => {
    if (!currentCardId) return undefined;
    return masterDeck.find((c) => String(c.id) === String(currentCardId));
  }, [currentCardId, masterDeck]);

  // Current card progress
  const currentCardProgress: CardProgress = useMemo(() => {
    if (!currentCardId) return { level: 1, srsLevel: 1, reviewsCount: 0, streak: 0, lastReviewedAt: 0, mastered: false };
    const cardKey = String(currentCardId);
    return progressMap[cardKey] || progressMap[currentCardId] || { level: 1, srsLevel: 1, reviewsCount: 0, streak: 0, lastReviewedAt: 0, mastered: false };
  }, [currentCardId, progressMap]);

  // Derived SRS Stats for current mode
  const stats = useMemo(() => {
    return calculateSRSStats(modeCardIds, progressMap, sessionQueue);
  }, [modeCardIds, progressMap, sessionQueue]);

  // =========================================================================
  // PRIMARY MODE SWITCHING (Learn Mode vs. Review Mode)
  // Allows seamless toggling back to Learn Mode without resetting active batch progress!
  // =========================================================================
  const handleSelectPrimaryMode = useCallback((mode: AppPrimaryMode) => {
    if (mode === primaryMode) return;
    setPrimaryMode(mode);
    setIsFlipped(false);

    if (mode === 'review') {
      const reviewBatch = getReviewModeQueue(modeDeck, progressMap, BATCH_SIZE);
      setReviewQueue(reviewBatch);
      setReviewActiveBatchIds(reviewBatch);
      setReviewMasteredIds(new Set());
      setReviewMissedIds(new Set());
    }
  }, [primaryMode, modeDeck, progressMap]);

  // Sub-filter change handler (All, N4, N5)
  const handleSelectMode = useCallback((newMode: StudyMode) => {
    setStudyMode(newMode);
    setBatchIndex(0);
    setIsFlipped(false);
    setIsReviewingMissed(false);
    setIsMiniDeckCleared(false);

    if (primaryMode === 'review') {
      const filtered = filterDeckByMode(masterDeck, newMode);
      const reviewBatch = getReviewModeQueue(filtered, progressMap, BATCH_SIZE);
      setReviewQueue(reviewBatch);
      setReviewActiveBatchIds(reviewBatch);
      setReviewMasteredIds(new Set());
      setReviewMissedIds(new Set());
    }
  }, [primaryMode, masterDeck, progressMap]);

  // Flip handler: toggles flip & automatically triggers centralized saveProgress
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      totalFlipsRef.current += 1;
      saveProgress(progressMap, stats, totalFlipsRef.current);
      return next;
    });
  }, [progressMap, stats, saveProgress]);

  // =========================================================================
  // MASTERED-BASED 25-CARD BATCH COMPLETION LOGIC
  // - Batch completes ONLY when all unique cards in the active set reach "Mastered"
  // - Cards swiped left ("Again") stay in the cycling queue until answered correctly
  // - Cards swiped left are tracked in sessionMissedIds for post-batch review
  // - Saves complete SRS metadata on every action
  // =========================================================================
  const handleSRSAction = useCallback((action: SRSAction) => {
    if (!currentCardId) return;

    // Process SRS level, streak, and review history
    const { updatedProgressMap } = processSRSAction(
      currentCardId,
      action,
      sessionQueue,
      progressMap
    );

    // Call centralized saveProgress on every card swipe
    const newStats = calculateSRSStats(modeCardIds, updatedProgressMap, sessionQueue);
    saveProgress(updatedProgressMap, newStats, totalFlipsRef.current);
    setProgressMap(updatedProgressMap);
    setIsFlipped(false);

    if (action === 'again') {
      // Swiped Left ("Again"): Needs Review
      // 1. Flag card for targeted post-batch review
      if (primaryMode === 'learn') {
        setLearnMissedIds((prev) => new Set(prev).add(currentCardId));
      } else {
        setReviewMissedIds((prev) => new Set(prev).add(currentCardId));
      }

      // 2. Keep card in active cycling queue until answered correctly
      const nextQueue = getNextQueue(sessionQueue, currentCardId, 'again');
      if (primaryMode === 'learn') {
        setLearnQueue(nextQueue);
      } else {
        setReviewQueue(nextQueue);
      }
    } else {
      // Swiped Right ("Good" / "Easy"): Reached Mastered for this session!
      // 1. Mark card as mastered in active batch and persist
      if (primaryMode === 'learn') {
        setLearnMasteredIds((prev) => new Set(prev).add(currentCardId));
      } else {
        setReviewMasteredIds((prev) => new Set(prev).add(currentCardId));
      }

      // 2. Remove card from the active cycling queue
      const nextQueue = sessionQueue.filter((id) => id !== currentCardId);
      if (primaryMode === 'learn') {
        setLearnQueue(nextQueue);
      } else {
        setReviewQueue(nextQueue);
      }
    }
  }, [currentCardId, sessionQueue, progressMap, modeCardIds, primaryMode, saveProgress]);

  // Next Batch Action: pulls next 25 prioritized cards from SRS queue
  const handleNextBatch = useCallback(() => {
    if (primaryMode === 'learn') {
      const nextIndex = batchIndex + 1;
      setBatchIndex(nextIndex);
      const newBatch = getBatchQueue(modeDeck, progressMap, BATCH_SIZE, nextIndex);
      setLearnQueue(newBatch);
      setLearnActiveBatchIds(newBatch);
      setLearnMasteredIds(new Set());
      setLearnMissedIds(new Set());
      setIsReviewingMissed(false);
      setIsMiniDeckCleared(false);
    } else {
      const newReviewBatch = getReviewModeQueue(modeDeck, progressMap, BATCH_SIZE);
      setReviewQueue(newReviewBatch);
      setReviewActiveBatchIds(newReviewBatch);
      setReviewMasteredIds(new Set());
      setReviewMissedIds(new Set());
    }
    setIsFlipped(false);
  }, [primaryMode, batchIndex, modeDeck, progressMap]);

  // Review Missed Words Action: creates a temporary mini-deck containing strictly the missed cards
  const handleReviewMissedWords = useCallback(() => {
    const missedList = Array.from(sessionMissedIds);
    if (missedList.length === 0) return;

    if (primaryMode === 'learn') {
      setIsReviewingMissed(true);
      setLearnActiveBatchIds(missedList);
      setLearnQueue([...missedList]);
      setLearnMasteredIds(new Set());
      setLearnMissedIds(new Set());
      setIsMiniDeckCleared(true);
    } else {
      setReviewActiveBatchIds(missedList);
      setReviewQueue([...missedList]);
      setReviewMasteredIds(new Set());
      setReviewMissedIds(new Set());
    }
    setIsFlipped(false);
  }, [sessionMissedIds, primaryMode]);

  // Review Due Items handler: strictly reviews genuine overdue cards
  const handleReviewDue = useCallback(() => {
    const dueCards = getDueReviewCards(modeDeck, progressMap);
    if (dueCards.length === 0) return;
    const targetQueue = dueCards.slice(0, BATCH_SIZE).map((c) => c.id);
    if (primaryMode === 'learn') {
      setLearnActiveBatchIds(targetQueue);
      setLearnQueue(targetQueue);
      setLearnMasteredIds(new Set());
      setLearnMissedIds(new Set());
    } else {
      setReviewActiveBatchIds(targetQueue);
      setReviewQueue(targetQueue);
      setReviewMasteredIds(new Set());
      setReviewMissedIds(new Set());
    }
    setIsFlipped(false);
  }, [modeDeck, progressMap, primaryMode]);

  // Restart current batch from beginning
  const handleRestartMode = useCallback(() => {
    if (primaryMode === 'learn') {
      setBatchIndex(0);
      const firstBatch = getBatchQueue(modeDeck, progressMap, BATCH_SIZE, 0);
      setLearnQueue(firstBatch);
      setLearnActiveBatchIds(firstBatch);
      setLearnMasteredIds(new Set());
      setLearnMissedIds(new Set());
      setIsReviewingMissed(false);
      setIsMiniDeckCleared(false);
    } else {
      const reviewBatch = getReviewModeQueue(modeDeck, progressMap, BATCH_SIZE);
      setReviewQueue(reviewBatch);
      setReviewActiveBatchIds(reviewBatch);
      setReviewMasteredIds(new Set());
      setReviewMissedIds(new Set());
    }
    setIsFlipped(false);
  }, [primaryMode, modeDeck, progressMap]);

  // Reset Progress handler
  const handleConfirmReset = useCallback(() => {
    clearProgressFromStorage();
    const fresh = initializeDefaultProgress(masterDeck.map((c) => c.id));
    const freshStats = calculateSRSStats(masterDeck.map((c) => c.id), fresh, []);
    totalFlipsRef.current = 0;
    saveProgressToStorage(fresh, freshStats, 0);
    setProgressMap(fresh);
    setBatchIndex(0);
    const resetBatch = getBatchQueue(modeDeck, fresh, BATCH_SIZE, 0);
    setLearnQueue(resetBatch);
    setLearnActiveBatchIds(resetBatch);
    setLearnMasteredIds(new Set());
    setLearnMissedIds(new Set());
    setReviewQueue([]);
    setReviewActiveBatchIds([]);
    setReviewMasteredIds(new Set());
    setReviewMissedIds(new Set());
    setIsReviewingMissed(false);
    setIsMiniDeckCleared(false);
    setIsFlipped(false);
  }, [masterDeck, modeDeck]);

  // Select card directly from deck overview
  const handleSelectCard = useCallback((cardId: string) => {
    if (primaryMode === 'learn') {
      setLearnQueue((prev) => [cardId, ...prev.filter((id) => id !== cardId)]);
    } else {
      setReviewQueue((prev) => [cardId, ...prev.filter((id) => id !== cardId)]);
    }
    setIsFlipped(false);
  }, [primaryMode]);

  // Matching Quiz Word Matched Handler (advances review count & streak)
  const handleQuizWordMatched = useCallback((cardId: string) => {
    setProgressMap((prev) => {
      const current = prev[cardId] || {
        level: 1,
        srsLevel: 1,
        reviewsCount: 0,
        streak: 0,
        lastReviewedAt: 0,
        mastered: false,
      };
      const updatedCard: CardProgress = {
        ...current,
        reviewsCount: current.reviewsCount + 1,
        streak: current.streak + 1,
        lastReviewedAt: Date.now(),
        mastered: current.streak >= 2 ? true : current.mastered,
      };
      const updatedMap = {
        ...prev,
        [cardId]: updatedCard,
      };
      saveProgress(updatedMap);
      return updatedMap;
    });
  }, [saveProgress]);

  // Arrow Key & Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isResetModalOpen || isDeckListOpen || primaryMode === 'quiz') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (cardRef.current) {
          cardRef.current.swipeLeft();
        } else {
          handleSRSAction('again');
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (cardRef.current) {
          cardRef.current.swipeRight();
        } else {
          const action: SRSAction = currentCardProgress.level >= 2 ? 'easy' : 'good';
          handleSRSAction(action);
        }
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        if (cardRef.current) {
          cardRef.current.flip();
        } else {
          handleFlip();
        }
      } else if (e.key === '1') {
        e.preventDefault();
        if (cardRef.current) {
          cardRef.current.swipeLeft();
        } else {
          handleSRSAction('again');
        }
      } else if (e.key === '2' || e.key === '3') {
        e.preventDefault();
        if (cardRef.current) {
          cardRef.current.swipeRight();
        } else {
          handleSRSAction(e.key === '3' ? 'easy' : 'good');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleSRSAction, isResetModalOpen, isDeckListOpen, currentCardProgress.level]);

  // Accuracy metrics for the active batch
  const totalBatchCount = activeBatchIds.length || BATCH_SIZE;
  const retryCount = sessionMissedIds.size;
  const firstPassCount = Math.max(0, totalBatchCount - retryCount);
  const isBatchComplete = sessionQueue.length === 0 && activeBatchIds.length > 0;
  const isReviewModeEmpty = primaryMode === 'review' && activeBatchIds.length === 0;

  return (
    <div className="h-full h-[100dvh] w-full max-w-full overflow-hidden box-border bg-[#F2EFE9] dark:bg-[#1E1B18] text-[#2B2B2B] dark:text-[#E6E1DA] flex flex-col transition-colors selection:bg-[#6B7F5E]/20 selection:text-[#6B7F5E]">
      {/* Row 1: Top Navigation / Header (compact padding, ~40px–50px max, flex-shrink: 0) */}
      <Header
        stats={stats}
        primaryMode={primaryMode}
        onSelectPrimaryMode={handleSelectPrimaryMode}
        currentMode={studyMode}
        onSelectMode={handleSelectMode}
        syncStatusMessage={syncStatusMessage}
        batchNumber={batchIndex}
        batchTotal={Math.ceil(modeDeck.length / BATCH_SIZE)}
        batchRemaining={sessionQueue.length}
        dueReviewCount={dueReviewCards.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onRequestReset={() => setIsResetModalOpen(true)}
        onToggleDeckList={() => setIsDeckListOpen((prev) => !prev)}
        isDeckListOpen={isDeckListOpen}
      />

      {/* Row 2: Center Card Container or Matching Quiz Module */}
      <main className="flex-1 min-h-0 w-full flex flex-col items-center justify-center px-2 py-1 sm:px-4 sm:py-2 overflow-hidden box-border">
        {primaryMode === 'quiz' ? (
          <MatchingQuiz
            deck={modeDeck}
            dueCardIds={quizDueCardIds}
            unmasteredCardIds={quizUnmasteredCardIds}
            onExit={() => handleSelectPrimaryMode('learn')}
            onWordMatched={handleQuizWordMatched}
          />
        ) : sessionQueue.length > 0 && currentCard ? (
          <div className="w-full h-full max-w-[420px] max-h-[560px] mx-auto flex flex-col items-center justify-center min-h-0 box-border">
            {/* Session Progress Meta: Mastery-based tracking */}
            <div className="w-[90%] max-w-[420px] flex-shrink-0 flex items-center justify-between text-[11px] text-[#736B63] dark:text-[#A59E95] mb-1 px-1 box-border font-medium">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6B7F5E]" />
                <span>
                  {primaryMode === 'review'
                    ? 'Review Mode'
                    : isReviewingMissed
                    ? 'Missed Words Review'
                    : `Batch #${batchIndex + 1}`}
                  {' · '}
                  Mastered {sessionMasteredIds.size} / {totalBatchCount}
                </span>
              </span>
              <span className="tabular-nums">
                {sessionQueue.length} in queue
              </span>
            </div>

            {/* Adaptive Flashcard Component (Width 90%, Max 420px, Max Height 560px, Aspect 3/4) */}
            <div className="flex-1 min-h-0 w-full flex items-center justify-center">
              <KanjiCard
                ref={cardRef}
                card={currentCard}
                level={currentCardProgress.level}
                streak={currentCardProgress.streak}
                isFlipped={isFlipped}
                onFlip={handleFlip}
                onSwipe={handleSRSAction}
                isModalOpen={isResetModalOpen || isDeckListOpen}
              />
            </div>
          </div>
        ) : isReviewModeEmpty ? (
          /* Empty Review Mode State */
          <div className="w-full max-w-[420px] mx-auto text-center p-6 sm:p-7 rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] shadow-lg shadow-[#332C27]/5 box-border">
            <div className="w-12 h-12 rounded-2xl bg-[#EDF3EF] dark:bg-[#202E24] text-[#4A6B53] dark:text-[#8BAF95] flex items-center justify-center mx-auto mb-3 shadow-2xs border border-[#D1E1D6] dark:border-[#314838]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-jp text-[#2B2B2B] dark:text-[#E6E1DA]">
              No Cards Currently Due for Review
            </h3>
            <p className="text-xs text-[#736B63] dark:text-[#A59E95] mt-1.5 leading-relaxed">
              {stats.masteredCount + stats.mediumCount > 0
                ? 'All studied cards are currently up to date in their spaced repetition intervals!'
                : 'No cards have been studied yet. Complete a 25-card batch in Learn Mode first!'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
              <button
                onClick={() => handleSelectPrimaryMode('learn')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#6B7F5E] hover:bg-[#5A6D4E] text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Switch to Learn Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleSelectPrimaryMode('quiz')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[#CAD8C5] dark:border-[#384A33] bg-[#F0F3ED] dark:bg-[#242F22] text-[#4A6B53] dark:text-[#A6C09C] text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Play Matching Quiz</span>
              </button>
            </div>
          </div>
        ) : isBatchComplete ? (
          /* Washitsu-Themed Session Completion View */
          <div className="w-full h-full overflow-y-auto flex items-center justify-center p-2">
            <SessionComplete
              stats={stats}
              batchNumber={batchIndex}
              totalCardsInMode={modeDeck.length}
              totalBatchCards={totalBatchCount}
              firstPassCount={firstPassCount}
              retryCount={retryCount}
              missedCardIds={Array.from(sessionMissedIds)}
              dueCount={dueReviewCards.length}
              isReviewMode={primaryMode === 'review'}
              isMiniDeckCleared={isMiniDeckCleared}
              onNextBatch={handleNextBatch}
              onReviewMissed={sessionMissedIds.size > 0 ? handleReviewMissedWords : undefined}
              onReviewDue={dueReviewCards.length > 0 ? handleReviewDue : undefined}
              onRestartMode={handleRestartMode}
              onOpenDeckOverview={() => setIsDeckListOpen(true)}
              onStartQuiz={() => handleSelectPrimaryMode('quiz')}
            />
          </div>
        ) : null}
      </main>

      {/* Row 3: Bottom Action Buttons / Controls (hidden in quiz mode for zero-scroll viewport space) */}
      {primaryMode !== 'quiz' && (
        <div className="w-full flex-shrink-0 h-auto max-h-[60px] py-1.5 sm:py-2 px-4 flex items-center justify-center border-t border-[#DED7CD] dark:border-[#38312B] bg-[#FAF8F5]/95 dark:bg-[#28231F]/95 z-20">
          {sessionQueue.length > 0 && currentCard ? (
            <SRSControls
              isFlipped={isFlipped}
              onFlip={handleFlip}
              onSelectAction={(action) => {
                if (action === 'again') {
                  if (cardRef.current) {
                    cardRef.current.swipeLeft();
                  } else {
                    handleSRSAction('again');
                  }
                } else {
                  if (cardRef.current) {
                    cardRef.current.swipeRight();
                  } else {
                    handleSRSAction(action);
                  }
                }
              }}
            />
          ) : (
            <p className="font-medium text-[11px] text-[#736B63] dark:text-[#A59E95] text-center truncate">
              JLPT N4 Study · 和室 Leitner Spaced Repetition · Frequency Ranked
            </p>
          )}
        </div>
      )}

      {/* Modals */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <DeckOverviewModal
        isOpen={isDeckListOpen}
        onClose={() => setIsDeckListOpen(false)}
        cards={modeDeck}
        progressMap={progressMap}
        onSelectCard={handleSelectCard}
      />
    </div>
  );
}
