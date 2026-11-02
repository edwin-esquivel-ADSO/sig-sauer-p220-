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
  Info,
  CheckCircle2,
  Flame,
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
}

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
}) => {
  const [activeTab, setActiveTab] = useState<'inspector' | 'historia' | 'ingenieria' | 'especificaciones' | 'variantes' | 'balistica'>('inspector');
  
  // Ballistics calculator state
  const [bulletWeightGr, setBulletWeightGr] = useState<number>(230);
  const [muzzleVelocityFps, setMuzzleVelocityFps] = useState<number>(850);

  // E = 0.5 * m * v^2 where m is in kg, v is in m/s
  // 1 grain = 0.0647989 grams; 1 fps = 0.3048 m/s
  const massKg = (bulletWeightGr * 0.06479891) / 1000;
  const velocityMs = muzzleVelocityFps * 0.3048;
  const energyJoules = Math.round(0.5 * massKg * Math.pow(velocityMs, 2));
  const energyFtLbs = Math.round((bulletWeightGr * Math.pow(muzzleVelocityFps, 2)) / 450436);

  const selectedPart: PartDetail | undefined = PARTS_CATALOG.find(
    (p) => p.id === selectedPartId
  ) || PARTS_CATALOG[0];

  return (
    <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* 3D Workbench Controls Panel */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-tactical text-base sm:text-lg font-bold text-white tracking-wide">
                CONTROLES CINEMÁTICOS DE ARMERÍA 3D
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Ajuste milimétrico de despiece, radiografía X-Ray y simulación de ciclo
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playSlideRack();
                onFireGun();
              }}
              className="px-3 py-2 bg-gradient-to-r from-red-600/80 to-amber-600/80 hover:from-red-500 hover:to-amber-500 text-white font-tactical font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-red-900/20 transition-all border border-red-500/30 cursor-pointer"
              title="Ciclar corredera y percutir martillo"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>CICLAR / DISPARO</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playDecocker();
                onDecockGun();
              }}
              className="px-3 py-2 glass-panel hover:bg-slate-800 text-amber-400 font-tactical font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-amber-500/30 cursor-pointer"
              title="Desamartillar de forma segura con Entspannhebel"
            >
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>ENTSPANNHEBEL (DECOCK)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleXRay();
              }}
              className={`px-3 py-2 font-tactical font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border cursor-pointer ${
                isXRay
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-cyan-500/20'
                  : 'glass-panel text-slate-300 border-white/10 hover:border-cyan-500/40'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isXRay ? 'RAYOS-X ACTIVO' : 'MODO RAYOS-X'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onResetView();
              }}
              className="px-3 py-2 glass-panel hover:bg-slate-800 text-slate-400 hover:text-white font-tactical font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer"
              title="Restablecer posición de cámara y ensamblaje"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET</span>
            </button>
          </div>
        </div>

        {/* Exploded View Slider */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-amber-400 font-bold">DESPIECE MECÁNICO:</span>
            <span>{Math.round(explosionFactor * 100)}%</span>
          </div>

          <div className="flex-1 max-w-md mx-auto sm:mx-0 w-full flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500">ENSAMBLADA</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explosionFactor}
              onChange={(e) => {
                onExplosionChange(parseFloat(e.target.value));
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] font-mono text-amber-500">DESPIECE 100%</span>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5">
            {[0, 0.35, 0.7, 1.0].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  soundEngine.playClick();
                  onExplosionChange(preset);
                }}
                className={`px-2 py-1 text-[11px] font-mono rounded-md border transition-all cursor-pointer ${
                  Math.abs(explosionFactor - preset) < 0.05
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {Math.round(preset * 100)}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-tactical text-xs sm:text-sm font-semibold tracking-wider transition-all whitespace-nowrap border cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                  : 'glass-panel text-slate-400 hover:text-slate-200 border-white/5 hover:border-white/15'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: INSPECTOR DE COMPONENTES */}
      {activeTab === 'inspector' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Components Selector List */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              Selecciona una pieza para inspección:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {PARTS_CATALOG.map((part) => {
                const isSelected = selectedPartId === part.id;
                return (
                  <button
                    key={part.id}
                    onClick={() => {
                      soundEngine.playClick();
                      onSelectPart(part.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'glass-panel border-white/5 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-tactical font-bold text-white group-hover:text-amber-300 transition-colors">
                          {part.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block italic">
                        {part.germanName}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-amber-400 block font-semibold">
                        {part.weight}
                      </span>
                      <ChevronRight className={`w-4 h-4 ml-auto text-slate-500 transition-transform ${isSelected ? 'rotate-90 text-amber-400' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Part High-Tech Dossier Card */}
          <div className="lg:col-span-7">
            {selectedPart && (
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-500/30 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                {/* Tactical Corner Accents */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10 border-t-2 border-r-2 border-amber-500" />

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-mono uppercase font-semibold border border-amber-500/30 inline-block mb-2">
                      SUB-CONJUNTO TÁCTICO // {selectedPart.category.toUpperCase()}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-tactical text-white">
                      {selectedPart.name}
                    </h2>
                    <h3 className="text-sm font-mono text-amber-400/90 italic">
                      Denominación Sauer: {selectedPart.germanName}
                    </h3>
                  </div>

                  <div className="text-right glass-panel px-3 py-2 rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Masa Oficial</span>
                    <span className="text-lg font-bold font-mono text-amber-400">{selectedPart.weight}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {selectedPart.description}
                </p>

                {/* Metallurgy & Materials Badge */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>METALURGIA Y TRATAMIENTO TÉRMICO:</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    {selectedPart.material}
                  </p>
                </div>

                {/* Engineering Breakthrough Fact */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-6">
                  <div className="flex items-center gap-2 text-xs font-tactical text-amber-400 font-bold mb-1 uppercase tracking-wide">
                    <Info className="w-4 h-4" />
                    <span>Hito de Ingeniería de Precisión:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                    {selectedPart.engineeringFact}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {selectedPart.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="glass-panel p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase mb-1">
                        {spec.label}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold font-mono text-white">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Maintenance Protocol */}
                <div className="flex items-start gap-3 text-xs font-mono text-slate-400 border-t border-slate-800 pt-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-emerald-400 font-bold uppercase">Protocolo de Mantenimiento de Armería: </span>
                    <span>{selectedPart.maintenanceNote}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: GÉNESIS E HISTORIA (1975–HOY) */}
      {activeTab === 'historia' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold font-tactical text-white mb-2">
              EL NACIMIENTO DE LA SIG SAUER P220
            </h2>
            <h3 className="text-sm font-mono text-amber-400 mb-6 uppercase tracking-wider">
              De los Alpes Suizos a la Leyenda Mundial del .45 ACP
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-bold font-tactical text-sm block mb-2 uppercase">
                  1. El Reemplazo de la P210 (1975)
                </span>
                La legendaria SIG P210 era insuperablemente precisa, pero requería semanas de mecanizado a mano sobre bloques macizos forjados. Con 970 g de peso y costes prohibitivos, el Ejército Suizo encargó una pistola ligera con armazón de aluminio y acción Doble Acción inmediata: nació la <strong>Pistole 75 (P75)</strong>.
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-bold font-tactical text-sm block mb-2 uppercase">
                  2. La Ley de Neutralidad Suiza
                </span>
                La Constitución y la ley suiza de material de guerra (<em>Kriegsmaterialgesetz</em>) prohibían exportar armas a naciones en conflicto. Para sortear esta traba legal y vender globalmente, SIG en Neuhausen se alió con la bicentenaria <strong>J.P. Sauer & Sohn GmbH</strong> en Eckernförde, Alemania Occidental, fundando el imperio SIG Sauer.
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-bold font-tactical text-sm block mb-2 uppercase">
                  3. La Conquista del .45 ACP
                </span>
                Importada inicialmente por Browning en 1977 como la Browning BDA, la P220 demostró al mercado norteamericano que una pistola de Doble Acción en .45 ACP podía alimentar munición hueca comercial con fiabilidad absoluta, sentando la base de las P226 de los Navy SEALs.
              </div>
            </div>

            {/* Timeline */}
            <h4 className="font-tactical text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              LÍNEA TEMPORAL DE EVOLUCIÓN HISTÓRICA:
            </h4>

            <div className="space-y-4">
              {HISTORICAL_MILESTONES.map((milestone, mIdx) => (
                <div
                  key={mIdx}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl glass-panel border border-white/5 hover:border-amber-500/30 transition-all"
                >
                  <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono font-bold text-sm shrink-0 self-start">
                    {milestone.year}
                  </div>
                  <div>
                    <h5 className="font-tactical font-bold text-white text-base mb-1">
                      {milestone.title}
                    </h5>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
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
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold font-tactical text-white mb-2">
              LA REVOLUCIÓN CINEMÁTICA: BROWNING-PETTER-SIG
            </h2>
            <h3 className="text-sm font-mono text-amber-400 mb-6 uppercase tracking-wider">
              El principio de acerrojado que copió la industria militar mundial
            </h3>

            {/* Comparative Table: 1911 vs P220 */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/80 font-mono text-slate-300">
                    <th className="p-3">Parámetro de Diseño</th>
                    <th className="p-3 text-red-400">Arquitectura Browning Colt 1911</th>
                    <th className="p-3 text-emerald-400">Sistema Browning-Petter-SIG (P220)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">Bloqueo de Acerrojado</td>
                    <td className="p-3 text-slate-400">Tetones radiales superiores fresados en el cañón dentro de ranuras en la bóveda de la corredera.</td>
                    <td className="p-3 text-emerald-300 font-semibold">Bloque prismático de recámara que encaja directamente en la ventana de expulsión.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Leva de Descenso</td>
                    <td className="p-3 text-slate-400">Cadeneta basculante articulada con pasador flotante propensa a rotura por fatiga.</td>
                    <td className="p-3 text-emerald-300 font-semibold">Leva sólida integrada de una sola pieza en el cañón guiada por bloque de acero templado.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Tolerancia a Suciedad</td>
                    <td className="p-3 text-slate-400">Pólvora y barro en las ranuras radiales impiden el cierre completo del arma.</td>
                    <td className="p-3 text-emerald-300 font-semibold">Cualquier residuo es expulsado hacia afuera por la propia ventana con cada disparo.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Adopción Global</td>
                    <td className="p-3 text-slate-400">Limitada a pistolas tipo 1911 tradicionales.</td>
                    <td className="p-3 text-emerald-300 font-semibold">Copiada por Glock 17, HK USP, Walther P99/PDP, S&W M&P y Beretta APX.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4-Point Safety Section */}
            <h4 className="font-tactical text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              SISTEMA INTEGRAL DE 4 PUNTOS DE SEGURIDAD PASIVA:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-mono font-bold text-xs uppercase block mb-1">
                  1. Bloqueo Automático de Aguja Percutora
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Un émbolo cilíndrico de acero inmoviliza físicamente la aguja percutora en todo momento. Solo en el último milímetro de presión deliberada del disparador, la barra de transferencia eleva el desbloqueador para permitir el disparo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-mono font-bold text-xs uppercase block mb-1">
                  2. Escalón de Seguridad del Martillo (Fangraste)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Si el martillo se resbala al montarlo manualmente o si sufre un impacto por caída violenta, el fiador queda atrapado en el escalón de seguridad impidiendo que toque la aguja.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-mono font-bold text-xs uppercase block mb-1">
                  3. Desconectador por Fuera de Batería
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Si la corredera se encuentra abierta aunque sea un milímetro, una leva inferior empuja la barra de disparo hacia abajo, desconectando el disparador para evitar detonaciones fuera de recámara.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-mono font-bold text-xs uppercase block mb-1">
                  4. Aguja Inercial Flotante
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  La aguja es más corta que su canal interno y permanece retrasada por un fuerte resorte. Jamás asoma por la recámara si no recibe el impacto a alta velocidad del martillo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: ESPECIFICACIONES MIL-SPEC */}
      {activeTab === 'especificaciones' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold font-tactical text-white mb-2">
            MATRIZ TÉCNICA MIL-SPEC OFICIAL
          </h2>
          <h3 className="text-sm font-mono text-amber-400 mb-6 uppercase tracking-wider">
            Tolerancias y medidas de la SIG Sauer P220 calibre .45 ACP
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TECHNICAL_SPECS.map((spec, sIdx) => (
              <div
                key={sIdx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    {spec.category}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {spec.label}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: VARIANTES DE ÉLITE */}
      {activeTab === 'variantes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VARIANTS_LIST.map((variant) => (
            <div
              key={variant.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold border border-amber-500/30">
                    {variant.imageBadge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{variant.year}</span>
                </div>

                <h3 className="text-2xl font-bold font-tactical text-white mb-1">
                  {variant.name}
                </h3>
                <h4 className="text-xs font-mono text-amber-300 mb-3">
                  {variant.finish} • {variant.caliber}
                </h4>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {variant.description}
                </p>

                <div className="space-y-1.5 mb-6">
                  {variant.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
                <span>Capacidad: <strong className="text-white">{variant.capacity}</strong></span>
                <span>Raíl: <strong className="text-white">{variant.rail}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 6: SIMULADOR BALÍSTICO .45 ACP */}
      {activeTab === 'balistica' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2.5 mb-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl sm:text-3xl font-bold font-tactical text-white">
              CALCULADORA DE ENERGÍA BALÍSTICA .45 ACP
            </h2>
          </div>
          <h3 className="text-sm font-mono text-amber-400 mb-6 uppercase tracking-wider">
            Física aplicada: Energía cinética en boca según masa de punta y velocidad de deflagración
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">PESO DE PUNTA (GRAINS / GRAMOS):</span>
                  <span className="text-amber-400 font-bold">{bulletWeightGr} gr ({(bulletWeightGr * 0.0647989).toFixed(1)} g)</span>
                </div>
                <input
                  type="range"
                  min="165"
                  max="255"
                  step="5"
                  value={bulletWeightGr}
                  onChange={(e) => setBulletWeightGr(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>165 gr (Defensa ligera)</span>
                  <span>185 gr (+P)</span>
                  <span>200 gr (Target)</span>
                  <span>230 gr (Mil-Spec Ball)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">VELOCIDAD EN BOCA (FEET PER SECOND / M/S):</span>
                  <span className="text-cyan-400 font-bold">{muzzleVelocityFps} fps ({(muzzleVelocityFps * 0.3048).toFixed(0)} m/s)</span>
                </div>
                <input
                  type="range"
                  min="750"
                  max="1150"
                  step="10"
                  value={muzzleVelocityFps}
                  onChange={(e) => setMuzzleVelocityFps(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>750 fps (Carga blanda)</span>
                  <span>850 fps (Estándar 230gr)</span>
                  <span>1,000 fps (+P Hollow Point)</span>
                </div>
              </div>

              {/* Load Presets */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs font-mono text-slate-400 self-center">Preajustes oficiales:</span>
                {[
                  { name: 'Mil-Spec 230 gr FMJ', gr: 230, fps: 850 },
                  { name: 'Tactical 185 gr +P JHP', gr: 185, fps: 1020 },
                  { name: 'Match Target 200 gr SWC', gr: 200, fps: 870 },
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      soundEngine.playClick();
                      setBulletWeightGr(preset.gr);
                      setMuzzleVelocityFps(preset.fps);
                    }}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg glass-panel hover:bg-slate-800 border border-white/10 text-amber-300 cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Telemetry Display */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 text-center">
                <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">ENERGÍA CINÉTICA</span>
                <span className="text-3xl sm:text-4xl font-bold font-mono text-amber-400 block mb-1">
                  {energyJoules}
                </span>
                <span className="text-xs font-mono text-amber-300/80 uppercase">JOULES (SI)</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-cyan-500/40 text-center">
                <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">ENERGÍA EN BOCA</span>
                <span className="text-3xl sm:text-4xl font-bold font-mono text-cyan-400 block mb-1">
                  {energyFtLbs}
                </span>
                <span className="text-xs font-mono text-cyan-300/80 uppercase">PIES-LIBRA (FT-LBS)</span>
              </div>

              <div className="col-span-2 glass-panel p-4 rounded-xl border border-white/5 text-xs text-slate-300 font-mono">
                <span className="text-amber-400 font-bold">Fórmula física: </span>
                <span>Ec = 0.5 · m · v². La masa pesada de 230 grains en calibre .45 ACP garantiza máxima transferencia de momento lineal y deformación controlada sin sobrepenetración excesiva.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
