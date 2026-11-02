import React from 'react';
import { Volume2, VolumeX, Crosshair, Wrench, Layers, Image as ImageIcon, QrCode } from 'lucide-react';
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
  onOpenQRModal: () => void;
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
  onOpenQRModal,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-2 sm:p-4 md:p-6 flex items-center justify-between gap-2 bg-gradient-to-b from-slate-100/90 via-slate-100/50 to-transparent backdrop-blur-[2px]">
      {/* Top Left: Logo & Military Designation */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 glass-panel-light px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-slate-200 shadow-md">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
          <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-tactical text-[10px] sm:text-xs tracking-wider text-amber-700 uppercase font-bold">
              SIG SAUER®
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 tracking-wider flex items-center gap-1">
            P220 <span className="text-amber-600 font-mono text-[11px] sm:text-xs font-semibold">.45 ACP</span>
          </h1>
        </div>
      </div>

      {/* Top Center: Progress Bar for Scrollytelling (Only in scroll mode, hidden on mobile/tablet) */}
      {!isWorkbenchMode && (
        <div className="pointer-events-auto hidden lg:flex items-center gap-2 glass-panel-light px-4 py-2 rounded-full border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
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
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* QR Code Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenQRModal();
          }}
          className="glass-panel-light p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-tactical font-semibold tracking-wider text-slate-700 hover:text-amber-700 hover:border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Ver o descargar código QR para escanear en celular"
        >
          <QrCode className="w-4 h-4 text-amber-600" />
          <span className="hidden md:inline">CÓDIGO QR</span>
        </button>

        {/* Real Photo Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenRealPhotoModal();
          }}
          className="glass-panel-light p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-tactical font-semibold tracking-wider text-slate-700 hover:text-amber-700 hover:border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Ver fotografía real de referencia de la SIG Sauer P220"
        >
          <ImageIcon className="w-4 h-4 text-amber-600" />
          <span className="hidden md:inline">FOTO REAL</span>
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
          className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-tactical font-semibold tracking-wider transition-all shadow-sm cursor-pointer ${
            isWorkbenchMode
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'glass-panel-light text-slate-800 hover:text-amber-700 hover:border-amber-500/40'
          }`}
          title={isWorkbenchMode ? 'Volver al recorrido scrollytelling' : 'Abrir Banco de Armería y Dossier 3D'}
        >
          {isWorkbenchMode ? (
            <>
              <Layers className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">SCROLL</span>
            </>
          ) : (
            <>
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>BANCO 3D</span>
            </>
          )}
        </button>

        {/* Audio Mute / Unmute Button */}
        <button
          onClick={onToggleSound}
          className="glass-panel-light p-2 sm:p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:border-amber-500/40 transition-colors cursor-pointer shadow-sm"
          title={isMuted ? 'Activar sonido de mecanismos mecánicos' : 'Silenciar audio'}
          aria-label="Alternar sonido"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-600" />
          )}
        </button>
      </div>
    </header>
  );
};
