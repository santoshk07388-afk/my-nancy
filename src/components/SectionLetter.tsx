import React from 'react';
import { motion } from 'motion/react';
import { LETTER_TEXT } from '../data/storyData';
import { MemoryPhoto } from '../types';
import { Feather, Heart } from 'lucide-react';

interface SectionLetterProps {
  photo?: MemoryPhoto;
}

export const SectionLetter: React.FC<SectionLetterProps> = ({ photo }) => {
  return (
    <section id="letter-section" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#601124]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300 text-xs tracking-wider uppercase mb-3 font-sans-clean">
          <Feather className="w-3.5 h-3.5" />
          <span>From My Heart</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl text-rose-100 font-normal tracking-tight">
          A Letter I Couldn't Say Properly
        </h2>
      </div>

      {/* Parchment / Handwritten Letter Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="relative rounded-3xl glass-letter text-[#2c1810] p-7 sm:p-12 md:p-16 shadow-[0_25px_70px_rgba(0,0,0,0.6)] border border-[#e5c07b]/30 overflow-hidden"
      >
        {/* Subtle decorative wax seal motif in corner */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 rounded-full bg-[#8c1d35] shadow-lg flex items-center justify-center border-2 border-[#b83350]/60 text-amber-200">
          <Heart className="w-5 h-5 fill-amber-200" />
        </div>

        {/* Faint subtle letter lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(180,140,110,0.06)_1px,transparent_1px)] bg-[size:100%_2rem] pointer-events-none" />

        {/* Letter Content */}
        <div className="relative z-10 space-y-6 font-serif-cormorant text-xl sm:text-2xl leading-relaxed text-[#2a1713]">
          {/* Salutation in script */}
          <p className="font-script text-4xl sm:text-5xl text-[#7a1930] pt-2">
            {LETTER_TEXT.greeting}
          </p>

          <p className="font-light">
            {LETTER_TEXT.p1}
          </p>

          <p className="font-light italic">
            {LETTER_TEXT.p2}
          </p>

          <p className="font-light">
            {LETTER_TEXT.p3}
          </p>

          <p className="font-light">
            {LETTER_TEXT.p4}
          </p>

          <p className="font-light">
            {LETTER_TEXT.p5}
          </p>

          <p className="font-light">
            {LETTER_TEXT.p6}
          </p>

          <p className="font-light">
            {LETTER_TEXT.p7}
          </p>

          <p className="font-medium text-[#7a1930]">
            {LETTER_TEXT.p8}
          </p>

          {/* Realistic bullet promises */}
          <div className="pl-4 sm:pl-6 space-y-2 border-l-2 border-[#b83350]/30 my-4 text-[#351a14] italic">
            {LETTER_TEXT.bullets.map((b, i) => (
              <p key={i} className="font-medium">
                — {b}
              </p>
            ))}
          </div>

          <p className="font-semibold text-2xl sm:text-3xl text-[#7a1930] pt-2">
            {LETTER_TEXT.p9}
          </p>

          <p className="font-light">
            {LETTER_TEXT.p10}
          </p>

          <p className="font-light">
            {LETTER_TEXT.p11}
          </p>

          <p className="text-base sm:text-lg font-sans-clean uppercase tracking-widest text-[#855345] pt-1">
            {LETTER_TEXT.p12}
          </p>

          <div className="w-16 h-px bg-[#b83350]/30 my-4" />

          {/* Keepsake Polaroid of Nancy & Santosh */}
          {photo && (
            <div className="my-6 flex justify-center">
              <div className="bg-[#fcf9f2] p-3 pb-5 rounded-lg shadow-xl border border-[#d4bc9e]/60 max-w-xs -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="relative aspect-[4/3] rounded overflow-hidden bg-stone-200">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Our memory'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="font-serif-cormorant text-[#4a2818] text-sm italic text-center mt-2.5 font-medium">
                  “{photo.caption || 'My favorite smile, my favorite person.'}”
                </p>
              </div>
            </div>
          )}

          <p className="font-medium text-xl sm:text-2xl text-[#7a1930]">
            {LETTER_TEXT.closing}
          </p>

          {/* Signature in romantic script */}
          <div className="pt-6 text-right">
            <p className="text-xs sm:text-sm font-sans-clean tracking-wider text-[#855345] uppercase">
              {LETTER_TEXT.signoff}
            </p>
            <p className="font-script text-4xl sm:text-5xl text-[#7a1930] mt-1">
              Santosh ❤️
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
