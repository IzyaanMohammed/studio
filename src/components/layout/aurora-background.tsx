"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-screen transition-bg",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            `
            pointer-events-none
            absolute -inset-px opacity-50
            [mask-image:radial-gradient(400px_at_center,white,transparent)]
            group-hover/button:opacity-100
            `,
            `
            after:absolute after:inset-0 after:z-10 after:h-full after:w-full
            after:bg-[radial-gradient(400px_at_center,white,transparent)]
            after:[mask-image:radial-gradient(400px_at_center,white,transparent)]
            after:content-[""]
            `,
            `
            [&.aurora-mask-activity]:after:animate-aurora
            [&.aurora-mask-activity]:after:bg-[radial-gradient(400px_at_var(--mouse-x)_var(--mouse-y),white,transparent)]
            `,
            `
            before:absolute before:inset-0 before:z-10 before:h-full before:w-full
            before:bg-[radial-gradient(circle_at_100%_0%,hsl(var(--primary)/0.1),transparent_40%)]
            before:content-[""]
            `,
            `
            dark:before:bg-[radial-gradient(circle_at_100%_0%,hsl(var(--primary)/0.2),transparent_40%)]
            `
          )}
        />
        {showRadialGradient && (
          <div className="pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_center,hsl(var(--background)),transparent_100%)]" />
        )}
        {children}
      </div>
    </main>
  );
};
