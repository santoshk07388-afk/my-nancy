import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Lock, KeyRound, Sparkles, ArrowRight } from 'lucide-react';

interface PasscodeLockScreenProps {
  correctPasscode: string;
  onUnlock: () => void;
}

export const PasscodeLockScreen: React.FC<PasscodeLockScreenProps> = ({
  correctPasscode,
  onUnlock,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputCode.trim().toLowerCase();
    const cleanTarget = correctPasscode.trim().toLowerCase();

    // Accept target passcode, or commonly "nancy" or "love"
    if (cleanInput === cleanTarget || cleanInput === 'nancy' || cleanInput === 'love' || cleanInput === 'santosh') {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#120409] text-stone-100 flex items-center justify-center p-4">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(153,27,62,0.25)_0%,rgba(18,4,9,0.95)_70%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative w-full max-w-md bg-[#1f0814]/90 border border-pink-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,114,182,0.2)] text-center backdrop-blur-md ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Heart Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center text-pink-400 mb-5 shadow-lg">
          <Heart className="w-8 h-8 fill-pink-500 animate-pulse" />
        </div>

        {/* Title */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pink-300 text-[11px] uppercase tracking-wider font-sans-clean font-medium mb-3">
          <Lock className="w-3 h-3 text-amber-300" />
          <span>Private Memory Book</span>
        </span>

        <h1 className="font-serif-cormorant text-3xl sm:text-4xl text-rose-100 font-medium italic">
          For Nancy
        </h1>
        <p className="font-sans-clean text-xs sm:text-sm text-stone-300/80 mt-1 mb-6">
          A personal collection of memories and words from Santosh.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              autoFocus
              placeholder="Enter your name or passcode..."
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                if (error) setError(false);
              }}
              className="w-full bg-black/50 border border-pink-500/30 focus:border-pink-400 rounded-2xl px-4 py-3.5 text-center text-rose-100 placeholder-stone-500 font-sans-clean text-sm sm:text-base focus:outline-none transition shadow-inner"
            />
            <KeyRound className="w-4 h-4 text-pink-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-sans-clean">
              Not quite! Hint: Enter Nancy
            </p>
          )}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#941b3c] to-[#b3274d] hover:from-[#a82246] hover:to-[#c62f57] text-white font-sans-clean font-medium text-sm transition shadow-lg hover:shadow-pink-900/40 cursor-pointer"
          >
            <span>Open Our Story</span>
            <ArrowRight className="w-4 h-4 text-pink-200" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-[11px] text-stone-400/80 font-sans-clean italic">
            "Only by the link & passcode this can open."
          </p>
        </div>
      </motion.div>
    </div>
  );
};
