import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, PenTool, Code, Rocket } from 'lucide-react';

const processSteps = [
  {
    icon: Search,
    title: '1. Discovery & Strategy',
    description: 'We begin by immersing ourselves in your brand, defining key objectives, and mapping out a strategic path to success.'
  },
  {
    icon: PenTool,
    title: '2. UX & UI Design',
    description: 'Next, we design a seamless user experience and a stunning visual interface that captivates your audience and tells your unique story.'
  },
  {
    icon: Code,
    title: '3. Precision Development',
    description: 'Our developers bring the designs to life using clean, scalable, and high-performance code for a flawless digital product.'
  },
  {
    icon: Rocket,
    title: '4. Launch & Optimization',
    description: 'We deploy your project to the world, then monitor and optimize for peak performance, ensuring long-term growth and impact.'
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Engineering Digital Excellence
            </h2>
            <p className="text-muted-foreground text-lg">
              At Aether Studio, our mission is to fuse cutting-edge design with robust technology to build extraordinary digital experiences. We believe in a collaborative, transparent process, working as your strategic partner to turn ambitious visions into high-performance digital products that not only look remarkable but deliver tangible results.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {processSteps.map((step, index) => (
              <Card key={index} className="p-4 bg-card/50 text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
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
