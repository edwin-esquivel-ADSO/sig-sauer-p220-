import React from 'react';
import { X, Check, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface RealPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealPhotoModal: React.FC<RealPhotoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-semibold block">
                REFERENCIA VISUAL DE ARMERÍA OFICIAL
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-tactical text-slate-900">
                SIG Sauer P220 .45 ACP — Fotografía Real vs Modelo 3D
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Photo Showcase */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center p-4 sm:p-8 shadow-inner">
            <img
              src="/p220-real.png"
              alt="SIG Sauer P220 .45 ACP Fotografía Real"
              className="max-h-[380px] w-auto object-contain drop-shadow-2xl transition-transform hover:scale-105 duration-300"
            />
            <div className="absolute bottom-3 right-4 text-[11px] font-mono text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm backdrop-blur-md">
              SIG Sauer P220 .45 ACP (Acabado Nitron & Chasis 7075-T6)
            </div>
          </div>

          {/* Details & Architecture Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 uppercase mb-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Corredera y Ventana</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Perfil plano característico con biseles superiores y recámara prismática en acero inoxidable pulido visible en la ventana de expulsión con la inscripción <strong>.45 Auto</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 uppercase mb-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Cachas y Medallón</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patrón de picado antideslizante con el característico contorno circular del tornillo central y diseño ergonómico monohilera de 38 mm de grosor.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 uppercase mb-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Mandos y Palanca</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Disposición clásica: palanca de desamartillado <em>Entspannhebel</em>, retenida de corredera y pasador de desmontaje rápido sin herramientas.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Comparativa fotográfica 1:1 con el modelo 3D procedural
          </span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-tactical font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            VOLVER AL MODELO 3D
          </button>
        </div>
      </div>
    </div>
  );
};
