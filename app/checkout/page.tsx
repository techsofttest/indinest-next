"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { CartItem as ContextCartItem } from "@/components/context/CartContext";
import { useCart } from "@/components/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import CheckoutProgressBar, { CheckoutStep } from "@/components/checkout/CheckoutProgressBar";
import { PhoneInput, defaultCountries } from "react-international-phone";
import "react-international-phone/style.css";

type CartItem = ContextCartItem;

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const isDirect = searchParams.get("direct") === "true";

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("Information");
  const { cartItems, clearCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[] | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [addressMode, setAddressMode] = useState<"saved" | "custom">("custom");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const loadCart = () => {
      if (isDirect) {
        const directItem = localStorage.getItem("directCheckoutItem");
        if (directItem) {
          try {
            setCheckoutItems(JSON.parse(directItem));
            return;
          } catch {
            setCheckoutItems([]);
            return;
          }
        }
      }

      setCheckoutItems(cartItems);
    };
    loadCart();

    const storedAddresses = localStorage.getItem("userAddresses");
    if (storedAddresses) {
      const parsed = JSON.parse(storedAddresses);
      setSavedAddresses(parsed);
      if (parsed.length > 0) {
        setAddressMode("saved");
        const defaultAddr = parsed.find((a: Address) => a.isDefault) || parsed[0];
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [cartItems, isDirect]);
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === "Information") setCurrentStep("Confirmation");
    else if (currentStep === "Confirmation") {
      setOrderComplete(true);
      if (isDirect) {
        localStorage.removeItem("directCheckoutItem");
      }
      clearCart();
      window.dispatchEvent(new Event("cart-change"));
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "Confirmation") setCurrentStep("Information");
  };

  const items = isDirect && checkoutItems !== null ? checkoutItems : cartItems;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  if (orderComplete) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 w-full max-w-[800px] mx-auto px-4 md:px-8 py-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider text-[#010526] mb-4">
            Thank you!
          </h1>
          <p className="text-base font-sans text-[#010526]/70 mb-8 max-w-md leading-relaxed">
            Your order has been placed successfully. We've sent a confirmation email with your order details and tracking information.
          </p>
          <Link
            href="/"
            className="px-8 py-4 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
      <Header />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* Left Column: Checkout Forms */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <h1 className="text-3xl font-light uppercase tracking-wider text-[#010526] mb-8">
              Checkout
            </h1>

            <CheckoutProgressBar
              currentStep={currentStep}
              steps={["Information", "Confirmation"]}
            />

            <form onSubmit={handleNextStep} className="mt-8 flex flex-col gap-8">

              {currentStep === "Information" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold font-sans text-[#010526] mb-4">Contact Phone Number</h2>
                    <PhoneInput
                      defaultCountry="gb"
                      countries={defaultCountries.filter((c) => ["gb", "ie", "de"].includes(c[1]))}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      style={{ '--react-international-phone-border-radius': '0' } as React.CSSProperties}
                      inputClassName="w-full !bg-transparent !border-l-0 !text-sm !font-sans !text-[#010526] focus:!outline-none !rounded-none"
                      className="[&.react-international-phone-input-container]:border [&.react-international-phone-input-container]:border-[#010526]/20 focus-within:[&.react-international-phone-input-container]:border-[#010526] [&.react-international-phone-input-container]:rounded-none"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-sans text-[#010526] mb-4">Shipping Address</h2>

                    {savedAddresses.length > 0 && (
                      <div className="flex flex-col gap-3 mb-6">
                        {savedAddresses.map((addr) => (
                          <label key={addr.id} className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${addressMode === "saved" && selectedAddressId === addr.id ? 'border-[#010526] bg-[#010526]/[0.02]' : 'border-[#010526]/20'}`}>
                            <input
                              type="radio"
                              name="addressSelection"
                              checked={addressMode === "saved" && selectedAddressId === addr.id}
                              onChange={() => {
                                setAddressMode("saved");
                                setSelectedAddressId(addr.id);
                              }}
                              className="accent-[#010526] mt-1"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-sm font-sans">{addr.name}</span>
                              <span className="text-sm font-sans text-[#010526]/70">{addr.street}, {addr.city}, {addr.state} {addr.pincode}</span>
                            </div>
                          </label>
                        ))}

                        <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${addressMode === "custom" ? 'border-[#010526] bg-[#010526]/[0.02]' : 'border-[#010526]/20'}`}>
                          <input
                            type="radio"
                            name="addressSelection"
                            checked={addressMode === "custom"}
                            onChange={() => setAddressMode("custom")}
                            className="accent-[#010526] mt-1"
                          />
                          <span className="font-bold text-sm font-sans">Use a different address</span>
                        </label>
                      </div>
                    )}

                    {(addressMode === "custom" || savedAddresses.length === 0) && (
                      <div className="grid grid-cols-2 gap-4 animate-fade-in">
                        <input type="text" placeholder="First Name" required className="col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none" />
                        <input type="text" placeholder="Last Name" required className="col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none" />
                        <input type="text" placeholder="Address" required className="col-span-2 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none" />
                        <input type="text" placeholder="Apartment, suite, etc. (optional)" className="col-span-2 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none" />
                        <input type="text" placeholder="City" required className="col-span-2 sm:col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none" />
                        <input type="text" placeholder="Postal Code" required className="col-span-2 sm:col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === "Confirmation" && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <h2 className="text-lg font-bold font-sans text-[#010526] mb-2">Order Confirmation</h2>
                  <div className="flex flex-col gap-4 border border-[#010526]/20 p-5 bg-[#010526]/[0.02]">
                    <div className="flex items-center gap-2 text-[#010526]/70 mb-2">
                      <Lock size={14} />
                      <span className="text-xs font-sans uppercase tracking-widest font-bold">Secure Checkout</span>
                    </div>
                    <p className="text-sm font-sans text-[#010526]/80 leading-relaxed">
                      Please review your shipping details and order summary before confirming. Once you place the order, you will receive a confirmation email.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-6 border-t border-[#010526]/10">
                {currentStep !== "Information" ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 text-sm font-bold font-sans text-[#010526]/70 hover:text-[#010526] transition-colors"
                  >
                    <ArrowLeft size={16} /> Return
                  </button>
                ) : (
                  <Link href="/cart" className="flex items-center gap-2 text-sm font-bold font-sans text-[#010526]/70 hover:text-[#010526] transition-colors">
                    <ArrowLeft size={16} /> Return to Cart
                  </Link>
                )}

                <button
                  type="submit"
                  className="px-8 py-4 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  {currentStep === "Information" && "Continue to Confirmation"}
                  {currentStep === "Confirmation" && "Confirm Order"}
                  <ArrowRight size={16} />
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[45%] bg-[#010526]/[0.02] p-6 md:p-8">
            <h2 className="text-xl uppercase tracking-wider font-light text-[#010526] pb-6 border-b border-[#010526]/10">
              Order Summary
            </h2>

            <div className="flex flex-col gap-4 py-6 border-b border-[#010526]/10 max-h-[300px] overflow-y-auto pr-2">
              {(items || []).map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-[#010526]/5 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#010526] text-white text-[10px] font-bold font-sans rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#010526] truncate">{item.name}</p>
                    <p className="text-xs text-[#010526]/60 font-sans mt-0.5">{item.size} / {item.colour}</p>
                  </div>
                  <div className="text-sm font-bold text-[#010526]">
                    £{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 font-sans text-sm text-[#010526]/70 py-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#010526]">£{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#010526]">
                  {shipping === 0 ? "Free" : `£${shipping}`}
                </span>
              </div>
              <div className="border-t border-[#010526]/10 pt-4 mt-2 flex justify-between text-base md:text-lg font-serif text-[#010526]">
                <span className="uppercase tracking-wider">Total</span>
                <span className="font-bold text-xl">£{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
