"use client";

import { useState, useEffect } from "react";
import { leftLinks, rightLinks, drawerCategories, keralaTraditionalItems } from "./Header";

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDropdown({ isOpen, onClose }: MenuDropdownProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useState(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  });

  const [keralaOpen, setKeralaOpen] = useState(false);

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

  return (
    <>
      {/* Backdrop below header */}
      <div
        onClick={onClose}
        className={`fixed inset-0 top-[96px] bg-black/35 backdrop-blur-xs z-40 transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Panel just below the navbar */}
      <div className={`absolute top-full left-0 w-full min-h-[380px] bg-white border-b border-[#010526]/10 shadow-2xl py-10 px-6 md:px-16 z-50 transition-all duration-300 ease-out grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 max-w-full text-left ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}>

        {/* Left Column: Menu Links */}
        <div className="md:col-span-4 flex flex-col justify-start">
          <p className="text-xs uppercase tracking-[0.2em] text-[#010526]/70 mb-6 font-bold">Navigation</p>
          <nav className="flex flex-col max-h-[350px] md:max-h-[calc(100vh-220px)] overflow-y-auto pr-4 custom-scrollbar">
            {leftLinks.map((link) => {
              if (link.label === "Kerala Traditional") {
                return (
                  <div key={link.label} className="mb-4">
                    <button
                      onClick={() => setKeralaOpen(!keralaOpen)}
                      className="text-sm md:text-base font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity text-[#010526] flex items-center gap-2 text-left w-full"
                    >
                      <span>{link.label}</span>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${keralaOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    <div className={`flex flex-col gap-2 pl-4 transition-all duration-300 overflow-hidden ${keralaOpen ? "max-h-[500px] mt-3 opacity-100" : "max-h-0 opacity-0"}`}>
                      {keralaTraditionalItems.map((subItem) => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          onClick={() => {
                            onClose();
                            setKeralaOpen(false);
                          }}
                          className="text-[12px] uppercase tracking-wider text-[#010526]/90 hover:text-[#010526] py-1.5 transition-all font-medium block"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="text-sm md:text-base font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity text-[#010526] mb-4 block"
                >
                  {link.label}
                </a>
              );
            })}

            {rightLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="text-sm md:text-base font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity text-[#010526] mb-4 block"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Column: Categories with Images */}
        <div className="md:col-span-8 flex flex-col justify-start">
          <p className="text-xs uppercase tracking-[0.2em] text-[#010526]/70 mb-6 font-bold">Shop by Category</p>
          <div className="flex flex-wrap gap-4 md:gap-6 max-h-[350px] md:max-h-[calc(100vh-220px)] overflow-y-auto pr-4 custom-scrollbar">
            {drawerCategories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                onClick={onClose}
                className="group flex flex-col text-left w-24 md:w-[120px]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0F2FF]">
                  <img
                    src={cat.image}
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
        </div>

      </div>
    </>
  );
}
