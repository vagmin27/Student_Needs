"use client"

import React from "react"
import { motion } from "framer-motion" // or "motion/react" depending on your package version
import { cn } from "@/lib/utils"

/**
 * BorderBeam Component
 * Creates an animated beam of light that travels along the border of its parent container.
 * * @param {Object} props
 * @param {number} [props.size=50] - The size/length of the beam.
 * @param {number} [props.duration=6] - Animation duration in seconds.
 * @param {number} [props.delay=0] - Animation delay in seconds.
 * @param {string} [props.colorFrom="#ffaa40"] - Start color of the gradient.
 * @param {string} [props.colorTo="#9c40ff"] - End color of the gradient.
 * @param {Object} [props.transition] - Framer Motion transition overrides.
 * @param {string} [props.className] - Additional Tailwind classes.
 * @param {Object} [props.style] - Inline style overrides.
 * @param {boolean} [props.reverse=false] - Whether to reverse animation direction.
 * @param {number} [props.initialOffset=0] - Initial position percentage (0-100).
 * @param {number} [props.borderWidth=1] - Thickness of the border.
 */
export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-beam-width)*1px)_solid_transparent] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [mask-composite:intersect] [mask-clip:padding-box,border-box]"
      style={{
        "--border-beam-width": borderWidth,
      }}
    >
      <motion.div
        className={cn(
          "absolute aspect-square",
          "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          ...style,
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  )
}