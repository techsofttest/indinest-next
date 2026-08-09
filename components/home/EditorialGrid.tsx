"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl } from "@/lib/product";
import Link from "next/link";

interface FeaturedCategory {
  id: number;
  name: string;
  slug: string;
  imageSrc: string;
}

export default function EditorialGrid() {
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedCategories() {
      try {
        const res = await fetch(apiUrl("/api/storefront/featured-categories"));
        if (res.ok) {
          const data = await res.json();
          const featured = (data ?? [])
            .slice(0, 4)
            .map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              imageSrc: resolveProductImageUrl(cat.image_url),
            }));
          setCategories(featured);
        }
      } catch (err) {
        console.error("Failed to load featured categories in EditorialGrid:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedCategories();
  }, []);

  if (loading || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/category/${item.slug}`}
            className="flex flex-col cursor-pointer group"
          >
            {/* Card Container */}
            <div className="w-full aspect-[4/5] bg-[#F0F2FF] mb-6 overflow-hidden relative">
              <img
                src={item.imageSrc}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Bottom text and CTA overlay inside the card */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10 text-left">
                <p className="text-xl md:text-2xl font-serif text-white mb-5 leading-normal uppercase tracking-wider">
                  {item.name}
                </p>
                <span
                  className="self-start text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 bg-white text-[#010526] hover:bg-white/90 transition-colors"
                >
                  Shop Now
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
