import React from 'react';
import { motion } from 'motion/react';
import { FUTURE_MOMENTS } from '../data/storyData';
import { Sparkles, Compass } from 'lucide-react';

export const SectionGlowingRoad: React.FC = () => {
  return (
    <section id="future-path-section" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#561327]/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs tracking-wider uppercase mb-3"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>The Path Ahead</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl text-rose-100 font-normal tracking-tight"
        >
          If We Get Another Chapter...
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25 }}
          className="font-serif-cormorant text-xl sm:text-2xl text-stone-300/80 italic mt-3"
        >
          Not a fantasy. Just us, doing the little things with more care.
        </motion.p>
      </div>

      {/* Animated Path of Tiny Glowing Lights */}
      <div className="relative">
        {/* Continuous SVG Glowing Path Ribbon */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-24 pointer-events-none hidden md:block">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 800" fill="none">
            <path
              d="M 50 0 Q 30 100 50 200 T 50 400 T 50 600 T 50 800"
              stroke="url(#glowGradient)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(244,114,182,0.1)" />
                <stop offset="50%" stopColor="rgba(251,191,36,0.8)" />
                <stop offset="100%" stopColor="rgba(244,114,182,0.2)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Path Items */}
        <div className="space-y-6 sm:space-y-8">
          {FUTURE_MOMENTS.map((moment, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: (idx % 4) * 0.1 }}
                className={`relative flex items-center ${
                  isLeft ? 'md:justify-start' : 'md:justify-end'
                } justify-center`}
              >
                {/* Center Node on desktop */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.9)] items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>

                {/* Milestone Stepping Stone */}
                <div className="w-full md:w-[44%]">
                  <div className="rounded-2xl glass-wine p-5 sm:p-6 border border-pink-500/20 shadow-lg backdrop-blur-md group hover:border-amber-400/40 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] transition-all duration-300">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-6 h-6 rounded-full bg-amber-400/15 border border-amber-300/30 flex items-center justify-center text-amber-300 text-xs">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl text-rose-100 font-normal">
                        {moment.text}
                      </h3>
                    </div>
                    <p className="font-serif-cormorant text-stone-300/80 text-base sm:text-lg italic pl-9">
                      {moment.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Culmination message */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2 }}
        className="mt-24 text-center max-w-xl mx-auto space-y-3"
      >
        <div className="w-12 h-px bg-amber-400/50 mx-auto mb-6" />
        <p className="font-sans-clean text-stone-300/80 text-lg font-light tracking-wide">
          Not a perfect relationship.
        </p>
        <p className="font-display text-3xl sm:text-4xl text-amber-200 font-normal tracking-tight">
          Just a better one.
        </p>
      </motion.div>
    </section>
  );
};
