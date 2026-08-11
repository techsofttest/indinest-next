"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Percent, AlertTriangle } from "lucide-react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { useCart, CartItem } from "@/components/context/CartContext";

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, updateCartItem, removeFromCart, clearCart } = useCart();
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUserName(localStorage.getItem("userName") || "");
    };
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // percentage
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const updateQuantity = (id: string, delta: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    const maxStock = item.stock ?? 99;
    const nextQuantity = Math.max(1, Math.min(item.quantity + delta, maxStock));
    updateCartItem(id, { quantity: nextQuantity });
  };

  const updateSize = (id: string, newSize: string) => {
    updateCartItem(id, { size: newSize });
  };

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (promoCode.toUpperCase() === "FIRST10") {
      setAppliedDiscount(10);
      setPromoSuccess("Promo code 'FIRST10' applied! 10% discount has been subtracted.");
    } else if (promoCode.trim() === "") {
      setPromoError("Please enter a promo code.");
    } else {
      setPromoError("Invalid promo code. Try using 'FIRST10'.");
    }
  };

  const subtotal = cartTotal;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shipping = 0;
  const total = subtotal - discountAmount;

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
      <Header />

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="text-[#010526]/30 mb-6">
              <ShoppingBag size={64} strokeWidth={1} />
            </div>
            <h2 className="text-2xl uppercase tracking-widest font-light text-[#010526] mb-3">
              Your bag is empty
            </h2>
            <p className="text-base font-sans text-[#010526]/60 max-w-sm leading-relaxed mb-8">
              Items you add to your shopping bag will be displayed here. Start exploring our collections.
            </p>
            <Link
              href="/"
              className="px-8 py-4 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left Column: Cart Items List */}
            <div className="w-full lg:w-[65%] flex flex-col gap-6">
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider text-[#010526] flex items-center gap-3">
                  <ShoppingBag size={36} className="text-[#010526]" strokeWidth={1.5} />
                  <span className="flex items-start">
                    <span>{isLoggedIn && userName ? `${userName.split(" ")[0]}'s Bag` : "Shopping Bag"}</span>
                    <sup className="text-sm md:text-base font-sans font-bold text-[#010526]/50 ml-1.5 lowercase tracking-wider">
                      {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                    </sup>
                  </span>
                </h1>
                {/* Personalized banner */}
                {isLoggedIn && userName ? (
                  <div className="mt-3 py-2.5 px-4 bg-[#010526]/5 text-[#010526] text-sm font-sans rounded-sm">
                    ✨ Hi <strong className="font-bold">{userName}</strong>! Enjoy complimentary free shipping on all orders over £50,000 as a circle member.
                  </div>
                ) : (
                  <div className="mt-3 py-2.5 px-4 bg-[#010526]/5 text-[#010526] text-xs font-sans rounded-sm">
                    💡 Sign in to save these items, view your membership rewards, and checkout faster.
                  </div>
                )}
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 md:gap-6 py-6 border-b border-[#010526]/10 animate-fade-in"
                >
                  {/* Image */}
                  <div className="relative w-24 h-32 md:w-32 md:h-44 flex-shrink-0 bg-[#010526]/5 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/50">
                            {item.brand}
                          </p>
                          <h3 className="text-base md:text-2xl font-medium text-[#010526] mt-1 line-clamp-2">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-base md:text-xl font-bold text-[#010526] flex-shrink-0">
                          £{item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Attributes */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-[#010526]/80 font-sans">
                        <span>Size: <strong className="text-[#010526] font-bold">{item.size ?? "One Size"}</strong></span>
                        <span className="border-l border-[#010526]/10 pl-4">Color: <strong className="text-[#010526] font-bold">{item.colour}</strong></span>
                      </div>
                      {(item.isOutOfStock || item.name === "Banarasi Silk Saree") && (
                        <div className="bg-red-50 text-red-700 py-1.5 px-3 rounded-sm inline-flex items-center gap-1.5 mt-2 border-none">
                          <AlertTriangle size={14} className="text-red-700 flex-shrink-0" />
                          <span className="text-[10px] font-sans font-bold tracking-wider uppercase leading-none">Currently Unavailable</span>
                        </div>
                      )}
                    </div>

                    {/* Quantity & Remove actions */}
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center border border-[#010526]/20 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-2 text-[#010526]/90 hover:text-[#010526] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 text-sm font-sans font-bold text-[#010526]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= (item.stock ?? 99)}
                          className="px-3 py-2 text-[#010526]/90 hover:text-[#010526] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#010526]/70 hover:text-red-600 transition-colors p-2 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-[35%] bg-[#010526]/[0.02] p-6 md:p-8 flex flex-col gap-6">
              <h2 className="text-xl uppercase tracking-wider font-light text-[#010526] pb-4">
                Order Summary
              </h2>

              {/* Price list details */}
              <div className="flex flex-col gap-3 font-sans text-sm text-[#010526]/70">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#010526]">£{subtotal.toLocaleString()}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      <Percent size={12} /> Discount ({appliedDiscount}%)
                    </span>
                    <span className="font-semibold">- £{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-[#010526]/60">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="border-t border-[#010526]/10 pt-4 mt-2 flex justify-between text-base md:text-lg font-serif text-[#010526]">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="font-bold text-xl">£{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code box */}
              <form onSubmit={handleApplyPromo} className="flex flex-col gap-2 mt-2">
                <label className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/60">
                  Promo / Coupon Code
                </label>
                <div className="flex border border-[#010526]/20 bg-white">
                  <input
                    type="text"
                    placeholder="Enter FIRST10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm outline-none text-[#010526]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] font-sans text-red-600">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] font-sans text-emerald-600">{promoSuccess}</p>}
              </form>

              {/* Secure Checkout and Details */}
              <div className="flex flex-col gap-4 mt-4">
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#010526]/10"
                >
                  <span>Secure Checkout</span>
                  <ArrowRight size={14} />
                </Link>

                <div className="flex items-start gap-2 text-xs text-[#010526]/50 font-sans mt-2">
                  <ShieldCheck size={16} className="text-[#010526]/60 flex-shrink-0" />
                  <p className="leading-normal">
                    Secure checkout. We protect your privacy and transaction details with bank-grade encryption algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
