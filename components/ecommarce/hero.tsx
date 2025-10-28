"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- Slides ------------------------------------------------------------------
const heroData = [
  {
    id: 1,
    image: "/assets/others/herobook1.jpg",
    title: "আপনার পছন্দের বই খুঁজুন",
    description: "হাজার হাজার বইয়ের মধ্যে থেকে আপনার পছন্দের বইটি খুঁজে নিন",
    cta: { label: "বই খুঁজুন", href: "/search" },
    badge: "বেস্টসেলার"
  },
  {
    id: 2,
    image: "/assets/others/herobook2.jpg",
    title: "নতুন প্রকাশিত বইসমূহ",
    description: "সর্বশেষ প্রকাশিত বইগুলি দেখুন এবং আপনার সংগ্রহে যোগ করুন",
    cta: { label: "নতুনগুলো দেখুন", href: "/new" },
    badge: "নতুন"
  },
  {
    id: 3,
    image: "/assets/others/herobook3.jpg",
    title: "বিশেষ অফার",
    description: "সীমিত সময়ের জন্য বিশেষ মূল্যে বই কিনুন",
    cta: { label: "অফার নিন", href: "/offers" },
    badge: "অফার"
  },
];

export default function Hero({ interval = 6000 }) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const timerRef = useRef(null);
  const startX = useRef(null);

  const isPaused = paused || hovered;

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Autoplay with page-visibility + hover pause
  useEffect(() => {
    const tick = () => setCurrent((p) => (p + 1) % heroData.length);

    const start = () => {
      if (!timerRef.current && !isPaused && interval > 0) {
        timerRef.current = setInterval(tick, Math.max(3000, interval));
      }
    };
    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const handleVisibility = () => {
      if (document.hidden || isPaused) stop();
      else start();
    };

    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [interval, isPaused]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Swipe nav
  const onPointerDown = (e) => (startX.current = e.clientX);
  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    startX.current = null;
  };

  const goTo = (i) => setCurrent(((i % heroData.length) + heroData.length) % heroData.length);
  const prev = () => setCurrent((p) => (p - 1 + heroData.length) % heroData.length);
  const next = () => setCurrent((p) => (p + 1) % heroData.length);

  return (
    <section
      className={`relative w-full mt-36 h-[70vh] md:h-[80vh] overflow-hidden rounded-3xl md:rounded-4xl shadow-2xl transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      aria-roledescription="carousel"
      aria-label="Featured hero banners"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Unique geometric background patterns */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute left-10 top-10 w-32 h-32 border-2 border-[#819A91] rounded-lg rotate-45" />
        <div className="absolute right-20 bottom-20 w-24 h-24 border-2 border-[#A7C1A8] rounded-full" />
        <div className="absolute left-1/4 top-1/3 w-16 h-16 bg-[#D1D8BE] opacity-20 rotate-12" />
        <div className="absolute right-1/3 bottom-1/4 w-20 h-20 border border-[#819A91] opacity-30" />
      </div>

      {/* Gradient overlays for depth */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#819A91]/40 via-transparent to-[#A7C1A8]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C4A3B]/70 via-[#2C4A3B]/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#819A91]/20 via-transparent to-transparent" />
      </div>

      {/* Slides */}
      {heroData.map((hero, index) => (
        <div
          key={hero.id}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === current 
              ? "opacity-100 visible scale-100" 
              : "opacity-0 invisible scale-105"
          }`}
        >
          {/* Bg image with enhanced overlay */}
          <div className="absolute inset-0">
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover transform transition-transform duration-1000 hover:scale-105"
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2C4A3B]/80 via-[#2C4A3B]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C4A3B] via-[#2C4A3B]/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-2xl">
                {/* Badge */}
                {hero.badge && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#819A91] text-[#EEEFE0] text-sm font-semibold mb-6 shadow-lg">
                    <div className="w-2 h-2 bg-[#EEEFE0] rounded-full mr-2 animate-pulse" />
                    {hero.badge}
                  </div>
                )}

                {/* Title with elegant underline */}
                <div className="relative">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#EEEFE0] leading-tight drop-shadow-2xl">
                    {hero.title}
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-[#A7C1A8] to-[#D1D8BE] rounded-full mt-4 shadow-lg" />
                </div>

                {/* Description */}
                <p className="mt-6 text-lg md:text-xl text-[#EEEFE0]/90 leading-relaxed max-w-xl">
                  {hero.description}
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href={hero.cta.href}>
                    <Button 
                      size="lg" 
                      className="rounded-2xl px-8 py-6 text-lg font-semibold bg-gradient-to-r from-[#819A91] to-[#A7C1A8] hover:from-[#A7C1A8] hover:to-[#819A91] text-[#EEEFE0] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                    >
                      {hero.cta.label}
                    </Button>
                  </Link>
                  <Link href="/books">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-2xl px-8 py-6 text-lg font-semibold border-2 border-[#EEEFE0] text-[#EEEFE0] bg-transparent hover:bg-[#EEEFE0] hover:text-[#2C4A3B] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      সব বই দেখুন
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-12 flex gap-8 text-[#EEEFE0]">
                  <div className="text-center">
                    <div className="text-2xl font-bold">১০,০০০+</div>
                    <div className="text-sm opacity-90">বইয়ের সংগ্রহ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">৫০০+</div>
                    <div className="text-sm opacity-90">লেখক</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">৯৯%</div>
                    <div className="text-sm opacity-90">সন্তুষ্ট গ্রাহক</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-6 md:p-8">
        <div className="pointer-events-auto flex gap-3">
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2C4A3B]/80 backdrop-blur-md border border-[#819A91] text-[#EEEFE0] hover:bg-[#819A91] hover:scale-110 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A7C1A8] shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="pointer-events-auto">
          <button
            aria-label="Next slide"
            onClick={next}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2C4A3B]/80 backdrop-blur-md border border-[#819A91] text-[#EEEFE0] hover:bg-[#819A91] hover:scale-110 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A7C1A8] shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Dots + Progress Bar */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between gap-6">
            {/* Dots */}
            <div className="flex items-center gap-3">
              {heroData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`relative rounded-full transition-all duration-300 ${
                    i === current 
                      ? "w-12 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] shadow-lg" 
                      : "w-4 bg-[#EEEFE0]/50 hover:bg-[#EEEFE0]/80 hover:scale-110"
                  } h-3`}
                />
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="hidden md:block relative h-2 grow rounded-full bg-[#EEEFE0]/20 overflow-hidden backdrop-blur-sm">
              <div
                key={current}
                className="h-full bg-gradient-to-r from-[#819A91] to-[#A7C1A8] rounded-full"
                style={{
                  width: isPaused || interval <= 0 ? "0%" : "100%",
                  transition: isPaused || interval <= 0 ? "none" : `width ${Math.max(3000, interval)}ms linear`,
                }}
              />
            </div>
            
            {/* Slide Numbers */}
            <div className="text-[#EEEFE0] font-semibold text-sm backdrop-blur-sm bg-[#2C4A3B]/30 px-3 py-1 rounded-full">
              <span className="text-lg">{current + 1}</span>
              <span className="mx-1">/</span>
              <span>{heroData.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#2C4A3B] to-transparent" />
      
      {/* Floating book icon */}
      <div className="absolute right-12 bottom-12 hidden xl:block">
        <div className="bg-[#819A91] p-4 rounded-2xl shadow-2xl animate-float">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5V4.5C4 3.4 4.9 2.5 6 2.5H19C20.1 2.5 21 3.4 21 4.5V19.5C21 20.6 20.1 21.5 19 21.5H6C4.9 21.5 4 20.6 4 19.5Z" stroke="#EEEFE0" strokeWidth="2"/>
            <path d="M8 2.5V21.5" stroke="#EEEFE0" strokeWidth="2"/>
            <path d="M16 2.5V21.5" stroke="#EEEFE0" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </section>
  );
}