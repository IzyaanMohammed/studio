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
    title: 'Nebula - SaaS Platform',
    description:
      'A comprehensive brand identity and UI/UX design for a next-generation SaaS platform. We developed a scalable design system that enhances usability and strengthens brand recall.',
    tags: ['Brand Identity', 'UI/UX Design', 'SaaS'],
  },
  {
    id: 'ecliptica-brand',
    title: 'Ecliptica - Luxury Fashion',
    description:
      'Crafted a sophisticated brand identity and high-converting e-commerce website for a luxury fashion label, leading to a significant increase in market presence and sales.',
    tags: ['Branding', 'E-commerce', 'Web Design'],
  },
  {
    id: 'flowspace-website',
    title: 'FlowSpace - FinTech Innovator',
    description:
      'Designed and developed a corporate website focused on building trust and authority. The site features clear data visualizations and a secure, seamless user journey.',
    tags: ['Web Development', 'FinTech', 'Brand Strategy'],
  },
];

const ParallaxCard = ({ project }: { project: (typeof projects)[0] }) => {
  const placeholder = PlaceHolderImages.find((p) => p.id === project.id);
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <Card
      ref={ref}
      key={project.id}
      className="overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-border hover:border-primary/50"
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
    <section id="portfolio" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
           <p className="text-primary font-semibold">OUR WORK</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Digital Experiences That Delight
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
