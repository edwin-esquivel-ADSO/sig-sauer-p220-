import { useState, useEffect, useCallback } from 'react';
import { GunCanvas } from './components/GunCanvas';
import { TacticalHUD } from './components/TacticalHUD';
import { ScrollytellingOverlay } from './components/ScrollytellingOverlay';
import { WorkbenchDossier } from './components/WorkbenchDossier';
import { RealPhotoModal } from './components/RealPhotoModal';
import { SCROLL_STEPS } from './data/p220Data';
import { soundEngine } from './utils/audio';
import { ExternalLink } from 'lucide-react';

export function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [isWorkbenchMode, setIsWorkbenchMode] = useState(false);
  const [isRealPhotoModalOpen, setIsRealPhotoModalOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Workbench 3D controls state
  const [explosionFactor, setExplosionFactor] = useState(0);
  const [isXRay, setIsXRay] = useState(false);
  const [isFiring, setIsFiring] = useState(false);
  const [isDecocked, setIsDecocked] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState('slide');

  // Camera state for 3D canvas
  const [cameraPos, setCameraPos] = useState<[number, number, number]>([0, 0.4, 6.4]);
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
    setCameraPos([2.0, 1.2, 5.8]);
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
    setCameraPos([0, 0.4, 6.4]);
    setCameraTarget([0, 0, 0]);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col relative bg-tactical-grid-light selection:bg-amber-500/20">
      {/* Top Tactical HUD */}
      <TacticalHUD
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        isWorkbenchMode={isWorkbenchMode}
        onToggleMode={handleToggleMode}
        currentStepIndex={currentStepIndex}
        totalSteps={SCROLL_STEPS.length}
        onJumpToWorkbench={handleEnterWorkbench}
        onOpenRealPhotoModal={() => setIsRealPhotoModalOpen(true)}
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
            {/* Soft ambient vignette */}
            <div className="absolute inset-0 pointer-events-none bg-radial-vignette-light" />
          </div>

          {/* Foreground Scroll Overlay with step cards */}
          <ScrollytellingOverlay
            currentStepIndex={currentStepIndex}
            onSelectStep={handleSelectStep}
            onEnterWorkbench={handleEnterWorkbench}
            onOpenRealPhotoModal={() => setIsRealPhotoModalOpen(true)}
          />
        </div>
      ) : (
        /* MODE 2: INTERACTIVE WORKBENCH & HISTORICAL DOSSIER */
        <div className="relative w-full flex flex-col pt-14 sm:pt-16 md:pt-20">
          {/* Persistent Interactive 3D Canvas Box */}
          <div className="w-full h-[44vh] sm:h-[52vh] lg:h-[60vh] relative bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200 shadow-sm">
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

            {/* Subtle 3D Interaction Hint overlay placed at bottom right to avoid header overlap */}
            <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] sm:text-[11px] font-mono text-slate-600 bg-white/95 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>Gira 360° • Zoom táctil</span>
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
            onOpenRealPhotoModal={() => setIsRealPhotoModalOpen(true)}
          />
        </div>
      )}

      {/* Real Photograph Lightbox / Modal */}
      <RealPhotoModal
        isOpen={isRealPhotoModalOpen}
        onClose={() => setIsRealPhotoModalOpen(false)}
      />

      {/* Clean Footer without QR or Vercel mentions */}
      <footer className="w-full mt-auto py-5 px-4 border-t border-slate-200 bg-white text-center text-xs font-mono text-slate-500 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span className="text-slate-700 font-tactical font-semibold tracking-wider text-[11px] sm:text-xs">
              SIG SAUER P220 .45 ACP // SISTEMA DE DESPIECE INTERACTIVO 3D
            </span>
          </div>
          <div>
            <a
              href="https://www.sigsauer.com/p220-nitron-full-size.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playClick()}
              className="text-amber-700 hover:text-amber-800 font-tactical font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <span>WEB OFICIAL SIG SAUER</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
