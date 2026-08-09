"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl } from "@/lib/product";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  // Handle keyboard events (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Dynamic API search call
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/api/storefront/search?q=${encodeURIComponent(query)}`));
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products ?? []);
        }
      } catch (err) {
        console.error("Failed to query search API:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Dark backdrop below header level */}
      <div
        onClick={onClose}
        className={`fixed inset-0 top-[96px] bg-black/35 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Dropdown panel just below the navbar */}
      <div className={`absolute top-full left-0 w-full min-h-[350px] bg-white border-b border-[#010526]/10 shadow-2xl py-10 px-6 md:px-16 z-50 transition-all duration-300 ease-out flex flex-col gap-6 ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}>

        {/* Absolute Close button */}
        <button
          onClick={onClose}
          aria-label="Close search"
          className="absolute top-4 right-4 md:top-6 md:right-8 p-2 hover:opacity-60 transition-opacity text-[#010526]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Search input line */}
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between border-b border-[#010526]/30 pb-3 pr-8 md:pr-12">
          <div className="flex-1 flex items-center">
            <span className="text-[#010526]/70 mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-2xl font-light tracking-wide text-[#010526] bg-transparent outline-none placeholder:text-[#010526]/45"
            />
          </div>

          <div className="flex items-center gap-4 ml-4">
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setProducts([]);
                  inputRef.current?.focus();
                }}
                className="text-sm uppercase tracking-widest text-[#010526]/70 hover:text-[#010526] transition-colors font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results layout */}
        <div className="w-full max-w-[1200px] mx-auto mt-2">
          <div className="flex flex-col">
            <h4
              className="text-xs uppercase tracking-[0.2em] font-bold text-[#010526]/75 mb-5 italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Products
            </h4>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-[#010526]/60 font-sans">
                <div className="w-4 h-4 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin" />
                Searching...
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    onClick={onClose}
                    className="flex gap-4 items-center group cursor-pointer"
                  >
                    <div className="w-16 h-20 bg-[#F0F2FF] overflow-hidden flex-shrink-0 relative">
                      <img
                        src={resolveProductImageUrl(prod.featured_image)}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col font-sans">
                      <span className="text-base font-semibold text-[#010526] group-hover:underline leading-snug">
                        {prod.name}
                      </span>
                      <span className="text-sm text-[#010526]/85 mt-1.5 font-medium">
                        £{(prod.price ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="text-sm text-[#010526]/60 font-sans">
                No results found for &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <div className="text-sm text-[#010526]/40 font-sans italic">
                Type above to search our collections...
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
