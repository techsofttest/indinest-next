"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl } from "@/lib/product";

interface CategoryItem {
  name: string;
  image: string;
  count: string;
  href: string;
}

interface ShopByCategoryProps {
  categories?: CategoryItem[];
}

export default function ShopByCategory({ categories: initialCategories }: ShopByCategoryProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
      return;
    }

    async function loadCategories() {
      try {
        const res = await fetch(apiUrl("/api/storefront/categories"));
        if (res.ok) {
          const data = await res.json();
          const mapped = (data ?? []).map((cat: any) => ({
            name: cat.name,
            image: resolveProductImageUrl(cat.image_url),
            count: cat.product_count ? `${cat.product_count} Styles` : "Explore",
            href: `/category/${cat.slug}`,
          }));
          setCategories(mapped);
        }
      } catch (err) {
        console.error("Failed to load categories in ShopByCategory:", err);
      }
    }
    loadCategories();
  }, [initialCategories]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto bg-white">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-[10px] uppercase tracking-[0.2em] mb-2 text-[#010526]/60 font-semibold font-sans">Curated Collections</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#010526] font-serif uppercase">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="group flex flex-col items-center text-center font-sans"
          >
            {/* Image Container (Oval) */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-full bg-[#F0F2FF] shadow-sm mb-4 border border-[#010526]/5">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
            </div>

            {/* Content (Below Image) */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm md:text-base font-bold tracking-wider uppercase text-[#010526] mb-0.5 group-hover:opacity-75 transition-opacity">
                {cat.name}
              </h3>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#010526]/60 font-semibold">
                {cat.count}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}