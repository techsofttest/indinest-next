"use client";

import { useEffect, useRef, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSuggestions = [
  "Kasavu",
  "Silk Weaves",
  "Chanderi",
  "Temple Jewellery",
  "Lehengas",
];

const searchDatabase = [
  { name: "Kerala Traditional Kasavu Saree", category: "Sarees", price: "£ 14,500", image: "/products/editorial/ed1.jpg" },
  { name: "Heritage Banarasi Silk Saree", category: "Sarees", price: "£ 24,000", image: "/products/editorial/ed2.jpg" },
  { name: "Kanjivaram Silk Saree", category: "Sarees", price: "£ 21,200", image: "/products/cloth/cloth.jpg" },
  { name: "Chanderi Cotton Saree", category: "Sarees", price: "£ 8,900", image: "/products/cloth/ChatGPT Image Jul 14, 2026, 10_28_54 AM 1.jpg" },
  { name: "Kundan Temple Art Jewellery Set", category: "Jewellery", price: "£ 8,500", image: "/products/jewellery/necklace.jpg" },
  { name: "Designer Bridal Lehenga", category: "Lehengas", price: "£ 38,000", image: "/products/cloth/look1.png" },
  { name: "Elegant Georgette Anarkali Suit", category: "Salwar Suits", price: "£ 12,000", image: "/products/cloth/look3.png" },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useState(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  // Handle keyboard events (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Focus input
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

  if (!shouldRender) return null;

  // Filter items in the search database based on typing query
  const filteredProducts = query.trim()
    ? searchDatabase.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    )
    : searchDatabase.slice(0, 3); // show first 3 by default if empty

  const suggestionList = query.trim()
    ? Array.from(
      new Set(
        searchDatabase
          .filter(
            (item) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.category.toLowerCase().includes(query.toLowerCase())
          )
          .map((item) => item.name)
      )
    )
    : trendingSuggestions;

  return (
    <>
      {/* Dark backdrop below header level (since SearchModal sits inside Header container) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 top-[96px] bg-black/35 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Dropdown panel just below the navbar */}
      <div className={`absolute top-full left-0 w-full min-h-[480px] bg-white border-b border-[#010526]/10 shadow-2xl py-10 px-6 md:px-16 z-50 transition-all duration-300 ease-out flex flex-col gap-8 ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}>

        {/* Absolute Close button in top-right to avoid confusion */}
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
              placeholder="Search..."
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
                  inputRef.current?.focus();
                }}
                className="text-sm uppercase tracking-widest text-[#010526]/70 hover:text-[#010526] transition-colors font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mt-4">

          {/* Left Column: Suggestions */}
          <div className="md:col-span-4 flex flex-col">
            <h4
              className="text-xs uppercase tracking-[0.2em] font-bold text-[#010526]/75 mb-5 italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Suggestions
            </h4>
            <div className="flex flex-col gap-4 items-start">
              {suggestionList.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    inputRef.current?.focus();
                  }}
                  className="text-left text-base text-[#010526] hover:underline transition-all"
                >
                  {item}
                </button>
              ))}
              {suggestionList.length === 0 && (
                <span className="text-sm text-[#010526]/80 font-medium">No suggestions available</span>
              )}
            </div>
          </div>

          {/* Right Column: Products */}
          <div className="md:col-span-8 flex flex-col">
            <h4
              className="text-xs uppercase tracking-[0.2em] font-bold text-[#010526]/75 mb-5 italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Products
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.name}
                  onClick={() => {
                    setQuery(prod.name);
                    inputRef.current?.focus();
                  }}
                  className="flex gap-4 items-center group cursor-pointer"
                >
                  <div className="w-16 h-20 bg-[#F0F2FF] overflow-hidden flex-shrink-0 relative">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-[#010526] group-hover:underline leading-snug">
                      {prod.name}
                    </span>
                    <span className="text-sm text-[#010526]/85 mt-1.5 font-medium">
                      {prod.price}
                    </span>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-4">
                  <div className="text-sm text-[#010526]/90 font-medium">
                    No results found for your search. You might like these instead:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchDatabase.slice(0, 4).map((prod) => (
                      <div
                        key={prod.name}
                        onClick={() => {
                          setQuery(prod.name);
                          inputRef.current?.focus();
                        }}
                        className="flex gap-4 items-center group cursor-pointer"
                      >
                        <div className="w-16 h-20 bg-[#F0F2FF] overflow-hidden flex-shrink-0 relative">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-[#010526] group-hover:underline leading-snug">
                            {prod.name}
                          </span>
                          <span className="text-sm text-[#010526]/85 mt-1.5 font-medium">
                            {prod.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
