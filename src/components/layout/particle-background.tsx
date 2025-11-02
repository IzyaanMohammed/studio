
'use client';

import React, { useRef, useEffect } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let animationFrameId: number;
  let particles: Particle[];
  let mouse = {
    x: 0,
    y: 0,
    radius: 150,
  };

  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;

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
      this.speedX = speedX;
      this.speedY = speedY;
      this.size = size;
      this.color = color;
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
      if (this.x > ctx.canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      if (this.y > ctx.canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }

      // mouse collision
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < ctx.canvas.width - this.size * 10) {
          this.x += 5;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 5;
        }
        if (mouse.y < this.y && this.y < ctx.canvas.height - this.size * 10) {
          this.y += 5;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 5;
        }
      }

      this.x += this.speedX;
      this.y += this.speedY;

      this.draw(ctx);
    }
  }

  const init = (ctx: CanvasRenderingContext2D) => {
    particles = [];
    const numberOfParticles = (ctx.canvas.height * ctx.canvas.width) / 9000;
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x =
        Math.random() * (window.innerWidth - size * 2 - size * 2) + size * 2;
      let y =
        Math.random() * (window.innerHeight - size * 2 - size * 2) + size * 2;
      let speedX = Math.random() * 0.4 - 0.2;
      let speedY = Math.random() * 0.4 - 0.2;
      
      let color = `hsl(${Math.random() > 0.5 ? primaryColor : accentColor})`;

      particles.push(new Particle(x, y, speedX, speedY, size, color));
    }
  };

  const connect = (ctx: CanvasRenderingContext2D) => {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance =
          (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) +
          (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y);
        if (distance < (ctx.canvas.width / 7) * (ctx.canvas.height / 7)) {
          opacityValue = 1 - distance / 20000;
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let dist = Math.sqrt(dx*dx + dy*dy);
          
          let color = dist < 100 ? particles[a].color : 'hsl(var(--foreground) / 0.1)';

          ctx.strokeStyle = color.replace(')', `, ${opacityValue})`).replace('hsl(', 'hsla(');

          ctx.lineWidth = 1;
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

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouse.radius = (canvas.height / 80) * (canvas.width / 80);
      init(ctx);
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('mousemove', mouseMoveHandler);

    resizeHandler();
    animate(ctx);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default ParticleBackground;
