import React, { useState } from 'react';
import { X, Volume2, ChevronRight, Search, Sparkles } from 'lucide-react';
import { VocabCardItem, JLPTLevel } from '../data/vocabTypes';
import { CardProgress, SRSLevel } from '../utils/srs';
import { speakJapanese } from '../utils/speech';

interface DeckOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: VocabCardItem[];
  progressMap: Record<string, CardProgress>;
  onSelectCard: (cardId: string) => void;
}

export const DeckOverviewModal: React.FC<DeckOverviewModalProps> = ({
  isOpen,
  onClose,
  cards,
  progressMap,
  onSelectCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | '1' | '2' | '3'>('all');
  const [filterJLPT, setFilterJLPT] = useState<'all' | 'N4' | 'N5'>('all');

  if (!isOpen) return null;

  const filteredCards = cards.filter((card) => {
    // JLPT level filter
    if (filterJLPT !== 'all' && card.level !== filterJLPT) return false;

    // SRS level filter
    if (filterLevel !== 'all') {
      const level = progressMap[card.id]?.level ?? 1;
      if (level !== Number(filterLevel)) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchExpr = card.expression.toLowerCase().includes(q);
      const matchReading = card.reading.toLowerCase().includes(q);
      const matchMeaning = card.meaning.toLowerCase().includes(q);
      const matchCategory = (card.category || '').toLowerCase().includes(q);
      if (!matchExpr && !matchReading && !matchMeaning && !matchCategory) return false;
    }

    return true;
  });

  const levelColorMap: Record<SRSLevel, { badge: string; dot: string; label: string }> = {
    1: {
      badge: 'bg-[#FBF0EE] text-[#C84B31] dark:bg-[#36221D] dark:text-[#E88673] border-[#F2D1CA] dark:border-[#522F26]',
      dot: 'bg-[#C84B31]',
      label: 'L1 · Hard',
    },
    2: {
      badge: 'bg-[#F7F4EC] text-[#8C6D3B] dark:bg-[#332E23] dark:text-[#DEC88E] border-[#E8DFC9] dark:border-[#504734]',
      dot: 'bg-[#8C6D3B]',
      label: 'L2 · Medium',
    },
    3: {
      badge: 'bg-[#EDF3EF] text-[#4A6B53] dark:bg-[#202E24] dark:text-[#8BAF95] border-[#D1E1D6] dark:border-[#314838]',
      dot: 'bg-[#4A6B53]',
      label: 'L3 · Mastered',
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        className="w-full max-w-2xl sm:max-w-3xl max-h-[88vh] rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#DED7CD] dark:border-[#38312B] flex items-center justify-between">
          <div>
            <h2 id="deck-modal-title" className="text-base sm:text-lg font-bold font-jp text-[#2B2B2B] dark:text-[#E6E1DA]">
              JLPT Master Deck ({cards.length} Words)
            </h2>
            <p className="text-xs text-[#736B63] dark:text-[#A59E95]">
              Browse frequency-sorted vocabulary and check individual Leitner SRS levels
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#736B63] hover:text-[#2B2B2B] dark:text-[#A59E95] dark:hover:text-[#E6E1DA] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] transition-colors"
            aria-label="Close deck list"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#F2EFE9]/60 dark:bg-[#1E1B18]/50 border-b border-[#DED7CD] dark:border-[#38312B]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#736B63] dark:text-[#A59E95] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Kanji, Hiragana reading, or English meaning..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#FAF8F5] dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B] text-[#2B2B2B] dark:text-[#E6E1DA] placeholder:text-[#A59E95] focus:outline-none focus:ring-2 focus:ring-[#6B7F5E]/40 focus:border-[#6B7F5E]"
            />
          </div>
        </div>

        {/* Filter Bar - Large enough for all contents to be completely visible without scrolling */}
        <div className="px-4 sm:px-6 py-3 bg-[#F2EFE9] dark:bg-[#1E1B18]/70 border-b border-[#DED7CD] dark:border-[#38312B] flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap w-full min-h-[52px] overflow-visible">
          {/* JLPT Level filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-[#736B63] dark:text-[#A59E95] mr-1">Level:</span>
            {(['all', 'N4', 'N5'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterJLPT(lvl)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterJLPT === lvl
                    ? 'bg-[#6B7F5E] text-white shadow-xs'
                    : 'bg-[#FAF8F5] dark:bg-[#28231F] text-[#736B63] dark:text-[#A59E95] border border-[#DED7CD] dark:border-[#38312B] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27]'
                }`}
              >
                {lvl === 'all' ? 'All' : lvl}
              </button>
            ))}
          </div>

          {/* SRS Level filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-[#736B63] dark:text-[#A59E95] mr-1">SRS:</span>
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                filterLevel === 'all'
                  ? 'bg-[#2B2B2B] text-white dark:bg-[#E6E1DA] dark:text-[#2B2B2B]'
                  : 'text-[#736B63] dark:text-[#A59E95] hover:text-[#2B2B2B] dark:hover:text-[#E6E1DA]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterLevel('1')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                filterLevel === '1'
                  ? 'bg-[#C84B31] text-white'
                  : 'text-[#C84B31] hover:bg-[#FBF0EE] dark:hover:bg-[#36221D]'
              }`}
            >
              L1
            </button>
            <button
              onClick={() => setFilterLevel('2')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                filterLevel === '2'
                  ? 'bg-[#8C6D3B] text-white'
                  : 'text-[#8C6D3B] hover:bg-[#F7F4EC] dark:hover:bg-[#332E23]'
              }`}
            >
              L2
            </button>
            <button
              onClick={() => setFilterLevel('3')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                filterLevel === '3'
                  ? 'bg-[#4A6B53] text-white'
                  : 'text-[#4A6B53] hover:bg-[#EDF3EF] dark:hover:bg-[#202E24]'
              }`}
            >
              L3
            </button>
          </div>
        </div>

        {/* Card List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 divide-y divide-[#DED7CD]/70 dark:divide-[#38312B]/80">
          {filteredCards.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#736B63] dark:text-[#A59E95]">
              No vocabulary matching the current search and filters.
            </div>
          ) : (
            filteredCards.slice(0, 100).map((card) => {
              const currentLevel = progressMap[card.id]?.level ?? 1;
              const meta = levelColorMap[currentLevel];

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    onSelectCard(card.id);
                    onClose();
                  }}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 hover:bg-[#F2EFE9]/80 dark:hover:bg-[#1E1B18]/80 px-2.5 rounded-2xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Expression Tile */}
                    <div className="w-12 h-12 rounded-xl bg-[#F2EFE9] dark:bg-[#1E1B18] border border-[#DED7CD] dark:border-[#38312B] flex items-center justify-center font-jp text-lg font-bold text-[#2B2B2B] dark:text-[#E6E1DA] shrink-0 group-hover:border-[#6B7F5E]/60 transition-colors">
                      {card.expression.slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-jp text-base font-bold text-[#2B2B2B] dark:text-[#E6E1DA]">
                          {card.expression}
                        </span>
                        <span className="font-jp text-xs font-semibold text-[#C84B31] dark:text-[#E88673]">
                          【{card.reading}】
                        </span>
                        <span className="text-xs text-[#554D46] dark:text-[#BDB6AC]">
                          — {card.meaning}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#736B63] dark:text-[#A59E95] mt-0.5 flex-wrap">
                        <span className="font-semibold text-[#736B63] dark:text-[#A59E95]">Priority #{card.priority}</span>
                        {card.category && !card.transitivity && card.category !== 'Transitive / Intransitive' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#8C6D3B] dark:text-[#DEC88E] font-medium">{card.category}</span>
                          </>
                        )}
                        {card.pairNote && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-jp text-[#C84B31] dark:text-[#E88673] truncate max-w-xs">{card.pairNote}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pl-14 sm:pl-0">
                    {/* Transitivity Badge */}
                    {card.transitivity && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border font-jp ${
                        card.transitivity === 'transitive'
                          ? 'bg-[#EEF3F8] dark:bg-[#1E2E40] text-[#2B4C6F] dark:text-[#8CB4DE] border-[#CAD8E6] dark:border-[#2B4C6F]'
                          : 'bg-[#F1F4EE] dark:bg-[#263123] text-[#5B7051] dark:text-[#A6C09C] border-[#D2DDCF] dark:border-[#3B4D36]'
                      }`}>
                        {card.transitivity === 'transitive' ? '他動詞' : '自動詞'}
                      </span>
                    )}

                    {/* JLPT Pill */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                      card.level === 'N4'
                        ? 'bg-[#FBF0EE] dark:bg-[#36221D] text-[#C84B31] dark:text-[#E88673] border-[#F2D1CA]/60 dark:border-[#522F26]'
                        : 'bg-[#EEF3F8] dark:bg-[#1E2E40] text-[#2B4C6F] dark:text-[#8CB4DE] border-[#CAD8E6]/60 dark:border-[#2B4C6F]'
                    }`}>
                      {card.level}
                    </span>

                    {/* Level Pill */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${meta.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      <span>{meta.label}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(card.reading);
                        }}
                        className="p-1.5 rounded-lg text-[#736B63] dark:text-[#A59E95] hover:text-[#6B7F5E] dark:hover:text-[#A6C09C] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] transition-colors"
                        title="Audio"
                        aria-label={`Pronounce ${card.expression}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <ChevronRight className="w-4 h-4 text-[#736B63] dark:text-[#A59E95] group-hover:text-[#6B7F5E] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {filteredCards.length > 100 && (
            <div className="py-3 text-center text-xs text-[#736B63] dark:text-[#A59E95]">
              Showing top 100 matches. Use search above to narrow down.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
