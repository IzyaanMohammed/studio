'use client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Palette, Layers, MonitorSmartphone, ShoppingBag, TrendingUp, MousePointerClick } from 'lucide-react';
import { UseScrollObserver } from '@/hooks/use-scroll-observer';
import { ParallaxTilt } from '../ui/parallax-tilt';


const services = [
  {
    icon: Layers,
    title: 'Brand Architecture',
    description: 'We will build a powerful brand foundation, crafting an identity that resonates with your audience and stands the test of time.'
  },
  {
    icon: MonitorSmartphone,
    title: 'Digital Ecosystems',
    description: 'We will design and develop beautiful, high-performance websites and applications engineered for an unforgettable user experience.'
  },
  {
    icon: MousePointerClick,
    title: 'Interactive Experiences',
    description: 'We can build immersive digital experiences that captivate users, foster engagement, and bring your brand’s story to life.'
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Solutions',
    description: 'We will create high-converting e-commerce platforms that seamlessly integrate your brand and drive sales through superior UX.'
  },
  {
      icon: Palette,
      title: 'Scalable Design Systems',
      description: 'We will craft a comprehensive design system that ensures brand consistency, streamlines development, and scales with your business.'
  },
  {
      icon: TrendingUp,
      title: 'Audience Growth',
      description: 'We can develop a cohesive content and social media strategy to expand your audience and amplify your brand’s digital reach.'
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32 bg-background relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <UseScrollObserver>
          <div className="text-center mb-12 fade-in-up">
              <p className="text-primary font-semibold">WHAT WE DO</p>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">
                  Services to Build & Grow Your Brand
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                  We offer a complete suite of services to help you build a powerful brand, from initial strategy to final launch and beyond.
              </p>
          </div>
        </UseScrollObserver>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <UseScrollObserver key={index} customClass="h-full">
                <ParallaxTilt className="h-full">
                  <Card className="p-6 bg-card/50 text-center transition-colors group h-full fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
                        <service.icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="mt-4 text-lg md:text-xl">{service.title}</CardTitle>                      
                      <CardDescription className="mt-2 text-sm">{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </ParallaxTilt>
              </UseScrollObserver>
            ))}
        </div>
      </div>
    </section>
  );
}
