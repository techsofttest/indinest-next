"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import HeritageCarousel from "@/components/home/ProductCarousel";
import { fetchStorefront } from "@/lib/storefront";
import { StorefrontProduct, resolveProductImageUrl, formatPrice } from "@/lib/product";
import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";

import ProductBreadcrumbs from "@/components/product/ProductBreadcrumbs";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfoPanel from "@/components/product/ProductInfoPanel";
import SizeGuideModal from "@/components/product/SizeGuideModal";
import StickyCartBar from "@/components/product/StickyCartBar";

interface ApiProduct extends StorefrontProduct {
  brand: { id: number; name: string; slug: string } | null;
  category: { id: number; name: string; slug: string } | null;
  gallery: string[];
  strikedPrice?: number;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const productSlug = slug;
  const router = useRouter();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantName, setSelectedVariantName] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
    features: false,
    styleFit: false,
    shippingReturns: false,
    faqs: false,
  });
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);

  const { addToCart, openCartDrawer } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const actionButtonsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      const [productData, similarData] = await Promise.all([
        fetchStorefront<ApiProduct>(`/api/storefront/products/${productSlug}`),
        fetchStorefront<{ data: StorefrontProduct[]; meta?: unknown }>(
          `/api/storefront/products?per_page=12&sort=latest&featured=false`
        ),
      ]);

      if (cancelled) return;

      if (productData) {
        setProduct(productData);

        const allVariants = productData.variants ?? [];
        if (allVariants.length > 0) {
          let cheapest = allVariants[0];
          for (const v of allVariants) {
            if (v.price < cheapest.price) {
              cheapest = v;
            }
          }
          setSelectedVariantName(cheapest.name || cheapest.size || null);
        }

        const categorySlug = productData.category?.slug;
        const similar = (similarData?.data ?? [])
          .filter((p) => p.slug !== productData.slug && (!categorySlug || p.category?.slug === categorySlug))
          .slice(0, 10)
          .map((p) => {
            const variant = p.variants?.find((v) => (v.stock ?? 0) > 0);
            const price = variant?.price ?? p.price ?? 0;
            const originalPrice = p.max_price && p.max_price > price
              ? p.max_price
              : Math.round((price || 0) * 1.15 * 100) / 100;

            return {
              id: p.id,
              slug: p.slug,
              imageSrc: resolveProductImageUrl(p.featured_image),
              imageAlt: p.name,
              brand: p.brand?.name ?? "",
              name: p.name,
              price: formatPrice(price),
              originalPrice: originalPrice > price ? formatPrice(originalPrice) : null,
              sizes: p.variants
                ?.filter((v) => (v.stock ?? 0) > 0)
                .map((v) => v.name || v.size || "")
                .filter(Boolean) as string[] | undefined,
            };
          });

        setSimilarProducts(similar);
      }

      setLoading(false);
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  const toggleAccordion = (key: string) =>
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleAddToBag = async () => {
    if (!product) return;

    const allVariants = product.variants ?? [];
    let cheapestVariant = allVariants[0];
    for (const v of allVariants) {
      if (v.price < (cheapestVariant?.price ?? Infinity)) {
        cheapestVariant = v;
      }
    }
    const selectedVariant = allVariants.find((v) => (v.name ?? v.size ?? "") === selectedVariantName) ?? cheapestVariant;
    const numericPrice = selectedVariant?.price ?? product.price ?? 0;

    await addToCart({
      product_id: product.id,
      variant_id: selectedVariant?.id ?? null,
      name: product.name,
      brand: product.brand?.name ?? "",
      image: resolveProductImageUrl(product.featured_image),
      price: numericPrice,
      quantity: 1,
      size: selectedVariantName || selectedVariant?.name || selectedVariant?.size || "One Size",
      colour: product.colour || "Standard",
      variant_name: selectedVariant?.name || selectedVariant?.size || null,
      stock: selectedVariant?.stock ?? 99,
    });

    setIsAddedToBag(true);
    openCartDrawer();
    setTimeout(() => setIsAddedToBag(false), 3000);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const allVariants = product.variants ?? [];
    let cheapestVariant = allVariants[0];
    for (const v of allVariants) {
      if (v.price < (cheapestVariant?.price ?? Infinity)) {
        cheapestVariant = v;
      }
    }
    const selectedVariant = allVariants.find((v) => (v.name ?? v.size ?? "") === selectedVariantName) ?? cheapestVariant;
    const numericPrice = selectedVariant?.price ?? product.price ?? 0;

    await addToCart({
      product_id: product.id,
      variant_id: selectedVariant?.id ?? null,
      name: product.name,
      brand: product.brand?.name ?? "",
      image: resolveProductImageUrl(product.featured_image),
      price: numericPrice,
      quantity: 1,
      size: selectedVariantName || selectedVariant?.name || selectedVariant?.size || "One Size",
      colour: product.colour || "Standard",
      variant_name: selectedVariant?.name || selectedVariant?.size || null,
      stock: selectedVariant?.stock ?? 99,
    });

    router.push('/checkout');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImageIndex(0);
    setIsAddedToBag(false);
    setOpenAccordions({ details: true, features: false, styleFit: false, shippingReturns: false, faqs: false });
  }, [productSlug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!actionButtonsRef.current || !footerRef.current) return;
      const actionButtonsBottom =
        actionButtonsRef.current.offsetTop + actionButtonsRef.current.offsetHeight;
      const footerTop = footerRef.current.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight;
      if (window.scrollY > actionButtonsBottom && scrollPosition < footerTop) {
        setIsStickyBarVisible(true);
      } else {
        setIsStickyBarVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#010526]/60">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex flex-col items-center justify-center py-20 text-center px-6">
          <h1 className="text-2xl font-bold text-[#010526] mb-4">Product Not Found</h1>
          <p className="text-[#010526]/60 mb-8">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/"
            className="px-8 py-3 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const galleryImages = [product.featured_image, ...(product.gallery ?? [])]
    .filter((img): img is string => Boolean(img))
    .map((img) => resolveProductImageUrl(img));

  const images = galleryImages.length > 0
    ? galleryImages.map((src: string, idx: number) => ({
        src,
        label: `View ${idx + 1}`,
        style: "",
      }))
    : [];

  const allVariants = product.variants ?? [];
  let cheapestVariant = allVariants[0];
  for (const v of allVariants) {
    if (v.price < (cheapestVariant?.price ?? Infinity)) {
      cheapestVariant = v;
    }
  }
  const selectedVariant = allVariants.find((v) => (v.name ?? v.size ?? "") === selectedVariantName) ?? cheapestVariant;
  const price = selectedVariant?.price ?? product.price ?? 0;
  const originalPrice = selectedVariant?.buying_price && selectedVariant.buying_price > price
    ? selectedVariant.buying_price
    : undefined;

  let discountPercent = 0;
  if (originalPrice && originalPrice > price) {
    discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const variantOptions = (product.variants ?? [])
    .filter((v) => (v.stock ?? 0) > 0)
    .map((v) => v.name || v.size || "")
    .filter(Boolean);

  const allVariantNames = (product.variants ?? [])
    .map((v) => v.name || v.size || "")
    .filter(Boolean);

  const alternativeProducts = (similarProducts as any[])
    .map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      image: p.imageSrc,
      sizes: p.sizes,
      category: product.category?.name ?? "",
      slug: p.slug,
    }));

  const infoProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand?.name ?? "",
    category: product.category?.name ?? "",
    price: formatPrice(price),
    originalPrice: originalPrice != null && originalPrice > price ? formatPrice(originalPrice) : null,
    fabric: product.fabric ?? "",
    colour: product.colour ?? "",
    occasion: product.occasion ?? "",
    image: images[0]?.src ?? "",
    images: images.map((img) => img.src),
    sizes: allVariantNames,
    styleNo: product.sku ?? "",
    designNo: "",
    packContains: "",
    manufacturedBy: "",
    speciality: product.description ?? "",
    keyFeatures: product.key_features ?? "",
    demand: 0,
    availability: "In Stock",
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-[#010526]">
        <ProductBreadcrumbs
          gender=""
          category={product.category?.name ?? ""}
          productName={product.name}
        />

        <div className="px-6 md:px-8 pt-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 lg:items-start">
          {images.length > 0 && (
            <ProductImageGallery
              images={images}
              productName={product.name}
              activeImageIndex={activeImageIndex}
              setActiveImageIndex={setActiveImageIndex}
            />
          )}

          <ProductInfoPanel
            product={infoProduct}
            discountPercent={discountPercent}
            variantOptions={variantOptions}
            selectedVariantName={selectedVariantName}
            setSelectedVariantName={setSelectedVariantName}
            isAddedToBag={isAddedToBag}
            onAddToBag={handleAddToBag}
            onBuyNow={handleBuyNow}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            openAccordions={openAccordions}
            toggleAccordion={toggleAccordion}
            actionButtonsRef={actionButtonsRef}
            isWishlisted={isInWishlist(product.id)}
            onToggleWishlist={() => toggleWishlist(product)}
          />
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-8 mb-16">
            <HeritageCarousel
              products={similarProducts}
              title="Similar Products"
              subtitle="PEOPLE ALSO VIEWED"
              showSeeAll={false}
            />
          </div>
        )}

        {isSizeGuideOpen && <SizeGuideModal onClose={() => setIsSizeGuideOpen(false)} />}
      </main>

      <div ref={footerRef}>
        <Footer />
      </div>

      <StickyCartBar
        isVisible={isStickyBarVisible}
        productName={product.name}
        productPrice={formatPrice(price)}
        productImage={images[0]?.src ?? ""}
        isAddedToBag={isAddedToBag}
        onAddToBag={handleAddToBag}
        onBuyNow={handleBuyNow}
        onClose={() => setIsStickyBarVisible(false)}
      />
    </>
  );
}
