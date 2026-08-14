"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl } from "@/lib/product";

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  departments: any[];
  leftLinks?: Array<{ label: string; href: string }>;
  rightLinks?: Array<{ label: string; href: string }>;
}

export default function MenuDropdown({
  isOpen,
  onClose,
  departments = [],
  leftLinks = [],
  rightLinks = [],
}: MenuDropdownProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedLinks, setExpandedLinks] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLinks(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

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

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(apiUrl("/api/storefront/categories"));
        if (res.ok) {
          const data = await res.json();
          setCategories(data ?? []);
        }
      } catch (err) {
        console.error("Failed to load categories in MenuDropdown:", err);
      }
    }
    loadCategories();
  }, []);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop below header */}
      <div
        onClick={onClose}
        className={`fixed inset-0 top-[96px] bg-black/35 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel just below the navbar */}
      <div
        className={`absolute top-full left-0 w-full min-h-[380px] bg-white border-b border-[#010526]/10 shadow-2xl py-10 px-6 md:px-16 z-50 transition-all duration-300 ease-out grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 max-w-full text-left ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Left Column: Menu Links */}
        <div className="md:col-span-4 flex flex-col justify-start font-sans">
          <p className="text-xs uppercase tracking-[0.2em] text-[#010526]/70 mb-6 font-bold">
            Navigation
          </p>
          <nav className="flex flex-col max-h-[350px] md:max-h-[calc(100vh-220px)] overflow-y-auto pr-4 custom-scrollbar">
            {leftLinks.map((link: any) => {
              const hasSubs = link.subcategories && link.subcategories.length > 0;
              const isExpanded = !!expandedLinks[link.label];
              return (
                <div key={link.label} className="mb-4">
                  <div className="flex items-center justify-between">
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="text-sm md:text-base font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity text-[#010526]"
                    >
                      {link.label}
                    </a>
                    {hasSubs && (
                      <button
                        onClick={(e) => toggleExpand(link.label, e)}
                        className="p-1 text-[#010526] hover:opacity-60 focus:outline-none cursor-pointer"
                      >
                        {isExpanded ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  {hasSubs && isExpanded && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-[#010526]/10">
                      {link.subcategories.map((sub: any) => (
                        <a
                          key={sub.id}
                          href={sub.href}
                          onClick={onClose}
                          className="text-xs font-semibold uppercase tracking-widest hover:opacity-60 text-[#010526]/75"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {rightLinks.map((link: any) => {
              const hasSubs = link.subdepartments && link.subdepartments.length > 0;
              const isExpanded = !!expandedLinks[link.label];
              return (
                <div key={link.label} className="mb-4">
                  <div className="flex items-center justify-between">
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="text-sm md:text-base font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity text-[#010526]"
                    >
                      {link.label}
                    </a>
                    {hasSubs && (
                      <button
                        onClick={(e) => toggleExpand(link.label, e)}
                        className="p-1 text-[#010526] hover:opacity-60 focus:outline-none cursor-pointer"
                      >
                        {isExpanded ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  {hasSubs && isExpanded && (
                    <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-[#010526]/10">
                      {link.subdepartments.map((sub: any) => (
                        <a
                          key={sub.id}
                          href={sub.href}
                          onClick={onClose}
                          className="text-xs font-semibold uppercase tracking-widest hover:opacity-60 text-[#010526]/75"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Column: Categories with Images */}
        <div className="md:col-span-8 flex flex-col justify-start">
          <p className="text-xs uppercase tracking-[0.2em] text-[#010526]/70 mb-6 font-bold font-sans">
            Shop by Category
          </p>
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-6 md:gap-8 max-h-[350px] md:max-h-[calc(100vh-220px)] overflow-y-auto pr-4 custom-scrollbar">
              {categories.map((cat: any) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="group flex flex-col text-left w-24 md:w-[120px] font-sans"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0F2FF]">
                    <img
                      src={resolveProductImageUrl(cat.image_url)}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <span className="mt-2 text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#010526] group-hover:opacity-75 transition-opacity leading-tight">
                    {cat.name}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-sm font-sans text-[#010526]/40 italic py-8">
              No categories available
            </div>
          )}
        </div>
      </div>
    </>
  );
}
