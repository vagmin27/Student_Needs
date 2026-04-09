import * as React from "react";
import { cn } from "@/lib/utils.js";

/**
 * Textarea Component
 * A multi-line input component that supports automatic resizing and standard form attributes.
 * * @param {Object} props - Standard HTML textarea attributes.
 * @param {string} [props.className] - Additional Tailwind classes for custom styling.
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };