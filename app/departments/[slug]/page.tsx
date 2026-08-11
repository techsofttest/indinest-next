"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/ui/ProductCard";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl, formatPrice } from "@/lib/product";
import {
  parsePrice,
} from "@/components/data/products";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const departmentSlug = slug;

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");

  // Categories Carousel dragging & scroll state
  const categoriesTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingCategories = useRef(false);
  const startXCategories = useRef(0);
  const scrollStartCategories = useRef(0);
  const velocityCategories = useRef(0);
  const lastXCategories = useRef(0);
  const rafIdCategories = useRef<number | null>(null);
  const hasMovedCategories = useRef(false);
  const [draggingCategories, setDraggingCategories] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, deptRes] = await Promise.all([
          fetch(apiUrl(`/api/storefront/products?department=${departmentSlug}&per_page=48`)),
          fetch(apiUrl('/api/storefront/categories')),
          fetch(apiUrl('/api/storefront/departments'))
        ]);

        if (deptRes.ok) {
          const depts = await deptRes.json();
          const currentDept = depts.find((d: any) => d.slug === departmentSlug);
          if (currentDept) setDepartment(currentDept);
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

        if (catRes.ok) {
          const catJson = await catRes.json();
          // Filter categories that have products in this department, or display all
          const mappedCats = [
            { name: "All", slug: "all", image: "/products/product-clt/Saree-red.png" },
            ...(catJson ?? []).map((cat: any) => ({
              name: cat.name,
              slug: cat.slug,
              image: resolveProductImageUrl(cat.image_url),
            }))
          ];
          setCategories(mappedCats);
        }
      } catch (error) {
        console.error("Failed to load department detail data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [departmentSlug]);

  const applyMomentumCategories = () => {
    if (!categoriesTrackRef.current) return;
    velocityCategories.current *= 0.92;
    categoriesTrackRef.current.scrollLeft -= velocityCategories.current;
    if (Math.abs(velocityCategories.current) > 0.5) {
      rafIdCategories.current = requestAnimationFrame(applyMomentumCategories);
    }
  };

  const onMouseDownCategories = (e: React.MouseEvent) => {
    if (!categoriesTrackRef.current) return;
    if (rafIdCategories.current) cancelAnimationFrame(rafIdCategories.current);
    isDraggingCategories.current = true;
    hasMovedCategories.current = false;
    setDraggingCategories(true);
    startXCategories.current = e.pageX - categoriesTrackRef.current.offsetLeft;
    scrollStartCategories.current = categoriesTrackRef.current.scrollLeft;
    lastXCategories.current = e.pageX;
    velocityCategories.current = 0;
  };

  const onMouseMoveCategories = (e: React.MouseEvent) => {
    if (!isDraggingCategories.current || !categoriesTrackRef.current) return;
    e.preventDefault();
    const moveX = Math.abs(e.pageX - lastXCategories.current);
    if (moveX > 2) {
      hasMovedCategories.current = true;
    }
    velocityCategories.current = lastXCategories.current - e.pageX;
    lastXCategories.current = e.pageX;
    const x = e.pageX - categoriesTrackRef.current.offsetLeft;
    categoriesTrackRef.current.scrollLeft = scrollStartCategories.current + (startXCategories.current - x);
  };

  const stopDragCategories = () => {
    if (!isDraggingCategories.current) return;
    isDraggingCategories.current = false;
    setTimeout(() => {
      setDraggingCategories(false);
    }, 50);
    rafIdCategories.current = requestAnimationFrame(applyMomentumCategories);
  };

  const onTouchStartCategories = (e: React.TouchEvent) => {
    if (!categoriesTrackRef.current) return;
    if (rafIdCategories.current) cancelAnimationFrame(rafIdCategories.current);
    isDraggingCategories.current = true;
    hasMovedCategories.current = false;
    startXCategories.current = e.touches[0].pageX - categoriesTrackRef.current.offsetLeft;
    scrollStartCategories.current = categoriesTrackRef.current.scrollLeft;
    lastXCategories.current = e.touches[0].pageX;
    velocityCategories.current = 0;
  };

  const onTouchMoveCategories = (e: React.TouchEvent) => {
    if (!categoriesTrackRef.current) return;
    const moveX = Math.abs(e.touches[0].pageX - lastXCategories.current);
    if (moveX > 2) {
      hasMovedCategories.current = true;
    }
    velocityCategories.current = lastXCategories.current - e.touches[0].pageX;
    lastXCategories.current = e.touches[0].pageX;
    const x = e.touches[0].pageX - categoriesTrackRef.current.offsetLeft;
    categoriesTrackRef.current.scrollLeft = scrollStartCategories.current + (startXCategories.current - x);
  };

  const onTouchEndCategories = () => {
    isDraggingCategories.current = false;
    rafIdCategories.current = requestAnimationFrame(applyMomentumCategories);
  };

  const handleScrollCategoriesLeft = () => {
    if (categoriesTrackRef.current) {
      categoriesTrackRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const handleScrollCategoriesRight = () => {
    if (categoriesTrackRef.current) {
      categoriesTrackRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  let filtered = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    return true;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#010526]/60">Loading department products...</p>
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
          gender={department?.name ?? "Department"}
          category=""
          productName=""
        />

        {/* Header Section */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 pb-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider text-[#010526]">
            {department?.name ?? "Department"}
          </h1>
          {department?.description && (
            <p className="text-sm font-sans text-[#010526]/60 mt-3 max-w-xl mx-auto leading-relaxed">
              {department.description}
            </p>
          )}
        </div>

        {/* Main Layout: Full Width Grid */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-12 md:pb-16 pt-6 md:pt-8">
          {/* Product Grid */}
          <div className="w-full">
            {/* Toolbar */}
            <div className="pb-6 flex items-center justify-between border-b border-[#010526]/10 mb-8">
              <span className="text-base font-medium text-[#010526]/60">
                <span className="font-bold text-[#010526] mr-2">
                  {department?.name ?? "Department"}
                </span>
                ({filtered.length} {filtered.length === 1 ? "product" : "products"})
              </span>
              <div className="flex items-center gap-4">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-sm font-bold uppercase tracking-widest text-[#010526] bg-white border border-[#010526]/20 px-4 py-2 outline-none hover:border-[#010526] transition-colors"
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
