import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { MemoryPhoto } from '../types';
import { RANDOM_MEMORY_MESSAGES } from '../data/storyData';
import { Heart, Sparkles, X, RefreshCw, QrCode, Camera, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface SectionEndingProps {
  photos: MemoryPhoto[];
  onOpenQR?: () => void;
  onUpdateLastPhoto?: (photoUrl: string) => void;
}

export const SectionEnding: React.FC<SectionEndingProps> = ({
  photos,
  onOpenQR,
  onUpdateLastPhoto,
}) => {
  const [activeMemory, setActiveMemory] = useState<{
    photo: MemoryPhoto;
    message: string;
  } | null>(null);
  const [isUploadingLastPhoto, setIsUploadingLastPhoto] = useState(false);

  // The last picture in the collection
  const lastPhoto = photos.length > 0 ? photos[photos.length - 1] : null;

  const handleShowRandomMemory = () => {
    if (photos.length === 0) return;

    // Trigger soft romantic petal confetti
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#fda4af', '#f472b6', '#fbbf24', '#fbcfe8', '#e11d48'],
      shapes: ['circle'],
      scalar: 0.9,
      ticks: 200,
    });

    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    const randomMsg = RANDOM_MEMORY_MESSAGES[Math.floor(Math.random() * RANDOM_MEMORY_MESSAGES.length)];

    setActiveMemory({
      photo: randomPhoto,
      message: randomMsg,
    });
  };

  const handleNextRandomMemory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length === 0) return;
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    const randomMsg = RANDOM_MEMORY_MESSAGES[Math.floor(Math.random() * RANDOM_MEMORY_MESSAGES.length)];
    setActiveMemory({
      photo: randomPhoto,
      message: randomMsg,
    });
  };

  const handleLastPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateLastPhoto) return;

    try {
      setIsUploadingLastPhoto(true);
      const compressed = await compressImage(file, 1920, 1080, 0.88);
      onUpdateLastPhoto(compressed);
    } catch (err) {
      console.error('Failed to update last photo:', err);
    } finally {
      setIsUploadingLastPhoto(false);
    }
  };

  return (
    <section id="ending-section" className="relative pt-28 pb-44 px-4 sm:px-6 lg:px-12 overflow-hidden">
      {/* Dark background transitioning into warm sunrise/candlelight */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e0407] via-[#240813] to-[#451020] pointer-events-none -z-20" />
      <div className="absolute bottom-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.2)_0%,rgba(153,27,62,0.15)_50%,transparent_85%)] pointer-events-none -z-10" />

      {/* Main Ending Container */}
      <div className="max-w-4xl mx-auto text-center space-y-10">
        
        {/* Step 1: "Our story isn't perfect." */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1 }}
          className="font-serif-cormorant text-3xl sm:text-4xl text-stone-300/90 italic font-light"
        >
          Our story isn't perfect.
        </motion.p>

        {/* Step 2: "But it's ours." */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="font-serif-cormorant text-4xl sm:text-5xl text-rose-200 font-normal italic"
        >
          But it's ours.
        </motion.p>

        {/* Step 3: "I'd still like to write the next chapter with you." */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-display text-2xl sm:text-3xl text-amber-200/90 font-light"
        >
          I'd still like to write the next chapter with you.
        </motion.p>

        {/* Featured Climax: Last Picture of Us in 16:9 Format */}
        {lastPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="pt-4 pb-2"
          >
            <div className="relative w-full max-w-3xl mx-auto">
              {/* Soft warm backlight */}
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-600/30 via-amber-500/20 to-rose-600/30 rounded-[2.5rem] blur-xl -z-10 opacity-70" />

              {/* 16:9 Image Container */}
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-2 border-pink-400/30 bg-[#190610] group">
                <img
                  src={lastPhoto.url}
                  alt={lastPhoto.caption || "Last picture of Nancy and Santosh"}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120308]/90 via-[#120308]/20 to-transparent pointer-events-none" />

                {/* Top Badge: 16:9 Climax Tag */}
                <div className="absolute top-3.5 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-amber-200 border border-amber-300/30 text-xs font-sans-clean backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Our Journey Together</span>
                </div>

                {/* Direct Upload button for the last 16:9 photo */}
                {onUpdateLastPhoto && (
                  <label className="absolute top-3.5 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/95 text-pink-200 hover:text-white text-xs font-sans-clean border border-pink-400/40 backdrop-blur-md cursor-pointer transition hover:scale-105 shadow-lg">
                    <Camera className="w-3.5 h-3.5 text-pink-400" />
                    <span>{isUploadingLastPhoto ? 'Updating...' : 'Change Last Picture'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLastPhotoUpload}
                    />
                  </label>
                )}

                {/* Bottom Caption Overlay in 16:9 Frame */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 text-center pointer-events-none">
                  <p className="font-serif-cormorant text-rose-100 text-xl sm:text-3xl font-medium italic tracking-tight drop-shadow-md">
                    “{lastPhoto.caption || 'Where every ordinary moment turned into something unforgettable.'}”
                  </p>
                  <p className="text-xs sm:text-sm text-pink-200/80 font-sans-clean mt-1">
                    {lastPhoto.category} • {lastPhoto.date || 'Always in my heart'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Final Declaration: "❤️ I Love You, Nancy" & "— Always yours, Santosh" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.3, delay: 0.7 }}
          className="pt-6 sm:pt-8 space-y-3"
        >
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400 fill-rose-500 animate-pulse" />
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-rose-100 font-normal tracking-tight">
              I Love You, Nancy
            </h2>
          </div>
          <p className="font-script text-3xl sm:text-4xl text-amber-300/90 pt-1">
            — Always yours, Santosh
          </p>
        </motion.div>

        {/* Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, delay: 0.9 }}
          className="pt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={handleShowRandomMemory}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#941b3c] to-[#b3274d] hover:from-[#a82246] hover:to-[#c62f57] text-white font-sans-clean font-medium text-sm sm:text-base shadow-[0_0_30px_rgba(244,114,182,0.3)] border border-pink-400/30 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>One More Memory</span>
            <span className="text-pink-200 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          {onOpenQR && (
            <button
              onClick={onOpenQR}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-rose-100 font-sans-clean font-medium text-sm sm:text-base border border-white/15 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-pink-300" />
              <span>Get Website QR Code</span>
            </button>
          )}
        </motion.div>

      </div>

      {/* Random Memory Reveal Modal (16:9 format) */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full bg-[#1e0712] border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveMemory(null)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-white/5 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Memory Message */}
              <span className="text-xs uppercase tracking-wider font-sans-clean text-pink-300/80 font-medium">
                A Moment In Time
              </span>

              <h3 className="font-serif-cormorant text-2xl sm:text-3xl text-rose-100 font-medium my-2">
                “{activeMemory.message}”
              </h3>

              {/* Photo in 16:9 format */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-black/40 my-4 shadow-inner border border-white/10">
                <img
                  src={activeMemory.photo.url}
                  alt={activeMemory.photo.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Caption */}
              <p className="font-serif-cormorant text-lg text-amber-200/90 italic">
                “{activeMemory.photo.caption}”
              </p>
              <p className="text-xs text-stone-400 font-sans-clean mt-1">
                {activeMemory.photo.category} • {activeMemory.photo.date || 'Our Memory'}
              </p>

              {/* Another Random Memory Button */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                <button
                  onClick={handleNextRandomMemory}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-rose-100 text-xs font-sans-clean transition cursor-pointer hover:scale-105"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-pink-300" />
                  <span>Show another memory</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
