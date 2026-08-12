"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BannerSlide {
  imageSrc: string;
  altText?: string;
  href?: string;
}

interface OfferBannerProps {
  slides?: BannerSlide[];
  imageSrc?: string;
  altText?: string;
  href?: string;
  variant?: "default" | "listing-top";
}

export default function OfferBanner({
  slides,
  imageSrc = "/offer-banner/b5.jpg",
  altText = "Offer Banner",
  href = "#",
  variant = "default",
}: OfferBannerProps) {
  const finalSlides = (slides && slides.length > 0) ? slides : [{ imageSrc, altText, href }];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play effect: cycle slides every 5 seconds
  useEffect(() => {
    if (finalSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % finalSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [finalSlides.length]);

  const sectionPadding = variant === "listing-top"
    ? "pt-1 pb-12 md:pb-16 px-4 md:px-8"
    : "py-12 md:py-16 px-4 md:px-8";

  if (finalSlides.length === 1) {
    const slide = finalSlides[0];
    return (
      <section className={`w-full max-w-[1600px] mx-auto ${sectionPadding}`}>
        <Link
          href={slide.href || "#"}
          className="block relative w-full aspect-[21/9] overflow-hidden bg-[#F0F2FF] group"
        >
          <img
            src={slide.imageSrc}
            alt={slide.altText || "Offer Banner"}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </Link>
      </section>
    );
  }

  return (
    <section className={`w-full max-w-[1600px] mx-auto relative group ${sectionPadding}`}>
      {/* Slider Track */}
      <div className="relative w-full aspect-[21/9] overflow-hidden bg-[#F0F2FF]">
        {finalSlides.map((slide, idx) => (
          <Link
            key={idx}
            href={slide.href || "#"}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.imageSrc}
              alt={slide.altText || `Banner Slide ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </Link>
        ))}

        {/* Left Arrow */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + finalSlides.length) % finalSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-white/60 hover:bg-white text-[#010526] transition-all opacity-0 group-hover:opacity-100 shadow-md"
          aria-label="Previous Slide"
        >
          &larr;
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % finalSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-white/60 hover:bg-white text-[#010526] transition-all opacity-0 group-hover:opacity-100 shadow-md"
          aria-label="Next Slide"
        >
          &rarr;
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {finalSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "bg-[#010526] w-5" : "bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
