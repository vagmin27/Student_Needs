import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils.js";

/**
 * TooltipProvider
 * Wraps the part of your app that will contain tooltips. 
 * Usually placed near the root of the component tree.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip
 * The root component that manages the state of the tooltip.
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * TooltipTrigger
 * The element that triggers the tooltip (usually a button or icon).
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * TooltipContent
 * The floating content that appears when the trigger is hovered or focused.
 */
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };