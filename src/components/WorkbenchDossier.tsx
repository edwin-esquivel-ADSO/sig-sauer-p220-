import React, { useState } from 'react';
import {
  Sliders,
  Eye,
  RotateCcw,
  Zap,
  BookOpen,
  Cpu,
  Crosshair,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  Flame,
  Image as ImageIcon,
} from 'lucide-react';
import {
  PARTS_CATALOG,
  VARIANTS_LIST,
  TECHNICAL_SPECS,
  HISTORICAL_MILESTONES,
  type PartDetail,
} from '../data/p220Data';
import { soundEngine } from '../utils/audio';

interface WorkbenchDossierProps {
  explosionFactor: number;
  onExplosionChange: (val: number) => void;
  isXRay: boolean;
  onToggleXRay: () => void;
  onFireGun: () => void;
  onDecockGun: () => void;
  onResetView: () => void;
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
  onOpenRealPhotoModal: () => void;
}

const COMPARISONS_DATA = [
  {
    param: 'Bloqueo de Acerrojado',
    classic1911: 'Tetones radiales superiores fresados en el cañón que encajan en ranuras internas de la corredera.',
    p220Sig: 'Bloque prismático de recámara que encaja directamente en la ventana de expulsión (Revolución moderna).',
  },
  {
    param: 'Leva de Descenso',
    classic1911: 'Cadeneta basculante articulada con pasador flotante propensa a fatiga y rotura.',
    p220Sig: 'Leva sólida integrada de una sola pieza en el cañón guiada por bloque de acero templado.',
  },
  {
    param: 'Tolerancia a Suciedad',
    classic1911: 'Pólvora y barro en las ranuras radiales impiden el cierre completo del arma (Out of battery).',
    p220Sig: 'Cualquier residuo es expulsado hacia afuera por la propia ventana con cada disparo.',
  },
  {
    param: 'Adopción Mundial',
    classic1911: 'Limitada a pistolas tipo 1911 tradicionales.',
    p220Sig: 'Copiada por Glock 17/19/21, HK USP, Walther P99/PDP, S&W M&P y Beretta APX.',
  },
];

export const WorkbenchDossier: React.FC<WorkbenchDossierProps> = ({
  explosionFactor,
  onExplosionChange,
  isXRay,
  onToggleXRay,
  onFireGun,
  onDecockGun,
  onResetView,
  selectedPartId,
  onSelectPart,
  onOpenRealPhotoModal,
}) => {
  const [activeTab, setActiveTab] = useState<'inspector' | 'historia' | 'ingenieria' | 'especificaciones' | 'variantes' | 'balistica'>('inspector');
  
  // Ballistics calculator state
  const [bulletWeightGr, setBulletWeightGr] = useState<number>(230);
  const [muzzleVelocityFps, setMuzzleVelocityFps] = useState<number>(850);

  // E = 0.5 * m * v^2 where m is in kg, v is in m/s
  const massKg = (bulletWeightGr * 0.06479891) / 1000;
  const velocityMs = muzzleVelocityFps * 0.3048;
  const energyJoules = Math.round(0.5 * massKg * Math.pow(velocityMs, 2));
  const energyFtLbs = Math.round((bulletWeightGr * Math.pow(muzzleVelocityFps, 2)) / 450436);

  const selectedPart: PartDetail | undefined = PARTS_CATALOG.find(
    (p) => p.id === selectedPartId
  ) || PARTS_CATALOG[0];

  // Render component details card (shared between desktop view and mobile inline accordion)
  const renderPartDetailsCard = (part: PartDetail) => (
    <div className="glass-panel-light p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 relative overflow-hidden">
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-7 h-7 bg-amber-500/10 border-t-2 border-r-2 border-amber-600" />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[10px] font-mono uppercase font-semibold border border-amber-500/30 inline-block mb-1.5">
            SUB-CONJUNTO TÁCTICO // {part.category.toUpperCase()}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-tactical text-slate-900">
            {part.name}
          </h2>
          <h3 className="text-xs sm:text-sm font-mono text-amber-700 italic">
            Denominación Sauer: {part.germanName}
          </h3>
        </div>

        <div className="self-start sm:self-auto glass-panel-light px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Masa Oficial</span>
          <span className="text-base sm:text-lg font-bold font-mono text-amber-700">{part.weight}</span>
        </div>
      </div>

      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
        {part.description}
      </p>

      {/* Metallurgy & Materials Badge */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-700 font-bold mb-1">
          <Cpu className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>METALURGIA Y TRATAMIENTO TÉRMICO:</span>
        </div>
        <p className="text-xs text-slate-700 font-mono">
          {part.material}
        </p>
      </div>

      {/* Engineering Breakthrough Fact */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-tactical text-amber-800 font-bold mb-1 uppercase tracking-wide">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Hito de Ingeniería de Precisión:</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          {part.engineeringFact}
        </p>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
        {part.specs.map((spec, sIdx) => (
          <div key={sIdx} className="glass-panel-light p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-mono text-slate-400 block uppercase mb-0.5">
              {spec.label}
            </span>
            <span className="text-xs font-semibold font-mono text-slate-900">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Maintenance Protocol */}
      <div className="flex items-start gap-2.5 text-xs font-mono text-slate-600 border-t border-slate-200 pt-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-emerald-700 font-bold uppercase">Mantenimiento: </span>
          <span>{part.maintenanceNote}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* 3D Workbench Controls Panel */}
      <div className="glass-panel-light p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-tactical text-sm sm:text-lg font-bold text-slate-900 tracking-wide">
                CONTROLES CINEMÁTICOS DE ARMERÍA 3D
              </h3>
              <p className="text-[11px] sm:text-xs font-mono text-slate-500">
                Ajuste milimétrico de despiece, radiografía X-Ray y simulación de ciclo
              </p>
            </div>
          </div>

          {/* Action Buttons: Wrap cleanly on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playSlideRack();
                onFireGun();
              }}
              className="px-3 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-tactical font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              title="Ciclar corredera y disparar"
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>CICLAR / DISPARO</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playDecocker();
                onDecockGun();
              }}
              className="px-3 py-2 glass-panel-light hover:bg-slate-100 text-amber-800 font-tactical font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-amber-500/30 cursor-pointer shadow-sm"
              title="Desamartillar de forma segura con Entspannhebel"
            >
              <Crosshair className="w-3.5 h-3.5 text-amber-600" />
              <span>ENTSPANNHEBEL</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleXRay();
              }}
              className={`px-3 py-2 font-tactical font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border cursor-pointer shadow-sm ${
                isXRay
                  ? 'bg-sky-500/15 text-sky-700 border-sky-400'
                  : 'glass-panel-light text-slate-700 border-slate-200 hover:border-sky-500/40'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span>{isXRay ? 'RAYOS-X ACTIVO' : 'MODO RAYOS-X'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenRealPhotoModal();
              }}
              className="px-3 py-2 glass-panel-light hover:bg-slate-100 text-slate-700 hover:text-amber-700 font-tactical font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer shadow-sm"
              title="Ver fotografía real de la SIG Sauer P220"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>VER FOTO REAL</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onResetView();
              }}
              className="col-span-2 sm:col-span-1 px-3 py-2 glass-panel-light hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-tactical font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
              title="Restablecer vista"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET VISTA</span>
            </button>
          </div>
        </div>

        {/* Exploded View Slider */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-mono text-slate-700">
            <span className="text-amber-700 font-bold">DESPIECE MECÁNICO:</span>
            <span className="font-bold bg-amber-500/15 px-2 py-0.5 rounded text-amber-800">{Math.round(explosionFactor * 100)}%</span>
          </div>

          <div className="flex-1 max-w-md mx-auto sm:mx-0 w-full flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500 shrink-0">ENSAMBLADA</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explosionFactor}
              onChange={(e) => {
                onExplosionChange(parseFloat(e.target.value));
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <span className="text-[10px] font-mono text-amber-700 font-semibold shrink-0">100%</span>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-4 sm:flex items-center gap-1.5">
            {[0, 0.35, 0.7, 1.0].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  soundEngine.playClick();
                  onExplosionChange(preset);
                }}
                className={`py-1 text-center text-[11px] font-mono rounded-md border transition-all cursor-pointer ${
                  Math.abs(explosionFactor - preset) < 0.05
                    ? 'bg-amber-500/15 text-amber-800 border-amber-500/50 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-sm'
                }`}
              >
                {Math.round(preset * 100)}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'inspector', label: 'Inspector de Componentes' },
          { id: 'historia', label: 'Génesis e Historia (1975–Hoy)' },
          { id: 'ingenieria', label: 'Ingeniería Browning-Petter-SIG' },
          { id: 'especificaciones', label: 'Especificaciones Mil-Spec' },
          { id: 'variantes', label: 'Variantes de Élite' },
          { id: 'balistica', label: 'Simulador Balístico .45 ACP' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-tactical text-xs sm:text-sm font-semibold tracking-wider transition-all whitespace-nowrap border cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 font-bold'
                  : 'glass-panel-light text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: INSPECTOR DE COMPONENTES */}
      {activeTab === 'inspector' && (
        <div>
          {/* MOBILE VIEW: Accordion style (expands directly under the tapped item!) */}
          <div className="block lg:hidden space-y-2.5">
            <span className="text-xs font-mono uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-600" />
              Toca una pieza para desplegar su ficha técnica:
            </span>

            {PARTS_CATALOG.map((part) => {
              const isSelected = selectedPartId === part.id;
              return (
                <div key={`mobile-${part.id}`} className="space-y-2">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      // Toggle selection
                      onSelectPart(part.id);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 shadow-md font-bold'
                        : 'glass-panel-light border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-tactical font-bold text-slate-900 block">
                        {part.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 italic">
                        {part.germanName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-amber-700 font-semibold">
                        {part.weight}
                      </span>
                      {isSelected ? (
                        <ChevronDown className="w-4 h-4 text-amber-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* INLINE EXPANSION ON MOBILE */}
                  {isSelected && (
                    <div className="pl-1 pr-1 pb-2 animate-in fade-in zoom-in-95 duration-200">
                      {renderPartDetailsCard(part)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* DESKTOP VIEW: Side-by-side 12-column layout */}
          <div className="hidden lg:grid grid-cols-12 gap-6">
            {/* Left: Components List */}
            <div className="col-span-5 flex flex-col gap-2">
              <span className="text-xs font-mono uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-amber-600" />
                Selecciona una pieza para inspección:
              </span>

              {PARTS_CATALOG.map((part) => {
                const isSelected = selectedPartId === part.id;
                return (
                  <button
                    key={`desk-${part.id}`}
                    onClick={() => {
                      soundEngine.playClick();
                      onSelectPart(part.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 shadow-md shadow-amber-500/10 font-bold'
                        : 'glass-panel-light border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-tactical font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                        {part.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 block italic">
                        {part.germanName}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-amber-700 block font-semibold">
                        {part.weight}
                      </span>
                      <ChevronRight className={`w-4 h-4 ml-auto text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-amber-600' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Part Details */}
            <div className="col-span-7">
              {selectedPart && renderPartDetailsCard(selectedPart)}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: GÉNESIS E HISTORIA (1975–HOY) */}
      {activeTab === 'historia' && (
        <div className="space-y-5">
          <div className="glass-panel-light p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl">
            {/* Real reference image banner */}
            <div className="flex flex-col md:flex-row items-center gap-5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
              <div className="w-full md:w-1/3 max-w-[260px] bg-white p-3 rounded-xl border border-slate-200 shadow-md shrink-0">
                <img
                  src="/p220-real.png"
                  alt="SIG Sauer P220 Real"
                  className="w-full h-auto object-contain cursor-pointer transition-transform hover:scale-105"
                  onClick={onOpenRealPhotoModal}
                  title="Haz clic para ampliar la fotografía real"
                />
                <span className="text-[10px] font-mono text-slate-400 block text-center mt-2">
                  Fotografía oficial de referencia
                </span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono font-bold text-amber-700 uppercase block mb-1">
                  HISTORIA DE UN EMBLEMA SUIZO-ALEMÁN
                </span>
                <h3 className="text-lg sm:text-2xl font-bold font-tactical text-slate-900 mb-2">
                  La Pistole 75 y la alianza SIG Sauer en Eckernförde
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  En 1975, el Ejército de Suiza sustituyó la veterana SIG P210 por la <strong>Pistole 75 (P75)</strong>. Para eludir las leyes de neutralidad suizas (<em>Kriegsmaterialgesetz</em>) que prohibían exportar armas a países en conflicto, SIG se alió con la firma alemana <strong>J.P. Sauer & Sohn</strong>, dando origen a la marca combinada SIG Sauer que conquistó las fuerzas especiales del mundo.
                </p>
                <button
                  onClick={onOpenRealPhotoModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-tactical font-semibold text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>AMPLIAR FOTO DE LA PISTOLA</span>
                </button>
              </div>
            </div>

            {/* Timeline */}
            <h4 className="font-tactical text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              LÍNEA TEMPORAL DE EVOLUCIÓN HISTÓRICA:
            </h4>

            <div className="space-y-3 sm:space-y-4">
              {HISTORICAL_MILESTONES.map((milestone, mIdx) => (
                <div
                  key={mIdx}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl glass-panel-light border border-slate-200 hover:border-amber-500/40 transition-all shadow-sm"
                >
                  <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 font-mono font-bold text-xs sm:text-sm shrink-0 self-start">
                    {milestone.year}
                  </div>
                  <div>
                    <h5 className="font-tactical font-bold text-slate-900 text-sm sm:text-base mb-1">
                      {milestone.title}
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: INGENIERÍA BROWNING-PETTER-SIG */}
      {activeTab === 'ingenieria' && (
        <div className="space-y-5">
          <div className="glass-panel-light p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl">
            <h2 className="text-xl sm:text-3xl font-bold font-tactical text-slate-900 mb-1">
              LA REVOLUCIÓN CINEMÁTICA: BROWNING-PETTER-SIG
            </h2>
            <h3 className="text-xs sm:text-sm font-mono text-amber-700 mb-5 uppercase tracking-wider font-semibold">
              El principio de acerrojado que copió la industria militar mundial
            </h3>

            {/* MOBILE VIEW: Stacked Comparative Cards (Zero horizontal scroll!) */}
            <div className="block lg:hidden space-y-3 mb-6">
              {COMPARISONS_DATA.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-700 uppercase block">
                    {item.param}
                  </span>
                  <div className="p-2.5 rounded-xl bg-red-50/80 border border-red-200/60">
                    <span className="text-[10px] font-mono font-bold text-red-700 uppercase block">Colt 1911 (Browning Clásico):</span>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.classic1911}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">P220 (Browning-Petter-SIG):</span>
                    <p className="text-xs text-slate-800 font-medium mt-0.5 leading-relaxed">{item.p220Sig}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: Table */}
            <div className="hidden lg:block overflow-x-auto mb-8 rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-mono text-slate-700">
                    <th className="p-3">Parámetro de Diseño</th>
                    <th className="p-3 text-red-600">Arquitectura Browning Colt 1911</th>
                    <th className="p-3 text-emerald-700">Sistema Browning-Petter-SIG (P220)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-600 bg-white">
                  {COMPARISONS_DATA.map((c, i) => (
                    <tr key={i}>
                      <td className="p-3 font-semibold text-slate-900">{c.param}</td>
                      <td className="p-3 text-slate-500">{c.classic1911}</td>
                      <td className="p-3 text-emerald-700 font-semibold">{c.p220Sig}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4-Point Safety Section */}
            <h4 className="font-tactical text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              SISTEMA INTEGRAL DE 4 PUNTOS DE SEGURIDAD PASIVA:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-amber-800 font-mono font-bold text-xs uppercase block mb-1">
                  1. Bloqueo Automático de Aguja
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Un émbolo cilíndrico de acero inmoviliza físicamente la aguja percutora. Solo en el último milímetro de presión deliberada del disparador se eleva el desbloqueador.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-amber-800 font-mono font-bold text-xs uppercase block mb-1">
                  2. Escalón de Seguridad (Fangraste)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Si el martillo se resbala al montarlo manualmente o si sufre un impacto por caída, el fiador queda atrapado en el escalón impidiendo que toque la aguja.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-amber-800 font-mono font-bold text-xs uppercase block mb-1">
                  3. Desconectador Fuera de Batería
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Si la corredera está abierta aunque sea un milímetro, una leva inferior empuja la barra de disparo hacia abajo para evitar detonaciones accidentales.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-amber-800 font-mono font-bold text-xs uppercase block mb-1">
                  4. Aguja Inercial Flotante
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  La aguja es más corta que su canal interno y permanece retrasada por un fuerte resorte. Jamás asoma si no recibe el impacto del martillo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: ESPECIFICACIONES MIL-SPEC */}
      {activeTab === 'especificaciones' && (
        <div className="glass-panel-light p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl">
          <h2 className="text-xl sm:text-3xl font-bold font-tactical text-slate-900 mb-1">
            MATRIZ TÉCNICA MIL-SPEC OFICIAL
          </h2>
          <h3 className="text-xs sm:text-sm font-mono text-amber-700 mb-5 uppercase tracking-wider font-semibold">
            Tolerancias y medidas de la SIG Sauer P220 calibre .45 ACP
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {TECHNICAL_SPECS.map((spec, sIdx) => (
              <div
                key={sIdx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200 gap-1 sm:gap-2"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    {spec.category}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    {spec.label}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-700 sm:text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: VARIANTES DE ÉLITE */}
      {activeTab === 'variantes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {VARIANTS_LIST.map((variant) => (
            <div
              key={variant.id}
              className="glass-panel-light p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-mono font-bold border border-amber-500/30">
                    {variant.imageBadge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{variant.year}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-tactical text-slate-900 mb-0.5">
                  {variant.name}
                </h3>
                <h4 className="text-xs font-mono text-amber-700 mb-3 font-semibold">
                  {variant.finish} • {variant.caliber}
                </h4>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {variant.description}
                </p>

                <div className="space-y-1.5 mb-5">
                  {variant.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs font-mono text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs font-mono text-slate-500">
                <span>Capacidad: <strong className="text-slate-900">{variant.capacity}</strong></span>
                <span>Raíl: <strong className="text-slate-900">{variant.rail}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 6: SIMULADOR BALÍSTICO .45 ACP */}
      {activeTab === 'balistica' && (
        <div className="glass-panel-light p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            <h2 className="text-xl sm:text-3xl font-bold font-tactical text-slate-900">
              CALCULADORA DE ENERGÍA BALÍSTICA .45 ACP
            </h2>
          </div>
          <h3 className="text-xs sm:text-sm font-mono text-amber-700 mb-5 uppercase tracking-wider font-semibold">
            Física aplicada: Energía cinética en boca según masa de punta y velocidad de deflagración
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-6">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-700 font-semibold">PESO DE PUNTA:</span>
                  <span className="text-amber-700 font-bold">{bulletWeightGr} gr ({(bulletWeightGr * 0.0647989).toFixed(1)} g)</span>
                </div>
                <input
                  type="range"
                  min="165"
                  max="255"
                  step="5"
                  value={bulletWeightGr}
                  onChange={(e) => setBulletWeightGr(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>165 gr</span>
                  <span>185 gr (+P)</span>
                  <span>200 gr</span>
                  <span>230 gr (Mil-Spec)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-700 font-semibold">VELOCIDAD EN BOCA:</span>
                  <span className="text-sky-700 font-bold">{muzzleVelocityFps} fps ({(muzzleVelocityFps * 0.3048).toFixed(0)} m/s)</span>
                </div>
                <input
                  type="range"
                  min="750"
                  max="1150"
                  step="10"
                  value={muzzleVelocityFps}
                  onChange={(e) => setMuzzleVelocityFps(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>750 fps</span>
                  <span>850 fps (Estándar)</span>
                  <span>1,000 fps (+P)</span>
                </div>
              </div>

              {/* Load Presets */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                <span className="text-xs font-mono text-slate-500 self-center">Preajustes:</span>
                {[
                  { name: '230 gr FMJ', gr: 230, fps: 850 },
                  { name: '185 gr +P JHP', gr: 185, fps: 1020 },
                  { name: '200 gr SWC', gr: 200, fps: 870 },
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      soundEngine.playClick();
                      setBulletWeightGr(preset.gr);
                      setMuzzleVelocityFps(preset.fps);
                    }}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg glass-panel-light hover:bg-slate-100 border border-slate-200 text-amber-800 cursor-pointer shadow-sm"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Telemetry Display */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="glass-panel-light p-4 rounded-2xl border border-amber-500/40 text-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">ENERGÍA CINÉTICA</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-700 block mb-1">
                  {energyJoules}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-amber-800 uppercase font-semibold">JOULES (SI)</span>
              </div>

              <div className="glass-panel-light p-4 rounded-2xl border border-sky-500/40 text-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">ENERGÍA EN BOCA</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-sky-700 block mb-1">
                  {energyFtLbs}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-sky-800 uppercase font-semibold">PIES-LIBRA (FT-LBS)</span>
              </div>

              <div className="col-span-2 glass-panel-light p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
                <span className="text-amber-700 font-bold">Fórmula física: </span>
                <span>Ec = 0.5 · m · v². La masa pesada de 230 grains en calibre .45 ACP garantiza máxima transferencia de momento lineal sin sobrepenetración excesiva.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
