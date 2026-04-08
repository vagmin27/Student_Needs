"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion" // or "motion/react"

import { cn } from "@/lib/utils"

/**
 * MagicCard Component
 * A card component with a mouse-following radial gradient glow effect on the border and background.
 * * @param {Object} props
 * @param {React.ReactNode} props.children - Content inside the card.
 * @param {string} [props.className] - Additional Tailwind classes.
 * @param {number} [props.gradientSize=200] - The radius of the glow effect in pixels.
 * @param {string} [props.gradientColor="#262626"] - The inner overlay color.
 * @param {number} [props.gradientOpacity=0.8] - Opacity of the inner glow.
 * @param {string} [props.gradientFrom="#9E7AFF"] - Start color of the border gradient.
 * @param {string} [props.gradientTo="#FE8BBB"] - End color of the border gradient.
 */
export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef()
  
  /**
   * Resets the gradient position to be off-screen.
   */
  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [gradientSize, mouseX, mouseY])

  /**
   * Updates the motion values based on pointer position relative to the card.
   */
  const handlePointerMove = useCallback(
    (e) => {
      if (isScrollingRef.current) return
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset()
  }, [reset])

  useEffect(() => {
    const handleGlobalPointerOut = (e) => {
      if (!e.relatedTarget) {
        reset()
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") {
        reset()
      }
    }
    
    const handleScroll = () => {
      isScrollingRef.current = true
      reset()
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 150)
    }

    window.addEventListener("pointerout", handleGlobalPointerOut, { passive: true })
    window.addEventListener("blur", reset, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true })
    document.addEventListener("visibilitychange", handleVisibility, { passive: true })

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", reset)
      window.removeEventListener("scroll", handleScroll, true)
      document.removeEventListener("visibilitychange", handleVisibility)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [reset])

  return (
    <div
      className={cn("group relative rounded-[inherit]", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerEnter={reset}
    >
      {/* Border Gradient Layer */}
      <motion.div
        className="bg-border pointer-events-none absolute inset-0 rounded-[inherit] duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom}, 
            ${gradientTo}, 
            var(--border) 100%
            )
          `,
        }}
      />

      {/* Main Card Background */}
      <div className="bg-background absolute inset-px rounded-[inherit]" />

      {/* Inner Glow Layer */}
      <motion.div
        className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />

      {/* Card Content */}
      <div className="relative h-full">{children}</div>
    </div>
  )
}