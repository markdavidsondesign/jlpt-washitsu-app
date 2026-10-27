import React from 'react';
import { RotateCw, Check, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SRSAction } from '../utils/srs';

interface SRSControlsProps {
  isFlipped: boolean;
  onFlip: () => void;
  onSelectAction: (action: SRSAction) => void;
}

export const SRSControls: React.FC<SRSControlsProps> = ({
  isFlipped,
  onFlip,
  onSelectAction,
}) => {
  return (
    <div className="w-full max-w-[420px] mx-auto flex items-center justify-center box-border h-[48px] sm:h-[52px]">
      {/* If not flipped yet, show a prominent Flip Card button (Matcha Green) */}
      {!isFlipped ? (
        <button
          onClick={onFlip}
          className="w-full h-10 sm:h-11 rounded-xl bg-[#6B7F5E] hover:bg-[#5A6D4E] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all cursor-pointer box-border"
          aria-label="Flip card to reveal answer"
        >
          <RotateCw className="w-3.5 h-3.5 text-white/90" />
          <span>Show Answer</span>
          <span className="hidden sm:inline-block ml-1.5 text-[10px] font-mono opacity-80 px-1 py-0.2 rounded border border-white/30">
            Space
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full h-10 sm:h-11 box-border items-center">
          {/* Button 1: Again / Hard (Vermilion Shu-iro) */}
          <button
            onClick={() => onSelectAction('again')}
            className="flex items-center justify-center gap-1 h-full px-2 rounded-xl bg-[#FBF0EE] hover:bg-[#F7E2DE] dark:bg-[#36221D] dark:hover:bg-[#452720] border border-[#F2D1CA] dark:border-[#522F26] text-[#C84B31] dark:text-[#E88673] transition-all active:scale-[0.98] shadow-2xs cursor-pointer group"
            aria-label="Rate Again / Hard (Drops to SRS Level 1, reappears immediately)"
          >
            <span className="text-xs sm:text-sm font-bold">Again</span>
            <span className="text-[10px] opacity-75 font-mono">←</span>
          </button>

          {/* Button 2: Good (Moegi / Ochre) */}
          <button
            onClick={() => onSelectAction('good')}
            className="flex items-center justify-center gap-1 h-full px-2 rounded-xl bg-[#F7F4EC] hover:bg-[#EFEAD9] dark:bg-[#332E23] dark:hover:bg-[#40392A] border border-[#E8DFC9] dark:border-[#504734] text-[#8C6D3B] dark:text-[#DEC88E] transition-all active:scale-[0.98] shadow-2xs cursor-pointer group"
            aria-label="Rate Good (Advances or keeps at SRS Level 2, reappears after 3 cards)"
          >
            <span className="text-xs sm:text-sm font-bold">Good</span>
            <span className="text-[10px] opacity-75 font-mono">→</span>
          </button>

          {/* Button 3: Easy / Mastered (Deep Bamboo Take-iro) */}
          <button
            onClick={() => onSelectAction('easy')}
            className="flex items-center justify-center gap-1 h-full px-2 rounded-xl bg-[#EDF3EF] hover:bg-[#E0ECE3] dark:bg-[#202E24] dark:hover:bg-[#283C2E] border border-[#D1E1D6] dark:border-[#314838] text-[#4A6B53] dark:text-[#8BAF95] transition-all active:scale-[0.98] shadow-2xs cursor-pointer group"
            aria-label="Rate Easy / Mastered (Advances to SRS Level 3, completed for today)"
          >
            <Check className="w-3 h-3 text-[#4A6B53] dark:text-[#8BAF95]" />
            <span className="text-xs sm:text-sm font-bold">Easy</span>
            <span className="text-[10px] opacity-75 font-mono">3</span>
          </button>
        </div>
      )}
    </div>
  );
};
