
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center h-screen min-h-[700px] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 bg-background"
        style={{
            background: mousePosition
                ? `radial-gradient(1000px at ${mousePosition.x}px ${mousePosition.y}px, hsla(var(--primary)/0.25), transparent 80%)`
                : 'transparent',
        }}
      />
      <div
        className={cn(
          'absolute inset-0 z-0',
          'bg-neutral-50 transition-bg dark:bg-transparent',
          '[--aurora:repeating-linear-gradient(100deg,hsl(var(--primary)/0.1)_0%,hsl(var(--primary)/0.1)_7%,transparent_10%,transparent_12%,hsl(var(--primary)/0.1)_16%)]',
          'dark:[--aurora:repeating-linear-gradient(100deg,hsl(var(--primary)/0.2)_0%,hsl(var(--primary)/0.2)_7%,transparent_10%,transparent_12%,hsl(var(--primary)/0.2)_16%)]',
          '[background-image:var(--aurora),var(--aurora)]',
          '[background-size:300%,300%]',
          "after:content-[''] after:absolute after:inset-0 after:bg-background/80 after:backdrop-blur-sm dark:after:bg-background/90",
          'animate-aurora'
        )}
      />
      <div className="container relative z-20 mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
          PIXEL-PERFECT
          <br />
          <span className="text-glow text-primary">BRANDING & WEB DESIGN</span>
          <br />
          FOR AMBITIOUS BUSINESSES
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
          We are a creative agency that builds brilliant brands, websites and apps that drive results.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#contact">
            <Button size="lg" className="group accent-glow transition-all duration-300 hover:accent-glow/70 w-full sm:w-auto">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
           <Link href="#portfolio">
            <Button size="lg" variant="outline" className="group w-full sm:w-auto">
              Explore Our Work
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
