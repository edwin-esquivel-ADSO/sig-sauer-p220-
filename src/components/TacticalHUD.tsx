import React from 'react';
import { Volume2, VolumeX, Crosshair, Wrench, Layers } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TacticalHUDProps {
  isMuted: boolean;
  onToggleSound: () => void;
  isWorkbenchMode: boolean;
  onToggleMode: () => void;
  currentStepIndex: number;
  totalSteps: number;
  onJumpToWorkbench: () => void;
}

export const TacticalHUD: React.FC<TacticalHUDProps> = ({
  isMuted,
  onToggleSound,
  isWorkbenchMode,
  onToggleMode,
  currentStepIndex,
  totalSteps,
  onJumpToWorkbench,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-3 md:p-6 flex items-center justify-between">
      {/* Top Left: Logo & Military Designation */}
      <div className="pointer-events-auto flex items-center gap-3 glass-panel px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl border border-white/10 shadow-2xl">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Crosshair className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-tactical text-xs tracking-widest text-amber-400 uppercase font-bold">
              SIG SAUER®
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] tracking-wider text-slate-400 font-mono hidden sm:inline">
              SYS-75 // W. GERMANY
            </span>
          </div>
          <h1 className="text-sm md:text-base font-bold text-white tracking-wider flex items-center gap-1.5">
            P220 <span className="text-amber-400 font-mono text-xs md:text-sm font-semibold">.45 ACP</span>
          </h1>
        </div>
      </div>

      {/* Top Center: Progress Bar for Scrollytelling (Only in scroll mode) */}
      {!isWorkbenchMode && (
        <div className="pointer-events-auto hidden md:flex items-center gap-2 glass-panel px-4 py-2 rounded-full border border-white/10 text-xs font-mono text-slate-300">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>DESPIECE:</span>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-amber-400 font-bold">{currentStepIndex + 1}/{totalSteps}</span>
        </div>
      )}

      {/* Top Right: Actions & Sound Toggle */}
      <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
        {/* Toggle Mode Button: Scroll ⇄ Banco de Armería */}
        <button
          onClick={() => {
            soundEngine.playClick();
            if (!isWorkbenchMode) {
              onJumpToWorkbench();
            } else {
              onToggleMode();
            }
          }}
          className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-tactical font-semibold tracking-wider transition-all shadow-lg cursor-pointer ${
            isWorkbenchMode
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
              : 'glass-panel text-slate-200 hover:text-white hover:border-amber-500/40'
          }`}
          title={isWorkbenchMode ? 'Volver al recorrido scrollytelling' : 'Abrir Banco de Armería y Dossier 3D'}
        >
          {isWorkbenchMode ? (
            <>
              <Layers className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">VER SCROLL</span>
            </>
          ) : (
            <>
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>BANCO 3D & DOSSIER</span>
            </>
          )}
        </button>

        {/* Audio Mute / Unmute Button */}
        <button
          onClick={onToggleSound}
          className="glass-panel p-2 md:p-2.5 rounded-xl text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer"
          title={isMuted ? 'Activar sonido de mecanismos mecánicos' : 'Silenciar audio'}
          aria-label="Alternar sonido"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
          ) : (
            <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
};
