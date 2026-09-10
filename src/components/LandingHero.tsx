import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ParticleHeartCanvas } from './ParticleHeartCanvas';
import { MemoryPhoto } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Music, ArrowDown, Sparkles } from 'lucide-react';

interface LandingHeroProps {
  photos: MemoryPhoto[];
  onOpenStory: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ photos, onOpenStory }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const unsub = audioEngine.subscribe((playing) => setIsPlaying(playing));
    return unsub;
  }, []);

  // Sequenced reveals with cinematic pacing
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);   // "Hey Love..."
    const t2 = setTimeout(() => setStep(2), 2200);  // "I made something for you."
    const t3 = setTimeout(() => setStep(3), 3900);  // "Not to convince you of anything."
    const t4 = setTimeout(() => setStep(4), 5600);  // "Just to remind you of us."

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handlePlayMusic = () => {
    audioEngine.toggle();
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#100508] px-4 py-12">
      {/* Background: Blurred collage of memories with dark overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30 select-none">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 w-[120%] h-[120%] -translate-x-[10%] -translate-y-[10%] filter blur-md scale-105">
          {photos.slice(0, 12).map((photo, i) => (
            <div
              key={photo.id || i}
              className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#230711]"
            >
              <img
                src={photo.url}
                alt=""
                className="w-full h-full object-cover grayscale-[30%] opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic dark ruby & charcoal gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#100508]/85 via-[#1a070f]/90 to-[#100508] backdrop-blur-[2px]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(117,16,47,0.25)_0%,rgba(16,5,8,0.95)_75%)]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center justify-center min-h-[75vh]">
        
        {/* Animated Heart Made from Tiny Glowing Particles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="mb-6 relative"
        >
          <ParticleHeartCanvas className="w-48 h-48 sm:w-56 sm:h-56" />
        </motion.div>

        {/* Sequenced Text Reveals */}
        <div className="min-h-[190px] sm:min-h-[210px] flex flex-col items-center justify-center space-y-3.5">
          
          {/* Step 1: "Hey Nancy..." */}
          <AnimatePresence>
            {step >= 1 && (
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="font-serif-cormorant text-4xl sm:text-5xl md:text-6xl text-[#fde8ef] tracking-wide font-normal italic drop-shadow-[0_2px_15px_rgba(244,114,182,0.3)]"
              >
                Hey Nancy...
              </motion.h1>
            )}
          </AnimatePresence>

          {/* Step 2: "I made something just for you." */}
          <AnimatePresence>
            {step >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="font-display text-xl sm:text-2xl text-pink-200/90 font-light tracking-normal"
              >
                I made something just for you.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Step 3: "Not to make excuses or force you into anything." */}
          <AnimatePresence>
            {step >= 3 && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="font-sans-clean text-stone-300/80 text-sm sm:text-base font-light max-w-md mx-auto"
              >
                Not to make excuses or force you into anything.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Step 4: "Just to tell you the complete truth from my heart, and remind you of us." */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="font-serif-cormorant text-2xl sm:text-3xl text-amber-200/95 italic font-medium pt-1 px-2"
              >
                “Just to tell you the truth from my heart, and remind you of us.”
              </motion.p>
            )}
          </AnimatePresence>

        </div>

        {/* Buttons: Primary "Open Our Story →" and "♫ Play Our Song" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 20 }}
          transition={{ duration: 1.0, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={onOpenStory}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#861937] via-[#a31f45] to-[#70122c] hover:from-[#9c1f42] hover:to-[#851635] text-rose-50 font-sans-clean font-medium text-base shadow-[0_0_35px_rgba(225,29,72,0.4)] border border-pink-400/30 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
          >
            <span>Open Our Story</span>
            <span className="text-pink-300 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          {/* Music toggle button in hero */}
          <button
            onClick={handlePlayMusic}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-stone-300 hover:text-pink-200 text-xs sm:text-sm font-sans-clean border border-white/10 transition backdrop-blur-sm cursor-pointer"
          >
            <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-pink-400 animate-bounce' : 'text-stone-400'}`} />
            <span>{isPlaying ? 'Pause Our Song' : '♫ Play Our Song'}</span>
          </button>
        </motion.div>

        {/* Subtle scroll cue */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-12 flex flex-col items-center gap-1 text-stone-400 text-xs font-light tracking-widest uppercase cursor-pointer"
            onClick={onOpenStory}
          >
            <span>Begin Journey</span>
            <ArrowDown className="w-3.5 h-3.5 text-pink-400 animate-bounce mt-1" />
          </motion.div>
        )}

      </div>
    </section>
  );
};
