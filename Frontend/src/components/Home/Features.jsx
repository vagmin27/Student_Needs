import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagicCard } from "../ui/magic-card.jsx";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    image: "/F1.png",
    title: "Verified Credentials",
    description: "Resume authenticity verified by College Authority",
  },
  {
    image: "/F2.png",
    title: "Transparent Hiring",
    description: "Every action recorded with immutable proof",
  },
  {
    image: "/F3.png",
    title: "Trust Network",
    description: "Connect with verified alumni for referrals",
  },
];

const Features = React.memo(() => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const bgImageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Force hardware acceleration for header elements
      gsap.set([headingRef.current, descRef.current], {
        force3D: true,
        willChange: "transform, opacity",
      });

      // Filter out null refs for cards
      const activeCards = cardsRef.current.filter(Boolean);

      gsap.set(activeCards, {
        force3D: true,
        willChange: "transform, opacity",
      });

      // Heading and description entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 60%",
          toggleActions: "play none none none",
          fastScrollEnd: true,
        },
        defaults: {
          force3D: true,
        },
        onComplete: () => {
          // Cleanup will-change to save browser resources
          gsap.set([headingRef.current, descRef.current], {
            willChange: "auto",
          });
        },
      });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      ).fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );

      // Staggered cards entrance
      gsap.fromTo(
        activeCards,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
            fastScrollEnd: true,
          },
          onComplete: () => {
            gsap.set(activeCards, {
              willChange: "transform",
            });
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mb-20 sm:mb-28 md:mb-36 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] w-full px-4 sm:px-6 lg:px-8 mx-auto text-center relative"
    >
      <img
        ref={bgImageRef}
        src="/Side-BG2.png"
        alt="Background decoration"
        className="absolute -bottom-[100%] left-[65%] pointer-events-none z-0 hidden lg:block"
        loading="lazy"
      />
      
      <h1
        ref={headingRef}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-foreground px-2"
        style={{ opacity: 0 }}
      >
        Features <span className="gradient-text3">that Feels </span>Human
      </h1>
      
      <p
        ref={descRef}
        className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-8 sm:mb-10 tracking-tight px-4"
        style={{ opacity: 0 }}
      >
        NextRef amplifies human insight and recommendations, to help incredible
        people find each other.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            ref={(el) => (cardsRef.current[index] = el)}
            style={{ opacity: 0, transform: "translateZ(0)" }}
            className="w-full h-80 sm:h-96"
          >
            <MagicCard
              className="w-full h-full rounded-xl p-1.5 sm:p-2"
              gradientSize={250}
              gradientColor="oklch(74.443% 0.00008 271.152)"
              gradientOpacity={0.6}
              gradientFrom="oklch(0.2809 0 0)"
              gradientTo="oklch(0.5841 0.1031 171.6359)"
            >
              <div className="w-full min-h-full h-full rounded-lg relative overflow-hidden border">
                <img
                  src={feature.image}
                  alt={feature.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full rounded-lg object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 flex flex-col items-start justify-end px-3 sm:px-4 pb-3 sm:pb-4">
                  <h3 className="font-bold text-xl sm:text-2xl text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90">
                    {feature.description}
                  </p>
                </div>
              </div>
            </MagicCard>
          </div>
        ))}
      </div>
    </div>
  );
});

Features.displayName = "Features";

export default Features;