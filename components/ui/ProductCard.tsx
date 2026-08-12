"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Check, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import QuickAddModal from "@/components/product/QuickAddModal";

interface ProductCardProps {
  imageSrc: string;
  imageAlt: string;
  brand: string;
  price: string;
  bgColor?: string;
  className?: string;
  name?: string;
  originalPrice?: string | null;
  sizes?: string[];
  slug?: string;
  id?: string | number;
}

export default function ProductCard({
  imageSrc,
  imageAlt,
  brand,
  price,
  bgColor = "bg-[#F0F2FF]",
  className = "flex-none md:w-[280px] snap-start",
  name,
  originalPrice,
  sizes = ["S", "M", "L", "XL", "XXL"],
  slug,
  id,
}: ProductCardProps) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = id ? isInWishlist(id) : false;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist({
      id,
      name,
      brand,
      price,
      originalPrice,
      imageSrc,
      slug,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsQuickAddOpen(true);
  };

  const cardContent = (
    <div className={`${className} group cursor-pointer`}>
      <div className={`w-full aspect-[4/5] group-hover:aspect-[4/4.6] transition-all duration-500 ${bgColor} mb-3 relative overflow-hidden`}>
        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 left-3 p-2.5 rounded-full bg-white/90 text-[#010526] z-10 transition-all duration-300 shadow-md hover:bg-white hover:scale-105 cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={`${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-[#010526] hover:text-red-500"
            } transition-colors`}
          />
        </button>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 text-[#010526] z-10 transition-all duration-300 shadow-md hover:bg-white hover:scale-105 cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Add to cart"
        >
          <ShoppingBag size={16} className="text-[#010526]" />
        </button>

        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {name ? (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#010526]/70 mb-1">{brand}</p>
          <h3 className="text-base font-semibold text-[#010526] leading-snug mb-2">{name}</h3>
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-[#010526]">{price}</span>
            {originalPrice && (
              <span className="text-sm text-[#010526]/55 line-through">{originalPrice}</span>
            )}
          </div>
          {/* Sizes below price */}
          {sizes && sizes.length > 0 && (
            <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-all duration-500 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest text-[#010526]/60">Varients:</span>
                <div className="flex gap-2.5">
                  {sizes.map((size) => (
                    <span key={size} className="text-xs font-bold text-[#010526]/80">{size}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-1">{brand}</h3>
          <p className="text-sm">{price}</p>
          {/* Sizes below price */}
          {sizes && sizes.length > 0 && (
            <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-all duration-500 mt-2 flex justify-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#010526]/60">Varients:</span>
                <div className="flex gap-2.5">
                  {sizes.map((size) => (
                    <span key={size} className="text-xs font-bold text-[#010526]/80">{size}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (slug) {
    return (
      <>
        <Link href={`/products/${slug}`} className="block">
          {cardContent}
        </Link>
        <QuickAddModal slug={slug} isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
      </>
    );
  }

  return (
    <>
      {cardContent}
      {slug && <QuickAddModal slug={slug} isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />}
    </>
  );
}