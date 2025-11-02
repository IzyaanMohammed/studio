'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export const PixelGridBackground = () => {
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-background">
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 dark:bg-background"
                style={{
                    background: mousePosition
                        ? `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, hsla(var(--primary)/0.15), transparent 80%)`
                        : 'transparent',
                }}
            />
            <div
                className={cn(
                    "absolute inset-0 z-[-1]",
                    "[mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,black_30%,transparent_100%)]",
                    "bg-[size:24px_24px] bg-repeat",
                    "bg-[image:radial-gradient(circle_at_center,hsl(var(--foreground)/0.03)_1px,transparent_1px)] dark:bg-[image:radial-gradient(circle_at_center,hsl(var(--foreground)/0.05)_1px,transparent_1px)]"
                )}
            />
        </div>
    );
};
