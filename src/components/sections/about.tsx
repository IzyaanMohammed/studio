import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, PenTool, Code, Rocket } from 'lucide-react';

const processSteps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'We dive deep into your brand, goals, and audience to build a solid foundation.'
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'Crafting intuitive and visually stunning interfaces that tell your story.'
  },
  {
    icon: Code,
    title: 'Develop',
    description: 'Bringing designs to life with clean, efficient, and scalable code.'
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description: 'Launching your project into the digital universe for the world to see.'
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Crafting Digital Futures
            </h2>
            <p className="text-muted-foreground text-lg">
              Our mission is to merge creativity with technology to build extraordinary digital experiences. We believe in a collaborative process, working closely with our clients to transform their vision into a reality that not only looks good but performs exceptionally.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {processSteps.map((step, index) => (
              <Card key={index} className="p-4 bg-card/50 text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4">{step.title}</CardTitle>
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
