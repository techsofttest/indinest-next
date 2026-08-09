"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { apiUrl } from "@/lib/api";

export default function Footer() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadFooterCategories() {
      try {
        const res = await fetch(apiUrl("/api/storefront/categories"));
        if (res.ok) {
          const data = await res.json();
          setCategories(data ?? []);
        }
      } catch (err) {
        console.error("Failed to load categories in Footer:", err);
      }
    }
    loadFooterCategories();
  }, []);

  return (
    <footer className="w-full max-w-[1600px] mx-auto pt-8 pb-8 px-4 md:px-8">

      {/* Premium CTA Banner */}
      <div className="w-full max-w-[1600px] mx-auto bg-[#F0F2FF] py-16 px-6 md:px-24 mb-4 flex flex-col items-center justify-center overflow-hidden relative min-h-[240px]">

        {/* Left Side Tree 1 (Large, aligned to bottom edge) */}
        <div className="hidden md:block w-24 h-28 absolute bottom-0 left-6 text-[#010526] opacity-25 pointer-events-none">
          <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M50 115 V60" strokeWidth="2.5" />
            <path d="M50 90 Q30 85 25 70" />
            <path d="M50 90 Q70 85 75 70" />
            <path d="M50 75 Q25 70 20 50" />
            <path d="M50 75 Q75 70 80 50" />
            <path d="M50 60 Q30 50 35 30" />
            <path d="M50 60 Q70 50 65 30" />
            <path d="M50 60 Q50 35 50 20" />
            <path d="M25 70 C20 70 15 65 25 55 C35 65 30 70 25 70 Z" fill="currentColor" />
            <path d="M75 70 C80 70 85 65 75 55 C65 55 70 70 75 70 Z" fill="currentColor" />
            <path d="M20 50 C15 50 10 45 20 35 C30 35 25 50 20 50 Z" fill="currentColor" />
            <path d="M80 50 C85 50 90 45 80 35 C70 35 75 50 80 50 Z" fill="currentColor" />
            <path d="M35 30 C30 30 25 25 35 15 C45 15 40 30 35 30 Z" fill="currentColor" />
            <path d="M65 30 C70 30 75 25 65 15 C55 15 60 30 65 30 Z" fill="currentColor" />
            <path d="M50 20 C45 20 40 15 50 5 C60 5 55 20 50 20 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Left Side Tree 2 (Smaller, positioned slightly inward and aligned to bottom edge) */}
        <div className="hidden md:block w-16 h-20 absolute bottom-0 left-28 text-[#010526] opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M50 115 V60" strokeWidth="2.5" />
            <path d="M50 90 Q30 85 25 70" />
            <path d="M50 90 Q70 85 75 70" />
            <path d="M50 75 Q25 70 20 50" />
            <path d="M50 75 Q75 70 80 50" />
            <path d="M50 60 Q30 50 35 30" />
            <path d="M50 60 Q70 50 65 30" />
            <path d="M50 60 Q50 35 50 20" />
            <path d="M25 70 C20 70 15 65 25 55 C35 65 30 70 25 70 Z" fill="currentColor" />
            <path d="M75 70 C80 70 85 65 75 55 C65 55 70 70 75 70 Z" fill="currentColor" />
            <path d="M20 50 C15 50 10 45 20 35 C30 35 25 50 20 50 Z" fill="currentColor" />
            <path d="M80 50 C85 50 90 45 80 35 C70 35 75 50 80 50 Z" fill="currentColor" />
            <path d="M35 30 C30 30 25 25 35 15 C45 15 40 30 35 30 Z" fill="currentColor" />
            <path d="M65 30 C70 30 75 25 65 15 C55 15 60 30 65 30 Z" fill="currentColor" />
            <path d="M50 20 C45 20 40 15 50 5 C60 5 55 20 50 20 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Center Content */}
        <div className="z-10 text-center flex flex-col items-center max-w-2xl mx-auto py-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#010526]/60 mb-3">
            Elevate Your Wardrobe
          </h4>
          <h2 className="text-3xl md:text-4xl italic text-[#010526] mb-6" style={{ fontFamily: "var(--font-pt-serif)" }}>
            Experience Luxury Indian Heritage
          </h2>
          <Button variant="primary" size="md" className="px-10">
            Explore Collection
          </Button>
        </div>

        {/* Right Side Tree 1 (Large, aligned to bottom edge, mirrored) */}
        <div className="hidden md:block w-24 h-28 absolute bottom-0 right-6 text-[#010526] opacity-25 pointer-events-none">
          <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full transform scale-x-[-1]">
            <path d="M50 115 V60" strokeWidth="2.5" />
            <path d="M50 90 Q30 85 25 70" />
            <path d="M50 90 Q70 85 75 70" />
            <path d="M50 75 Q25 70 20 50" />
            <path d="M50 75 Q75 70 80 50" />
            <path d="M50 60 Q30 50 35 30" />
            <path d="M50 60 Q70 50 65 30" />
            <path d="M50 60 Q50 35 50 20" />
            <path d="M25 70 C20 70 15 65 25 55 C35 65 30 70 25 70 Z" fill="currentColor" />
            <path d="M75 70 C80 70 85 65 75 55 C65 55 70 70 75 70 Z" fill="currentColor" />
            <path d="M20 50 C15 50 10 45 20 35 C30 35 25 50 20 50 Z" fill="currentColor" />
            <path d="M80 50 C85 50 90 45 80 35 C70 35 75 50 80 50 Z" fill="currentColor" />
            <path d="M35 30 C30 30 25 25 35 15 C45 15 40 30 35 30 Z" fill="currentColor" />
            <path d="M65 30 C70 30 75 25 65 15 C55 15 60 30 65 30 Z" fill="currentColor" />
            <path d="M50 20 C45 20 40 15 50 5 C60 5 55 20 50 20 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Right Side Tree 2 (Smaller, positioned slightly inward and aligned to bottom edge, mirrored) */}
        <div className="hidden md:block w-16 h-20 absolute bottom-0 right-28 text-[#010526] opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full transform scale-x-[-1]">
            <path d="M50 115 V60" strokeWidth="2.5" />
            <path d="M50 90 Q30 85 25 70" />
            <path d="M50 90 Q70 85 75 70" />
            <path d="M50 75 Q25 70 20 50" />
            <path d="M50 75 Q75 70 80 50" />
            <path d="M50 60 Q30 50 35 30" />
            <path d="M50 60 Q70 50 65 30" />
            <path d="M50 60 Q50 35 50 20" />
            <path d="M25 70 C20 70 15 65 25 55 C35 65 30 70 25 70 Z" fill="currentColor" />
            <path d="M75 70 C80 70 85 65 75 55 C65 55 70 70 75 70 Z" fill="currentColor" />
            <path d="M20 50 C15 50 10 45 20 35 C30 35 25 50 20 50 Z" fill="currentColor" />
            <path d="M80 50 C85 50 90 45 80 35 C70 35 75 50 80 50 Z" fill="currentColor" />
            <path d="M35 30 C30 30 25 25 35 15 C45 15 40 30 35 30 Z" fill="currentColor" />
            <path d="M65 30 C70 30 75 25 65 15 C55 15 60 30 65 30 Z" fill="currentColor" />
            <path d="M50 20 C45 20 40 15 50 5 C60 5 55 20 50 20 Z" fill="currentColor" />
          </svg>
        </div>

      </div>

      {/* 4 Pillars Row - Grid of Boxed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 max-w-[1600px] mx-auto py-4">
        {/* Card 1 */}
        <div className="bg-[#F0F2FF] p-6 flex items-start gap-4 text-left">
          <div className="text-[#010526] flex-shrink-0 pt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#010526] mb-1">No Returns or Refunds</span>
            <span className="text-xs text-[#010526]/70 leading-normal">
              All sales are final. Please review product details.
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#F0F2FF] p-6 flex items-start gap-4 text-left">
          <div className="text-[#010526] flex-shrink-0 pt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M14 18H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11v11" />
              <path d="M19 18h2a2 2 0 0 0 2-2v-3l-3-4h-3v7" />
              <circle cx="7.5" cy="18.5" r="2.5" />
              <circle cx="17.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#010526] mb-1">Shipping Regions</span>
            <span className="text-xs text-[#010526]/70 leading-normal">
              We ship across the UK, Ireland & Germany
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#F0F2FF] p-6 flex items-start gap-4 text-left">
          <div className="text-[#010526] flex-shrink-0 pt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#010526] mb-1">Delivery Rates</span>
            <span className="text-xs text-[#010526]/70 leading-normal">
              Standard UK: £4.45 <br />
              Express: £5.95 <span className="line-through opacity-50 ml-1">£9.95</span>
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#F0F2FF] p-6 flex items-start gap-4 text-left">
          <div className="text-[#010526] flex-shrink-0 pt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <rect width="22" height="16" x="2" y="4" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#010526] mb-1">No Cash on Delivery</span>
            <span className="text-xs text-[#010526]/70 leading-normal">
              Secure online payment methods only
            </span>
          </div>
        </div>
      </div>

      {/* Brand Info & SEO Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-20 items-start max-w-[1600px] mx-auto border-t border-[#010526]/10 pt-16">
        {/* Logo Column */}
        <div className="md:col-span-4 flex justify-start">
          <Image
            src="/logo/logo.png"
            alt="IndiNest Logo"
            width={280}
            height={185}
            className="object-contain w-auto h-auto"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        {/* SEO Text Column */}
        <div className="md:col-span-8 text-left">
          <h4 className="text-sm font-bold uppercase tracking-widest mb-4">
            IndiNest - Premium Indian Fashion &amp; Jewelry
          </h4>
          <p className="text-sm text-[#010526]/70 leading-relaxed mb-4">
            IndiNest is the most-trusted source for finding the finest selection of luxurious Indian wear. Our expert
            buying team travels the globe with a simple mission: to bring international fashion&apos;s finest directly to
            your doorstep. With our runway-fresh new arrivals every week, an easy-to-navigate platform and a mobile app
            to shop on-the-go, we ensure a boutique-like feeling for a unique shopping experience.
          </p>
          <a href="#" className="text-xs font-bold uppercase tracking-widest underline underline-offset-4">
            Read more
          </a>
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
        <div className="flex flex-col gap-3">
          <h5 className="font-bold uppercase tracking-widest text-[10px] mb-2">Customer Service</h5>
          <a href="/contact" className="text-[#010526]/70 hover:text-[#010526]">Contact Us</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Gift Card &amp; Store Credit</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Payment</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Shipping</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Returns &amp; Exchanges</a>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="font-bold uppercase tracking-widest text-[10px] mb-2">About Us</h5>
          <a href="/about" className="text-[#010526]/70 hover:text-[#010526]">Our Story</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Sustainability</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Press &amp; Events</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Careers</a>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="font-bold uppercase tracking-widest text-[10px] mb-2">Legal</h5>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Terms of Use</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Privacy Policy</a>
          <a href="#" className="text-[#010526]/70 hover:text-[#010526]">Imprint</a>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="font-bold uppercase tracking-widest text-[10px] mb-2">Categories</h5>
          {categories.slice(0, 8).map((cat: any) => (
            <a key={cat.id} href={`/category/${cat.slug}`} className="text-[#010526]/70 hover:text-[#010526]">
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="pt-8 border-t border-[#010526]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
        <div className="text-[#010526]/50">copyright &copy; 2026 indinest.com</div>
        <div className="flex gap-4">
          <span>Follow us on</span>
          <a href="#" className="hover:opacity-70">IG</a>
          <a href="#" className="hover:opacity-70">FB</a>
          <a href="#" className="hover:opacity-70">X</a>
        </div>
      </div>
    </footer>
  );
}
