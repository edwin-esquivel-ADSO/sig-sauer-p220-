import React from 'react';
import { ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { SCROLL_STEPS, type ScrollStep } from '../data/p220Data';
import { soundEngine } from '../utils/audio';

interface ScrollytellingOverlayProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  onEnterWorkbench: () => void;
}

export const ScrollytellingOverlay: React.FC<ScrollytellingOverlayProps> = ({
  currentStepIndex,
  onSelectStep,
  onEnterWorkbench,
}) => {
  return (
    <div className="relative w-full z-20 pointer-events-none">
      {/* Scroll indicator when at step 0 */}
      {currentStepIndex === 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-auto animate-bounce">
          <span className="font-tactical text-[11px] uppercase tracking-widest text-amber-400 bg-slate-900/80 px-3 py-1 rounded-full border border-amber-500/30">
            Desliza para despiezar
          </span>
          <ChevronDown className="w-5 h-5 text-amber-400" />
        </div>
      )}

      {/* Step dots navigation for desktop & mobile */}
      <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5 pointer-events-auto glass-panel p-2 rounded-2xl border border-white/10">
        {SCROLL_STEPS.map((step, idx) => (
          <button
            key={`dot-${idx}`}
            onClick={() => {
              soundEngine.playClick();
              onSelectStep(idx);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 relative group ${
              currentStepIndex === idx
                ? 'bg-amber-400 scale-125 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                : 'bg-slate-700 hover:bg-slate-500'
            }`}
            title={step.title}
            aria-label={`Ir a paso ${idx + 1}`}
          >
            <span className="absolute right-6 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900 text-slate-200 text-xs px-2.5 py-1 rounded-md whitespace-nowrap border border-white/10 font-tactical">
              {step.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Scrolly sections generating vertical page height */}
      {SCROLL_STEPS.map((step: ScrollStep, idx: number) => {
        const isCurrent = currentStepIndex === idx;

        return (
          <section
            key={`step-${idx}`}
            className="min-h-screen flex items-center justify-start p-4 sm:p-8 md:p-14 lg:p-20 relative"
          >
            <div
              className={`max-w-xl transition-all duration-700 transform pointer-events-auto ${
                isCurrent
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-20 translate-y-8 scale-95'
              }`}
            >
              {/* Tactical Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{step.badge}</span>
              </div>

              {/* Main Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/15 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                {/* Accent corner brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500" />

                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide font-tactical mb-1">
                  {step.title}
                </h2>
                <h3 className="text-xs sm:text-sm font-mono text-amber-400/90 mb-4 uppercase tracking-wider">
                  {step.subtitle}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                  {step.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {step.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono"
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
                    className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-tactical rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all text-sm tracking-wider uppercase group"
                  >
                    <span>Entrar al Banco de Armería & Dossier</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-slate-800">
                    <span>SECCIÓN {idx + 1} DE {SCROLL_STEPS.length}</span>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onSelectStep(idx + 1);
                      }}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-tactical tracking-wider"
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
