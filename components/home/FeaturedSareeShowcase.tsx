"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

export default function FeaturedSareeShowcase() {
  return (
    <section className="w-full bg-[#F0F2FF] py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

        {/* Left Grid: Product Angle Collage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Full-Length Image */}
          <div className="md:col-span-6 relative aspect-[3/4] w-full overflow-hidden bg-[#e6ded7]">
            <Image
              src="/products/featured/full.png"
              alt="Instant Saree - Full View"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Side Panel Images */}
          <div className="md:col-span-6 flex flex-col gap-4">
            {/* Top Close-Up Waist Detail */}
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#e6ded7]">
              <Image
                src="/products/featured/front-closeup2.jpg"
                alt="Instant Saree - Waist Detail"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Bottom Two Split Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e6ded7]">
                <Image
                  src="/products/featured/back.png"
                  alt="Instant Saree - Back Detail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e6ded7]">
                <Image
                  src="/products/featured/pallu.jpg"
                  alt="Instant Saree - Pallu Detail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Info: Copy and Promotion */}
        <div className="flex flex-col items-center justify-center text-center lg:px-8 py-8">
          {/* Discount Headline */}
          <div className="mb-4">
            <span className="block text-sm uppercase tracking-[0.3em] text-[#010526]/50 mb-1">
              — Flat —
            </span>
            <h2 className="text-5xl md:text-7xl font-bold text-[#010526] tracking-tight relative flex justify-center items-end">
              30-50
              <span className="text-xl md:text-2xl font-semibold align-super ml-1 mb-6 md:mb-8">%<br /><span className="text-[10px] uppercase tracking-wider font-bold">off</span></span>
            </h2>
          </div>

          {/* Product Name */}
          <h3
            className="text-3xl md:text-5xl uppercase tracking-widest text-[#010526] mb-8 font-light"
            style={{ fontFamily: "var(--font-pt-serif)" }}
          >
            Instant Saree<span className="text-sm align-super font-bold">™</span>
          </h3>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="lg"
            className="mb-8 shadow-sm"
            icon={
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            }
          >
            Pre-Drape Now
          </Button>

          {/* Subtext Tagline */}
          <p className="text-xs md:text-sm text-[#010526]/70 max-w-md tracking-wider leading-relaxed">
            Pre-drape any saree instantly, unlock SALE offers today
          </p>
        </div>

      </div>
    </section>
  );
}
