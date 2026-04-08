import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WorkProcess = React.memo(() => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const connector1Ref = useRef(null);
  const connector2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading and description entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );

      // SVG Connector 1 - Scroll-based fill reveal animation using clipPath
      if (connector1Ref.current) {
        const svg1 = connector1Ref.current.closest('svg');
        const clipRect1 = svg1?.querySelector('#clip1Rect');
        
        if (clipRect1) {
          gsap.set(clipRect1, {
            attr: { width: 0 }
          });

          gsap.to(clipRect1, {
            attr: { width: 356 },
            ease: "none",
            scrollTrigger: {
              trigger: connector1Ref.current,
              start: "top 85%",
              end: "bottom 35%",
              scrub: 2,
              fastScrollEnd: true,
              invalidateOnRefresh: false,
            },
          });
        }
      }

      // SVG Connector 2 - Scroll-based fill reveal animation using clipPath (right to left)
      if (connector2Ref.current) {
        const svg2 = connector2Ref.current.closest('svg');
        const clipRect2 = svg2?.querySelector('#clip2Rect');
        
        if (clipRect2) {
          gsap.set(clipRect2, {
            attr: { x: 356, width: 356 }
          });

          gsap.to(clipRect2, {
            attr: { x: 0 },
            ease: "none",
            scrollTrigger: {
              trigger: connector2Ref.current,
              start: "top 85%",
              end: "bottom 35%",
              scrub: 2,
              fastScrollEnd: true,
              invalidateOnRefresh: false,
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-16 sm:mb-20 relative overflow-visible"
    >      
    <img 
        src="/Side-BG3.png" 
        alt="Background decoration"
        className="absolute right-[55rem] top-[55%] -translate-y-1/2 pointer-events-none z-0 hidden xl:block"
        loading="lazy"
      />      
      <div className="mb-8 sm:mb-10 md:mb-12 mx-auto text-center">
        <h1 
          ref={headingRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-foreground px-2"
          style={{ opacity: 0 }}
        >
          How <span className="gradient-text3">NextRef </span>works
        </h1>
        <p 
          ref={descRef}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20 tracking-tight px-4"
          style={{ opacity: 0 }}
        >
          NextRef connects incredible people to opportunities. It's for
          people hiring, connecting others, or even job-seeking themselves.
        </p>
      </div>
      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        {/* Process 1 */}
        <div className="process1 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:h-[28rem]">
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none lg:w-[32rem] aspect-[4/5] lg:aspect-auto lg:h-full rounded-lg relative overflow-hidden flex justify-center lg:justify-end items-center lg:ml-6 xl:ml-12 order-1">
            <img
              src="/W1.png"
              alt="Student Build Profile and Upload Resume"
              loading="lazy"
              decoding="async"
              className="absolute w-full h-full rounded-xl object-fill object-center z-0 border"
            />
          </div>
          <div className="w-full lg:w-[80%] xl:w-[60%] flex flex-col justify-center lg:justify-end items-start px-4 sm:px-0 order-2">
            <div className="h-10 w-12 sm:h-12 sm:w-14 flex items-center justify-center py-2 border-2 border-border rounded-lg text-2xl sm:text-3xl mb-3 sm:mb-4">
              01
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Student Build Profile and Upload Resume
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Resume PDF uploaded, parsed, and credentials submitted for verification
            </p>
          </div>
        </div>

        {/* Process Connectors */}
        <div className="svgConnector1 w-full justify-center items-center -my-4 sm:-my-6 md:-my-8 hidden lg:flex">
          <div className="w-[70%] md:w-[60%] max-w-[500px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 356 126.116"
              overflow="visible"
            >
              <g>
                <defs>
                  <linearGradient
                    id="connector1Gradient"
                    x1="0.49751243781094523"
                    x2="0.5024875621890548"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#145A4B" stopOpacity="1"></stop>
                    <stop
                      offset="0.4318869650900901"
                      stopColor="#838383"
                      stopOpacity="1"
                    ></stop>
                    <stop offset="1" stopColor="#020D0E" stopOpacity="1"></stop>
                  </linearGradient>
                  <clipPath id="clip1">
                    <rect id="clip1Rect" x="0" y="0" width="0" height="126.116" />
                  </clipPath>
                </defs>
                <path
                  ref={connector1Ref}
                  d="M 356 126.116 L 351.939 126.116 L 351.939 120.88 C 351.939 103.083 337.96 87.962 319.068 85.33 L 36.332 45.929 C 15.451 43.018 0 26.31 0 6.639 L 0 0 L 4.061 0 L 4.061 6.64 C 4.061 24.437 18.04 39.554 36.932 42.187 L 319.668 81.588 C 340.549 84.497 356 101.21 356 120.88 Z"
                  fill="url(#connector1Gradient)"
                  stroke="none"
                  clipPath="url(#clip1)"
                ></path>
              </g>
            </svg>
          </div>
        </div>

        {/* Process 2 */}
        <div className="process2 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:h-[28rem]">
          <div className="w-full lg:w-[80%] xl:w-[60%] flex flex-col justify-center lg:justify-end items-start lg:items-end text-left lg:text-right px-4 sm:px-0 lg:ml-auto xl:ml-48 order-2 lg:order-1">
            <div className="h-10 w-12 sm:h-12 sm:w-14 flex items-center justify-center py-2 border-2 border-border rounded-lg text-2xl sm:text-3xl mb-3 sm:mb-4">
              02
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Verifier Approves and Verifies Credentials
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              College authority verifies authenticity of credentials
            </p>
          </div>
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none lg:w-[32rem] aspect-[4/5] lg:aspect-auto lg:h-full relative overflow-hidden flex justify-center items-center border rounded-xl order-1 lg:order-2">
            <img
              src="/W2.png"
              alt="Verifier Approves and Verifies Credentials"
              loading="lazy"
              decoding="async"
              className="absolute w-full h-full rounded-lg object-fill object-center z-0"
            />
          </div>
        </div>

        {/* Process Connectors */}
        <div className="svgConnector2 w-full justify-center items-center -my-4 sm:-my-6 md:-my-8 hidden lg:flex">
          <div className="w-[70%] md:w-[60%] max-w-[500px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 356 126.116" overflow="visible">
              <g>
                <defs>
                  <linearGradient id="connector2Gradient" x1="0.49751243781094523" x2="0.5024875621890548" y1="0" y2="1">
                    <stop offset="0" stopColor="#1B5C4A" stopOpacity="1"></stop>
                    <stop offset="0.45326576576576577" stopColor="#838383" stopOpacity="1"></stop>
                    <stop offset="1" stopColor="#051F1A" stopOpacity="1"></stop>
                  </linearGradient>
                  <clipPath id="clip2">
                    <rect id="clip2Rect" x="0" y="0" width="0" height="126.116" />
                  </clipPath>
                </defs>
                <path 
                  ref={connector2Ref}
                  d="M 356 6.64 C 356 26.31 340.549 43.019 319.668 45.929 L 36.933 85.33 C 18.04 87.962 4.061 103.081 4.061 120.877 L 4.061 126.116 L 0 126.116 L 0 120.877 C 0 101.207 15.451 84.497 36.331 81.588 L 319.068 42.187 C 337.96 39.554 351.939 24.437 351.939 6.64 L 351.939 0 L 356 0 Z" 
                  fill="url(#connector2Gradient)"
                  stroke="none"
                  clipPath="url(#clip2)"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Process 3 */}
        <div className="process3 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:h-[28rem]">
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none lg:w-[32rem] aspect-[4/5] lg:aspect-auto lg:h-full rounded-lg relative overflow-hidden flex justify-center lg:justify-end items-center lg:ml-6 xl:ml-12 order-1">
            <img
              src="/W3.png"
              alt="Alumni Refers Based on Verified Credentials"
              loading="lazy"
              decoding="async"
              className="border rounded-xl absolute w-full h-full object-fill object-center z-0"
            />
          </div>
          <div className="w-full lg:w-[80%] xl:w-[60%] flex flex-col justify-center lg:justify-end items-start px-4 sm:px-0 order-2">
            <div className="h-10 w-12 sm:h-12 sm:w-14 flex items-center justify-center py-2 border-2 border-border rounded-lg text-2xl sm:text-3xl mb-3 sm:mb-4">
              03
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Alumni Refers Based on Verified Credentials
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Trusted referrals based on verified credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

WorkProcess.displayName = 'WorkProcess';

export default WorkProcess;