
'use client';

import React, { useState, useEffect, useRef } from 'react';

const StarfieldBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ 
          x: (event.clientX - rect.left) / rect.width, 
          y: (event.clientY - rect.top) / rect.height 
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const transformX = (mousePosition.x - 0.5) * 200;
  const transformY = (mousePosition.y - 0.5) * 200;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden bg-background"
    >
      <div
        className="stars"
        style={{
          '--tx': `${transformX}px`,
          '--ty': `${transformY}px`,
        } as React.CSSProperties}
      />
      <div
        className="stars-2"
        style={{
          '--tx': `${transformX / 2}px`,
          '--ty': `${transformY / 2}px`,
        } as React.CSSProperties}
      />
      <div
        className="stars-3"
        style={{
          '--tx': `${transformX / 4}px`,
          '--ty': `${transformY / 4}px`,
        } as React.CSSProperties}
      />
    </div>
  );
};

export { StarfieldBackground };
