import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shine Border Component
 * * An animated background border effect component with configurable properties.
 * * @param {Object} props
 * @param {number} [props.borderWidth=1] - Width of the border in pixels.
 * @param {number} [props.duration=14] - Duration of the animation in seconds.
 * @param {string | string[]} [props.shineColor="#000000"] - Color of the border (single string or array of strings).
 * @param {string} [props.className] - Additional Tailwind classes.
 * @param {Object} [props.style] - Inline style overrides.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}) {
  return (
    <div
      style={{
        "--border-width": `${borderWidth}px`,
        "--duration": `${duration}s`,
        backgroundImage: `radial-gradient(transparent,transparent, ${
          Array.isArray(shineColor) ? shineColor.join(",") : shineColor
        },transparent,transparent)`,
        backgroundSize: "300% 300%",
        mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "var(--border-width)",
        ...style,
      }}
      className={cn(
        "motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className
      )}
      {...props}
    />
  );
}