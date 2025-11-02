'use client';

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
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';
import { UseScrollObserver } from '@/hooks/use-scroll-observer';
import { ParallaxTilt } from '../ui/parallax-tilt';

const projects = [
  {
    id: 'nebula-ui',
    title: 'The Daily Grind - Local Cafe',
    description:
      'We brewed up a fresh website and online ordering system, boosting their takeaway sales by 40% and creating a vibrant online hub for their local community.',
    tags: ['Web Design', 'E-commerce', 'Local Business'],
    href: "/#",
  },
  {
    id: 'ecliptica-brand',
    title: 'Artisan Crafted Co. - Boutique E-commerce',
    description:
      'Crafted a beautiful brand identity and Shopify store that captured the essence of their handmade products, leading to a 300% increase in online sales within the first quarter.',
    tags: ['Branding', 'E-commerce', 'Shopify'],
    href: "/#",
  },
  {
    id: 'flowspace-website',
    title: 'Evergreen Services - Service Provider',
    description:
      "Developed a clean, professional website focused on lead generation. The new site structure and clear calls-to-action resulted in a 60% increase in qualified customer inquiries.",
    tags: ['Web Development', 'Lead Generation', 'Small Business'],
    href: "/#",
  },
  {
    id: 'quantum-analytics',
    title: 'Innovatech - B2B Tech Startup',
    description:
      'Designed a sleek, modern landing page and brand identity to help them secure their first round of funding and attract early-adopter clients in the competitive tech space.',
    tags: ['Branding', 'Web Design', 'UI/UX'],
    href: "/#",
  }
];

const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => {
  const placeholder = PlaceHolderImages.find((p) => p.id === project.id);
  
  return (
    <UseScrollObserver>
      <ParallaxTilt>
        <Card
          className="overflow-hidden group transition-all duration-300 h-full flex flex-col border-border/50 fade-in-up bg-card/50"
        >
          <CardHeader className="p-0">
            <div className="aspect-video overflow-hidden">
              <Image
                src={placeholder?.imageUrl || ''}
                alt={project.title}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
                data-ai-hint={placeholder?.imageHint || 'abstract'}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            <CardTitle className="text-xl font-bold mb-2">
              {project.title}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {project.description}
            </p>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </ParallaxTilt>
    </UseScrollObserver>
  );
};


export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 md:py-32 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <UseScrollObserver>
        <div className="text-center mb-12 fade-in-up">
           <p className="text-primary font-semibold">OUR WORK</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Digital Experiences That Delight
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            A curated selection of our finest digital craftsmanship.
          </p>
        </div>
        </UseScrollObserver>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
