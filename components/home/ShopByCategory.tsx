"use client";

interface CategoryItem {
  name: string;
  image: string;
  count: string;
  href: string;
}

interface ShopByCategoryProps {
  categories?: CategoryItem[];
}

const fallbackCategories: CategoryItem[] = [
  { name: "Sarees", image: "/category/sarees.png", count: "120+ Styles", href: "#" },
  { name: "Readymade Blouses", image: "/category/blouses2.png", count: "45+ Styles", href: "#" },
  { name: "Jewellery", image: "/category/jewellery.png", count: "80+ Styles", href: "#" },
  { name: "Kaftans", image: "/category/kaftan2.png", count: "30+ Styles", href: "#" },
  { name: "Salwar Suits", image: "/category/salvar.png", count: "65+ Styles", href: "#" },
  { name: "Kurtas", image: "/category/kurtas.png", count: "50+ Styles", href: "#" },
  { name: "Kids' Wear", image: "/banner/kids_category.png", count: "40+ Styles", href: "#" },
  { name: "Men's Wear", image: "/banner/men_category.png", count: "55+ Styles", href: "#" },
];

export default function ShopByCategory({ categories = fallbackCategories }: ShopByCategoryProps) {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto bg-white">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-[10px] uppercase tracking-[0.2em] mb-2 text-[#010526]/60">Curated Collections</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#010526]">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="group flex flex-col items-center text-center"
          >
            {/* Image Container (Oval) */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-full bg-[#F0F2FF] shadow-sm mb-4">
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