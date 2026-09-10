import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryPhoto } from '../types';
import { Sparkles, X, ChevronLeft, ChevronRight, MapPin, Calendar, Heart } from 'lucide-react';

interface SectionGalleryProps {
  photos: MemoryPhoto[];
  onOpenCustomizer?: () => void;
}

const CATEGORIES = [
  'All Memories',
  'Our hugs',
  'Our kisses',
  'Walking together',
  'Sitting together',
  'Watching movies',
  'Eating together',
  'Park dates',
  'Laughing together',
  'Working together',
  'Random everyday moments',
  'Silly moments',
  'Beautiful quiet moments',
];

export const SectionGallery: React.FC<SectionGalleryProps> = ({ photos, onOpenCustomizer }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Memories');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const filteredPhotos = selectedCategory === 'All Memories'
    ? photos
    : photos.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const openLightbox = (photo: MemoryPhoto) => {
    const idx = photos.findIndex((p) => p.id === photo.id);
    setActivePhotoIndex(idx !== -1 ? idx : 0);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
  };

  return (
    <section id="gallery-section" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300 text-xs tracking-wider uppercase mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cinematic Gallery</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl text-rose-100 font-normal tracking-tight"
        >
          But Then I Remember Us
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25 }}
          className="font-serif-cormorant text-xl sm:text-2xl text-stone-300/80 italic mt-3"
        >
          Every smile, every quiet evening, every ordinary moment that felt like home.
        </motion.p>

        {onOpenCustomizer && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500/15 hover:bg-pink-500/25 border border-pink-400/40 text-pink-200 text-xs sm:text-sm font-sans-clean font-medium shadow-[0_0_20px_rgba(244,114,182,0.2)] hover:scale-[1.02] transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Replace with Our Real Photos (Upload from Phone/PC)</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Categories Filter Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 mb-12 scrollbar-none justify-start md:justify-center px-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-sans-clean whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-rose-900/80 text-rose-100 border border-pink-400/40 shadow-[0_0_15px_rgba(244,114,182,0.25)]'
                  : 'bg-stone-900/50 text-stone-400 border border-stone-800 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Interactive Cinematic Memory Book Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {filteredPhotos.map((photo, index) => {
          const isLastPhoto = index === filteredPhotos.length - 1 && filteredPhotos.length > 1;
          // Alternate styles: Polaroid card vs cinematic frame
          const isPolaroid = !isLastPhoto && index % 2 === 0;
          const tilt = isLastPhoto ? 0 : (photo.rotation || (index % 2 === 0 ? -1.5 : 1.5));

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: (index % 3) * 0.15 }}
              whileHover={{ y: -6, scale: isLastPhoto ? 1.01 : 1.02 }}
              onClick={() => openLightbox(photo)}
              className={`group cursor-pointer ${isLastPhoto ? 'sm:col-span-2 lg:col-span-3' : ''}`}
            >
              {isLastPhoto ? (
                /* Grand Finale: Last Picture in 16:9 Format */
                <div className="relative rounded-3xl overflow-hidden glass-wine shadow-2xl p-3.5 sm:p-4 border border-pink-400/30 transition-all duration-500 group-hover:border-pink-400/60 group-hover:shadow-[0_20px_50px_rgba(244,114,182,0.2)]">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-stone-900 shadow-inner">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100508]/90 via-[#100508]/25 to-transparent pointer-events-none" />

                    {/* Top 16:9 Format Tag */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <span className="text-[11px] sm:text-xs uppercase font-sans-clean tracking-wider text-amber-200 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-amber-300/30 inline-flex items-center gap-1.5 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Featured 16:9 Memory</span>
                      </span>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-left">
                      <span className="text-[11px] uppercase font-sans-clean tracking-wider text-pink-300/90 bg-black/50 px-2.5 py-0.5 rounded backdrop-blur-sm">
                        {photo.category}
                      </span>
                      <p className="font-serif-cormorant text-rose-100 text-2xl sm:text-3xl font-medium mt-1.5 leading-snug drop-shadow-md">
                        “{photo.caption}”
                      </p>
                      {photo.location && (
                        <div className="flex items-center gap-1 text-xs text-stone-300 font-sans-clean mt-1">
                          <MapPin className="w-3.5 h-3.5 text-pink-400" />
                          <span>{photo.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : isPolaroid ? (
                /* Polaroid Style Memory Card */
                <div
                  style={{ transform: `rotate(${tilt}deg)` }}
                  className="bg-[#fbf7f2] p-4 pb-6 rounded-md shadow-2xl transition-all duration-500 group-hover:rotate-0 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)] relative"
                >
                  {/* Subtle tape effect at top */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-white/40 backdrop-blur-sm rotate-1 border-t border-b border-black/5 opacity-70" />

                  {/* Photo area */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-stone-200">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[11px] text-white/90 font-sans-clean bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                        Click to view
                      </span>
                    </div>
                  </div>

                  {/* Handwritten Polaroid Caption */}
                  <div className="pt-3 px-1">
                    <p className="font-serif-cormorant text-stone-900 text-lg sm:text-xl font-medium tracking-tight">
                      “{photo.caption}”
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-stone-600 font-sans-clean mt-1 pt-1 border-t border-stone-200">
                      <span>{photo.category}</span>
                      <span>{photo.date || 'Unforgettable'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Cinematic Borderless Frame Card */
                <div
                  style={{ transform: `rotate(${tilt}deg)` }}
                  className="relative rounded-2xl overflow-hidden glass-wine shadow-2xl p-2.5 transition-all duration-500 group-hover:rotate-0 group-hover:border-pink-500/30"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-900">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100508]/90 via-[#100508]/25 to-transparent" />

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                      <span className="text-[10px] uppercase font-sans-clean tracking-wider text-pink-300/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        {photo.category}
                      </span>
                      <p className="font-serif-cormorant text-rose-100 text-xl font-normal mt-1.5 leading-snug">
                        “{photo.caption}”
                      </p>
                      {photo.location && (
                        <div className="flex items-center gap-1 text-[11px] text-stone-400 font-sans-clean mt-1">
                          <MapPin className="w-3 h-3 text-pink-400" />
                          <span>{photo.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 text-stone-300 hover:text-white bg-white/10 p-2.5 rounded-full backdrop-blur-md transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Photo */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Photo */}
            <button
              onClick={nextPhoto}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[90vh] flex flex-col md:flex-row bg-[#1b0811] border border-pink-500/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Image */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[500px]">
                <img
                  src={photos[activePhotoIndex].url}
                  alt={photos[activePhotoIndex].caption}
                  className="w-full h-full max-h-[75vh] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Memory Details */}
              <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-gradient-to-b from-[#240c17] to-[#16060e] border-t md:border-t-0 md:border-l border-white/10">
                <div>
                  <div className="flex items-center justify-between text-xs text-pink-300 uppercase tracking-wider mb-2 font-sans-clean">
                    <span>{photos[activePhotoIndex].category}</span>
                    <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                  </div>

                  <h3 className="font-serif-cormorant text-2xl sm:text-3xl text-rose-100 font-medium leading-snug mt-3">
                    “{photos[activePhotoIndex].caption}”
                  </h3>

                  <div className="mt-6 space-y-2 text-xs text-stone-300 font-sans-clean">
                    {photos[activePhotoIndex].date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        <span>{photos[activePhotoIndex].date}</span>
                      </div>
                    )}
                    {photos[activePhotoIndex].location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" />
                        <span>{photos[activePhotoIndex].location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 text-stone-400 text-xs font-serif-cormorant italic">
                  Memory {activePhotoIndex + 1} of {photos.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
