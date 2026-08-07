"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Check, ShoppingBag } from "lucide-react";

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
}

export default function ProductCard({
  imageSrc,
  imageAlt,
  brand,
  price,
  bgColor = "bg-[#F0F2FF]",
  className = "flex-none w-[220px] md:w-[280px] snap-start",
  name,
  originalPrice,
  sizes = ["S", "M", "L", "XL", "XXL"],
  slug,
}: ProductCardProps) {
  const [addingState, setAddingState] = useState<"idle" | "loading" | "success">("idle");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (addingState !== "idle") return;

    setAddingState("loading");

    // Simulate network delay and add item to cart
    setTimeout(() => {
      setAddingState("success");

      // 1. Get current cart items
      const stored = localStorage.getItem("cartItems");
      const currentCart = stored ? JSON.parse(stored) : [];

      // 2. Parse price to integer
      const numericPrice = Number(price.replace(/[^0-9]/g, "")) || 15000;

      // 3. Check if exists
      const productName = name || imageAlt || "Premium Product";
      const existsIndex = currentCart.findIndex((item: any) => item.name === productName);
      
      if (existsIndex > -1) {
        currentCart[existsIndex].quantity += 1;
      } else {
        currentCart.push({
          id: Date.now(),
          name: productName,
          brand: brand,
          price: numericPrice,
          image: imageSrc,
          size: sizes[0] || "M",
          sizes: sizes,
          colour: "Original",
          quantity: 1,
        });
      }

      // 4. Save and trigger sync
      localStorage.setItem("cartItems", JSON.stringify(currentCart));
      const totalCount = currentCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      localStorage.setItem("cartItemCount", String(totalCount));
      
      window.dispatchEvent(new Event("cart-change"));

      // 5. Open Cart Drawer after success state finishes showing (0.8s later)
      setTimeout(() => {
        setAddingState("idle");
        window.dispatchEvent(new Event("cart-open-drawer"));
      }, 800);

    }, 1200);
  };

  const cardContent = (
    <div className={`${className} group cursor-pointer`}>
      <div className={`w-full aspect-[4/5] group-hover:aspect-[4/4.6] transition-all duration-500 ${bgColor} mb-3 relative overflow-hidden`}>
        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className={`absolute top-3 right-3 p-2.5 rounded-full bg-white/90 text-[#010526] z-10 transition-all duration-300 shadow-md hover:bg-white hover:scale-105 cursor-pointer ${
            addingState !== "idle" ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label="Add to cart"
          disabled={addingState !== "idle"}
        >
          {addingState === "loading" && (
            <Loader2 size={16} className="animate-spin text-[#010526]" />
          )}
          {addingState === "success" && (
            <Check size={16} className="text-emerald-600 animate-fade-in" />
          )}
          {addingState === "idle" && (
            <ShoppingBag size={16} className="text-[#010526]" />
          )}
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
                <span className="text-[11px] font-bold tracking-widest text-[#010526]/60">Sizes:</span>
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#010526]/60">Sizes:</span>
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
      <Link href={`/product/${slug}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}