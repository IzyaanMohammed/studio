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
    title: 'Nebula - Next-Gen SaaS',
    description:
      'We delivered a comprehensive brand identity and scalable design system for Nebula, a B2B SaaS platform. The new UX/UI led to a 40% increase in user engagement and a 25% faster task completion rate.',
    tags: ['Brand Identity', 'UI/UX Design', 'SaaS'],
    href: "/#",
  },
  {
    id: 'ecliptica-brand',
    title: 'Ecliptica - Luxury Fashion E-commerce',
    description:
      'Crafted a sophisticated brand and e-commerce website for Ecliptica, resulting in a 300% increase in online sales and significant media attention in major fashion publications.',
    tags: ['Branding', 'E-commerce', 'Web Design'],
    href: "/#",
  },
  {
    id: 'flowspace-website',
    title: 'FlowSpace - FinTech Corporate Site',
    description:
      'Designed a corporate website focused on building trust and authority in the FinTech space. The site features clear data visualizations and a secure, seamless user journey, boosting investor confidence.',
    tags: ['Web Development', 'FinTech', 'Data Visualization'],
    href: "/#",
  },
  {
    id: 'quantum-analytics',
    title: 'Quantum - AI Analytics Platform',
    description:
      'Developed a cutting-edge web application for Quantum, an AI-powered analytics firm. The platform visualizes complex data streams in an intuitive dashboard, enabling users to derive insights 80% faster.',
    tags: ['Web App', 'AI', 'Data Science'],
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
