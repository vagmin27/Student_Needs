import React from "react";
import { cn } from "@/lib/utils";

/**
 * AnimatedShinyText Component
 * Creates a text effect with a moving shimmer/shine gradient.
 * * @param {Object} props
 * @param {React.ReactNode} props.children - The text or elements to be styled.
 * @param {string} [props.className] - Additional Tailwind classes.
 * @param {number} [props.shimmerWidth=100] - The width of the shine effect in pixels.
 */
export const AnimatedShinyText = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={{
        "--shiny-width": `${shimmerWidth}px`,
      }}
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect logic
        "animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat [transition:background-position:1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient colors
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};