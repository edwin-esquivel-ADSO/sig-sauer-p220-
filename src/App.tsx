import { useState, useEffect, useCallback } from 'react';
import { GunCanvas } from './components/GunCanvas';
import { TacticalHUD } from './components/TacticalHUD';
import { ScrollytellingOverlay } from './components/ScrollytellingOverlay';
import { WorkbenchDossier } from './components/WorkbenchDossier';
import { SCROLL_STEPS } from './data/p220Data';
import { soundEngine } from './utils/audio';

export function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [isWorkbenchMode, setIsWorkbenchMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Workbench 3D controls state
  const [explosionFactor, setExplosionFactor] = useState(0);
  const [isXRay, setIsXRay] = useState(false);
  const [isFiring, setIsFiring] = useState(false);
  const [isDecocked, setIsDecocked] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState('slide');

  // Camera state for 3D canvas
  const [cameraPos, setCameraPos] = useState<[number, number, number]>([0, 0.4, 5.2]);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);
  const [highlightPart, setHighlightPart] = useState('all');

  // Handle scroll progress
  useEffect(() => {
    if (isWorkbenchMode) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / totalHeight, 0), 1);

      // Determine step
      const stepFloat = progress * (SCROLL_STEPS.length - 1);
      const stepIndex = Math.round(stepFloat);
      const boundedIndex = Math.min(Math.max(stepIndex, 0), SCROLL_STEPS.length - 1);

      setCurrentStepIndex(boundedIndex);

      const currentStepData = SCROLL_STEPS[boundedIndex];
      setExplosionFactor(currentStepData.explosionFactor);
      setCameraPos(currentStepData.cameraPos);
      setCameraTarget(currentStepData.cameraTarget);
      setHighlightPart(currentStepData.highlightPart);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isWorkbenchMode]);

  // Jump to specific scroll step
  const handleSelectStep = useCallback((stepIdx: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = (stepIdx / (SCROLL_STEPS.length - 1)) * totalHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  // Toggle audio
  const handleToggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.enabled = !next;
      if (!next) {
        soundEngine.playClick();
      }
      return next;
    });
  }, []);

  // Enter full workbench mode
  const handleEnterWorkbench = useCallback(() => {
    setIsWorkbenchMode(true);
    setExplosionFactor(0.35); // Initial exploded view in workbench
    setCameraPos([2.0, 1.2, 4.4]);
    setCameraTarget([0, 0, 0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Toggle between Scroll and Workbench
  const handleToggleMode = useCallback(() => {
    setIsWorkbenchMode((prev) => {
      const next = !prev;
      if (!next) {
        setTimeout(() => {
          handleSelectStep(0);
        }, 50);
      } else {
        handleEnterWorkbench();
      }
      return next;
    });
  }, [handleEnterWorkbench, handleSelectStep]);

  // Firing action simulation
  const handleFireGun = useCallback(() => {
    setIsFiring(true);
    soundEngine.playSlideRack();
    setTimeout(() => {
      soundEngine.playDryFire();
    }, 180);
    setTimeout(() => {
      setIsFiring(false);
      setIsDecocked(false); // Cocked after cycle
    }, 450);
  }, []);

  // Decock action simulation
  const handleDecockGun = useCallback(() => {
    setIsDecocked(true);
    soundEngine.playDecocker();
  }, []);

  // Reset 3D view
  const handleResetView = useCallback(() => {
    setExplosionFactor(0);
    setIsXRay(false);
    setIsDecocked(false);
    setCameraPos([0, 0.4, 5.2]);
    setCameraTarget([0, 0, 0]);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col relative bg-tactical-grid selection:bg-amber-500/30">
      {/* Top Tactical HUD */}
      <TacticalHUD
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        isWorkbenchMode={isWorkbenchMode}
        onToggleMode={handleToggleMode}
        currentStepIndex={currentStepIndex}
        totalSteps={SCROLL_STEPS.length}
        onJumpToWorkbench={handleEnterWorkbench}
      />

      {/* MODE 1: SCROLLYTELLING VIEW */}
      {!isWorkbenchMode ? (
        <div className="relative w-full">
          {/* Fixed 3D Viewport in background */}
          <div className="fixed inset-0 z-0 pointer-events-auto">
            <GunCanvas
              explosionFactor={explosionFactor}
              highlightPart={highlightPart}
              isXRay={false}
              isFiring={isFiring}
              isDecocked={isDecocked}
              isWorkbenchMode={false}
              cameraPos={cameraPos}
              cameraTarget={cameraTarget}
              onPartClick={(partId) => {
                soundEngine.playClick();
                setSelectedPartId(partId);
                handleEnterWorkbench();
              }}
            />
            {/* Subtle vignette shadow around 3D canvas */}
            <div className="absolute inset-0 pointer-events-none bg-radial-vignette" />
          </div>

          {/* Foreground Scroll Overlay with step cards */}
          <ScrollytellingOverlay
            currentStepIndex={currentStepIndex}
            onSelectStep={handleSelectStep}
            onEnterWorkbench={handleEnterWorkbench}
          />
        </div>
      ) : (
        /* MODE 2: INTERACTIVE WORKBENCH & HISTORICAL DOSSIER */
        <div className="relative w-full flex flex-col pt-16 md:pt-20">
          {/* Persistent Interactive 3D Canvas Box */}
          <div className="w-full h-[48vh] sm:h-[55vh] lg:h-[62vh] relative bg-gradient-to-b from-[#0a0d14] to-[#07090e] border-b border-white/10 shadow-2xl">
            <GunCanvas
              explosionFactor={explosionFactor}
              highlightPart={selectedPartId}
              isXRay={isXRay}
              isFiring={isFiring}
              isDecocked={isDecocked}
              isWorkbenchMode={true}
              cameraPos={cameraPos}
              cameraTarget={cameraTarget}
              onPartClick={(partId) => {
                soundEngine.playClick();
                setSelectedPartId(partId);
              }}
            />

            {/* Subtle 3D Interaction Hint overlay */}
            <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Gira con un dedo o ratón • Zoom con pellizco / rueda</span>
            </div>
          </div>

          {/* Comprehensive Interactive Dossier & Armory Controls */}
          <WorkbenchDossier
            explosionFactor={explosionFactor}
            onExplosionChange={(val) => {
              setExplosionFactor(val);
            }}
            isXRay={isXRay}
            onToggleXRay={() => setIsXRay((prev) => !prev)}
            onFireGun={handleFireGun}
            onDecockGun={handleDecockGun}
            onResetView={handleResetView}
            selectedPartId={selectedPartId}
            onSelectPart={(partId) => {
              setSelectedPartId(partId);
            }}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="w-full mt-auto py-6 px-4 border-t border-white/10 bg-[#050609] text-center text-xs font-mono text-slate-500 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-400 font-tactical font-semibold tracking-wider">
              SIG SAUER P220 .45 ACP // SISTEMA DE DESPIECE INTERACTIVO 3D
            </span>
          </div>
          <div>
            <span>Desarrollado para alta precisión técnica • Listo para Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
