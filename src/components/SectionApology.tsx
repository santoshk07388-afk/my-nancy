import React from 'react';
import { motion } from 'motion/react';
import { Heart, Clock, Moon, ShieldCheck, Home } from 'lucide-react';

export const SectionApology: React.FC = () => {
  return (
    <section id="apology-section" className="relative py-24 sm:py-36 px-4 sm:px-8 max-w-4xl mx-auto text-center">
      {/* Delicate background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#601227]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Intro lines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="space-y-2 mb-8"
      >
        <p className="font-serif-cormorant text-2xl sm:text-3xl text-pink-200/80 italic font-light">
          Before anything else, Nancy,
        </p>
        <p className="font-serif-cormorant text-xl sm:text-2xl text-pink-200/80 italic font-light">
          I want to speak to you with complete, unguarded honesty.
        </p>
      </motion.div>

      {/* Large sincere apology headline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.3, delay: 0.2, ease: 'easeOut' }}
        className="my-8 sm:my-10"
      >
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-100 tracking-tight font-normal drop-shadow-[0_4px_30px_rgba(244,114,182,0.25)]">
          I'm so sorry, Nancy.
        </h2>
      </motion.div>

      {/* Sincere message body */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.2, delay: 0.35, ease: 'easeOut' }}
        className="max-w-2xl mx-auto space-y-6 text-stone-300 font-sans-clean leading-relaxed text-base sm:text-lg"
      >
        <p className="text-stone-300/90 font-light text-base sm:text-lg">
          I know that merely saying sorry doesn't magically undo the hurt.
          <br className="hidden sm:inline" />
          You felt alone in what we built, and that is what hurts me most.
        </p>

        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent mx-auto my-6" />

        <p className="text-pink-100/95 font-serif-cormorant text-xl sm:text-2xl leading-relaxed italic">
          “You felt that I don't value you, that I don't care about you, and that in our relationship,
          only you were pushing while I was doing nothing. And I understand why my actions made you feel that way.”
        </p>
      </motion.div>

      {/* Honest Breakdown Cards: Validating what happened */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.1, delay: 0.5 }}
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
      >
        {/* Card 1: My Bad Habits */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#230915]/60 border border-pink-500/20 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2.5 text-pink-300">
            <Moon className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif-cormorant text-xl text-rose-100 font-medium">
              My Faults & Habits
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed font-sans-clean">
            The truth is, I forget things so easily, I sleep way too much, and when you needed me to talk, I was not available. It made you feel like you were the only one holding our relationship together. That was unfair to you, and I take full accountability.
          </p>
        </div>

        {/* Card 2: The Situation at Home */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#230915]/60 border border-pink-500/20 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2.5 text-pink-300">
            <Home className="w-5 h-5 text-pink-300" />
            <h3 className="font-serif-cormorant text-xl text-rose-100 font-medium">
              The Reality at My Home
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed font-sans-clean">
            In my house, I am the younger child, so my parents are constantly watching over me — concerned about what I’m doing, who I’m talking to, and monitoring everything. It put me in a state of hesitation that irritated you so much. Because of that pressure, I couldn't give you the uninterrupted, valuable time you deserved.
          </p>
        </div>
      </motion.div>

      {/* Sincere takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="mt-8 p-4 sm:p-6 rounded-2xl bg-[#3b0d1e]/40 border border-amber-300/20 max-w-2xl mx-auto"
      >
        <p className="text-xs sm:text-sm text-amber-200/95 font-sans-clean leading-relaxed">
          <span className="font-semibold text-rose-200">What I want you to know:</span> It wasn't because I didn't care. It was my weakness in managing things properly. You are the most valuable person to me, and you never deserved to feel neglected.
        </p>
      </motion.div>
    </section>
  );
};
