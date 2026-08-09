import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { fetchStorefront } from "@/lib/storefront";
import { resolveProductImageUrl } from "@/lib/product";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  icon_url: string | null;
  product_count?: number;
}

export default async function CategoriesPage() {
  const categories = await fetchStorefront<Category[]>("/api/storefront/categories") || [];

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.2em] mb-3 text-[#010526]/60 font-semibold">
            Curated Collections
          </p>
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-widest text-[#010526] font-serif">
            Featured Categories
          </h1>
          <p className="text-sm text-[#010526]/60 mt-4 max-w-md mx-auto leading-relaxed">
            Explore our curated categories of premium garments, custom weaves, and handpicked accessories.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {categories.map((cat) => {
              const imageUrl = resolveProductImageUrl(cat.image_url);
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Oval-ish image container */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-full bg-[#F0F2FF] shadow-sm mb-5 border border-[#010526]/5">
                    <img
                      src={imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>

                  {/* Category Details */}
                  <div className="flex flex-col items-center">
                    <h2 className="text-base font-bold tracking-wider uppercase text-[#010526] group-hover:opacity-75 transition-opacity">
                      {cat.name}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-[#010526]/60 font-semibold mt-1">
                      {cat.product_count !== undefined ? `${cat.product_count} Styles` : "Explore"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-[#010526]/10 rounded-2xl">
            <h2 className="text-xl font-bold text-[#010526]">No categories found</h2>
            <p className="text-sm text-[#010526]/60 mt-2">Check back later for new arrivals.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
