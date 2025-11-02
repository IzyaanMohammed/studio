
'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  let animationFrameId: number;
  let particles: Particle[];
  let mouse = {
    x: 0,
    y: 0,
    radius: 100, // Reduced radius for more subtle interaction
  };

  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    baseX: number;
    baseY: number;
    density: number;

    constructor(
      x: number,
      y: number,
      speedX: number,
      speedY: number,
      size: number,
      color: string
    ) {
      this.x = x;
      this.y = y;
      this.baseX = this.x;
      this.baseY = this.y;
      this.speedX = speedX;
      this.speedY = speedY;
      this.size = size;
      this.color = color;
      this.density = (Math.random() * 30) + 1;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update(
      ctx: CanvasRenderingContext2D,
      mouse: { x: number; y: number; radius: number }
    ) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;
      
      if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
      } else {
          if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 10;
          }
      }

      if (this.x > ctx.canvas.width + this.size) this.x = -this.size;
      if (this.x < -this.size) this.x = ctx.canvas.width + this.size;
      if (this.y > ctx.canvas.height + this.size) this.y = -this.size;
      if (this.y < -this.size) this.y = ctx.canvas.height + this.size;

      this.x += this.speedX;
      this.y += this.speedY;

      this.draw(ctx);
    }
  }

  const init = (ctx: CanvasRenderingContext2D) => {
    particles = [];
    const numberOfParticles = (ctx.canvas.height * ctx.canvas.width) / 5000;
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 1.5 + 0.5;
      let x = Math.random() * ctx.canvas.width;
      let y = Math.random() * ctx.canvas.height;
      let speedX = (Math.random() - 0.5) * 0.2;
      let speedY = (Math.random() - 0.5) * 0.2;
      
      let color = Math.random() > 0.3 ? `hsl(${primaryColor})` : `hsl(${accentColor})`;

      particles.push(new Particle(x, y, speedX, speedY, size, color));
    }
  };

  const connect = (ctx: CanvasRenderingContext2D) => {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
          opacityValue = 1 - (distance / 80);
          let lineColor = theme === 'dark' ? 'hsla(0, 0%, 98%, ' + opacityValue + ')' : 'hsla(222.2, 84%, 4.9%, ' + opacityValue + ')';
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.update(ctx, mouse);
    });
    connect(ctx);
    animationFrameId = requestAnimationFrame(() => animate(ctx));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const resizeHandler = () => {
      if (!canvas || !isMounted) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouse.radius = 120;
      if (ctx) {
        init(ctx);
      }
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    
    const mouseOutHandler = () => {
        mouse.x = -Infinity;
        mouse.y = -Infinity;
    }

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseout', mouseOutHandler);

    resizeHandler();
    animate(ctx);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseout', mouseOutHandler);
      cancelAnimationFrame(animationFrameId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default ParticleBackground;
