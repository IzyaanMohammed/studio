"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Aether Studio is a powerhouse of creativity and technical skill. They took our vision and turned it into a digital reality that exceeded all our goals. The best branding agency in Dubai, hands down.',
    name: 'Fatima Al Marzooqi',
    company: 'CEO of Innovate UAE',
    avatar: 'FA',
    image: 'https://picsum.photos/seed/avatar1/100/100'
  },
  {
    quote:
      'The attention to detail and commitment to our vision was unparalleled. Aether Studio is the Tesla of web design, without a doubt. Our user engagement has skyrocketed since the launch.',
    name: 'Yusuf Ahmed',
    company: 'Founder of Tech Forward',
    avatar: 'YA',
    image: 'https://picsum.photos/seed/avatar2/100/100'
  },
  {
    quote:
      'Working with Aether Studio was a seamless experience. They delivered a high-performance, visually stunning website that perfectly captures our brand essence. Highly recommended!',
    name: 'Layla Ibrahim',
    company: 'Marketing Director at Creative Minds',
    avatar: 'LI',
    image: 'https://picsum.photos/seed/avatar3/100/100'
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <p className="text-primary font-semibold">WHAT OUR CLIENTS SAY</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Words From Our Clients
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            See what our partners have to say about their experience with us.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2">
                <div className="p-4 h-full">
                  <Card className="h-full flex flex-col justify-between bg-secondary/30">
                    <CardContent className="p-6 flex flex-col items-start gap-4">
                      <Quote className="h-8 w-8 text-primary" />
                      <p className="text-muted-foreground italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-4 pt-4">
                        <Avatar>
                          <AvatarImage src={testimonial.image} alt={testimonial.name}/>
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-50px]"/>
          <CarouselNext className="right-[-50px]"/>
        </Carousel>
      </div>
    </section>
  );
}
