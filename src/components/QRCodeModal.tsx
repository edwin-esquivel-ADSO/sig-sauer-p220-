import React, { useState, useRef } from 'react';
import { X, QrCode, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { soundEngine } from '../utils/audio';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sig-sauer-p220.vercel.app';
  const [customUrl, setCustomUrl] = useState(currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1') ? 'https://sig-sauer-p220.vercel.app' : currentUrl);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(customUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    soundEngine.playClick();
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 900, 900);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'QR-SIG-Sauer-P220.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold block">
                COMPARTIR Y ESCANEAR
              </span>
              <h2 className="text-base sm:text-lg font-bold font-tactical text-slate-900">
                Código QR de la Experiencia SIG P220
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
            Escanea con cualquier celular para abrir la experiencia 3D en vivo sin necesidad de instalar nada.
          </p>

          {/* QR Container */}
          <div
            ref={qrRef}
            className="p-5 rounded-2xl bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/60 flex items-center justify-center"
          >
            <QRCodeSVG
              value={customUrl}
              size={220}
              level="H"
              includeMargin={false}
              fgColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>

          {/* URL Input */}
          <div className="w-full space-y-1.5 text-left">
            <label className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
              Enlace de destino (Vercel / Dominio):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://tu-proyecto.vercel.app"
                className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-tactical font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                title="Copiar enlace"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIADO' : 'COPIAR'}</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadQR}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-tactical font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>DESCARGAR QR (PNG HD)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                window.open(customUrl, '_blank');
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-tactical font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200"
            >
              <ExternalLink className="w-4 h-4 text-slate-600" />
              <span>PROBAR ENLACE</span>
            </button>
          </div>
        </div>

        {/* Footer recommendation tip */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 font-mono text-center">
          💡 <span className="font-semibold text-slate-700">Tip para imprimir:</span> Puedes descargar este QR en alta resolución directamente o usar <strong>QRCode Monkey</strong> para agregarle marco personalizado.
        </div>
      </div>
    </div>
  );
};
