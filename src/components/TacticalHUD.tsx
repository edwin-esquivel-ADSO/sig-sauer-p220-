import React from 'react';
import { Volume2, VolumeX, Crosshair, Wrench, Layers, Image as ImageIcon } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TacticalHUDProps {
  isMuted: boolean;
  onToggleSound: () => void;
  isWorkbenchMode: boolean;
  onToggleMode: () => void;
  currentStepIndex: number;
  totalSteps: number;
  onJumpToWorkbench: () => void;
  onOpenRealPhotoModal: () => void;
}

export const TacticalHUD: React.FC<TacticalHUDProps> = ({
  isMuted,
  onToggleSound,
  isWorkbenchMode,
  onToggleMode,
  currentStepIndex,
  totalSteps,
  onJumpToWorkbench,
  onOpenRealPhotoModal,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none p-3 md:p-6 flex items-center justify-between">
      {/* Top Left: Logo & Military Designation */}
      <div className="pointer-events-auto flex items-center gap-3 glass-panel-light px-3.5 py-2 md:px-5 md:py-2.5 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
          <Crosshair className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-tactical text-xs tracking-widest text-amber-700 uppercase font-bold">
              SIG SAUER®
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] tracking-wider text-slate-500 font-mono hidden sm:inline">
              SYS-75 // W. GERMANY
            </span>
          </div>
          <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-wider flex items-center gap-1.5">
            P220 <span className="text-amber-600 font-mono text-xs md:text-sm font-semibold">.45 ACP</span>
          </h1>
        </div>
      </div>

      {/* Top Center: Progress Bar for Scrollytelling (Only in scroll mode) */}
      {!isWorkbenchMode && (
        <div className="pointer-events-auto hidden md:flex items-center gap-2 glass-panel-light px-4 py-2 rounded-full border border-slate-200 text-xs font-mono text-slate-700 shadow-md">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>DESPIECE:</span>
          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-amber-700 font-bold">{currentStepIndex + 1}/{totalSteps}</span>
        </div>
      )}

      {/* Top Right: Actions & Sound Toggle */}
      <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
        {/* Real Photo Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenRealPhotoModal();
          }}
          className="glass-panel-light px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-xs font-tactical font-semibold tracking-wider text-slate-700 hover:text-amber-700 hover:border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Ver fotografía real de referencia de la SIG Sauer P220"
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">FOTO REAL</span>
        </button>

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
          className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs font-tactical font-semibold tracking-wider transition-all shadow-md cursor-pointer ${
            isWorkbenchMode
              ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'
              : 'glass-panel-light text-slate-800 hover:text-amber-700 hover:border-amber-500/40'
          }`}
          title={isWorkbenchMode ? 'Volver al recorrido scrollytelling' : 'Abrir Banco de Armería y Dossier 3D'}
        >
          {isWorkbenchMode ? (
            <>
              <Layers className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">VER SCROLL</span>
            </>
          ) : (
            <>
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>BANCO 3D & DOSSIER</span>
            </>
          )}
        </button>

        {/* Audio Mute / Unmute Button */}
        <button
          onClick={onToggleSound}
          className="glass-panel-light p-2 md:p-2.5 rounded-xl text-slate-600 hover:text-amber-600 hover:border-amber-500/40 transition-colors cursor-pointer shadow-sm"
          title={isMuted ? 'Activar sonido de mecanismos mecánicos' : 'Silenciar audio'}
          aria-label="Alternar sonido"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
          )}
        </button>
      </div>
    </header>
  );
};
