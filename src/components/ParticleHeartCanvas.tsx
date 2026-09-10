import React, { useEffect, useRef } from 'react';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  phase: number;
  orbitRadius: number;
  glow: number;
}

export const ParticleHeartCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 320 * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 320 * window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const totalParticles = 240;

    const colors = [
      'rgba(244, 114, 182, ', // blush pink
      'rgba(251, 191, 36, ',  // warm gold
      'rgba(244, 63, 94, ',   // rose
      'rgba(253, 230, 138, ', // delicate champagne
      'rgba(225, 29, 72, ',   // ruby
    ];

    const initParticles = () => {
      particles.length = 0;
      const scale = Math.min(width, height) / 42;
      const centerX = width / 2;
      const centerY = height / 2 - scale * 1.5;

      for (let i = 0; i < totalParticles; i++) {
        const t = (i / totalParticles) * Math.PI * 2;
        // Parametric heart formula
        const xVal = 16 * Math.pow(Math.sin(t), 3);
        const yVal = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        // Add some slight natural dispersal inside and outside the path
        const scatter = (Math.random() - 0.5) * scale * 1.2;
        const targetX = centerX + xVal * scale + scatter;
        const targetY = centerY + yVal * scale + scatter;

        particles.push({
          baseX: targetX,
          baseY: targetY,
          x: targetX + (Math.random() - 0.5) * 40,
          y: targetY + (Math.random() - 0.5) * 40,
          size: Math.random() * 2.2 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: 0.02 + Math.random() * 0.025,
          phase: Math.random() * Math.PI * 2,
          orbitRadius: Math.random() * 4 + 2,
          glow: Math.random() * 0.6 + 0.4,
        });
      }
    };

    initParticles();

    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Heartbeat pulse calculation (two-stage systolic pulse)
      const heartbeat = 1 + 0.06 * Math.sin(time * 2.2) * Math.max(0, Math.sin(time * 2.2));
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(heartbeat, heartbeat);
      ctx.translate(-centerX, -centerY);

      // Soft center glow
      const radialGlow = ctx.createRadialGradient(centerX, centerY - 20, 10, centerX, centerY, width * 0.45);
      radialGlow.addColorStop(0, 'rgba(153, 27, 62, 0.18)');
      radialGlow.addColorStop(0.5, 'rgba(88, 14, 32, 0.08)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Render glowing particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.speed;

        const currentX = p.baseX + Math.cos(p.phase) * p.orbitRadius;
        const currentY = p.baseY + Math.sin(p.phase) * p.orbitRadius;

        const shimmer = 0.5 + 0.5 * Math.sin(time * 3 + i);
        const alpha = Math.min(1, Math.max(0.2, p.glow * shimmer));

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size * (0.8 + 0.3 * shimmer), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(251, 113, 133, 0.7)';
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[340px] max-h-[340px] pointer-events-none drop-shadow-[0_0_25px_rgba(244,114,182,0.35)]"
      />
    </div>
  );
};
