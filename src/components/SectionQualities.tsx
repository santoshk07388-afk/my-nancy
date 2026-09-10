import React from 'react';
import { motion } from 'motion/react';
import { QUALITIES } from '../data/storyData';
import { Heart, Brain, ShieldCheck, Flame, Award, Smile, Sparkles } from 'lucide-react';

const ICONS = [Heart, Brain, ShieldCheck, Flame, Award, Smile];

export const SectionQualities: React.FC = () => {
  return (
    <section id="qualities-section" className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#781636]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300 text-xs tracking-wider uppercase mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why You Are So Special To Me</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl text-rose-100 font-normal tracking-tight"
        >
          Nancy, What Makes You Irreplaceable
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25 }}
          className="font-serif-cormorant text-xl sm:text-2xl text-stone-300/80 italic mt-3"
        >
          The qualities that amaze me every day, and why my heart is safe only with you.
        </motion.p>
      </div>

      {/* Qualities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {QUALITIES.map((quality, index) => {
          const IconComponent = ICONS[index % ICONS.length];

          return (
            <motion.div
              key={quality.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.12 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative rounded-2xl glass-wine p-6 sm:p-7 border border-pink-500/20 shadow-xl transition-all duration-300 group hover:border-pink-400/40 hover:shadow-[0_15px_35px_rgba(153,27,62,0.25)] flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center text-pink-300 group-hover:scale-110 group-hover:text-pink-200 transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-sans-clean font-semibold px-2.5 py-0.5 rounded-full bg-[#1b0811] text-amber-300/90 border border-amber-400/20">
                    {quality.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl sm:text-3xl text-rose-100 font-normal tracking-tight mb-2">
                  {quality.title}
                </h3>

                {/* Primary Quote */}
                <p className="font-serif-cormorant text-xl sm:text-2xl text-pink-200/95 italic font-medium mb-3">
                  “{quality.quote}”
                </p>

                {/* Deep Personal Detail */}
                <p className="font-sans-clean text-stone-300/85 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                  {quality.detail}
                </p>
              </div>

              {/* Bottom decorative hint */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end text-xs text-pink-400/60 font-serif-cormorant italic">
                <span>Santosh's promise to Nancy</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
