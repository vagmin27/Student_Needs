import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { Blocks } from "lucide-react";
import { GetStarted } from "@/components/GetStarted.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BorderBeam } from "../ui/border-beam.jsx";

gsap.registerPlugin(ScrollTrigger);

const LandingHero = React.memo(() => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Refs without TypeScript type annotations
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const lowerHeroRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Force hardware acceleration for all animated elements
      gsap.set([badgeRef.current, headingRef.current, descRef.current, ctaRef.current], {
        force3D: true,
        willChange: "transform, opacity"
      });
      
      gsap.set([lowerHeroRef.current, imageContainerRef.current], {
        force3D: true,
        willChange: "transform, opacity"
      });

      // Hero entrance animations with stagger
      const tl = gsap.timeline({ 
        defaults: { 
          ease: "power3.out",
          force3D: true 
        },
        onComplete: () => {
          // Clear will-change after animation completes to free up GPU memory
          gsap.set([badgeRef.current, headingRef.current, descRef.current, ctaRef.current], {
            willChange: "auto"
          });
        }
      });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          "-=0.4"
        );

      // Section fade-in
      gsap.fromTo(
        lowerHeroRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: lowerHeroRef.current,
            start: "top 85%",
            end: "top 60%",
            scrub: false,
            fastScrollEnd: true,
          },
        }
      );

      // Parallax and scaling effect for the product image container
      gsap.to(imageContainerRef.current, {
        y: -30,
        scale: 1.05,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: lowerHeroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
          fastScrollEnd: true,
          invalidateOnRefresh: false,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger when theme changes (essential for dynamic content height)
    ScrollTrigger.refresh();
  }, [theme]);

  return (
    <div className="mb-20 sm:mb-28 md:mb-36 mt-16 sm:mt-20 md:mt-24 w-full text-center">
      <div ref={heroRef} className="upperHero container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-[6px] rounded-full bg-[#248f74]/5 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6 border relative overflow-hidden"
          style={{ opacity: 0 }}
        >
          <BorderBeam
            duration={8}
            size={40}
            reverse
            className="from-transparent via-primary to-transparent"
            initialOffset={20}
          />
          <Blocks className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Secure Tech</span>
          <span className="xs:hidden">Powered by Next Gen NLP</span>
        </div>

        <h1
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2"
          style={{ opacity: 0 }}
        >
          <span className="gradient-text2">Trustworthy</span> Referrals{" "}
          <span className="gradient-text3">for</span> <br className="hidden sm:block" />{" "}
          <span className="gradient-text2">Verified </span>Talent
        </h1>

        <p
          ref={descRef}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-8 sm:mb-10 tracking-tight px-4"
          style={{ opacity: 0 }}
        >
          Streamline your hiring with referrals backed by verified student
          credentials. Build trust, reduce risk, and find the perfect fit for
          your team.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col items-center justify-center gap-4 sm:gap-6"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <GetStarted />
            <p className="text-xs sm:text-sm text-muted-foreground tracking-tight text-center max-w-xs sm:max-w-none">
              Start your journey with verified credentials
            </p>
          </div>
        </div>
      </div>

      <div
        ref={lowerHeroRef}
        className="lowerHero w-screen relative left-[50%] right-[50%] -mx-[50vw] bg-[url(/Gradient-bg.png)] bg-no-repeat bg-cover bg-center min-h-[400px] sm:min-h-[500px] md:min-h-[650px] lg:min-h-[750px] px-4 sm:px-8 md:px-16 lg:px-24 pb-0 flex items-end"
        style={{ opacity: 0 }}
      >
        <div
          ref={imageContainerRef}
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] rounded-xl sm:rounded-2xl border-2 border-background/20 bg-border mt-20 sm:mt-32 md:mt-44 relative p-0.5 sm:p-1 will-change-transform"
        >
          <div className="w-full h-full rounded-lg sm:rounded-xl overflow-hidden border-[1px] border-background/20 bg-background">
            <img
              src={theme === "dark" ? "/P1.png" : "/P2.png"}
              alt="Product Preview"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-top"
              style={{ transform: "translateZ(0)" }}
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 sm:h-56 md:h-72 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
});

LandingHero.displayName = "LandingHero";

export default LandingHero;