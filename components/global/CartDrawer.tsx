"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, AlertTriangle } from "lucide-react";
import { useCart } from "@/components/context/CartContext";

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: string;
  sizes?: string[];
  colour: string;
  quantity: number;
  isOutOfStock?: boolean;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateCartItem, removeFromCart } = useCart();
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    const nextQuantity = Math.max(1, item.quantity + delta);
    updateCartItem(id, { quantity: nextQuantity });
  };

  const updateSize = (id: string, newSize: string) => {
    updateCartItem(id, { size: newSize });
  };

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[150] transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out z-10 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#010526]/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#010526]" />
            <h2 className="text-base font-bold uppercase tracking-wider text-[#010526]">
              Shopping Bag ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#010526] hover:opacity-60 transition-opacity cursor-pointer"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5 custom-scrollbar">
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(1, 5, 38, 0.02);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(1, 5, 38, 0.2);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(1, 5, 38, 0.4);
            }
          `}</style>
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <ShoppingBag size={48} className="text-[#010526]/20 mb-4 font-light" />
              <p className="text-sm font-sans text-[#010526]/70">Your shopping bag is empty.</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore Collection</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-[#010526]/10 items-start">
                {/* Product Thumbnail */}
                <div className="relative w-20 h-28 bg-[#010526]/5 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/75">
                    {item.brand}
                  </p>
                  <h4 className="text-sm md:text-base font-bold text-[#010526] mt-0.5 line-clamp-2 leading-snug">
                    {item.name}
                  </h4>
                  <div className="text-xs text-[#010526]/85 font-sans mt-1.5 flex items-center gap-3 flex-wrap">
                    {!["S", "M", "L", "XL", "XXL"].includes(item.size ?? "") ? (
                      <span>Size: <strong className="text-[#010526] font-bold">{item.size ?? "One Size"}</strong></span>
                    ) : (
                      <span className="flex items-center gap-1 relative">
                        <span>Size:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                          }}
                          className="flex items-center gap-1 bg-transparent border border-[#010526]/20 px-2 py-0.5 text-xs text-[#010526] font-bold outline-none cursor-pointer hover:bg-[#010526]/5 transition-colors rounded-sm"
                        >
                          <span>{item.size}</span>
                          <span className="text-[9px] text-[#010526]/60">▼</span>
                        </button>

                        {activeDropdownId === item.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdownId(null)}
                            />
                            <div className="absolute top-full left-0 mt-1 bg-white border border-[#010526]/20 shadow-lg rounded-sm py-1 z-20 min-w-[70px]">
                              {["S", "M", "L", "XL", "XXL"].map((sz) => {
                                const isAvailable = !item.sizes || item.sizes.includes(sz);
                                return (
                                  <button
                                    key={sz}
                                    disabled={!isAvailable}
                                    onClick={() => {
                                      updateSize(item.id, sz);
                                      setActiveDropdownId(null);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors ${isAvailable
                                        ? "text-[#010526] hover:bg-[#010526]/5"
                                        : "line-through text-[#010526]/30 cursor-not-allowed bg-[#010526]/[0.02]"
                                      }`}
                                  >
                                    {sz}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </span>
                    )}
                    <span>|</span>
                    <span>Color: <strong className="text-[#010526] font-bold">{item.colour}</strong></span>
                  </div>
                  {(item.isOutOfStock || item.name === "Banarasi Silk Saree") && (
                    <div className="bg-red-50 text-red-700 py-1.5 px-2.5 rounded-sm inline-flex items-center gap-1.5 mt-2 border-none">
                      <AlertTriangle size={12} className="text-red-700 flex-shrink-0" />
                      <span className="text-[9px] font-sans font-bold tracking-wider uppercase leading-none">Currently Unavailable</span>
                    </div>
                  )}
                  <p className="text-sm font-extrabold text-[#010526] mt-2">
                    £{item.price.toLocaleString()}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    {/* Qty Selector */}
                    <div className="flex items-center border border-[#010526]/30 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1.5 text-[#010526]/90 hover:bg-[#010526]/5 transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-sans font-bold text-[#010526]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1.5 text-[#010526]/90 hover:bg-[#010526]/5 transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#010526]/60 hover:text-red-600 transition-colors cursor-pointer p-1.5"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info sticky */}
        {cartItems.length > 0 && (
          <div className="bg-[#010526]/[0.02] border-t border-[#010526]/10 px-6 py-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-sans uppercase tracking-widest text-[#010526] font-bold">Subtotal</span>
              <span className="text-lg font-extrabold text-[#010526]">£{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full py-3 bg-white border border-[#010526]/30 text-[#010526] text-xs font-bold uppercase tracking-widest text-center hover:bg-[#010526]/5 transition-colors cursor-pointer block flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                <span>Check Your Bag</span>
              </Link>
              <button
                onClick={() => {
                  alert("Proceeding to checkout...");
                  onClose();
                }}
                className="w-full py-3 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Checkout Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
