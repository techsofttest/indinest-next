"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Loader2, Check, ShoppingBag, Gift } from "lucide-react";
import { giftProducts } from "@/components/data/products";
import Button from "@/components/ui/Button";

/* ─── Gift Card ──────────────────────────────────────────────────────── */
function GiftCard({
  id,
  name,
  price,
  image,
}: {
  id: number;
  name: string;
  price: string;
  image: string;
}) {
  const [addingState, setAddingState] = useState<"idle" | "loading" | "success">("idle");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (addingState !== "idle") return;
    setAddingState("loading");

    setTimeout(() => {
      setAddingState("success");

      const stored = localStorage.getItem("cartItems");
      const currentCart = stored ? JSON.parse(stored) : [];
      const numericPrice = Number(price.replace(/[^0-9]/g, "")) || 2000;
      const existsIndex = currentCart.findIndex((item: any) => item.name === name);
      if (existsIndex > -1) {
        currentCart[existsIndex].quantity += 1;
      } else {
        currentCart.push({
          id: Date.now(),
          name,
          brand: "IndiNest Gifts",
          price: numericPrice,
          image,
          size: "Standard",
          sizes: ["Standard"],
          colour: "Original",
          quantity: 1,
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(currentCart));
      const totalCount = currentCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      localStorage.setItem("cartItemCount", String(totalCount));
      window.dispatchEvent(new Event("cart-change"));

      setTimeout(() => {
        setAddingState("idle");
        window.dispatchEvent(new Event("cart-open-drawer"));
      }, 800);
    }, 1200);
  };

  return (
    <Link
      href={`/products/gifts/${id}`}
      className="flex-none w-[240px] md:w-[300px] snap-start group cursor-pointer relative"
      aria-label={`View ${name}`}
    >

      <div className="w-full aspect-square group-hover:rounded-t-none transition-all duration-500 ease-in-out overflow-hidden bg-[#F0F2FF] relative">
        {/* Cut-out corner effect */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white rounded-full z-[5]"></div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-3 right-3 h-10 rounded-full bg-white/90 text-[#010526] z-10 transition-all duration-300 shadow-md hover:bg-white cursor-pointer flex items-center justify-center overflow-hidden group/btn ${addingState !== "idle"
            ? "w-10" // Keep it small for loading/success
            : "w-10 hover:w-24" // Expand on hover
            }`}
          aria-label="Add to cart"
          disabled={addingState !== "idle"}
        >
          {addingState === "loading" && <Loader2 size={16} className="animate-spin text-[#010526]" />}
          {addingState === "success" && <Check size={16} className="text-emerald-600" />}
          {addingState === "idle" && (
            <>
              <ShoppingBag size={16} className="text-[#010526] flex-shrink-0" />
              <span className="text-xs font-bold w-0 group-hover/btn:w-auto group-hover/btn:ml-2 transition-all duration-200 whitespace-nowrap overflow-hidden">Add</span>
            </>
          )}
        </button>

        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Info panel */}
      <div className="pt-3 pb-1 text-center flex flex-col items-center mb-8">
        <h3 className="text-base font-semibold text-[#010526] leading-snug mb-2 line-clamp-2">
          {name}
        </h3>
        <span className="text-xl font-bold text-[#010526]">{price}</span>
      </div>
      <div className="absolute top-1 right-1 z-10 pointer-events-none">
        <img src="/icons/gift.gif" alt="Gift" className="w-9 h-9" />
      </div>
    </Link>
  );
}

/* ─── GiftSection ────────────────────────────────────────────────────── */
export default function GiftSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  /* Drag state */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const rafId = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const updateProgress = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => el.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  /* Momentum */
  const applyMomentum = () => {
    if (!trackRef.current) return;
    velocity.current *= 0.92;
    trackRef.current.scrollLeft -= velocity.current;
    if (Math.abs(velocity.current) > 0.5) {
      rafId.current = requestAnimationFrame(applyMomentum);
    }
  };

  /* Mouse handlers */
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
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  /* Touch handlers */
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
    trackRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };
  const handleScrollRight = () => {
    trackRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Section header — same pattern as ProductCarousel / CategorySection */}
      <div className="flex flex-col items-center text-center mb-8 gap-4">
        <div className="flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-widest mb-2 text-[#010526]/60">
            A Thoughtful Gesture
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-[#010526]">
            Delight Your Loved Ones
          </h2>
        </div>
      </div>

      {/* Carousel wrapper */}
      <div className="relative w-full">
        {/* Left arrow */}
        <button
          onClick={handleScrollLeft}
          aria-label="Scroll Left"
          className="absolute -left-2 md:-left-6 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors"
        >
          &larr;
        </button>

        {/* Right arrow */}
        <button
          onClick={handleScrollRight}
          aria-label="Scroll Right"
          className="absolute -right-2 md:-right-6 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors"
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
          {giftProducts.map((product) => (
            <GiftCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
