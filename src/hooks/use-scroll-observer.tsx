'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type UseScrollObserverProps = {
  children: React.ReactElement;
  customClass?: string;
};

export const UseScrollObserver = ({ children, customClass }: UseScrollObserverProps) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  // Ensure children is a valid React element before cloning
  if (!React.isValidElement(children)) {
    return null;
  }
  
  // Get the original className from children.props
  const originalClassName = children.props.className || '';

  return React.cloneElement(children, {
    ref: elementRef,
    // Add custom class and merge with existing classes
    className: cn(originalClassName, customClass),
    style: {
      ...children.props.style,
      // Add a CSS custom property for the animation delay if needed for staggered effects
      // '--animation-delay': '100ms'
    }
  });
};
