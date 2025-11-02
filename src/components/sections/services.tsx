import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Palette, Layers, MonitorSmartphone, ShoppingBag, TrendingUp, Gem } from 'lucide-react';

const services = [
  {
    icon: Layers,
    title: 'Brand Strategy',
    description: 'We define your brand’s core message, target audience, and market position to create a foundation for success.'
  },
  {
    icon: Palette,
    title: 'Brand Identity & Logo',
    description: 'From logos to color palettes, we design a stunning visual identity that tells your brand’s story and makes it unforgettable.'
  },
  {
    icon: MonitorSmartphone,
    title: 'Web & App Design',
    description: 'We create intuitive, high-performance websites and applications that offer a seamless user experience and drive engagement.'
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Experiences',
    description: 'We build high-converting e-commerce platforms that integrate your brand and drive sales through superior UX/UI.'
  },
  {
      icon: Gem,
      title: 'Packaging Design',
      description: 'We craft beautiful, sustainable packaging that stands out on the shelf and enhances the unboxing experience.'
  },
  {
      icon: TrendingUp,
      title: 'Social Media Strategy',
      description: 'We develop a cohesive content strategy and visual language for your social channels to grow your audience.'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-6 bg-card/50 text-center hover:bg-secondary/50 transition-colors group">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
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
