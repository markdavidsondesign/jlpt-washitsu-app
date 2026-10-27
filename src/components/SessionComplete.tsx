import React, { useEffect, useMemo } from 'react';
import { Award, RotateCcw, BookOpen, Sparkles, ArrowRight, CheckCircle2, AlertCircle, Gamepad2 } from 'lucide-react';
import { SRSStats } from '../utils/srs';
import { playCelebratoryChime } from '../utils/audio';

interface SessionCompleteProps {
  stats: SRSStats;
  batchNumber: number;
  totalCardsInMode: number;
  totalBatchCards?: number;
  firstPassCount?: number;
  retryCount?: number;
  missedCardIds?: string[];
  dueCount?: number;
  isReviewMode?: boolean;
  isMiniDeckCleared?: boolean;
  onNextBatch: () => void;
  onReviewMissed?: () => void;
  onReviewDue?: () => void;
  onRestartMode?: () => void;
  onOpenDeckOverview?: () => void;
  onStartQuiz?: () => void;
}

export const SessionComplete: React.FC<SessionCompleteProps> = ({
  stats,
  batchNumber,
  totalCardsInMode,
  totalBatchCards = 25,
  firstPassCount = 25,
  retryCount = 0,
  missedCardIds = [],
  dueCount = 0,
  isReviewMode = false,
  isMiniDeckCleared = false,
  onNextBatch,
  onReviewMissed,
  onReviewDue,
  onRestartMode,
  onOpenDeckOverview,
  onStartQuiz,
}) => {
  const isAllMastered = stats.masteredCount === stats.totalCount && stats.totalCount > 0;
  const isPerfectSet = retryCount === 0 && missedCardIds.length === 0;
  const effectiveBatchCards = Math.max(1, totalBatchCards);
  const firstPassPercentage = Math.round((firstPassCount / effectiveBatchCards) * 100);

  // Trigger celebratory audio chime and haptics on mount
  useEffect(() => {
    playCelebratoryChime();
  }, []);

  // Generate deterministic sakura petals & gold particles for the animation overlay
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 20; i++) {
      const isSakura = i % 2 === 0;
      const left = (i * 5.1 + 2.5) % 96;
      const duration = 4.2 + (i % 5) * 0.7;
      const delay = (i * 0.28) % 3.2;
      const size = isSakura ? 10 + (i % 4) * 3 : 5 + (i % 3) * 2;
      list.push({ id: i, isSakura, left, duration, delay, size });
    }
    return list;
  }, []);

  return (
    <div className="w-full max-w-[460px] mx-auto text-center py-2 sm:py-3 px-3 sm:px-4 box-border relative flex flex-col justify-center min-h-0">
      {/* Celebratory Floating Sakura Petals & Gold Dust Particles Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
        {particles.map((p) =>
          p.isSakura ? (
            <div
              key={p.id}
              className="absolute top-0 animate-sakura opacity-80"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size * 1.3}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                background: 'radial-gradient(ellipse at center, #FBCFE8 0%, #F472B6 80%)',
                borderRadius: '80% 0% 80% 0%',
                transform: 'rotate(-25deg)',
                boxShadow: '0 2px 6px rgba(244, 114, 182, 0.3)',
              }}
            />
          ) : (
            <div
              key={p.id}
              className="absolute animate-gold rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${(p.id * 7 + 10) % 90}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration * 0.6}s`,
                animationDelay: `${p.delay}s`,
                background: 'radial-gradient(circle, #F6E05E 20%, #D4AF37 90%)',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.7)',
              }}
            />
          )
        )}
      </div>

      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] shadow-xl shadow-[#332C27]/10 dark:shadow-black/50 box-border text-left relative z-10">
        {/* Celebration Header with Washitsu Seal */}
        <div className="flex items-center gap-3 sm:gap-3.5 mb-3.5">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#4A6B53] text-white flex items-center justify-center font-bold font-jp text-xl shadow-md border border-[#3E5A46] shrink-0">
            祝
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6B7F5E] dark:text-[#A6C09C]">
                {isReviewMode ? 'Review Mode Complete' : '25-Card Batch Cleared'}
              </span>
              {isPerfectSet && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-jp bg-[#FBF0EE] text-[#C84B31] border border-[#F2D1CA] dark:bg-[#36221D] dark:text-[#E88673] dark:border-[#522F26]">
                  <span>完璧</span>
                  <span>Perfect Set!</span>
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold font-jp text-[#2B2B2B] dark:text-[#E6E1DA] leading-tight mt-0.5">
              {isAllMastered
                ? '全単語習得！ (All Mastered)'
                : isReviewMode
                ? '復習セッション完了！'
                : `第 ${batchNumber + 1} 組 習得完了！`}
            </h2>
          </div>
        </div>

        {/* Perfect Set Seal Banner (Rendered if 0 cards swiped left) */}
        {isPerfectSet ? (
          <div className="mb-3 p-2.5 rounded-xl bg-[#F7F4EC] dark:bg-[#332E23] border border-[#E8DFC9] dark:border-[#504734] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C84B31] text-white flex items-center justify-center font-jp font-bold text-sm shrink-0 shadow-xs">
              完璧
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#2B2B2B] dark:text-[#E6E1DA]">
                Flawless 100% First Pass!
              </p>
              <p className="text-[#736B63] dark:text-[#A59E95] text-[11px]">
                All {effectiveBatchCards} cards mastered without needing any retries.
              </p>
            </div>
          </div>
        ) : isMiniDeckCleared ? (
          <div className="mb-3 p-2.5 rounded-xl bg-[#EDF3EF] dark:bg-[#202E24] border border-[#D1E1D6] dark:border-[#314838] flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#4A6B53] dark:text-[#8BAF95] shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-[#4A6B53] dark:text-[#8BAF95]">
                Missed Words Mastered!
              </p>
              <p className="text-[#736B63] dark:text-[#A59E95] text-[11px]">
                All previously missed cards have now reached mastery.
              </p>
            </div>
          </div>
        ) : null}

        {/* Dashboard Section 1: Accuracy Breakdown */}
        <div className="p-3 rounded-xl bg-[#F2EFE9] dark:bg-[#1E1B18]/70 border border-[#DED7CD] dark:border-[#38312B] mb-3">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-[#736B63] dark:text-[#A59E95] uppercase tracking-wider text-[10px]">
              Accuracy Breakdown
            </span>
            <span className="text-[#2B2B2B] dark:text-[#E6E1DA] font-bold">
              {firstPassPercentage}% First Pass
            </span>
          </div>

          {/* Dual Segment Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#DED7CD] dark:bg-[#38312B] overflow-hidden flex mb-2">
            <div
              style={{ width: `${firstPassPercentage}%` }}
              className="h-full bg-[#4A6B53] transition-all duration-500"
              title="First pass mastery"
            />
            <div
              style={{ width: `${100 - firstPassPercentage}%` }}
              className="h-full bg-[#C84B31] transition-all duration-500"
              title="Required retries"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD]/70 dark:border-[#38312B]">
              <span className="text-[#4A6B53] dark:text-[#8BAF95] font-medium text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B53]" />
                First Pass
              </span>
              <span className="font-bold text-[#2B2B2B] dark:text-[#E6E1DA] tabular-nums text-xs">
                {firstPassCount} / {effectiveBatchCards}
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD]/70 dark:border-[#38312B]">
              <span className="text-[#C84B31] dark:text-[#E88673] font-medium text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31]" />
                Retries Needed
              </span>
              <span className="font-bold text-[#2B2B2B] dark:text-[#E6E1DA] tabular-nums text-xs">
                {retryCount}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Section 2: Overall JLPT Mastery from LocalStorage */}
        <div className="p-3 rounded-xl bg-[#F2EFE9] dark:bg-[#1E1B18]/70 border border-[#DED7CD] dark:border-[#38312B] mb-3.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#736B63] dark:text-[#A59E95] uppercase tracking-wider text-[10px] font-semibold">
              Overall Deck Mastery
            </span>
            <span className="text-[#4A6B53] dark:text-[#8BAF95] font-bold text-xs tabular-nums">
              {stats.masteredCount} / {stats.totalCount} ({stats.masteryPercentage}%)
            </span>
          </div>

          {/* Mastered Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#DED7CD] dark:bg-[#38312B] overflow-hidden mb-2">
            <div
              style={{ width: `${Math.min(100, stats.masteryPercentage)}%` }}
              className="h-full bg-[#4A6B53] transition-all duration-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="p-1 rounded bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD]/60 dark:border-[#38312B]">
              <span className="text-[#C84B31] dark:text-[#E88673] font-bold block">
                {stats.hardCount}
              </span>
              <span className="text-[#736B63] dark:text-[#A59E95]">Level 1</span>
            </div>
            <div className="p-1 rounded bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD]/60 dark:border-[#38312B]">
              <span className="text-[#8C6D3B] dark:text-[#DEC88E] font-bold block">
                {stats.mediumCount}
              </span>
              <span className="text-[#736B63] dark:text-[#A59E95]">Level 2</span>
            </div>
            <div className="p-1 rounded bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD]/60 dark:border-[#38312B]">
              <span className="text-[#4A6B53] dark:text-[#8BAF95] font-bold block">
                {stats.masteredCount}
              </span>
              <span className="text-[#736B63] dark:text-[#A59E95]">Mastered</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Primary Action: Start Next 25 Cards in Matcha Green (#6B7F5E) */}
          <button
            onClick={onNextBatch}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#6B7F5E] hover:bg-[#5A6D4E] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>Start Next 25 Cards</span>
            <ArrowRight className="w-4 h-4 text-white/90" />
          </button>

          {/* Quick Quiz Action: 5-Word Matching Quiz */}
          {onStartQuiz && (
            <button
              onClick={onStartQuiz}
              className="w-full py-2.5 px-4 rounded-xl bg-[#F0F3ED] dark:bg-[#242F22] hover:bg-[#E5ECE0] dark:hover:bg-[#2C3B29] text-[#4A6B53] dark:text-[#A6C09C] border border-[#CAD8C5] dark:border-[#384A33] font-semibold text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Gamepad2 className="w-4 h-4 text-[#6B7F5E]" />
              <span>Practice 5-Word Matching Quiz</span>
            </button>
          )}

          {/* Secondary Action: Review Missed Words (X) in Vermilion Red (#C84B31) — Rendered ONLY if cards were swiped left */}
          {missedCardIds.length > 0 && onReviewMissed && (
            <button
              onClick={onReviewMissed}
              className="w-full py-2.5 px-4 rounded-xl bg-[#C84B31] hover:bg-[#B23E26] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <AlertCircle className="w-4 h-4 text-white/90" />
              <span>Review Missed Words ({missedCardIds.length})</span>
            </button>
          )}

          {/* Genuine Overdue Review Option:
              IF dueCount > 0: Render "Review Due Items (X)" styled as a focused review option.
              IF dueCount === 0: Show subtle "0 Reviews Due" indicator so it doesn't clutter the screen. */}
          {dueCount > 0 && onReviewDue ? (
            <button
              onClick={onReviewDue}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#F7F4EC] dark:bg-[#2B261F] hover:bg-[#EFEAD9] dark:hover:bg-[#383128] text-[#8C6D3B] dark:text-[#DEC88E] border border-[#E8DFC9] dark:border-[#504734] font-semibold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              title={`Review ${dueCount} overdue cards`}
            >
              <Sparkles className="w-4 h-4 text-[#8C6D3B] dark:text-[#DEC88E] shrink-0" />
              <span>Review Due Items ({dueCount})</span>
            </button>
          ) : (
            <div className="w-full py-1.5 px-3 rounded-lg bg-[#FAF8F5]/60 dark:bg-[#28231F]/60 border border-[#DED7CD]/50 dark:border-[#38312B]/50 flex items-center justify-center gap-1.5 text-[11px] text-[#736B63] dark:text-[#A59E95] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B53] dark:text-[#8BAF95] shrink-0" />
              <span>0 Reviews Due · Spaced Repetition Up to Date</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-0.5">
            {onRestartMode && (
              <button
                onClick={onRestartMode}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-[#DED7CD] dark:border-[#38312B] text-[#736B63] dark:text-[#A59E95] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] font-medium text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restart Batch</span>
              </button>
            )}

            {onOpenDeckOverview && (
              <button
                onClick={onOpenDeckOverview}
                className="flex-1 py-1.5 px-2.5 rounded-lg border border-[#DED7CD] dark:border-[#38312B] text-[#736B63] dark:text-[#A59E95] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] font-medium text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                <span>Browse Deck ({totalCardsInMode})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
