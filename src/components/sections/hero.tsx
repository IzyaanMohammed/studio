import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center h-screen min-h-[700px] overflow-hidden"
    >
       <div
        className={cn(
          "absolute inset-0 z-0",
          "bg-neutral-950 transition-bg",
          "bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
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
