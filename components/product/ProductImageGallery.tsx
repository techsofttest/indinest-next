"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface ProductImage {
  src: string;
  label: string;
  style: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  activeImageIndex: number;
  setActiveImageIndex: (idx: number) => void;
}

export default function ProductImageGallery({
  images,
  productName,
  activeImageIndex,
  setActiveImageIndex,
}: ProductImageGalleryProps) {
  // ── Desktop magnifier state ──────────────────────────────────────────────
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const smoothedCursorPos = useSmoothCursor(cursorPos);
  const isZoomed = isHovering && (cursorPos.x !== 0 || cursorPos.y !== 0);

  // ── Mobile drag / swipe state ────────────────────────────────────────────
  const dragStartX = useRef<number>(0);
  const dragDelta = useRef<number>(0);
  const [liveDelta, setLiveDelta] = useState(0); // px offset during drag
  const isDragging = useRef(false);

  const DRAG_THRESHOLD = 50; // px needed to count as a slide change

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    isDragging.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    dragDelta.current = delta;
    setLiveDelta(delta);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = dragDelta.current;
    setLiveDelta(0);

    if (delta < -DRAG_THRESHOLD && activeImageIndex < images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else if (delta > DRAG_THRESHOLD && activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  }, [activeImageIndex, images.length, setActiveImageIndex]);

  const currentImage =
    images[activeImageIndex] || images[0] || { src: "", label: "Product Image", style: "" };

  return (
    <div className="lg:col-span-5 flex flex-col md:flex-row-reverse gap-4 lg:sticky lg:top-28">

      {/* ══════════════════════════════════════════════════════════════
          MOBILE  — draggable full-width carousel (hidden on md+)
      ══════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden w-full">
        {/* Drag track */}
        <div
          className="relative w-full aspect-[4/5] overflow-hidden bg-[#F0F2FF] select-none touch-pan-y cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Slides strip */}
          <div
            className="flex h-full"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(calc(${-activeImageIndex * (100 / images.length)}% + ${liveDelta}px))`,
              transition: isDragging.current ? "none" : "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="h-full flex-shrink-0 bg-[#F0F2FF]"
                style={{ width: `${100 / images.length}%` }}
              >
                <img
                  src={img.src}
                  alt={`${productName} - ${img.label}`}
                  className={`w-full h-full object-contain pointer-events-none ${img.style}`}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeImageIndex === idx
                      ? "bg-[#010526] w-5"
                      : "bg-[#010526]/30 w-2"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Prev / Next arrows (only if multiple images) */}
          {images.length > 1 && (
            <>
              {activeImageIndex > 0 && (
                <button
                  onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full shadow-md"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#010526" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              )}
              {activeImageIndex < images.length - 1 && (
                <button
                  onClick={() => setActiveImageIndex(activeImageIndex + 1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full shadow-md"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#010526" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP — magnifier main image (hidden below md)
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:block flex-1 aspect-[4/5] bg-[#F0F2FF] relative overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={(e) => {
          const el = e.currentTarget;
          const { left, top } = el.getBoundingClientRect();
          setCursorPos({ x: e.clientX - left, y: e.clientY - top });
        }}
      >
        <img
          src={currentImage.src}
          alt={`${productName} - ${currentImage.label}`}
          className={`w-full h-full object-contain transition-transform duration-500 ease-out ${currentImage.style}`}
          style={{
            transform: isZoomed ? "scale(2.5)" : "scale(1)",
            transformOrigin: `${smoothedCursorPos.x}px ${smoothedCursorPos.y}px`,
          }}
        />
      </div>

      {/* ── Thumbnails Sidebar (desktop only) ── */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`aspect-[4/5] w-full bg-[#F0F2FF] overflow-hidden transition-all duration-300 relative ${
                activeImageIndex === idx
                  ? "ring-2 ring-[#010526] opacity-100"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              <img
                src={img.src}
                alt={`${productName} thumbnail`}
                className={`w-full h-full object-contain ${img.style}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Custom hook to smoothly interpolate cursor position.
 * This creates a "lerping" or "easing" effect for the zoom origin.
 */
function useSmoothCursor(targetPos: { x: number; y: number }, smoothing = 0.12) {
  const [smoothedPos, setSmoothedPos] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(undefined);

  useEffect(() => {
    const update = () => {
      setSmoothedPos((current) => ({
        x: current.x + (targetPos.x - current.x) * smoothing,
        y: current.y + (targetPos.y - current.y) * smoothing,
      }));
      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [targetPos, smoothing]);

  return smoothedPos;
}
