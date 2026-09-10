import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Download, ExternalLink, ShieldCheck, Heart, Smartphone, Lock, Unlock } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  passcodeEnabled: boolean;
  passcode: string;
  onTogglePasscode: (enabled: boolean) => void;
  onChangePasscode: (newPass: string) => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  passcodeEnabled,
  passcode,
  onTogglePasscode,
  onChangePasscode,
}) => {
  const [copied, setCopied] = useState(false);
  const [includeAutoUnlock, setIncludeAutoUnlock] = useState(true);
  const [isEditingPasscode, setIsEditingPasscode] = useState(false);
  const [tempPasscode, setTempPasscode] = useState(passcode);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Compute the exact URL
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : 'https://ais-pre-yaok3nrsuwnhq2gutd63s7-123770666421.asia-east1.run.app';

  // Construct target link based on passcode and auto-unlock settings
  let finalUrl = baseUrl;
  if (passcodeEnabled && includeAutoUnlock && passcode.trim()) {
    finalUrl = `${baseUrl}?key=${encodeURIComponent(passcode.trim().toLowerCase())}`;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = finalUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownloadQR = () => {
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
        // Draw elegant dark background
        ctx.fillStyle = '#14060c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw outer border
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, 940, 940);

        // Draw title
        ctx.fillStyle = '#ffe4e6';
        ctx.font = 'bold 44px serif';
        ctx.textAlign = 'center';
        ctx.fillText('For Nancy ❤️ From Santosh', 500, 110);

        // Draw QR
        ctx.drawImage(img, 150, 160, 700, 700);

        // Draw subtitle
        ctx.fillStyle = '#fda4af';
        ctx.font = '30px sans-serif';
        ctx.fillText('Scan with camera to open our story', 500, 920);

        const a = document.createElement('a');
        a.download = 'Our-Story-Nancy-QR.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 text-stone-200">
      <div className="relative w-full max-w-lg bg-[#1a0711] border border-pink-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#250917]">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-pink-400" />
            <div>
              <h2 className="font-serif-cormorant text-xl sm:text-2xl font-semibold text-rose-100">
                Share Link & QR Code
              </h2>
              <p className="text-[11px] text-stone-400 font-sans-clean">
                For Nancy to open on her phone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center text-center">
            <div
              ref={qrRef}
              className="p-5 rounded-3xl bg-white shadow-[0_0_40px_rgba(244,114,182,0.35)] border-4 border-pink-300 relative inline-block transition-transform hover:scale-105"
            >
              <QRCodeSVG
                value={finalUrl}
                size={210}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e11d48"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
                  x: undefined,
                  y: undefined,
                  height: 38,
                  width: 38,
                  excavate: true,
                }}
              />
            </div>
            
            <p className="font-serif-cormorant text-lg text-rose-200 mt-4 italic">
              Point phone camera at this QR code to open
            </p>
            <p className="text-xs text-stone-400 font-sans-clean max-w-xs mt-0.5">
              Works instantly with iPhone Camera, Android Google Lens, or any QR scanner.
            </p>
          </div>

          {/* Website Link Box */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-pink-300 font-sans-clean font-medium">
              Private Website Link:
            </label>
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/50 border border-white/10">
              <input
                type="text"
                readOnly
                value={finalUrl}
                className="w-full bg-transparent px-2 text-xs sm:text-sm text-pink-100 font-mono focus:outline-none select-all truncate"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-700 hover:bg-pink-600 text-white text-xs font-sans-clean font-medium shrink-0 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Privacy & Passcode Settings */}
          <div className="p-4 rounded-2xl bg-[#2b0c1b] border border-pink-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-rose-100 font-sans-clean">
                  Privacy & Access Protection
                </span>
              </div>
              <button
                onClick={() => onTogglePasscode(!passcodeEnabled)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  passcodeEnabled ? 'bg-pink-600' : 'bg-stone-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    passcodeEnabled ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-[11px] text-stone-300/90 leading-relaxed">
              {passcodeEnabled
                ? 'Passcode lock is ON. Nancy can unlock it by typing the secret passcode, or the link above can automatically unlock it for her.'
                : 'Passcode lock is OFF. Anyone with this secret link or QR code can view the story directly.'}
            </p>

            {passcodeEnabled && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">Current Passcode:</span>
                  {isEditingPasscode ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempPasscode}
                        onChange={(e) => setTempPasscode(e.target.value)}
                        className="bg-black/60 border border-pink-400 rounded px-2 py-0.5 text-xs text-white w-24 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          onChangePasscode(tempPasscode.trim() || 'nancy');
                          setIsEditingPasscode(false);
                        }}
                        className="px-2 py-0.5 bg-pink-700 text-[10px] rounded text-white"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-pink-300 font-bold uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        {passcode}
                      </span>
                      <button
                        onClick={() => {
                          setTempPasscode(passcode);
                          setIsEditingPasscode(true);
                        }}
                        className="text-[10px] text-stone-400 hover:text-pink-300 underline"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includeAutoUnlock}
                    onChange={(e) => setIncludeAutoUnlock(e.target.checked)}
                    className="accent-pink-600 rounded"
                  />
                  <span className="text-[11px] text-stone-300 font-sans-clean">
                    Auto-unlock when Nancy taps the shared link (recommended)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleDownloadQR}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-medium font-sans-clean border border-white/10 transition"
            >
              <Download className="w-4 h-4 text-pink-300" />
              <span>Download QR Image</span>
            </button>
            <a
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#941b3c] to-[#b3274d] hover:from-[#a82246] hover:to-[#c62f57] text-white text-xs font-medium font-sans-clean border border-pink-400/30 transition shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test Link in Tab</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
