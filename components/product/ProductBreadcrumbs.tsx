import Link from "next/link";

interface ProductBreadcrumbsProps {
  gender: string;
  category: string;
  productName: string;
}

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function ProductBreadcrumbs({ gender, category, productName }: ProductBreadcrumbsProps) {
  // Determine what is active/last to render it dark
  const showCategory = !!category;
  const showProductName = !!productName;

  const isHomeActive = !gender && !showCategory && !showProductName;
  const isGenderActive = !!gender && !showCategory && !showProductName;
  const isCategoryActive = showCategory && !showProductName;
  const isProductNameActive = showProductName;

  const displayGender = gender ? gender.replace("-", " ") : "";

  return (
    <div className="px-6 md:px-16 pt-3 pb-1">
      <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#010526]/50">
        <Link 
          href="/" 
          className={`hover:text-[#010526] transition-colors ${isHomeActive ? "text-[#010526]" : ""}`}
        >
          Home
        </Link>
        {gender && (
          <>
            <ChevronIcon />
            <Link 
              href={`/products/${gender}`} 
              className={`hover:text-[#010526] transition-colors capitalize ${isGenderActive ? "text-[#010526] font-semibold" : ""}`}
            >
              {displayGender}
            </Link>
          </>
        )}
        {showCategory && (
          <>
            <ChevronIcon />
            <span className={`capitalize truncate ${isCategoryActive ? "text-[#010526] font-semibold" : ""}`}>
              {category}
            </span>
          </>
        )}
        {showProductName && (
          <>
            <ChevronIcon />
            <span className={`truncate ${isProductNameActive ? "text-[#010526] font-bold" : ""}`}>
              {productName}
            </span>
          </>
        )}
      </nav>
    </div>
  );
}
