import React from 'react';
import { RotateCcw, Sun, Moon, BookOpen, CheckCircle2, BookMarked, RefreshCw, Gamepad2 } from 'lucide-react';
import { SRSStats } from '../utils/srs';
import { StudyMode } from '../data/vocabTypes';
import { PWAInstallButton } from './PWAInstallButton';

export type AppPrimaryMode = 'learn' | 'review' | 'quiz';

interface HeaderProps {
  stats: SRSStats;
  primaryMode: AppPrimaryMode;
  onSelectPrimaryMode: (mode: AppPrimaryMode) => void;
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  syncStatusMessage: string;
  batchNumber: number;
  batchTotal: number;
  batchRemaining: number;
  dueReviewCount?: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onRequestReset: () => void;
  onToggleDeckList: () => void;
  isDeckListOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  primaryMode,
  onSelectPrimaryMode,
  currentMode,
  onSelectMode,
  dueReviewCount = 0,
  isDarkMode,
  onToggleDarkMode,
  onRequestReset,
  onToggleDeckList,
  isDeckListOpen,
}) => {
  // Reusable Brand & Mode Switcher component
  const BrandAndModeSwitcher = (
    <div className="flex items-center gap-1 xs:gap-1.5 min-w-0 flex-shrink-1">
      {/* Brand Icon: Kanji '語' */}
      <div className="w-6.5 h-6.5 xs:w-7.5 xs:h-7.5 rounded-lg bg-[#C84B31] text-white flex items-center justify-center font-bold text-xs xs:text-sm shadow-2xs font-jp shrink-0">
        語
      </div>

      {/* Primary Mode Tabs: Learn Mode vs. Review Mode vs. Matching Quiz */}
      <div className="flex items-center p-0.5 rounded-lg bg-[#F2EFE9] dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B] min-w-0 shrink-1">
        <button
          onClick={() => onSelectPrimaryMode('learn')}
          className={`flex items-center gap-1 px-1.5 xs:px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer min-w-0 shrink-1 ${
            primaryMode === 'learn'
              ? 'bg-[#6B7F5E] text-white shadow-2xs'
              : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
          }`}
          title="Learn Mode (25-card interleaved batches)"
        >
          <BookMarked className="w-3 h-3 shrink-0" />
          <span className="truncate">Learn</span>
        </button>

        <button
          onClick={() => onSelectPrimaryMode('review')}
          className={`flex items-center gap-1 px-1.5 xs:px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer min-w-0 shrink-1 ${
            primaryMode === 'review'
              ? 'bg-[#6B7F5E] text-white shadow-2xs'
              : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
          }`}
          title="Review Mode (SRS urgency sorted previously studied words)"
        >
          <RefreshCw className="w-3 h-3 shrink-0" />
          <span className="truncate">Review</span>
          {dueReviewCount > 0 && (
            <span
              className={`text-[9px] px-1 py-0 rounded-full font-mono shrink-0 ${
                primaryMode === 'review'
                  ? 'bg-white/25 text-white'
                  : 'bg-[#C84B31] text-white'
              }`}
            >
              {dueReviewCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectPrimaryMode('quiz')}
          className={`flex items-center gap-1 px-1.5 xs:px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer min-w-0 shrink-1 ${
            primaryMode === 'quiz'
              ? 'bg-[#6B7F5E] text-white shadow-2xs'
              : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
          }`}
          title="Matching Quiz (Duolingo-style 5-word rapid matching)"
        >
          <Gamepad2 className="w-3 h-3 shrink-0" />
          <span className="truncate">Quiz</span>
        </button>
      </div>
    </div>
  );

  // Reusable Level Sub-filter tabs (All | N4 | N5)
  const LevelFilterTabs = (
    <div className="flex items-center p-0.5 rounded-lg bg-[#F2EFE9] dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B] shrink-0">
      <button
        onClick={() => onSelectMode('all')}
        className={`px-2 xs:px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer shrink-0 ${
          currentMode === 'all'
            ? 'bg-[#4A6B53] text-white shadow-2xs'
            : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onSelectMode('n4')}
        className={`px-2 xs:px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer shrink-0 ${
          currentMode === 'n4'
            ? 'bg-[#4A6B53] text-white shadow-2xs'
            : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
        }`}
      >
        N4
      </button>
      <button
        onClick={() => onSelectMode('n5')}
        className={`px-2 xs:px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer shrink-0 ${
          currentMode === 'n5'
            ? 'bg-[#4A6B53] text-white shadow-2xs'
            : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
        }`}
      >
        N5
      </button>
    </div>
  );

  // Reusable Mastered Stats Pill
  const StatsPill = (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EDF3EF] dark:bg-[#202E24] text-[#4A6B53] dark:text-[#8BAF95] border border-[#D1E1D6] dark:border-[#314838] text-[11px] font-bold shrink-0"
      title="Total cards mastered in this study mode"
    >
      <CheckCircle2 className="w-3 h-3 text-[#4A6B53] dark:text-[#8BAF95] shrink-0" />
      <span className="tabular-nums">
        {stats.masteredCount}/{stats.totalCount}
      </span>
    </div>
  );

  // Reusable Action Icons (Install App, Deck browse, Theme toggle, Reset)
  const ActionIcons = (
    <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
      {/* PWA Install Button (Suppresses in standalone mode) */}
      <PWAInstallButton />

      {/* Deck Browse */}
      <button
        onClick={onToggleDeckList}
        className={`p-1 xs:p-1.5 rounded-md text-[#736B63] dark:text-[#A59E95] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] transition-colors cursor-pointer shrink-0 ${
          isDeckListOpen
            ? 'bg-[#F0F3ED] dark:bg-[#263123] text-[#6B7F5E] dark:text-[#A6C09C] ring-1 ring-[#6B7F5E]/60'
            : ''
        }`}
        title="View all cards in deck"
        aria-label="View all cards in deck"
      >
        <BookOpen className="w-3.5 h-3.5" />
      </button>

      {/* Theme Toggle */}
      <button
        onClick={onToggleDarkMode}
        className="p-1 xs:p-1.5 rounded-md text-[#736B63] dark:text-[#A59E95] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] transition-colors cursor-pointer shrink-0"
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun className="w-3.5 h-3.5 text-[#DEC88E]" /> : <Moon className="w-3.5 h-3.5" />}
      </button>

      {/* Reset Progress */}
      <button
        onClick={onRequestReset}
        className="p-1 xs:p-1.5 rounded-md text-[#736B63] dark:text-[#A59E95] hover:text-[#C84B31] dark:hover:text-[#E88673] hover:bg-[#FBF0EE] dark:hover:bg-[#36221D]/50 transition-colors cursor-pointer shrink-0"
        title="Reset progress"
        aria-label="Reset Progress"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <header className="w-full max-w-full flex-shrink-0 z-30 bg-[#FAF8F5]/95 dark:bg-[#28231F]/95 backdrop-blur-md border-b border-[#DED7CD] dark:border-[#38312B] transition-colors py-1.5 px-3 xs:py-0 xs:px-4 xs:h-12 box-border">
      {/* =========================================================================
          RESPONSIVE MOBILE LAYOUT (< 480px / max-xs)
          Two compact rows to eliminate horizontal header overflow:
          - Row 1: Logo ('語') + Mode Switcher ('Learn'/'Review') on left, Settings/Theme/Reset on right
          - Row 2: Level Filter tabs ('All'/'N4'/'N5') and SRS Stats Pill ('0/1396') justified across width
         ========================================================================= */}
      <div className="w-full flex flex-col gap-1.5 xs:hidden box-border max-w-full">
        {/* Top Row: Left logo & mode switcher, Right settings/theme icons */}
        <div className="w-full flex items-center justify-between gap-1.5 min-w-0 box-border">
          {BrandAndModeSwitcher}
          {ActionIcons}
        </div>

        {/* Bottom Row: Level Filter tabs and SRS Stats Pill */}
        <div className="w-full flex items-center justify-between gap-2 min-w-0 box-border pt-1 border-t border-[#DED7CD]/40 dark:border-[#38312B]/40">
          {LevelFilterTabs}
          {StatsPill}
        </div>
      </div>

      {/* =========================================================================
          DESKTOP VIEWPORT (>= 480px / xs)
          Sleek single-row header bar with proportional spacing
         ========================================================================= */}
      <div className="hidden xs:flex max-w-5xl mx-auto w-full items-center justify-between gap-2 h-full box-border">
        {/* Left: Brand & Primary Mode Selector */}
        {BrandAndModeSwitcher}

        {/* Center: Level Sub-filter (All | N4 | N5) */}
        {LevelFilterTabs}

        {/* Right: Mastered Stats Pill & Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {StatsPill}
          {ActionIcons}
        </div>
      </div>
    </header>
  );
};
