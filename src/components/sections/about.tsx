import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gem, Target, Palette, Rocket } from 'lucide-react';
import Image from 'next/image';

const processSteps = [
  {
    icon: Target,
    title: '1. Brand Strategy',
    description: 'We define your brand’s core message, target audience, and market position to create a foundation for success.'
  },
  {
    icon: Palette,
    title: '2. Brand Identity',
    description: 'Our team designs a stunning visual identity, including logos, color palettes, and typography that tells your brand’s story.'
  },
  {
    icon: Gem,
    title: '3. Web & App Design',
    description: 'We create intuitive, high-performance websites and applications that offer a seamless user experience.'
  },
  {
    icon: Rocket,
    title: '4. Launch & Grow',
    description: 'We deploy your project and provide ongoing support to ensure it continues to meet your business goals and evolve with your brand.'
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
                <p className="text-primary font-semibold">WHO WE ARE</p>
                <h2 className="text-3xl md:text-4xl font-bold font-headline">
                Crafting Digital Legacies
                </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Aether Studio is a collective of designers, developers, and strategists passionate about building brands that last. We believe that great design is a blend of art and science—aesthetically beautiful, strategically sound, and built for performance.
            </p>
            <p className="text-muted-foreground">
              Our mission is to empower businesses in the UAE and beyond by creating digital-first brands that are not only memorable but also drive measurable growth. We are your partners in innovation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {processSteps.map((step, index) => (
              <Card key={index} className="p-4 bg-background/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-base md:text-lg">{step.title}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
