"use client";

import React from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useWishlist } from "@/components/context/WishlistContext";
import { formatPrice } from "@/lib/product";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProfileWishlistPage() {
  const { wishlist, isWishlistLoading } = useWishlist();

  if (isWishlistLoading) {
    return (
      <div className="py-20 text-center font-sans">
        <div className="w-8 h-8 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#010526]/60">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="font-serif">
      <div className="mb-8 pb-4 border-b border-[#010526]/10 flex flex-col sm:flex-row justify-between items-baseline gap-2">
        <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-[#010526]">
          My Wishlist
        </h1>
        <p className="text-xs md:text-sm text-[#010526]/60 font-sans">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-[#010526]/10 rounded-2xl p-6 font-sans">
          <div className="w-16 h-16 border border-[#010526]/20 rounded-full flex items-center justify-center mb-6">
            <Heart size={24} className="text-[#010526]/40" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-[#010526]/60 max-w-sm mb-6">
            Explore our collections and save your favorite items here to find them easily later.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 rounded-full"
          >
            <span>Browse Products</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
          {wishlist.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.title}
              brand={item.brand ?? "IndiNest"}
              price={formatPrice(item.price)}
              originalPrice={item.originalPrice ? formatPrice(item.originalPrice) : null}
              imageSrc={item.image}
              imageAlt={item.title}
              slug={item.slug}
              sizes={item.variants?.map((v: any) => v.name || v.size || "").filter(Boolean)}
              className="w-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
