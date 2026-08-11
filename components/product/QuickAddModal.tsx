"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl, formatPrice } from "@/lib/product";

interface QuickAddModalProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ slug, isOpen, onClose }: QuickAddModalProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const { addToCart, openCartDrawer } = useCart();

  useEffect(() => {
    if (!isOpen || !slug) return;
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/api/storefront/products/${slug}`));
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          const available = (data.variants ?? []).filter((v: any) => (v.stock ?? 0) > 0);
          if (available.length > 0) {
            let cheapest = available[0];
            for (const v of available) {
              if (v.price < cheapest.price) {
                cheapest = v;
              }
            }
            setSelectedVariantId(cheapest.id);
          }
        }
      } catch (err) {
        console.error("Failed to load product for quick add:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [isOpen, slug]);

  if (!isOpen) return null;

  const handleAddToCart = async () => {
    if (!product || !selectedVariantId) return;
    const variant = product.variants.find((v: any) => v.id === selectedVariantId);
    if (!variant) return;

    setAdding(true);
    await addToCart({
      product_id: product.id,
      variant_id: variant.id,
      name: product.name,
      brand: product.brand?.name ?? "",
      image: resolveProductImageUrl(product.featured_image),
      price: variant.price ?? product.price ?? 0,
      quantity: 1,
      size: variant.name || variant.size || "One Size",
      colour: product.colour || "Standard",
      variant_name: variant.name || variant.size || null,
      stock: variant.stock ?? 99,
    });
    setAdding(false);
    onClose();
    openCartDrawer();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#010526]/10 flex flex-col font-serif">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#010526]/10">
          <span className="text-sm font-bold uppercase tracking-widest text-[#010526]">Quick Add Options</span>
          <button onClick={onClose} className="text-[#010526] hover:opacity-60 transition-opacity">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin mb-3" />
              <span className="text-xs font-sans text-[#010526]/60">Loading sizes & options...</span>
            </div>
          ) : product ? (
            <>
              {/* Product Info */}
              <div className="flex gap-4">
                <img
                  src={resolveProductImageUrl(product.featured_image)}
                  alt={product.name}
                  className="w-16 h-20 object-cover rounded bg-[#010526]/5"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#010526]/60">
                    {product.brand?.name ?? "IndiNest"}
                  </span>
                  <h4 className="text-base font-medium text-[#010526] mt-0.5 line-clamp-1">
                    {product.name}
                  </h4>
                  <span className="text-sm font-bold text-[#010526] mt-1">
                    {formatPrice(product.variants?.find((v: any) => v.id === selectedVariantId)?.price ?? product.price ?? 0)}
                  </span>
                </div>
              </div>

              {/* Variants Selector */}
              <div>
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-[#010526]/80 block mb-3">
                  Select Size / Variant
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(product.variants ?? []).map((v: any) => {
                    const active = selectedVariantId === v.id;
                    const outOfStock = (v.stock ?? 0) <= 0;
                    return (
                      <button
                        key={v.id}
                        disabled={outOfStock}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-4 py-2.5 rounded-full text-xs font-sans font-bold transition-all border ${
                          active
                            ? "bg-[#010526] border-[#010526] text-white"
                            : "border-[#010526]/20 hover:border-[#010526] text-[#010526]"
                        } ${outOfStock ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                      >
                        {v.name || v.size || "Standard"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAddToCart}
                disabled={adding || !selectedVariantId}
                className="w-full py-4 bg-[#010526] text-white text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 rounded-full disabled:opacity-50"
              >
                {adding ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingBag size={14} />
                )}
                <span>Add To Shopping Bag</span>
              </button>
            </>
          ) : (
            <div className="py-8 text-center text-sm text-red-600">
              Failed to load product options.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
