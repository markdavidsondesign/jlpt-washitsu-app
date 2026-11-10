import React, { useEffect, useMemo } from 'react';
import { Layers, X, Check, CheckCircle2, CheckSquare2, Square } from 'lucide-react';
import { DeckMetadata, VocabCardItem } from '../data/vocabTypes';
import { CardProgress, calculateDeckStats } from '../utils/srs';

export interface DeckChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDecks: DeckMetadata[];
  selectedDeckIds: string[];
  onToggleDeck: (deckId: string) => void;
  onSelectAllDecks: () => void;
  onDeselectAllDecks?: () => void;
  progressMap: Record<string, CardProgress>;
  masterDeck: VocabCardItem[];
}

export const DeckChooserModal: React.FC<DeckChooserModalProps> = ({
  isOpen,
  onClose,
  availableDecks,
  selectedDeckIds,
  onToggleDeck,
  onSelectAllDecks,
  onDeselectAllDecks,
  progressMap,
  masterDeck,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fallback handler for Deselect All: keep at least 1 deck selected (the first deck)
  const handleDeselectAll = () => {
    if (onDeselectAllDecks) {
      onDeselectAllDecks();
    } else if (availableDecks.length > 0) {
      // Toggle off all except the first available deck
      const firstDeckId = availableDecks[0].id;
      for (const deck of availableDecks) {
        if (deck.id !== firstDeckId && selectedDeckIds.includes(deck.id)) {
          onToggleDeck(deck.id);
        }
      }
      if (!selectedDeckIds.includes(firstDeckId)) {
        onToggleDeck(firstDeckId);
      }
    }
  };

  // Safe toggle: prevent unchecking if it is the only deck currently checked
  const handleSafeToggle = (deckId: string) => {
    if (selectedDeckIds.includes(deckId) && selectedDeckIds.length <= 1) {
      // Cannot uncheck the only remaining deck (must keep at least 1 deck selected)
      return;
    }
    onToggleDeck(deckId);
  };

  // Compute stats for all available decks
  const deckStatsList = useMemo(() => {
    return availableDecks.map((deck) => {
      const stats = calculateDeckStats(deck.id, masterDeck, progressMap);
      const totalCount = stats.totalCount || deck.cardCount;
      return {
        deck,
        masteredCount: stats.masteredCount,
        totalCount,
        masteryPercentage: stats.masteryPercentage,
      };
    });
  }, [availableDecks, masterDeck, progressMap]);

  // Aggregate active card count
  const totalActiveCards = useMemo(() => {
    return deckStatsList
      .filter(({ deck }) => selectedDeckIds.includes(deck.id))
      .reduce((sum, item) => sum + item.totalCount, 0);
  }, [deckStatsList, selectedDeckIds]);

  if (!isOpen) return null;

  const allSelected = availableDecks.length > 0 && selectedDeckIds.length === availableDecks.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-chooser-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] p-5 xs:p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDF3EF] dark:bg-[#202E24] text-[#4A6B53] dark:text-[#8BAF95] border border-[#D1E1D6] dark:border-[#314838] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-[#6B7F5E]" />
            </div>
            <div>
              <h3 id="deck-chooser-title" className="text-base font-bold text-[#2B2B2B] dark:text-[#E6E1DA] leading-tight">
                Choose Deck(s)
              </h3>
              <p className="text-xs text-[#736B63] dark:text-[#A59E95] mt-0.5 font-medium">
                Select one or more decks for your study queue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#736B63] hover:text-[#2B2B2B] dark:text-[#A59E95] dark:hover:text-[#E6E1DA] p-1.5 rounded-lg hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: Select All / Deselect All */}
        <div className="flex items-center justify-between gap-2 py-2 px-1 mb-3 border-y border-[#DED7CD]/60 dark:border-[#38312B] text-xs shrink-0">
          <span className="font-semibold text-[#736B63] dark:text-[#A59E95]">
            {selectedDeckIds.length} of {availableDecks.length} selected
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSelectAllDecks}
              disabled={allSelected}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                allSelected
                  ? 'opacity-50 cursor-not-allowed text-[#736B63] dark:text-[#A59E95]'
                  : 'text-[#4A6B53] dark:text-[#8BAF95] hover:bg-[#EDF3EF] dark:hover:bg-[#202E24]'
              }`}
            >
              <CheckSquare2 className="w-3.5 h-3.5" />
              <span>Select All</span>
            </button>
            <span className="text-[#DED7CD] dark:text-[#38312B]">|</span>
            <button
              onClick={handleDeselectAll}
              disabled={selectedDeckIds.length <= 1}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                selectedDeckIds.length <= 1
                  ? 'opacity-50 cursor-not-allowed text-[#736B63] dark:text-[#A59E95]'
                  : 'text-[#736B63] dark:text-[#A59E95] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27]'
              }`}
              title={selectedDeckIds.length <= 1 ? 'At least 1 deck must remain selected' : 'Keep only the primary deck'}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Deselect All</span>
            </button>
          </div>
        </div>

        {/* Deck List Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 min-h-0">
          {deckStatsList.map(({ deck, masteredCount, totalCount, masteryPercentage }) => {
            const isChecked = selectedDeckIds.includes(deck.id);
            const isOnlyChecked = isChecked && selectedDeckIds.length === 1;

            return (
              <div
                key={deck.id}
                onClick={() => handleSafeToggle(deck.id)}
                className={`w-full p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col gap-2 ${
                  isChecked
                    ? 'bg-white dark:bg-[#1E1B18] border-[#6B7F5E]/60 dark:border-[#6B7F5E]/80 shadow-xs ring-1 ring-[#6B7F5E]/20'
                    : 'bg-[#F5F2EC] dark:bg-[#231F1C] border-[#DED7CD] dark:border-[#38312B] hover:border-[#C2BAAF] dark:hover:border-[#524942]'
                }`}
              >
                <div className="flex items-center justify-between gap-2.5">
                  {/* Left: Custom Checkbox & Deck Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-[#6B7F5E] border-[#6B7F5E] text-white shadow-2xs'
                          : 'border-[#C2BAAF] dark:border-[#524942] bg-white dark:bg-[#28231F]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#2B2B2B] dark:text-[#E6E1DA] truncate">
                          {deck.name}
                        </span>
                        <span
                          className={`text-[11px] px-1.5 py-0.2 rounded-md font-mono font-bold shrink-0 ${
                            deck.level === 'N4'
                              ? 'bg-[#EDF3EF] dark:bg-[#202E24] text-[#4A6B53] dark:text-[#8BAF95] border border-[#D1E1D6] dark:border-[#314838]'
                              : 'bg-[#F7F4EC] dark:bg-[#332E23] text-[#8C6D3B] dark:text-[#DEC88E] border border-[#E8DFC9] dark:border-[#504734]'
                          }`}
                        >
                          {deck.level}
                        </span>
                      </div>
                      <p className="text-xs text-[#736B63] dark:text-[#A59E95] mt-0.5 line-clamp-1 font-medium">
                        {deck.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Individual Deck Progress Pill */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EDF3EF] dark:bg-[#202E24] text-[#4A6B53] dark:text-[#8BAF95] border border-[#D1E1D6] dark:border-[#314838] text-xs font-bold shrink-0"
                    title={`Progress for ${deck.name}: ${masteredCount} of ${totalCount} words mastered (${masteryPercentage}%)`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="tabular-nums">
                      {masteredCount} / {totalCount} mastered
                    </span>
                  </div>
                </div>

                {/* Progress bar visual track */}
                <div className="w-full bg-[#EAE4DC] dark:bg-[#342D27] h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#6B7F5E] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, masteryPercentage))}%` }}
                  />
                </div>

                {/* Single deck warning note */}
                {isOnlyChecked && (
                  <p className="text-[11px] text-[#A59E95] dark:text-[#736B63] italic">
                    (Currently active · at least 1 deck must remain selected)
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Area */}
        <div className="pt-3.5 mt-3 border-t border-[#DED7CD] dark:border-[#38312B] flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-medium text-[#736B63] dark:text-[#A59E95] truncate">
            <span className="font-bold text-[#2B2B2B] dark:text-[#E6E1DA] tabular-nums">
              {totalActiveCards}
            </span>{' '}
            active cards in queue
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#6B7F5E] hover:bg-[#5A6D4E] rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
