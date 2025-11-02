
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
import { useEffect, useRef, useState } from 'react';

const projects = [
  {
    id: 'nebula-ui',
    title: 'Nebula UI',
    description:
      'A comprehensive, futuristic UI kit developed for a major SaaS platform, featuring a custom design system and interactive components to enhance user productivity.',
    tags: ['UI/UX Design', 'Web Development', 'SaaS'],
  },
  {
    id: 'ecliptica-brand',
    title: 'Ecliptica',
    description:
      'A complete brand identity and e-commerce launch for a luxury fashion label, resulting in a 200% increase in online engagement and record first-quarter sales.',
    tags: ['Branding', 'E-commerce', 'Fashion'],
  },
  {
    id: 'flowspace-website',
    title: 'FlowSpace',
    description:
      'A conversion-focused corporate website for a leading FinTech startup, integrating complex data visualizations and a secure client portal.',
    tags: ['Web Design', 'FinTech', 'SEO'],
  },
];

const ParallaxCard = ({ project }: { project: (typeof projects)[0] }) => {
  const placeholder = PlaceHolderImages.find((p) => p.id === project.id);
  const ref = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { top, height } = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // Check if the element is in the viewport
        if (top < windowHeight && top + height > 0) {
          // Calculate a parallax effect value
          const parallaxValue = (windowHeight - top) / 10;
          setTranslateY(parallaxValue - 50); // Adjust the starting offset
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Card
      ref={ref}
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
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
            style={{
              transform: `scale(1.2) translateY(${translateY}px)`,
            }}
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
};


export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Our Portfolio
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            A curated selection of our finest digital craftsmanship.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ParallaxCard project={project} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
