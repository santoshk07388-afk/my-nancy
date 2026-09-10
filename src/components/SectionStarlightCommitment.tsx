import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export const SectionStarlightCommitment: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Moving starry night sky canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', onResize);

    const stars: { x: number; y: number; size: number; alpha: number; speed: number; phase: number }[] = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }

        const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 243, 199, ${s.alpha * twinkle})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section id="commitment-section" className="relative py-32 sm:py-44 px-5 sm:px-8 bg-[#090306] overflow-hidden">
      {/* Moving starfield canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      />

      {/* Deep atmospheric dark vignettes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(65,12,28,0.25)_0%,rgba(9,3,6,0.95)_75%)] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-12">
        
        {/* Paragraphs revealed step by step */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1 }}
          className="space-y-4 font-sans-clean text-stone-300 text-lg sm:text-xl font-light"
        >
          <p>I don't want to pretend everything is perfect.</p>
          <p className="text-pink-200/90 font-medium">I know we have things to fix.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="space-y-4"
        >
          <p className="font-serif-cormorant text-2xl sm:text-3xl text-rose-100 italic">
            I know love isn't just about beautiful days.
          </p>

          <div className="pt-2">
            <p className="font-serif-cormorant text-xl sm:text-2xl text-amber-200/90 italic leading-relaxed">
              It's also about listening.<br />
              Changing.<br />
              Understanding.<br />
              Forgiving.<br />
              Growing.
            </p>
          </div>
        </motion.div>

        {/* Subtle glowing separator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mx-auto"
        />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, delay: 0.3 }}
          className="font-serif-cormorant text-2xl sm:text-3xl text-stone-200/95 italic font-light space-y-3"
        >
          <p>
            I don't want to give up on us, Nancy,<br />
            just because things became difficult.
          </p>
          <p className="text-base sm:text-lg font-sans-clean text-pink-200/90 not-italic font-normal max-w-xl mx-auto pt-2">
            No matter how late I am awake, or what you see online — my heart, my soul, and my loyalty belong exclusively to you. There is no other girl. Only Nancy.
          </p>
        </motion.div>

        {/* Large final statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.4, delay: 0.45 }}
          className="pt-6"
        >
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200 font-normal tracking-tight drop-shadow-[0_0_40px_rgba(244,114,182,0.35)]">
            I still choose us, Nancy.
          </h2>
          <p className="font-script text-2xl sm:text-3xl text-amber-300/90 mt-2">
            With all my love — Santosh
          </p>
        </motion.div>

      </div>
    </section>
  );
};
