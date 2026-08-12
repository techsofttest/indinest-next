"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import QuickAddModal from "@/components/product/QuickAddModal";
import { formatPrice } from "@/lib/product";

interface SlideItem {
  id: number;
  product_id: number;
  name: string;
  category: string;
  image: string;
  slug: string;
  url: string;
  brand?: string;
  price?: number;
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
  const [activeQuickAddSlug, setActiveQuickAddSlug] = useState<string | null>(null);

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
          <img
            src={currentSlide.model_image}
            alt={currentSlide.model_alt || currentSlide.title}
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
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
              <div
                key={item.id}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="relative w-full aspect-[4/3] bg-[#fdfdfd] mb-2 overflow-hidden flex items-center justify-center border border-[#010526]/5">
                  <Link href={item.url} className="w-full h-full flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-contain max-h-[85%] transition-transform duration-500 group-hover:scale-105"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setActiveQuickAddSlug(item.slug);
                    }}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 text-[#010526] z-10 transition-all duration-300 shadow-md hover:bg-white hover:scale-105 cursor-pointer opacity-0 group-hover:opacity-100"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={16} className="text-[#010526]" />
                  </button>
                </div>
                <Link href={item.url}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#010526] mb-1 hover:text-[#010526]/80 transition-colors">
                    {item.name}
                  </h4>
                </Link>
                <p className="text-[11px] uppercase tracking-wider text-[#010526]/70">
                  {item.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeQuickAddSlug && (
        <QuickAddModal
          slug={activeQuickAddSlug}
          isOpen={!!activeQuickAddSlug}
          onClose={() => setActiveQuickAddSlug(null)}
        />
      )}
    </section>
  );
}
