import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Palette, Layers, MonitorSmartphone, ShoppingBag, TrendingUp, MousePointerClick } from 'lucide-react';
import { UseScrollObserver } from '@/hooks/use-scroll-observer';
import { ParallaxTilt } from '../ui/parallax-tilt';


const services = [
  {
    icon: Layers,
    title: 'Brand Strategy & Identity',
    description: 'We define your brand’s core message and design a stunning visual identity that tells your story and makes it unforgettable.'
  },
  {
    icon: MonitorSmartphone,
    title: 'UI/UX Design',
    description: 'We create intuitive, beautiful, and high-performance websites and applications that offer a seamless user experience.'
  },
  {
    icon: MousePointerClick,
    title: 'Interactive Experiences',
    description: 'We build engaging interactive websites and applications that captivate users and bring your brand’s digital presence to life.'
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Platforms',
    description: 'We build high-converting e-commerce platforms that integrate your brand and drive sales through superior UX/UI.'
  },
  {
      icon: Palette,
      title: 'Design Systems',
      description: 'We craft comprehensive design systems that ensure brand consistency, streamline development, and scale with your business.'
  },
  {
      icon: TrendingUp,
      title: 'Growth & Marketing',
      description: 'We develop a cohesive content and social media strategy to grow your audience and amplify your brand’s reach.'
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
