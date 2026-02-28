import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const stars: Star[] = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    // Nebula colors
    const nebulaColors = [
      { r: 138, g: 43, b: 226, a: 0.03 },  // Purple
      { r: 65, g: 105, b: 225, a: 0.02 },   // Royal Blue
      { r: 255, g: 193, b: 37, a: 0.01 },   // Gold
    ];

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = 'hsl(232, 47%, 4%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle nebula effect
      nebulaColors.forEach((color, index) => {
        const gradient = ctx.createRadialGradient(
          canvas.width * (0.3 + index * 0.2) + Math.sin(time + index) * 50,
          canvas.height * (0.4 + index * 0.15) + Math.cos(time + index) * 30,
          0,
          canvas.width * (0.3 + index * 0.2),
          canvas.height * (0.4 + index * 0.15),
          400
        );
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw and animate stars
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.speed * 2 + star.x) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();

        // Add glow effect to larger stars
        if (star.size > 1.5) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glow.addColorStop(0, `rgba(255, 255, 255, ${0.3 * twinkle})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(star.x - star.size * 4, star.y - star.size * 4, star.size * 8, star.size * 8);
        }
      });

      // Occasional shooting star
      if (Math.random() < 0.002) {
        const shootingX = Math.random() * canvas.width;
        const shootingY = Math.random() * canvas.height * 0.5;
        const gradient = ctx.createLinearGradient(shootingX, shootingY, shootingX + 100, shootingY + 50);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingX, shootingY);
        ctx.lineTo(shootingX + 100, shootingY + 50);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: 'hsl(232, 47%, 4%)' }}
    />
  );
};

export default StarfieldBackground;
