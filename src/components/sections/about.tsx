import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gem, Target, Palette, Rocket } from 'lucide-react';
import { UseScrollObserver } from '@/hooks/use-scroll-observer';
import { ParallaxTilt } from '../ui/parallax-tilt';

const processSteps = [
  {
    icon: Target,
    title: '1. Discovery & Strategy',
    description: 'We dive deep into your brand, audience, and goals to build a strategic foundation for undeniable success.'
  },
  {
    icon: Palette,
    title: '2. Visual Identity',
    description: 'Our designers craft a stunning and memorable visual identity, from logos to color palettes that tell your unique story.'
  },
  {
    icon: Gem,
    title: '3. Web & App Craftsmanship',
    description: 'We build beautiful, high-performance websites and apps focused on providing an exceptional user experience.'
  },
  {
    icon: Rocket,
    title: '4. Launch & Growth',
    description: 'We deploy your project and provide ongoing support, ensuring it evolves with your brand and continues to drive results.'
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <UseScrollObserver>
          <div className="grid md:grid-cols-2 gap-12 items-center fade-in-up">
            <div className="space-y-6">
              <div className="space-y-2">
                  <p className="text-primary font-semibold">WHO WE ARE</p>
                  <h2 className="text-3xl md:text-4xl font-bold font-headline">
                  Architects of Digital Presence
                  </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                WebCraft is a nimble team of creators, strategists, and developers who are passionate about building brands that thrive in the digital age. We believe that exceptional design is a perfect marriage of art and science—beautiful, strategic, and engineered for performance.
              </p>
              <p className="text-muted-foreground">
                Our mission is to empower businesses by crafting digital-first brands that not only captivate audiences but also deliver tangible, measurable growth. We are your dedicated partners in innovation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {processSteps.map((step, index) => (
                <ParallaxTilt key={index}>
                  <Card className="p-4 bg-background/50 h-full">
                    <CardHeader>
                      <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="mt-4 text-base md:text-lg">{step.title}</CardTitle>
                      <CardDescription className="mt-1 text-sm">{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </ParallaxTilt>
              ))}
            </div>
          </div>
        </UseScrollObserver>
      </div>
    </section>
  );
}
