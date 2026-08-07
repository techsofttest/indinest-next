"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";

const finestEditProducts = [
  {
    id: 1,
    imageSrc: "/products/jewellery/necklace.png",
    imageAlt: "Necklace",
    brand: "Necklace",
    price: "£ 48,000",
  },
  {
    id: 2,
    imageSrc: "/products/cloth/kerala-saree.png",
    imageAlt: "Kerala Saree",
    brand: "Kerala Saree",
    price: "£ 14,500",
  },
  {
    id: 3,
    imageSrc: "/products/jewellery/bangle.png",
    imageAlt: "Bangle",
    brand: "Bangle",
    price: "£ 18,500",
  },
  {
    id: 4,
    imageSrc: "/products/cloth/luxury-saree1.png",
    imageAlt: "Luxury Saree 1",
    brand: "Luxury Saree 1",
    price: "£ 34,900",
  },
  {
    id: 5,
    imageSrc: "/products/jewellery/ring.png",
    imageAlt: "Ring",
    brand: "Ring",
    price: "£ 12,000",
  },
  {
    id: 6,
    imageSrc: "/products/cloth/churidar.png",
    imageAlt: "Churidar",
    brand: "Churidar",
    price: "£ 9,800",
  },
  {
    id: 7,
    imageSrc: "/products/cloth/churidar-1.png",
    imageAlt: "Churidar 1",
    brand: "Churidar 1",
    price: "£ 11,200",
  },
];

export default function FinestEditCarousel() {
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
  }, [updateProgress]);

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

  return (
    <section className="py-16 px-4 md:px-8 bg-[#F0F2FF]">
      {/* Section header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#010526]">Finest Edit</h2>
        <a
          href="#"
          className="text-[10px] uppercase tracking-widest border border-[#010526] px-4 py-2 bg-transparent hover:bg-[#010526] hover:text-[#F0F2FF] transition-colors whitespace-nowrap"
        >
          See all
        </a>
      </div>

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
        {finestEditProducts.map((product) => (
          <ProductCard key={product.id} {...product} bgColor="bg-white" />
        ))}
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
