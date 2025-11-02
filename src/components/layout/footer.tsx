import Link from 'next/link';
import { Github, Twitter, Linkedin, Phone, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { UseScrollObserver } from '@/hooks/use-scroll-observer';
import { Logo } from '../logo';

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://twitter.com',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com',
  },
];

const footerLinks = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Our Work' },
    { href: '#about', label: 'About Us' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border relative z-10">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <UseScrollObserver>
          <div className="grid gap-8 md:grid-cols-12 fade-in-up">
              <div className='col-span-12 md:col-span-4 space-y-4'>
                   <Link href="/" className="flex items-center gap-2">
                      <Logo className="h-12 w-auto" />
                  </Link>
                  <p className='text-muted-foreground text-sm'>
                      We craft digital excellence, building impactful web experiences for innovative brands globally.
                  </p>
                   <div className="flex items-center gap-4">
                      {socialLinks.map((link) => (
                      <a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.name}
                          className="text-muted-foreground transition-colors hover:text-primary"
                      >
                          <link.icon className="h-5 w-5" />
                      </a>
                      ))}
                  </div>
              </div>
              <div className='col-span-12 md:col-span-2'>
                  <h3 className='font-semibold mb-4'>Navigation</h3>
                  <ul className='space-y-2'>
                      {footerLinks.map(link => (
                          <li key={link.href}>
                              <Link href={link.href} className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                                  {link.label}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
              <div className='col-span-12 md:col-span-3'>
                   <h3 className='font-semibold mb-4'>Get in Touch</h3>
                   <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                      <a href="mailto:izyaankaka11@gmail.com" className="flex items-center gap-2 transition-colors hover:text-primary">
                          <Mail className="h-4 w-4" />
                          <span>izyaankaka11@gmail.com</span>
                      </a>
                      <a href="tel:+9710526157389" className="flex items-center gap-2 transition-colors hover:text-primary">
                          <Phone className="h-4 w-4" />
                          <span>+971 052 615 7389</span>
                      </a>
                  </div>
              </div>
              <div className='col-span-12 md:col-span-3 space-y-4'>
                  <h3 className='font-semibold'>Ready to start a project?</h3>
                  <p className='text-sm text-muted-foreground'>Let's build something amazing together.</p>
                  <Button asChild>
                      <Link href="#contact">Let's Talk</Link>
                  </Button>
              </div>
          </div>
        </UseScrollObserver>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Pixel8 Studios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
