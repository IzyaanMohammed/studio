import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import LiquidBackground from '@/components/layout/liquid-background';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center h-[calc(100vh-4rem)] min-h-[500px] overflow-hidden"
    >
      <LiquidBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background z-10" />
      <div className="container relative z-20 mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl font-headline">
          The <span className="text-glow text-primary">Tesla</span> of
          <br />
          Web Design
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
          We build futuristic, innovative, and high-performance websites that
          drive results for creative businesses in the UAE and beyond.
        </p>
        <div className="mt-10 flex justify-center">
          <Link href="#contact">
            <Button size="lg" className="group accent-glow transition-all duration-300 hover:accent-glow/70">
              Start a Project
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
