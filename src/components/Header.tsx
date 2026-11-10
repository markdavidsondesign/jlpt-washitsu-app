import React, { useMemo } from 'react';
import { RotateCcw, Sun, Moon, BookOpen, CheckCircle2, BookMarked, RefreshCw, Gamepad2, Layers } from 'lucide-react';
import { SRSStats } from '../utils/srs';
import { StudyMode, DeckMetadata } from '../data/vocabTypes';
import { PWAInstallButton } from './PWAInstallButton';

export type AppPrimaryMode = 'learn' | 'review' | 'quiz';

interface HeaderProps {
  stats: SRSStats;
  primaryMode: AppPrimaryMode;
  onSelectPrimaryMode: (mode: AppPrimaryMode) => void;
  selectedDeckIds?: string[];
  availableDecks?: DeckMetadata[];
  onOpenDeckChooser?: () => void;
  currentMode?: StudyMode;
  onSelectMode?: (mode: StudyMode) => void;
  syncStatusMessage?: string;
  batchNumber?: number;
  batchTotal?: number;
  batchRemaining?: number;
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
  selectedDeckIds = ['elzup_n4', 'elzup_n5'],
  availableDecks = [],
  onOpenDeckChooser,
  currentMode = 'all',
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
      <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-[#C84B31] text-white flex items-center justify-center font-bold text-sm xs:text-base shadow-2xs font-jp shrink-0">
        語
      </div>

      {/* Primary Mode Tabs: Learn Mode vs. Review Mode vs. Matching Quiz */}
      <div className="flex items-center p-0.5 rounded-lg bg-[#F2EFE9] dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B] min-w-0 shrink-1">
        <button
          onClick={() => onSelectPrimaryMode('learn')}
          className={`flex items-center gap-1.5 px-2 xs:px-2.5 py-1 text-[13px] font-bold rounded-md transition-all cursor-pointer min-w-0 shrink-1 ${
            primaryMode === 'learn'
              ? 'bg-[#6B7F5E] text-white shadow-2xs'
              : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
          }`}
          title="Learn Mode (25-card interleaved batches)"
        >
          <BookMarked className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Learn</span>
        </button>

        <button
          onClick={() => onSelectPrimaryMode('review')}
          className={`flex items-center gap-1.5 px-2 xs:px-2.5 py-1 text-[13px] font-bold rounded-md transition-all cursor-pointer min-w-0 shrink-1 ${
            primaryMode === 'review'
              ? 'bg-[#6B7F5E] text-white shadow-2xs'
              : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
          }`}
          title="Review Mode (SRS urgency sorted previously studied words)"
        >
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Review</span>
          {dueReviewCount > 0 && (
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0 ${
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
          className={`flex items-center gap-1.5 px-2 xs:px-2.5 py-1 text-[13px] font-bold rounded-md transition-all cursor-pointer min-w-0 shrink-1 ${
            primaryMode === 'quiz'
              ? 'bg-[#6B7F5E] text-white shadow-2xs'
              : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
          }`}
          title="Matching Quiz (Duolingo-style 5-word rapid matching)"
        >
          <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Quiz</span>
        </button>
      </div>
    </div>
  );

  // Computed label for "Choose Decks" button
  const deckButtonLabel = useMemo(() => {
    if (availableDecks.length > 0 && selectedDeckIds.length === availableDecks.length) {
      return `All Decks (${selectedDeckIds.length})`;
    }
    if (selectedDeckIds.length === 0) {
      return 'Choose Decks';
    }
    const names = selectedDeckIds.map((id) => {
      const match = availableDecks.find((d) => d.id === id);
      if (match) return match.level || match.name;
      if (id.includes('n4')) return 'N4';
      if (id.includes('n5')) return 'N5';
      return id;
    });
    return names.join(' + ');
  }, [selectedDeckIds, availableDecks]);

  // Reusable Choose Decks Button
  const ChooseDecksButton = (
    <button
      onClick={onOpenDeckChooser}
      className="flex items-center gap-1.5 px-2.5 xs:px-3 py-1 text-[13px] font-bold rounded-lg bg-[#F2EFE9] dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B] text-[#2B2B2B] dark:text-[#E6E1DA] hover:bg-[#EAE4DC] dark:hover:bg-[#28231F] hover:border-[#C2BAAF] dark:hover:border-[#524942] transition-all cursor-pointer shrink-0 shadow-2xs"
      title="Choose active decks (click to configure)"
      aria-label="Choose Decks"
    >
      <Layers className="w-3.5 h-3.5 text-[#6B7F5E] dark:text-[#8BAF95] shrink-0" />
      <span className="truncate max-w-[130px] sm:max-w-none">{deckButtonLabel}</span>
    </button>
  );

  // Reusable Mastered Stats Pill
  const StatsPill = (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EDF3EF] dark:bg-[#202E24] text-[#4A6B53] dark:text-[#8BAF95] border border-[#D1E1D6] dark:border-[#314838] text-[13px] font-bold shrink-0"
      title="Total cards mastered in this study mode"
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B53] dark:text-[#8BAF95] shrink-0" />
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
    <header
      className="w-full max-w-full flex-shrink-0 z-30 bg-[#FAF8F5] dark:bg-[#1F1D1B] border-b border-[#DED7CD] dark:border-[#2C2724] transition-colors py-2 px-3 xs:py-2.5 xs:px-4 box-border"
      style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
    >
      {/* =========================================================================
          RESPONSIVE MOBILE LAYOUT (< 480px / max-xs)
          Two rows with comfortable vertical spacing to eliminate clutter & overlap:
          - Row 1: Logo ('語') + Mode Switcher ('Learn'/'Review'/'Quiz') on left, Settings/Theme/Reset on right
          - Row 2: Level Filter tabs ('All'/'N4'/'N5') and SRS Stats Pill ('0/1396')
         ========================================================================= */}
      <div className="w-full flex flex-col gap-3 xs:hidden box-border max-w-full">
        {/* Top Row: Left logo & mode switcher, Right settings/theme icons */}
        <div className="w-full flex items-center justify-between gap-1.5 min-w-0 box-border">
          {BrandAndModeSwitcher}
          {ActionIcons}
        </div>

        {/* Bottom Row: Choose Decks button and SRS Stats Pill with 12px vertical separation */}
        <div className="w-full flex items-center justify-between gap-2 min-w-0 box-border pt-2 border-t border-[#DED7CD]/50 dark:border-[#2C2724]">
          {ChooseDecksButton}
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

        {/* Center: Choose Decks Button */}
        {ChooseDecksButton}

        {/* Right: Mastered Stats Pill & Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {StatsPill}
          {ActionIcons}
        </div>
      </div>
    </header>
  );
};
