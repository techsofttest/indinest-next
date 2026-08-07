interface BlogCategoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function BlogCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-sans text-xs uppercase tracking-widest border-b border-[#010526]/10 pb-6 mb-12">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`pb-1.5 border-b-[2px] transition-all cursor-pointer font-bold ${
            selectedCategory === cat
              ? "border-[#010526] text-[#010526]"
              : "border-transparent text-[#010526]/40 hover:text-[#010526]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
