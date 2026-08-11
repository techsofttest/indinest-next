"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/ui/ProductCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { apiUrl } from "@/lib/api";
import { formatPrice } from "@/lib/product";
import { Loader2, AlertCircle } from "lucide-react";

export default function LookbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const [lookbook, setLookbook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLookbook() {
      try {
        const res = await fetch(apiUrl("/api/storefront/lookbooks"));
        if (res.ok) {
          const list = await res.json();
          const found = list.find((item: any) => item.slug === slug);
          if (found) {
            setLookbook(found);
          } else {
            setError("Lookbook not found.");
          }
        } else {
          setError("Failed to load lookbook.");
        }
      } catch (err) {
        console.error("Error fetching lookbooks:", err);
        setError("An error occurred while loading the lookbook.");
      } finally {
        setLoading(false);
      }
    }

    loadLookbook();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#010526] mb-4" />
          <h1 className="text-xl uppercase tracking-wider font-light">Loading Lookbook...</h1>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !lookbook) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 text-center px-5 gap-4">
          <AlertCircle size={48} className="text-rose-500 stroke-[1.5]" />
          <h2 className="text-2xl uppercase tracking-widest font-light text-[#010526]">
            {error || "Lookbook Not Found"}
          </h2>
          <div className="mt-4">
            <a
              href="/"
              className="px-6 py-3 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Return Home
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
      <Header />

      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Lookbooks", href: "/" },
          { label: lookbook.title },
        ]}
      />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Column: Big Model/Look Image */}
          <div className="w-full md:w-[45%] flex flex-col gap-4">
            <div className="relative w-full aspect-[3/4] bg-[#f8f8f8] overflow-hidden border border-[#010526]/5">
              <img
                src={lookbook.model_image}
                alt={lookbook.model_alt || lookbook.title}
                className="w-full h-full object-cover"
              />
            </div>
            {lookbook.subtitle && (
              <span className="text-xs uppercase tracking-widest text-[#010526]/60 font-semibold text-center md:text-left mt-2">
                {lookbook.subtitle}
              </span>
            )}
            <h1 className="text-3xl italic text-[#010526] text-center md:text-left leading-tight">
              {lookbook.title}
            </h1>
          </div>

          {/* Right Column: Associated Products */}
          <div className="w-full md:w-[55%] flex flex-col gap-6">
            <h2 className="text-lg uppercase tracking-widest font-normal text-[#010526]/80 border-b border-[#010526]/10 pb-3 font-sans">
              Shop the Look
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {lookbook.items.map((item: any) => (
                <ProductCard
                  key={item.id}
                  imageSrc={item.image}
                  imageAlt={item.name}
                  brand={item.brand || "IndiNest"}
                  price={formatPrice(item.price)}
                  name={item.name}
                  slug={item.slug}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
