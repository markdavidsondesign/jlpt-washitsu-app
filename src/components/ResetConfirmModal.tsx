import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#736B63] hover:text-[#2B2B2B] dark:text-[#A59E95] dark:hover:text-[#E6E1DA] p-1 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBF0EE] dark:bg-[#36221D] text-[#C84B31] dark:text-[#E88673] border border-[#F2D1CA] dark:border-[#522F26] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 id="reset-modal-title" className="text-base font-bold text-[#2B2B2B] dark:text-[#E6E1DA]">
            Reset SRS Progress?
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#A59E95] leading-relaxed mb-6">
          This will reset all your JLPT N5 and N4 card study progress in LocalStorage back to Level 1 (New / Hard), clear your review streaks and stats, and restart your study queue.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#736B63] dark:text-[#A59E95] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#C84B31] hover:bg-[#B23E26] rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Yes, Reset All
          </button>
        </div>
      </div>
    </div>
  );
};
