import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import HeroSection from "@/components/home/HeroSection";
import HeritageCarousel from "@/components/home/ProductCarousel";
import CategorySection from "@/components/home/CategorySection";
import ShopByCategory from "@/components/home/ShopByCategory";
import EditorialGrid from "@/components/home/EditorialGrid";
import LookbookSlider from "@/components/home/LookbookSlider";
import FeaturedSareeShowcase from "@/components/home/FeaturedSareeShowcase";
import OfferBanner from "@/components/home/OfferBanner";
import { fetchStorefront } from "@/lib/storefront";
import { StorefrontProduct, resolveProductImageUrl, formatPrice } from "@/lib/product";

export default async function Home() {
  const [productsData, categoriesData, departmentsData, lookbooksData] = await Promise.all([
    fetchStorefront<{ data: StorefrontProduct[]; meta?: unknown }>(
      "/api/storefront/products?per_page=12&sort=latest&featured=false"
    ),
    fetchStorefront<
      Array<{
        id: number;
        name: string;
        slug: string;
        image_url: string | null;
        icon_url: string | null;
        product_count?: number;
      }>
    >("/api/storefront/categories"),
    fetchStorefront<
      Array<{
        id: number;
        name: string;
        slug: string;
        image_url: string | null;
        description: string | null;
        sort_order: number;
        href: string;
      }>
    >("/api/storefront/departments"),
    fetchStorefront<any[]>("/api/storefront/lookbooks"),
  ]);

  // Map API products to the ProductCarousel format
  const heritageProducts = (productsData?.data ?? []).map((product) => {
    const available = (product.variants ?? []).filter((v) => (v.stock ?? 0) > 0);
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
      imageSrc: resolveProductImageUrl(product.featured_image),
      imageAlt: product.name,
      brand: product.brand?.name ?? "IndiNest",
      name: product.name,
      price: formatPrice(cheapestPrice),
      originalPrice: cheapestBuyingPrice && cheapestBuyingPrice > cheapestPrice ? formatPrice(cheapestBuyingPrice) : null,
      sizes: product.variants
        ?.filter((v) => (v.stock ?? 0) > 0)
        .map((v) => v.name || v.size || "")
        .filter(Boolean) as string[] | undefined,
    };
  });

  // Map API categories to the ShopByCategory format
  const shopCategories = (categoriesData ?? []).map((cat) => ({
    name: cat.name,
    image: resolveProductImageUrl(cat.image_url),
    count: cat.product_count ? `${cat.product_count}+ Styles` : "New Arrivals",
    href: `/category/${cat.slug}`,
  }));

  // Map API departments to the CategorySection format (keep null if no image so fallback images work)
  const departments = (departmentsData ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((dept) => ({
      id: dept.id,
      name: dept.name,
      slug: dept.slug,
      image_url: dept.image_url ? resolveProductImageUrl(dept.image_url) : null,
      description: dept.description,
      href: dept.href,
      sort_order: dept.sort_order ?? 0,
    }));

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526]">
      <Header />

      <main className="flex-1 w-full">
        <HeroSection />
        <HeritageCarousel products={heritageProducts} />
        <CategorySection departments={departments} />
        <ShopByCategory categories={shopCategories} />
        <EditorialGrid />
        <OfferBanner />
        <LookbookSlider slides={lookbooksData ?? []} />
      </main>

      <Footer />
    </div>
  );
}