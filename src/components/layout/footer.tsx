
import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Phone, Mail } from 'lucide-react';

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

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Aether Studio</span>
          </Link>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm text-muted-foreground">
             <a href="mailto:izyaankaka11@gmail.com" className="flex items-center gap-2 transition-colors hover:text-primary">
                <Mail className="h-4 w-4" />
                <span>izyaankaka11@gmail.com</span>
              </a>
              <a href="tel:+9710526157389" className="flex items-center gap-2 transition-colors hover:text-primary">
                <Phone className="h-4 w-4" />
                <span>+971 052 615 7389</span>
              </a>
          </div>

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
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Aether Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
