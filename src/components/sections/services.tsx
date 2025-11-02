import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Palette, Layers, MonitorSmartphone, ShoppingBag } from 'lucide-react';

const services = [
  {
    icon: Layers,
    title: 'Brand Strategy',
    description: 'We help you define your story, purpose, and audience to build a brand that resonates.'
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'From logos to color palettes, we create a visual system that makes your brand unforgettable.'
  },
  {
    icon: MonitorSmartphone,
    title: 'Web & App Design',
    description: 'We design and build beautiful, high-performance websites and mobile apps that drive results.'
  },
  {
    icon: ShoppingBag,
    title: 'Packaging Design',
    description: 'We craft beautiful packaging that stands out on the shelf and tells your brand\'s story.'
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <p className="text-primary font-semibold">WHAT WE DO</p>
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
                Services to Build & Grow Your Brand
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                We offer a complete suite of services to help you build a powerful brand, from initial strategy to final launch and beyond.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-6 bg-card/50 text-center hover:bg-secondary/50 transition-colors">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4 text-lg md:text-xl">{service.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
