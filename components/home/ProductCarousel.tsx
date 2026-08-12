"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";

interface ProductCarouselProps {
  products?: {
    id: number;
    imageSrc: string;
    imageAlt: string;
    brand: string;
    name: string;
    price: string;
    originalPrice: string | null;
    sizes?: string[];
    slug?: string;
  }[];
  title?: string;
  subtitle?: string;
  showSeeAll?: boolean;
}

export default function HeritageCarousel({
  products = [],
  title = "New Styles from IndiNest",
  subtitle = "Explore our latest products",
  showSeeAll = true,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const rafId = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  // Progress indicator (0–1)
  const [progress, setProgress] = useState(0);

  /* ── Update progress bar on scroll ── */
  const updateProgress = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress(); // initialise
    return () => el.removeEventListener("scroll", updateProgress);
  }, [updateProgress, products]);

  /* ── Momentum helper ── */
  const applyMomentum = () => {
    if (!trackRef.current) return;
    velocity.current *= 0.92; // friction
    trackRef.current.scrollLeft -= velocity.current;
    if (Math.abs(velocity.current) > 0.5) {
      rafId.current = requestAnimationFrame(applyMomentum);
    }
  };

  /* ── Mouse handlers ── */
  const onMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    isDragging.current = true;
    setDragging(true);
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollStart.current = trackRef.current.scrollLeft;
    lastX.current = e.pageX;
    velocity.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    velocity.current = lastX.current - e.pageX;
    lastX.current = e.pageX;
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollStart.current + (startX.current - x);
  };

  const stopDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false);
    // kick off momentum
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  /* ── Touch handlers ── */
  const onTouchStart = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    startX.current = e.touches[0].pageX - trackRef.current.offsetLeft;
    scrollStart.current = trackRef.current.scrollLeft;
    lastX.current = e.touches[0].pageX;
    velocity.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    velocity.current = lastX.current - e.touches[0].pageX;
    lastX.current = e.touches[0].pageX;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollStart.current + (startX.current - x);
  };

  const onTouchEnd = () => {
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  const handleScrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Section header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          {subtitle && (
            <p className="text-[10px] uppercase tracking-widest mb-2 text-[#010526]/60">
              {subtitle}
            </p>
          )}
          <h2 className="text-xl md:text-2xl font-bold text-[#010526]">
            {title}
          </h2>
        </div>
        {showSeeAll && (
          <Button
            href="/products"
            variant="secondary"
            size="sm"
            className="whitespace-nowrap"
          >
            See all
          </Button>
        )}
      </div>

      {/* Relative wrapper containing carousel track and navigation arrows */}
      <div className="relative w-full">
        {/* Scroll Left Button */}
        <button
          onClick={handleScrollLeft}
          aria-label="Scroll Left"
          className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors"
        >
          &larr;
        </button>

        {/* Scroll Right Button */}
        <button
          onClick={handleScrollRight}
          aria-label="Scroll Right"
          className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors"
        >
          &rarr;
        </button>

        {/* Draggable track */}
        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
          className="flex gap-5 overflow-x-auto pb-6 no-scrollbar select-none"
        >
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* Line progress indicator */}
      {/* <div className="mt-5 w-full h-[1px] bg-[#010526]/15 relative overflow-hidden rounded-full">
        <div
          className="absolute top-0 left-0 h-full bg-[#010526] rounded-full transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div> */}
    </section>
  );
}