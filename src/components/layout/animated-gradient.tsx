'use client';

import { useEffect, useRef } from 'react';

export const AnimatedGradient = () => {
    const blobRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const blob = blobRef.current;
        if (!blob) return;

        const handlePointerMove = (event: PointerEvent) => {
            const { clientX, clientY } = event;
            blob.animate(
                {
                    left: `${clientX}px`,
                    top: `${clientY}px`
                },
                { duration: 3000, fill: 'forwards' }
            );
        };

        window.addEventListener('pointermove', handlePointerMove);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-background">
            <div className="absolute h-full w-full bg-[radial-gradient(#2f333a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
            <div
                ref={blobRef}
                className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full bg-gradient-to-br from-primary via-blue-500 to-teal-400 opacity-20 blur-3xl dark:opacity-10"
            />
        </div>
    );
};

const animation = `
@keyframes spin-slow {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 15s linear infinite;
}
`;

// Inject animation to the head
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = animation;
  document.head.appendChild(style);
}
