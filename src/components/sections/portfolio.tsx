import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const projects = [
  {
    id: 'nebula-ui',
    title: 'Nebula UI',
    description:
      'A futuristic UI kit designed to bring a cosmic feel to modern web applications.',
    tags: ['UI/UX Design', 'Web Development'],
  },
  {
    id: 'ecliptica-brand',
    title: 'Ecliptica',
    description:
      'A complete brand identity for a high-end fashion label, focusing on minimalism and elegance.',
    tags: ['Branding', 'Graphic Design'],
  },
  {
    id: 'flowspace-website',
    title: 'FlowSpace',
    description:
      'A corporate website for a SaaS company, designed to improve user engagement and conversions.',
    tags: ['Web Design', 'SEO'],
  },
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Our Creations
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            A glimpse into the digital experiences we've brought to life.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const placeholder = PlaceHolderImages.find(
              (p) => p.id === project.id
            );
            return (
              <Card
                key={project.id}
                className="overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border-border hover:border-primary/50"
              >
                <CardHeader className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={placeholder?.imageUrl || ''}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={placeholder?.imageHint || 'abstract'}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold mb-2">
                    {project.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
