"use client";

interface DepartmentItem {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  href: string;
  sort_order?: number;
}

interface CategorySectionProps {
  departments?: DepartmentItem[];
}

const fallbackDepartments: DepartmentItem[] = [
  {
    id: 1,
    name: "Men",
    slug: "men",
    image_url: "/banner/men_category.png",
    description: "Modern Traditions",
    href: "#",
  },
  {
    id: 2,
    name: "Women",
    slug: "women",
    image_url: "/banner/women_category.png",
    description: "Heritage Elegance",
    href: "#",
  },
  {
    id: 3,
    name: "Kids",
    slug: "kids",
    image_url: "/banner/kids_category.png",
    description: "Festive Joy",
    href: "#",
  },
];

const fallbackImages: Record<string, string> = {
  men: "/banner/men_category.png",
  women: "/banner/women_category.png",
  kids: "/banner/kids_category.png",
  gifts: "/banner/kids_category.png",
};

export default function CategorySection({ departments = fallbackDepartments }: CategorySectionProps) {
  const safeDepartments = departments.length > 0 ? departments : fallbackDepartments;

  return (
    <section className="relative w-full overflow-hidden bg-white py-12 md:py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Title / Header */}
      <div className="text-center mb-12">
        <p className="text-[10px] uppercase tracking-[0.2em] mb-2 text-[#010526]/60">Explore Collections</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#010526]">Designed for the Whole Family</h2>
      </div>

      {/* Grid container */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 h-[600px] md:h-[550px] w-full overflow-hidden shadow-sm">
        {safeDepartments.slice(0, 3).map((dept, index) => {
          const fallbackImage = dept.image_url || fallbackImages[dept.slug?.toLowerCase()] || fallbackImages[index === 0 ? "men" : index === 1 ? "women" : "kids"];

          return (
            <a
              key={dept.id ?? dept.name}
              href={dept.href}
              className="group relative h-full w-full overflow-hidden flex flex-col justify-end p-8 md:p-12 transition-all duration-500 hover:z-20"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={fallbackImage}
                  alt={dept.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 object-top"
                />
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent transition-opacity duration-300" />
              </div>

              {/* Content overlay */}
              <div className="relative z-10 text-white translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-[10px] uppercase tracking-widest text-white/70 block mb-1">
                  {dept.description || "Explore Collection"}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide uppercase">
                  {dept.name}
                </h3>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:pr-4 transition-all duration-300">
                  <span>Shop Now</span>
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </div>
              </div>
            </a>
          );
        })}

        {/* Leaning Vertical Bars (Dividers) between sections on desktop */}
        <div className="absolute top-0 bottom-0 left-[33.33%] w-[3px] bg-white/75 transform -skew-x-[12deg] origin-center z-20 pointer-events-none hidden md:block" />
        <div className="absolute top-0 bottom-0 left-[66.66%] w-[3px] bg-white/75 transform -skew-x-[12deg] origin-center z-20 pointer-events-none hidden md:block" />
      </div>
    </section>
  );
}