"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const heroData = [
  {
    id: 1,
    image: "/assets/others/herobook1.jpg",
    title: "আপনার পছন্দের বই খুঁজুন",
    description: "হাজার হাজার বইয়ের মধ্যে থেকে আপনার পছন্দের বইটি খুঁজে নিন",
  },
  {
    id: 2,
    image: "/assets/others/herobook2.jpg",
    title: "নতুন প্রকাশিত বইসমূহ",
    description: "সর্বশেষ প্রকাশিত বইগুলি দেখুন এবং আপনার সংগ্রহে যোগ করুন",
  },
  {
    id: 3,
    image: "/assets/others/herobook3.jpg",
    title: "বিশেষ অফার",
    description: "সীমিত সময়ের জন্য বিশেষ মূল্যে বই কিনুন",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[50vh] w-full overflow-hidden">
      {heroData.map((hero, index) => (
        <div
          key={hero.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }`}
        >
          <div className="h-[50vh] w-full relative">
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              className="object-cover transition-all duration-1000"
              priority={index === 0}
            />
          </div>
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl text-white">
                <h1 className="text-4xl md:text-5xl mt-32 font-bold mb-4">
                  {hero.title}
                </h1>
                <p className="text-lg mb-6">{hero.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-primary" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
