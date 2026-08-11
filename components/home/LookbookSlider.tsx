"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface SlideItem {
  id: number;
  product_id: number;
  name: string;
  category: string;
  image: string;
  slug: string;
  url: string;
}

interface SlideData {
  id: number;
  title: string;
  subtitle?: string | null;
  slug: string;
  model_image: string;
  model_alt: string;
  items: SlideItem[];
}

interface LookbookSliderProps {
  slides?: SlideData[];
}

export default function LookbookSlider({ slides = [] }: LookbookSliderProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!slides || slides.length === 0) return null;

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentSlideIndex];

  if (!currentSlide) return null;

  const showNavigation = slides.length > 1;

  return (
    <section className="relative w-full py-12 md:py-16 px-4 md:px-8 bg-white border-t border-[#010526]/5">
      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Look"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white text-[#010526] transition-colors shadow-md"
          >
            &larr;
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Look"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white text-[#010526] transition-colors shadow-md"
          >
            &rarr;
          </button>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-stretch max-w-[1600px] mx-auto">
        {/* Left Side: Large image of the look/model */}
        <div className="relative w-full min-h-[450px] md:h-full bg-[#f8f8f8] overflow-hidden group">
          <Image
            src={currentSlide.model_image}
            alt={currentSlide.model_alt || currentSlide.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={currentSlideIndex === 0}
          />
        </div>

        {/* Right Side: Showcase items */}
        <div className="flex flex-col justify-center py-2">
          <div className="text-center mb-6">
            <h3 className="text-xs uppercase tracking-widest text-[#010526]/60 mb-1 font-semibold">
              {currentSlide.subtitle || "Finishing Touches"}
            </h3>
            <h2
              className="text-2xl md:text-3xl italic text-[#010526]"
              style={{ fontFamily: "var(--font-pt-serif)" }}
            >
              {currentSlide.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            {currentSlide.items.map((item) => (
              <Link
                href={item.url}
                key={item.id}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="relative w-full aspect-[4/3] bg-[#fdfdfd] mb-2 overflow-hidden flex items-center justify-center border border-[#010526]/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={150}
                    height={112}
                    className="object-contain max-h-[85%] transition-transform duration-500 group-hover:scale-105"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#010526] mb-1">
                  {item.name}
                </h4>
                <p className="text-[11px] uppercase tracking-wider text-[#010526]/70">
                  {item.category}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-center w-full">
            <Link href={`/lookbook/${currentSlide.slug}`} className="max-w-[280px] w-full">
              <Button
                variant="primary"
                size="md"
                className="w-full tracking-[0.2em] font-semibold flex items-center justify-center gap-2"
              >
                <svg
                  className="w-3.5 h-3.5 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Shop the Look
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
