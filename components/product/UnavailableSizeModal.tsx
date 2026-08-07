"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface AlternativeProduct {
  id: number;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  sizes?: string[];
  category: string;
  slug?: string;
}

interface UnavailableSizeModalProps {
  size: string;
  products: AlternativeProduct[];
  productCategory: string;
  onClose: () => void;
}

export default function UnavailableSizeModal({
  size,
  products,
  productCategory,
  onClose,
}: UnavailableSizeModalProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isModalDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const rafId = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => el.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  const applyMomentum = () => {
    if (!carouselRef.current) return;
    velocity.current *= 0.92;
    carouselRef.current.scrollLeft -= velocity.current;
    if (Math.abs(velocity.current) > 0.5) {
      rafId.current = requestAnimationFrame(applyMomentum);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    isModalDragging.current = true;
    setDragging(true);
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollStart.current = carouselRef.current.scrollLeft;
    lastX.current = e.pageX;
    velocity.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isModalDragging.current || !carouselRef.current) return;
    e.preventDefault();
    velocity.current = lastX.current - e.pageX;
    lastX.current = e.pageX;
    const x = e.pageX - carouselRef.current.offsetLeft;
    carouselRef.current.scrollLeft = scrollStart.current + (startX.current - x);
  };

  const stopDrag = () => {
    if (!isModalDragging.current) return;
    isModalDragging.current = false;
    setDragging(false);
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    startX.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
    scrollStart.current = carouselRef.current.scrollLeft;
    lastX.current = e.touches[0].pageX;
    velocity.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    velocity.current = lastX.current - e.touches[0].pageX;
    lastX.current = e.touches[0].pageX;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    carouselRef.current.scrollLeft = scrollStart.current + (startX.current - x);
  };

  const onTouchEnd = () => {
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  const scrollLeft = () => carouselRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  const scrollRight = () => carouselRef.current?.scrollBy({ left: 340, behavior: "smooth" });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Body */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl bg-white z-50 shadow-2xl p-6 md:p-8 rounded-md border border-[#010526]/10 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-[#010526] tracking-tight">
            Similar products according to size ({size}) ({products.length})
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#010526]/60 hover:text-[#010526] transition-colors"
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {products.length > 0 ? (
          <div className="relative w-full group/modal-carousel">
            {/* Scroll Left */}
            <button
              onClick={scrollLeft}
              aria-label="Scroll Left"
              className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors opacity-0 group-hover/modal-carousel:opacity-100 transition-opacity duration-300"
            >
              &larr;
            </button>

            {/* Scroll Right */}
            <button
              onClick={scrollRight}
              aria-label="Scroll Right"
              className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors opacity-0 group-hover/modal-carousel:opacity-100 transition-opacity duration-300"
            >
              &rarr;
            </button>

            {/* Draggable track */}
            <div
              ref={carouselRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ cursor: dragging ? "grabbing" : "grab" }}
              className="flex gap-5 overflow-x-auto pb-6 no-scrollbar select-none scroll-smooth"
            >
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug ? p.slug : slugify(p.name)}`}
                  className="flex-none w-[180px] md:w-[220px] group/item"
                  onClick={onClose}
                >
                  <ProductCard
                    className="w-full"
                    name={p.name}
                    brand={p.brand}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    imageSrc={p.image}
                    imageAlt={p.name}
                    sizes={p.sizes}
                  />
                </Link>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full h-[1px] bg-[#010526]/15 relative overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-[#010526] rounded-full transition-none"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-[#010526]/50">
            <p className="text-base font-bold mb-2">No alternative items found</p>
            <p className="text-xs">
              We currently don't have other {productCategory}s in size {size}.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
