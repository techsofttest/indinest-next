"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/ui/ProductCard";
import FilterPanel from "@/components/product/FilterPanel";
import InfoPanel from "@/components/product/InfoPanel";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl, formatPrice } from "@/lib/product";
import { parsePrice } from "@/components/data/products";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "New In" },
];

export default function AllProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([5, 1000]);
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filterConfig, setFilterConfig] = useState<any[]>([]);

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

  // ── One-time load: categories + master filter options ──────────────────
  useEffect(() => {
    async function loadStatic() {
      try {
        const [catRes, masterRes] = await Promise.all([
          fetch(apiUrl('/api/storefront/categories')),
          fetch(apiUrl('/api/storefront/master-filters')).catch(() => null),
        ]);

        let masterFilters: Record<string, string[]> = { occasions: [], fabrics: [], colors: [], brands: [] };
        if (masterRes && masterRes.ok) {
          masterFilters = await masterRes.json().catch(() => masterFilters);
        }

        setFilterConfig([
          { id: "occasion", label: "Occasion", options: masterFilters.occasions ?? [] },
          { id: "fabric",   label: "Fabric",   options: masterFilters.fabrics ?? [] },
          { id: "colour",   label: "Color",    options: masterFilters.colors ?? [] },
          { id: "brand",    label: "Brand",    options: masterFilters.brands ?? [] },
          { id: "price",    label: "Price",    options: [] },
        ]);

        if (catRes.ok) {
          const catJson = await catRes.json();
          setCategories([
            { name: "All", slug: "all", image: "/products/product-clt/Saree-red.png" },
            ...(catJson ?? []).map((cat: any) => ({
              name: cat.name,
              slug: cat.slug,
              image: resolveProductImageUrl(cat.image_url),
            })),
          ]);
        }
      } catch (err) {
        console.error("Failed to load static data:", err);
      }
    }
    loadStatic();
  }, []);

  // ── Fetch products from API whenever filters/category/sort change ───────
  useEffect(() => {
    async function fetchProducts() {
      setProductsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('per_page', '48');

        if (activeCategory !== 'all') params.set('category', activeCategory);

        if (activeFilters.colour?.length)   params.set('colour',   activeFilters.colour.join(','));
        if (activeFilters.fabric?.length)   params.set('fabric',   activeFilters.fabric.join(','));
        if (activeFilters.occasion?.length) params.set('occasion', activeFilters.occasion.join(','));
        if (activeFilters.brand?.length)    params.set('brand_name', activeFilters.brand.join(','));

        const sortMap: Record<SortOption, string> = {
          featured:   'featured',
          'price-asc':  'price_low',
          'price-desc': 'price_high',
          newest:     'latest',
        };
        params.set('sort', sortMap[sort] ?? 'latest');

        const res = await fetch(apiUrl(`/api/storefront/products?${params.toString()}`));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const mapped = (json.data ?? []).map((p: any) => {
          const inStock = (p.variants ?? []).filter((v: any) => (v.stock ?? 0) > 0);
          let price = p.price ?? 0;
          let buyingPrice = null;
          if (inStock.length > 0) {
            const cheapest = inStock.reduce((a: any, b: any) => b.price < a.price ? b : a, inStock[0]);
            price = cheapest.price;
            buyingPrice = cheapest.buying_price;
          }
          return {
            id: p.id,
            slug: p.slug,
            image: resolveProductImageUrl(p.featured_image),
            name: p.name,
            brand: p.brand?.name ?? "",
            price: formatPrice(price),
            originalPrice: buyingPrice && buyingPrice > price ? formatPrice(buyingPrice) : null,
            sizes: (p.variants ?? [])
              .filter((v: any) => (v.stock ?? 0) > 0)
              .map((v: any) => v.name || v.size || "")
              .filter(Boolean),
          };
        });

        // Client-side price filter (API doesn't support price range yet)
        const priceFiltered = mapped.filter((p: any) => {
          const n = parsePrice(p.price);
          return n >= priceRange[0] && n <= priceRange[1];
        });

        setProducts(priceFiltered);
        setTotalProducts(priceFiltered.length);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setProductsLoading(false);
        setInitialLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory, activeFilters, sort, priceRange]);

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
    const walk = e.pageX - lastXCategories.current;
    velocityCategories.current = walk * 1.5;
    lastXCategories.current = e.pageX;
    categoriesTrackRef.current.scrollLeft = scrollStartCategories.current + (startXCategories.current - (e.pageX - categoriesTrackRef.current.offsetLeft));
    if (Math.abs(walk) > 3) {
      hasMovedCategories.current = true;
    }
  };

  const stopDragCategories = () => {
    if (!isDraggingCategories.current) return;
    isDraggingCategories.current = false;
    setDraggingCategories(false);
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
    if (!isDraggingCategories.current || !categoriesTrackRef.current) return;
    const walk = e.touches[0].pageX - lastXCategories.current;
    velocityCategories.current = walk * 1.5;
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

  const toggleFilter = (filterId: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[filterId] ?? [];
      return {
        ...prev,
        [filterId]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setPriceRange([5, 1000]);
  };

  const filtered = products; // Already filtered server-side
  const loading = initialLoading;
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#010526]/60">Loading products...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <ProductBreadcrumbs
          gender="All Products"
          category=""
          productName=""
        />

        {/* Category Cards Carousel */}
        {categories && categories.length > 0 && (
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-2 pb-2">
            <div className="relative w-full group/carousel">
              <button
                onClick={handleScrollCategoriesLeft}
                aria-label="Scroll Left"
                className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
              >
                &larr;
              </button>

              <button
                onClick={handleScrollCategoriesRight}
                aria-label="Scroll Right"
                className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
              >
                &rarr;
              </button>

              <div
                ref={categoriesTrackRef}
                onMouseDown={onMouseDownCategories}
                onMouseMove={onMouseMoveCategories}
                onMouseUp={stopDragCategories}
                onMouseLeave={stopDragCategories}
                onTouchStart={onTouchStartCategories}
                onTouchMove={onTouchMoveCategories}
                onTouchEnd={onTouchEndCategories}
                style={{ cursor: draggingCategories ? "grabbing" : "grab" }}
                className="flex gap-6 items-center overflow-x-auto py-4 px-4 md:px-6 no-scrollbar select-none"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      if (!hasMovedCategories.current) {
                        setActiveCategory(cat.slug);
                      }
                    }}
                    className={`flex-none relative w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden group select-none transition-all duration-300 ${activeCategory === cat.slug ? "scale-110 z-10" : "scale-90 hover:scale-95"
                      }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center p-3 text-center z-0">
                      <span className="text-white text-xs md:text-sm font-bold uppercase tracking-widest leading-tight">
                        {cat.name}
                      </span>
                    </div>
                    {activeCategory === cat.slug && (
                      <div className="absolute inset-1.5 border border-white pointer-events-none rounded-full z-10" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Layout: Filter + Grid */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-12 md:pb-16 pt-6 md:pt-8 flex gap-10 md:gap-14 items-start">
          {/* Desktop Filters */}
          <div className="hidden md:block w-60 flex-none sticky top-[88px] overflow-y-auto max-h-[calc(100vh-120px)] pr-2 no-scrollbar">
            <FilterPanel
              activeFilters={activeFilters}
              onToggle={toggleFilter}
              onClear={clearFilters}
              filterConfig={filterConfig}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
            <InfoPanel />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="pb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <span className="text-base font-medium text-[#010526]/60">
                <span className="font-bold text-[#010526] mr-2">
                  {(categories.find((c) => c.slug === activeCategory)?.name || "All")}
                </span>
                ({productsLoading ? "..." : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`})
              </span>
              <div className="flex items-center justify-between gap-3 md:justify-end md:gap-4 w-full md:w-auto">
                <button
                  className="md:hidden flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#010526] border border-[#010526]/20 px-4 py-2 whitespace-nowrap"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="11" y1="18" x2="13" y2="18" />
                  </svg>
                  Filters
                </button>

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

            {/* Grid */}
            <div className="relative">
              {productsLoading && (
                <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center min-h-[200px]">
                  <div className="w-8 h-8 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin" />
                </div>
              )}
              {!productsLoading && filtered.length === 0 ? (
                <div className="text-center py-20 border border-[#010526]/10 font-sans">
                  <p className="text-lg font-semibold text-[#010526]">No products found</p>
                  <p className="text-sm text-[#010526]/60 mt-1">Try adjusting your filter options</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
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
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-50 md:hidden" onClick={() => setMobileFiltersOpen(false)} />
            <div className="fixed bottom-0 left-0 right-0 bg-white z-50 md:hidden max-h-[85vh] overflow-y-auto rounded-t-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold uppercase tracking-widest text-[#010526]">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <FilterPanel
                activeFilters={activeFilters}
                onToggle={toggleFilter}
                onClear={clearFilters}
                filterConfig={filterConfig}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-6 py-4 bg-[#010526] text-white font-bold uppercase tracking-widest text-sm"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
