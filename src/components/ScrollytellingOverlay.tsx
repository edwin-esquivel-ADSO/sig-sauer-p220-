import React from 'react';
import { ChevronDown, ArrowRight, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { SCROLL_STEPS, type ScrollStep } from '../data/p220Data';
import { soundEngine } from '../utils/audio';

interface ScrollytellingOverlayProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  onEnterWorkbench: () => void;
  onOpenRealPhotoModal: () => void;
}

export const ScrollytellingOverlay: React.FC<ScrollytellingOverlayProps> = ({
  currentStepIndex,
  onSelectStep,
  onEnterWorkbench,
  onOpenRealPhotoModal,
}) => {
  return (
    <div className="relative w-full z-20 pointer-events-none">
      {/* Scroll indicator when at step 0 */}
      {currentStepIndex === 0 && (
        <div className="fixed bottom-6 left-4 sm:left-12 lg:left-20 z-30 flex flex-col items-start gap-1.5 pointer-events-auto animate-bounce">
          <span className="font-tactical text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-800 bg-white/95 px-3 py-1 rounded-full border border-amber-500/30 shadow-md">
            Desliza para despiezar ↓
          </span>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 ml-4" />
        </div>
      )}

      {/* Floating button to view Real Firearm Photo */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-30 pointer-events-auto">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenRealPhotoModal();
          }}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/95 hover:bg-white text-slate-800 hover:text-amber-700 rounded-2xl border border-slate-200 shadow-xl shadow-slate-300/40 text-[11px] sm:text-xs font-tactical font-bold tracking-wider transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span>FOTO REAL</span>
        </button>
      </div>

      {/* Step dots navigation on right edge (desktop & tablet only) */}
      <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-2.5 pointer-events-auto glass-panel-light p-2 rounded-2xl border border-slate-200 shadow-lg">
        {SCROLL_STEPS.map((step, idx) => (
          <button
            key={`dot-${idx}`}
            onClick={() => {
              soundEngine.playClick();
              onSelectStep(idx);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 relative group cursor-pointer ${
              currentStepIndex === idx
                ? 'bg-amber-500 scale-125 shadow-[0_0_10px_rgba(217,119,6,0.6)]'
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
            title={step.title}
            aria-label={`Ir a paso ${idx + 1}`}
          >
            <span className="absolute right-6 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap shadow-md font-tactical">
              {step.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Scrolly sections:
          - On mobile: cards are at bottom (items-end pb-24) leaving the upper 45% for the 3D gun
          - On desktop: cards are on the left (justify-start) leaving the right 50% for the 3D gun
      */}
      {SCROLL_STEPS.map((step: ScrollStep, idx: number) => {
        const isCurrent = currentStepIndex === idx;

        return (
          <section
            key={`step-${idx}`}
            className="min-h-screen flex items-end sm:items-center justify-start p-3 sm:p-8 md:p-12 lg:p-20 pb-24 sm:pb-8 relative"
          >
            {/* Left-side / bottom card container */}
            <div
              className={`w-full max-w-lg lg:max-w-xl transition-all duration-700 transform pointer-events-auto ${
                isCurrent
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-15 translate-y-8 scale-95'
              }`}
            >
              {/* Tactical Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-800 text-[10px] sm:text-xs font-mono font-semibold tracking-wider mb-2 sm:mb-3">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
                <span>{step.badge}</span>
              </div>

              {/* Main Light Card */}
              <div className="glass-panel-light p-4 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-200/80 relative overflow-hidden backdrop-blur-xl">
                {/* Accent corner brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-600" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-600" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-600" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-600" />

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-wide font-tactical mb-0.5 sm:mb-1">
                  {step.title}
                </h2>
                <h3 className="text-[11px] sm:text-xs md:text-sm font-mono text-amber-700 mb-2.5 sm:mb-4 uppercase tracking-wider font-semibold">
                  {step.subtitle}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 font-sans">
                  {step.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {step.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-slate-100/90 border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-mono font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Final step action: Transition into the interactive workbench */}
                {idx === SCROLL_STEPS.length - 1 ? (
                  <button
                    onClick={() => {
                      soundEngine.playSlideRack();
                      onEnterWorkbench();
                    }}
                    className="w-full py-3 px-4 sm:py-3.5 sm:px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold font-tactical rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all text-xs sm:text-sm tracking-wider uppercase group cursor-pointer"
                  >
                    <span>Entrar al Banco de Armería & Dossier</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-mono pt-2.5 sm:pt-3 border-t border-slate-200">
                    <span>SECCIÓN {idx + 1} DE {SCROLL_STEPS.length}</span>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onSelectStep(idx + 1);
                      }}
                      className="text-amber-700 hover:text-amber-800 flex items-center gap-1 font-tactical tracking-wider font-semibold cursor-pointer"
                    >
                      <span>SIGUIENTE PARTE</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
