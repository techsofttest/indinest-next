"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/ui/ProductCard";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl, formatPrice } from "@/lib/product";
import { parsePrice } from "@/components/data/products";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const collectionSlug = slug;

  const [products, setProducts] = useState<any[]>([]);
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("featured");

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, colRes] = await Promise.all([
          fetch(apiUrl(`/api/storefront/products?collection=${collectionSlug}&per_page=48`)),
          fetch(apiUrl('/api/storefront/collections'))
        ]);

        if (colRes.ok) {
          const cols = await colRes.json();
          const currentCol = cols.find((c: any) => c.slug === collectionSlug);
          if (currentCol) {
            setCollection(currentCol);
          } else {
            // fallback
            const derivedName = collectionSlug
              .split("-")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            setCollection({ name: derivedName });
          }
        }

        if (prodRes.ok) {
          const prodJson = await prodRes.json();
          const mappedProds = (prodJson.data ?? []).map((product: any) => {
            const available = (product.variants ?? []).filter((v: any) => (v.stock ?? 0) > 0);
            let cheapestPrice = product.price ?? 0;
            let cheapestBuyingPrice = null;
            if (available.length > 0) {
              let cheapest = available[0];
              for (const v of available) {
                if (v.price < cheapest.price) {
                  cheapest = v;
                }
              }
              cheapestPrice = cheapest.price;
              cheapestBuyingPrice = cheapest.buying_price;
            }

            return {
              id: product.id,
              slug: product.slug,
              image: resolveProductImageUrl(product.featured_image),
              name: product.name,
              brand: product.brand?.name ?? "IndiNest",
              category: product.category?.slug ?? "",
              price: formatPrice(cheapestPrice),
              originalPrice: cheapestBuyingPrice && cheapestBuyingPrice > cheapestPrice ? formatPrice(cheapestBuyingPrice) : null,
              fabric: product.fabric ?? "",
              colour: product.colour ?? "",
              occasion: product.occasion ?? "",
              sizes: product.variants
                ?.filter((v: any) => (v.stock ?? 0) > 0)
                .map((v: any) => v.name || v.size || "")
                .filter(Boolean),
            };
          });
          setProducts(mappedProds);
        }
      } catch (error) {
        console.error("Failed to load collection detail data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [collectionSlug]);

  let filtered = [...products];

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#010526]/60">Loading collection products...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white font-serif">
        <ProductBreadcrumbs
          gender="Collection"
          category={collection?.name ?? "Best Sellers"}
          productName=""
        />

        {/* Header Section */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 pb-4 text-center font-sans">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider text-[#010526] font-serif">
            {collection?.name ?? "Collection"}
          </h1>
          {collection?.description && (
            <p className="text-sm text-[#010526]/60 mt-3 max-w-xl mx-auto leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        {/* Main Layout */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-12 md:pb-16 pt-6 md:pt-8">
          <div className="w-full">
            {/* Toolbar */}
            <div className="pb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#010526]/10 mb-8 font-sans">
              <span className="text-base font-medium text-[#010526]/60">
                <span className="font-bold text-[#010526] mr-2">
                  {collection?.name ?? "Collection"}
                </span>
                ({filtered.length} {filtered.length === 1 ? "product" : "products"})
              </span>
              <div className="flex items-center justify-end gap-3 w-full md:w-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-sm font-bold uppercase tracking-widest text-[#010526] bg-white border border-[#010526]/20 px-4 py-2 outline-none hover:border-[#010526] transition-colors max-w-full"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center font-sans">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#010526]/20 mb-6">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p className="text-xl font-bold text-[#010526] mb-2">No products found</p>
                <p className="text-base text-[#010526]/50 mb-6">Check back later for new arrivals.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    brand={product.brand}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    imageSrc={product.image}
                    imageAlt={product.name}
                    sizes={product.sizes}
                    slug={product.slug}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
