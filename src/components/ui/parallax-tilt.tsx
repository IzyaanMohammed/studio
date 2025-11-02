'use client';

import React, { useRef, ReactNode } from 'react';

const ParallaxTilt = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    const rotateX = y * -15; // Max rotation 7.5 degrees
    const rotateY = x * 15; // Max rotation 7.5 degrees

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      className="w-full h-full"
    >
      {children}
    </div>
  );
};

export { ParallaxTilt };
