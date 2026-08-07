"use client";

import * as React from "react";
import { useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/ui/ProductCard";
import OfferBanner from "@/components/home/OfferBanner";
import EditorialGrid from "@/components/home/EditorialGrid";
import LookbookSlider from "@/components/home/LookbookSlider";
import FilterPanel from "@/components/product/FilterPanel";
import InfoPanel from "@/components/product/InfoPanel";
import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import {
  priceInRange,
  parsePrice,
  menCategories,
  menProducts,
  womenCategories,
  womenProducts,
  giftProducts,
  filterConfig,
  collectionFilterConfig,
} from "@/components/data/products";

// ──────────────────────────────────────────
// Sort Options
// ──────────────────────────────────────────

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ──────────────────────────────────────────
// Dataset Definitions
// ──────────────────────────────────────────

const menEditorialItems = [
  {
    id: 1,
    imageSrc: "/products/editorial/men_sherwani_editorial.png",
    imageAlt: "Groom's Heritage Sherwani",
    label: "Royal Sherwanis",
    description: "Impeccably tailored silhouettes featuring hand-woven details for grand celebrations",
  },
  {
    id: 2,
    imageSrc: "/products/editorial/men_kurta_editorial.png",
    imageAlt: "Classic Silk Kurta",
    label: "Silk Kurtas",
    description: "Breathable silk cotton fabrics styled for contemporary comfort and refinement",
  },
  {
    id: 3,
    imageSrc: "/products/editorial/men_waistcoat_editorial.png",
    imageAlt: "Navy Waistcoat Set",
    label: "Nehru & Waistcoats",
    description: "Elevate your look with structured layering and exquisite floral brocade patterns",
  },
  {
    id: 4,
    imageSrc: "/products/editorial/men_pathani_editorial.png",
    imageAlt: "Embroidered Pathani Suit",
    label: "Pathani Suits",
    description: "Classic cuts combined with intricate collar details making a statement all season",
  },
];

const menBannerSlides = [
  { imageSrc: "/offer-banner/offer-men.png", altText: "Men's Heritage Sale" },
  { imageSrc: "/offer-banner/offer-men4.png", altText: "Groom's Collection" },
  { imageSrc: "/offer-banner/offer-men5.png", altText: "Traditional Indian Looks" },
];

const menLookbookSlides = [
  {
    id: 1,
    modelImage: "/products/lookbook/man/look1/look1.png",
    modelAlt: "Groom's Heritage styling look",
    title: "Groom's Heritage Look",
    items: [
      {
        id: 101,
        imageSrc: "/products/lookbook/man/look1/cloth.jpg",
        imageAlt: "Heritage Silk Sherwani",
        name: "Heritage Sherwani",
        category: "Apparel",
      },
      {
        id: 102,
        imageSrc: "/products/lookbook/man/look1/necklace.jpg",
        imageAlt: "Men's Temple Necklace",
        name: "Temple Necklace",
        category: "Jewellery",
      },
      {
        id: 103,
        imageSrc: "/products/lookbook/man/look1/lexury-pin.jpg",
        imageAlt: "Royal Emerald Brooch",
        name: "Emerald Brooch",
        category: "Accessories",
      },
      {
        id: 104,
        imageSrc: "/products/lookbook/man/look1/loffer.jpg",
        imageAlt: "Premium Leather Loafers",
        name: "Leather Loafers",
        category: "Footwear",
      },
    ],
  },
  {
    id: 2,
    modelImage: "/products/lookbook/man/look2/look2.png",
    modelAlt: "Festive Refinement Styling Look",
    title: "Festive Refinement Look",
    items: [
      {
        id: 201,
        imageSrc: "/products/lookbook/man/look2/cloth.jpg",
        imageAlt: "Silk Kurta Set",
        name: "Silk Kurta Set",
        category: "Apparel",
      },
      {
        id: 202,
        imageSrc: "/products/lookbook/man/look2/necklace.jpg",
        imageAlt: "Sacred Rudraksha Chain",
        name: "Rudraksha Chain",
        category: "Jewellery",
      },
      {
        id: 203,
        imageSrc: "/products/lookbook/man/look2/lexury-pin.jpg",
        imageAlt: "Heritage Ruby Brooch",
        name: "Ruby Brooch",
        category: "Accessories",
      },
      {
        id: 204,
        imageSrc: "/products/lookbook/man/look2/loffer.jpg",
        imageAlt: "Classic Velvet Loafers",
        name: "Velvet Loafers",
        category: "Footwear",
      },
    ],
  },
];

const womenEditorialItems = [
  {
    id: 1,
    imageSrc: "/products/editorial/ed2.jpg",
    imageAlt: "Heritage Banarasi Saree",
    label: "Heritage Weaves",
    description: "Intricately woven silk sarees for grand celebrations",
  },
  {
    id: 2,
    imageSrc: "/products/editorial/ed3.jpg",
    imageAlt: "Kundan Jewellery",
    label: "Temple & Kundan Art",
    description: "Handcrafted heirloom jewelry passed down generations",
  },
  {
    id: 3,
    imageSrc: "/products/editorial/ed4.png",
    imageAlt: "Tops",
    label: "From City To Coast",
    description: "These drapes are making waves all season long",
  },
];

const womenBannerSlides = [
  { imageSrc: "/banner/b4.jpg", altText: "Women's Heritage Weaves" },
  { imageSrc: "/offer-banner/b5.jpg", altText: "Exclusive Silk Collection" },
];

const womenLookbookSlides = [
  {
    id: 1,
    modelImage: "/products/lookbook/look1/look1.png",
    modelAlt: "Kerala Heritage Styling Look",
    title: "Kerala Heritage Look",
    items: [
      {
        id: 101,
        imageSrc: "/products/lookbook/look1/necklace.jpg",
        imageAlt: "Heritage Gold Necklace",
        name: "Heritage Gold Necklace",
        category: "Jewellery",
      },
      {
        id: 102,
        imageSrc: "/products/lookbook/look1/bangle.jpg",
        imageAlt: "Classic Gold Bangle",
        name: "Classic Gold Bangle",
        category: "Jewellery",
      },
      {
        id: 103,
        imageSrc: "/products/lookbook/look1/earing.jpg",
        imageAlt: "Heritage Earrings",
        name: "Heritage Earrings",
        category: "Jewellery",
      },
      {
        id: 104,
        imageSrc: "/products/lookbook/look1/cloth.jpg",
        imageAlt: "Premium Kasavu Saree",
        name: "Premium Kasavu Saree",
        category: "Apparel",
      },
    ],
  },
  {
    id: 2,
    modelImage: "/products/lookbook/look2/look2.png",
    modelAlt: "Luxury Saree Look",
    title: "Bridal Elegance Look",
    items: [
      {
        id: 201,
        imageSrc: "/products/lookbook/look2/necklace.jpg",
        imageAlt: "Bridal Kundan Choker",
        name: "Bridal Kundan Choker",
        category: "Jewellery",
      },
      {
        id: 202,
        imageSrc: "/products/lookbook/look2/earing.jpg",
        imageAlt: "Bridal Earrings",
        name: "Bridal Earrings",
        category: "Jewellery",
      },
      {
        id: 203,
        imageSrc: "/products/lookbook/look2/cloth.jpg",
        imageAlt: "Banarasi Silk Saree",
        name: "Banarasi Silk Saree",
        category: "Apparel",
      },
      {
        id: 204,
        imageSrc: "/products/lookbook/look2/bangle.jpg",
        imageAlt: "Matching Bangle Set",
        name: "Matching Bangle Set",
        category: "Jewellery",
      },
    ],
  },
];


interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryGenderPage({ params }: PageProps) {
  const { slug } = React.use(params);

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const toggleFilter = (filterId: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[filterId] ?? [];
      return {
        ...prev,
        [filterId]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const clearFilters = () => setActiveFilters({});

  // Resolve config based on active route slug params
  let pageTitle = "Men";
  let categories = menCategories;
  let products: any[] = [];
  let bannerSlides = menBannerSlides;
  let editorialItems = menEditorialItems;
  let lookbookSlides = menLookbookSlides;
  let isCollectionPage = false;

  if (slug === "women") {
    pageTitle = "Women";
    categories = womenCategories;
    products = womenProducts.map(p => ({ ...p, gender: "women" }));
    bannerSlides = womenBannerSlides;
    editorialItems = womenEditorialItems;
    lookbookSlides = womenLookbookSlides;
  } else if (slug === "kids") {
    pageTitle = "Kids";
    categories = [];
    products = [];
    bannerSlides = [];
    editorialItems = [];
    lookbookSlides = [];
  } else if (slug === "best-sellers") {
    pageTitle = "Best Sellers";
    categories = [];
    products = [
      ...menProducts.filter((p) => p.isBestSeller).map((p) => ({ ...p, gender: "men" })),
      ...womenProducts.filter((p) => p.isBestSeller).map((p) => ({ ...p, gender: "women" })),
    ];
    bannerSlides = [];
    editorialItems = [];
    lookbookSlides = [];
    isCollectionPage = true;
  } else if (slug === "new-arrivals") {
    pageTitle = "New Arrivals";
    categories = [];
    products = [
      ...menProducts.filter((p) => p.isNewArrival).map((p) => ({ ...p, gender: "men" })),
      ...womenProducts.filter((p) => p.isNewArrival).map((p) => ({ ...p, gender: "women" })),
    ];
    bannerSlides = [];
    editorialItems = [];
    lookbookSlides = [];
    isCollectionPage = true;
  } else if (slug === "gifts") {
    pageTitle = "Gifts";
    categories = [];
    products = giftProducts.map((p) => ({ ...p, gender: "gifts" }));
    bannerSlides = [];
    editorialItems = [];
    lookbookSlides = [];
    isCollectionPage = true;
  } else {
    // Default to Men
    pageTitle = "Men";
    categories = menCategories;
    products = menProducts.map(p => ({ ...p, gender: "men" }));
    bannerSlides = menBannerSlides;
    editorialItems = menEditorialItems;
    lookbookSlides = menLookbookSlides;
  }

  let filtered = products.filter((p) => {
    if (!isCollectionPage && activeCategory !== "all" && p.category !== activeCategory) return false;

    // For collections (Best Sellers/New Arrivals), support filtering by Category (gender)
    if (isCollectionPage && activeFilters.gender?.length) {
      const genderMap: Record<string, string> = { Men: "men", Women: "women", Kids: "kids" };
      const matchesGender = activeFilters.gender.some((g) => genderMap[g] === p.gender);
      if (!matchesGender) return false;
    }

    if (activeFilters.occasion?.length && !activeFilters.occasion.includes(p.occasion)) return false;
    if (activeFilters.fabric?.length && !activeFilters.fabric.includes(p.fabric)) return false;
    if (activeFilters.colour?.length && !activeFilters.colour.includes(p.colour)) return false;
    if (activeFilters.brand?.length && !activeFilters.brand.includes(p.brand)) return false;
    if (activeFilters.price?.length) {
      const inRange = activeFilters.price.some((r) => priceInRange(p.price, r));
      if (!inRange) return false;
    }
    return true;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

  const sortOptionsList = sortOptions;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <ProductBreadcrumbs
          gender={slug}
          category=""
          productName=""
        />

        {/* Banner Carousel */}
        {bannerSlides && bannerSlides.length > 0 && (
          <OfferBanner slides={bannerSlides} variant="listing-top" />
        )}

        {/* Collection Promo Banner */}
        {isCollectionPage && (
          <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-1 pb-4">
            <div className="bg-[#F0F2FF]/60 py-5 px-6 border border-[#010526]/5 text-center">
              <span className="text-sm md:text-base font-light tracking-[0.15em] text-[#010526] uppercase">
                {slug === "gifts" 
                  ? "Explore our handpicked curation of kerala gifts and accessories" 
                  : `Explore our handpicked curation of ${pageTitle.toLowerCase()} and seasonal highlights`}
              </span>
            </div>
          </div>
        )}

        {/* Category Cards Carousel */}
        {categories && categories.length > 0 && (
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-2 pb-2">
            <div className="relative w-full group/carousel">
              {/* Scroll Left Button */}
              <button
                onClick={handleScrollCategoriesLeft}
                aria-label="Scroll Left"
                className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
              >
                &larr;
              </button>

              {/* Scroll Right Button */}
              <button
                onClick={handleScrollCategoriesRight}
                aria-label="Scroll Right"
                className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-[#010526]/20 bg-white/80 hover:bg-white text-[#010526] transition-colors opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
              >
                &rarr;
              </button>

              {/* Draggable track */}
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

        {/* Divider */}
        {/* <div className="border-t border-[#010526]/10 max-w-[1600px] mx-auto" /> */}

        {/* Main Layout: Filter + Grid */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-12 md:pb-16 pt-6 md:pt-8 flex gap-10 md:gap-14 items-start">
          {/* Desktop Filters */}
          <div className="hidden md:block w-60 flex-none sticky top-[88px] overflow-y-auto max-h-[calc(100vh-120px)] pr-2 no-scrollbar">
            <FilterPanel
              activeFilters={activeFilters}
              onToggle={toggleFilter}
              onClear={clearFilters}
              filterConfig={isCollectionPage ? collectionFilterConfig : filterConfig}
            />
            <InfoPanel />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="pb-6 flex items-center justify-between">
              <span className="text-base font-medium text-[#010526]/60">
                <span className="font-bold text-[#010526] mr-2">
                  {isCollectionPage ? "All" : (categories.find((c) => c.slug === activeCategory)?.name || "All")}
                </span>
                ({filtered.length} {filtered.length === 1 ? "product" : "products"})
              </span>
              <div className="flex items-center gap-4">
                {/* Mobile filter button */}
                <button
                  className="md:hidden flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#010526] border border-[#010526]/20 px-4 py-2"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="11" y1="18" x2="13" y2="18" />
                  </svg>
                  Filters
                </button>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-sm font-bold uppercase tracking-widest text-[#010526] bg-white border border-[#010526]/20 px-4 py-2 outline-none hover:border-[#010526] transition-colors"
                >
                  {sortOptionsList.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#010526]/20 mb-6">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p className="text-xl font-bold text-[#010526] mb-2">No products found</p>
                <p className="text-base text-[#010526]/50 mb-6">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    className=""
                    name={product.name}
                    brand={product.brand}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    imageSrc={product.image}
                    imageAlt={product.name}
                    sizes={product.sizes}
                    slug={slugify(product.name)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editorial Grid */}
        {editorialItems && editorialItems.length > 0 && (
          <EditorialGrid items={editorialItems} />
        )}

        {/* Lookbook Slider */}
        {lookbookSlides && lookbookSlides.length > 0 && (
          <LookbookSlider slides={lookbookSlides} />
        )}

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
                filterConfig={isCollectionPage ? collectionFilterConfig : filterConfig}
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
