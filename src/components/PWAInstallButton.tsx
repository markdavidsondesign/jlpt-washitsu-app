import React, { useState } from 'react';
import { Download, Share, X, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  // If already running inside standalone PWA mode, don't show install CTA
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1 px-1.5 xs:px-2 py-1 rounded-md text-[11px] font-semibold text-[#4A6B53] dark:text-[#A6C09C] bg-[#F0F3ED] dark:bg-[#242F22] hover:bg-[#E2EBE0] dark:hover:bg-[#2D3C2B] border border-[#CAD8C5] dark:border-[#384A33] transition-colors cursor-pointer shrink-0"
        title="Install JLPT Study as an App"
        aria-label="Install JLPT Study App"
      >
        <Download className="w-3 h-3 text-[#6B7F5E]" />
        <span className="hidden sm:inline">Install</span>
      </button>
    );
  }

  // iOS Safari flow (WebKit doesn't trigger beforeinstallprompt, requires Add to Home Screen)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="flex items-center gap-1 px-1.5 xs:px-2 py-1 rounded-md text-[11px] font-semibold text-[#4A6B53] dark:text-[#A6C09C] bg-[#F0F3ED] dark:bg-[#242F22] hover:bg-[#E2EBE0] dark:hover:bg-[#2D3C2B] border border-[#CAD8C5] dark:border-[#384A33] transition-colors cursor-pointer shrink-0"
          title="Install on iPhone / iPad"
          aria-label="Install on iPhone / iPad"
        >
          <Download className="w-3 h-3 text-[#6B7F5E]" />
          <span className="hidden sm:inline">Install</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl sm:rounded-3xl bg-[#FAF8F5] dark:bg-[#28231F] border border-[#DED7CD] dark:border-[#38312B] p-5 shadow-2xl text-left box-border">
              <div className="flex items-center justify-between pb-3 border-b border-[#DED7CD]/70 dark:border-[#38312B]/70 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#6B7F5E] text-[#F9F6F0] flex items-center justify-center font-bold font-jp text-sm shadow-2xs">
                    学
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2B2B2B] dark:text-[#E6E1DA] font-jp">
                      Install JLPT Study
                    </h3>
                    <p className="text-[10px] text-[#736B63] dark:text-[#A59E95]">
                      Add to your iPhone or iPad home screen
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-lg text-[#736B63] dark:text-[#A59E95] hover:bg-[#EAE4DC] dark:hover:bg-[#342D27] cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#2B2B2B] dark:text-[#E6E1DA] py-1">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#EAE4DC] dark:bg-[#342D27] text-[#6B7F5E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="leading-snug">
                    Tap the <strong className="inline-flex items-center gap-1 font-semibold text-[#6B7F5E]"><Share className="w-3.5 h-3.5" /> Share</strong> icon in your Safari bottom navigation bar.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#EAE4DC] dark:bg-[#342D27] text-[#6B7F5E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="leading-snug">
                    Scroll down the share sheet and tap <strong className="inline-flex items-center gap-1 font-semibold text-[#6B7F5E]"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#EAE4DC] dark:bg-[#342D27] text-[#6B7F5E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="leading-snug">
                    Tap <strong>Add</strong> in the top right corner. The app will launch in full standalone mode with the custom 「学」 icon!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-[#6B7F5E] hover:bg-[#5A6D4E] text-white font-semibold text-xs transition-colors cursor-pointer text-center"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
