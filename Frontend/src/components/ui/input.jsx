import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input Component
 * A reusable, styled input field that supports ref forwarding.
 * * @param {Object} props - Standard HTML input attributes.
 * @param {string} [props.className] - Additional Tailwind classes.
 * @param {string} [props.type] - The type of input (text, password, email, etc.).
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };