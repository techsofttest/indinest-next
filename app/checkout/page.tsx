"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { CartItem as ContextCartItem } from "@/components/context/CartContext";
import { useCart } from "@/components/context/CartContext";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2, CheckCircle2, ShoppingBag, MapPin, Check } from "lucide-react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { apiUrl } from "@/lib/api";

type CartItem = ContextCartItem;

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDirect = searchParams.get("direct") === "true";

  const { cartItems, clearCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutErrors, setCheckoutErrors] = useState<string[]>([]);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any | null>(null);
  const [placedEnquiryDetails, setPlacedEnquiryDetails] = useState<any | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [initializing, setInitializing] = useState(true);
  const [checkoutType, setCheckoutType] = useState<"payment" | "enquiry" | null>(null);

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("manual");
  const [saveAddressToBook, setSaveAddressToBook] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Shipping Rates State
  const [shippingRates, setShippingRates] = useState<Record<string, number>>({
    standard: 4.00,
    express: 6.00,
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("standard");

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    contact_name: "",
    phone: "",
    email: "",
    address_line_1: "",
    address_line_2: "",
    suburb: "",
    city: "",
    state: "",
    postcode: "",
    country: "United Kingdom",
    delivery_notes: "",
  });

  const updateCheckoutPaymentMethod = (countryNameOrCode: string, countriesList: any[] = countries) => {
    const found = countriesList.find(
      (c) => c.code === countryNameOrCode || c.name === countryNameOrCode
    );
    const resolvedType = found?.checkout_type || "payment";
    setCheckoutType(resolvedType);
    return resolvedType;
  };

  useEffect(() => {
    const initializeCheckout = async () => {
      setInitializing(true);

      // 1. Load Cart Items
      let finalItems: CartItem[] = [];
      if (isDirect) {
        const directItem = localStorage.getItem("directCheckoutItem");
        if (directItem) {
          try {
            finalItems = JSON.parse(directItem);
          } catch {
            finalItems = [];
          }
        }
      } else {
        finalItems = cartItems;
      }
      setCheckoutItems(finalItems);

      if (!finalItems || finalItems.length === 0) {
        router.push("/cart");
        return;
      }

      // 2. Fetch shipping rates
      let loadedRates = { standard: 4.00, express: 6.00 };
      try {
        const res = await fetch(apiUrl("/api/shipping/rates"));
        if (res.ok) {
          loadedRates = await res.json();
          setShippingRates(loadedRates);
        }
      } catch (err) {
        console.error("Failed to load shipping rates:", err);
      }

      // 3. Fetch countries list
      let loadedCountries: any[] = [];
      try {
        const res = await fetch(apiUrl("/api/countries"));
        if (res.ok) {
          loadedCountries = await res.json();
          setCountries(loadedCountries);
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }

      // 4. Fetch saved addresses
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail") || "";
      setIsLoggedIn(!!token);

      let initialCountry = "United Kingdom";
      if (userEmail) {
        setAddressForm(prev => ({ ...prev, email: userEmail }));
      }

      if (token) {
        try {
          const res = await fetch(apiUrl("/api/customer/addresses"), {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (res.ok) {
            const data = await res.json();
            setSavedAddresses(data);
            const defaultAddr = data.find((addr: any) => addr.is_default_shipping);
            if (defaultAddr) {
              setSelectedAddressId(String(defaultAddr.id));
              initialCountry = defaultAddr.country || "United Kingdom";
              setAddressForm({
                contact_name: defaultAddr.contact_name,
                phone: defaultAddr.phone,
                email: userEmail,
                address_line_1: defaultAddr.address_line_1,
                address_line_2: defaultAddr.address_line_2 || "",
                suburb: defaultAddr.suburb || "",
                city: defaultAddr.city,
                state: defaultAddr.state || "",
                postcode: defaultAddr.postcode,
                country: initialCountry,
                delivery_notes: defaultAddr.delivery_notes || "",
              });
            }
          }
        } catch (err) {
          console.error("Failed to load saved addresses for checkout:", err);
        }
      }

      // 5. Update checkout payment method condition based on determined country and loaded countries
      updateCheckoutPaymentMethod(initialCountry, loadedCountries);
      setInitializing(false);
    };

    initializeCheckout();
  }, [cartItems, isDirect]);

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    const userEmail = localStorage.getItem("userEmail") || "";
    if (id === "manual") {
      setAddressForm({
        contact_name: "",
        phone: "",
        email: userEmail,
        address_line_1: "",
        address_line_2: "",
        suburb: "",
        city: "",
        state: "",
        postcode: "",
        country: "United Kingdom",
        delivery_notes: "",
      });
      updateCheckoutPaymentMethod("United Kingdom");
    } else {
      const selected = savedAddresses.find((addr) => String(addr.id) === id);
      if (selected) {
        const countryVal = selected.country || "United Kingdom";
        setAddressForm({
          contact_name: selected.contact_name,
          phone: selected.phone,
          email: userEmail,
          address_line_1: selected.address_line_1,
          address_line_2: selected.address_line_2 || "",
          suburb: selected.suburb || "",
          city: selected.city,
          state: selected.state || "",
          postcode: selected.postcode,
          country: countryVal,
          delivery_notes: selected.delivery_notes || "",
        });
        updateCheckoutPaymentMethod(countryVal);
      }
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];
    if (!addressForm.contact_name) errors.push("Full Name is required.");
    if (!addressForm.phone) errors.push("Phone Number is required.");
    if (!addressForm.email) errors.push("Email is required.");
    if (!addressForm.address_line_1) errors.push("Street Address is required.");
    if (!addressForm.address_line_2) errors.push("Apartment, suite, unit, etc. (Address Line 2) is required.");
    if (!addressForm.city) errors.push("City is required.");
    if (!addressForm.postcode) errors.push("Postcode is required.");

    if (errors.length > 0) {
      setCheckoutErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCheckoutErrors([]);
    setLoading(true);

    const token = localStorage.getItem("authToken");

    // 1. If checked and is manual entry, save the address first
    if (isLoggedIn && selectedAddressId === "manual" && saveAddressToBook) {
      try {
        await fetch(apiUrl("/api/customer/addresses"), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            label: "Checkout Saved",
            contact_name: addressForm.contact_name,
            phone: addressForm.phone,
            address_line_1: addressForm.address_line_1,
            address_line_2: addressForm.address_line_2,
            suburb: addressForm.suburb,
            city: addressForm.city,
            state: addressForm.state,
            postcode: addressForm.postcode,
            country: addressForm.country,
            delivery_notes: addressForm.delivery_notes
          })
        });
      } catch (err) {
        console.error("Failed to save address to address book during checkout:", err);
      }
    }

    // 2. Proceed with checkout order placement
    const items = isDirect && checkoutItems !== null ? checkoutItems : cartItems;
    const payload = {
      cart: items.map(item => {
        let realProductId: any = item.product_id;
        if (!realProductId && typeof item.id === "string") {
          const firstPart = item.id.split("-")[0];
          realProductId = parseInt(firstPart) || item.id;
        } else if (!realProductId) {
          realProductId = item.id;
        }

        let realVariantId: any = item.variant_id;
        if (!realVariantId && typeof item.id === "string") {
          const parts = item.id.split("-");
          if (parts.length > 1) {
            realVariantId = parseInt(parts[1]) || null;
          }
        }

        return {
          product_id: realProductId,
          quantity: item.quantity,
          variant_id: realVariantId || null,
          price: item.price
        };
      }),
      address: {
        contact_name: addressForm.contact_name,
        phone: addressForm.phone,
        email: addressForm.email,
        address_line_1: addressForm.address_line_1,
        address_line_2: addressForm.address_line_2,
        suburb: addressForm.suburb || "",
        city: addressForm.city,
        state: addressForm.state || "",
        postcode: addressForm.postcode,
        country: addressForm.country,
        delivery_notes: addressForm.delivery_notes,
      }
    };

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(apiUrl("/api/checkout"), {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        if (data.checkout_type === "enquiry") {
          setPlacedEnquiryDetails({
            enquiryNumber: data.enquiry_number,
            items: items,
            subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            address: addressForm,
          });
          clearCart();
          window.dispatchEvent(new Event("cart-change"));
        } else if (data.checkout_url) {
          // Redirect to Stripe hosted checkout page
          window.location.href = data.checkout_url;
        } else {
          setPlacedOrderDetails({
            orderNumber: data.order_number,
            items: items,
            shippingCost: shippingRates[selectedShippingMethod] ?? 4.00,
            subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (shippingRates[selectedShippingMethod] ?? 4.00),
            address: addressForm,
            shippingMethod: selectedShippingMethod
          });
          clearCart();
          window.dispatchEvent(new Event("cart-change"));
        }
      } else {
        const serverErrors: string[] = [];
        if (data.errors) {
          Object.values(data.errors).forEach((v: any) => {
            if (Array.isArray(v)) serverErrors.push(...v);
            else serverErrors.push(String(v));
          });
        }
        if (data.message) serverErrors.push(data.message);
        if (data.error) serverErrors.push(data.error);

        setCheckoutErrors(serverErrors.length > 0 ? serverErrors : ["Failed to place order."]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Checkout order placement failed:", err);
      setCheckoutErrors(["An error occurred. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const items = isDirect && checkoutItems !== null ? checkoutItems : cartItems;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingRates[selectedShippingMethod] ?? 4.00;
  const total = subtotal + shippingCost;

  if (initializing) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#010526] mb-4" />
          <h1 className="text-xl uppercase tracking-wider font-light">Loading Checkout...</h1>
        </main>
        <Footer />
      </div>
    );
  }

  if (placedEnquiryDetails) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 w-full max-w-[800px] mx-auto px-4 md:px-8 py-16 text-center">
          <div className="bg-[#010526]/[0.02] p-8 md:p-12 border border-[#010526]/10 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-amber-600 mb-6" />
            <h1 className="text-3xl font-light uppercase tracking-wider mb-2">Enquiry Submitted</h1>
            <p className="text-sm font-sans text-[#010526]/60 mb-8">
              Thank you for your enquiry! Reference number: <strong className="text-[#010526]">#{placedEnquiryDetails.enquiryNumber}</strong>.
              Our team will contact you regarding delivery options and final pricing.
            </p>

            <div className="w-full border-t border-b border-[#010526]/10 py-6 my-6 text-left font-sans text-sm flex flex-col gap-4">
              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-[#010526]">Requested Items</h2>
              
              <div className="flex flex-col gap-3">
                {placedEnquiryDetails.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span>{item.name} <strong className="text-[#010526]/60">x{item.quantity}</strong></span>
                    <span className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#010526]/10 pt-4 mt-2 flex flex-col gap-2 text-xs text-[#010526]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{placedEnquiryDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-amber-700">To be confirmed</span>
                </div>
              </div>
            </div>

            <div className="w-full text-left font-sans text-xs text-[#010526]/70 grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
              <div>
                <h3 className="font-bold text-[#010526] mb-1.5 uppercase tracking-wider">Delivery Address</h3>
                <p>{placedEnquiryDetails.address.contact_name}</p>
                <p>{placedEnquiryDetails.address.address_line_1}</p>
                {placedEnquiryDetails.address.address_line_2 && <p>{placedEnquiryDetails.address.address_line_2}</p>}
                <p>{placedEnquiryDetails.address.city}, {placedEnquiryDetails.address.postcode}</p>
                <p>{placedEnquiryDetails.address.country}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#010526] mb-1.5 uppercase tracking-wider">Contact Details</h3>
                <p>Email: {placedEnquiryDetails.address.email}</p>
                <p>Phone: {placedEnquiryDetails.address.phone}</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Link href="/products" className="px-6 py-3 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (placedOrderDetails) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 w-full max-w-[800px] mx-auto px-4 md:px-8 py-16 text-center">
          <div className="bg-[#010526]/[0.02] p-8 md:p-12 border border-[#010526]/10 flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mb-6" />
            <h1 className="text-3xl font-light uppercase tracking-wider mb-2">Order Confirmed</h1>
            <p className="text-sm font-sans text-[#010526]/60 mb-8">
              Thank you for your order! Your order number is <strong className="text-[#010526]">#{placedOrderDetails.orderNumber}</strong>.
            </p>

            <div className="w-full border-t border-b border-[#010526]/10 py-6 my-6 text-left font-sans text-sm flex flex-col gap-4">
              <h2 className="text-base font-bold font-serif uppercase tracking-wider text-[#010526]">Order Summary</h2>
              
              <div className="flex flex-col gap-3">
                {placedOrderDetails.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span>{item.name} <strong className="text-[#010526]/60">x{item.quantity}</strong></span>
                    <span className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#010526]/10 pt-4 mt-2 flex flex-col gap-2 text-xs text-[#010526]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{placedOrderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({placedOrderDetails.shippingMethod.toUpperCase()})</span>
                  <span>£{placedOrderDetails.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#010526] border-t border-[#010526]/10 pt-3 mt-1">
                  <span>Total Paid</span>
                  <span>£{placedOrderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="w-full text-left font-sans text-xs text-[#010526]/70 grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
              <div>
                <h3 className="font-bold text-[#010526] mb-1.5 uppercase tracking-wider">Delivery Address</h3>
                <p>{placedOrderDetails.address.contact_name}</p>
                <p>{placedOrderDetails.address.address_line_1}</p>
                {placedOrderDetails.address.address_line_2 && <p>{placedOrderDetails.address.address_line_2}</p>}
                <p>{placedOrderDetails.address.city}, {placedOrderDetails.address.postcode}</p>
                <p>{placedOrderDetails.address.country}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#010526] mb-1.5 uppercase tracking-wider">Contact Details</h3>
                <p>Email: {placedOrderDetails.address.email}</p>
                <p>Phone: {placedOrderDetails.address.phone}</p>
                {placedOrderDetails.address.delivery_notes && (
                  <p className="mt-2 italic">Notes: {placedOrderDetails.address.delivery_notes}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Link href="/products" className="px-6 py-3 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                Continue Shopping
              </Link>
              <Link href="/profile/orders" className="px-6 py-3 border border-[#010526] text-[#010526] text-xs font-bold uppercase tracking-widest hover:bg-[#010526]/5 transition-colors">
                View Orders
              </Link>
            </div>
          </div>
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

            {checkoutErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold font-sans rounded-none">
                <ul className="list-disc pl-4 space-y-1">
                  {checkoutErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-8">
              
              {/* Saved Addresses List (For logged in users) */}
              {isLoggedIn && savedAddresses.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-bold font-sans text-[#010526]">Delivery Destination</h2>
                  <div className="grid grid-cols-1 gap-3 font-sans">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        onClick={() => handleAddressSelect(String(addr.id))}
                        className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                          selectedAddressId === String(addr.id)
                            ? "border-[#010526] bg-[#010526]/[0.02]"
                            : "border-[#010526]/20 hover:border-[#010526]/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddressId"
                          checked={selectedAddressId === String(addr.id)}
                          onChange={() => {}}
                          className="accent-[#010526] mt-1"
                        />
                        <div className="flex-1 text-xs">
                          <p className="font-bold text-sm text-[#010526] mb-1">
                            {addr.contact_name} {addr.label && <span className="font-normal text-[#010526]/60">({addr.label})</span>}
                          </p>
                          <p className="text-[#010526]/80 leading-relaxed">
                            {addr.address_line_1}, {addr.address_line_2 ? `${addr.address_line_2}, ` : ""}{addr.suburb ? `${addr.suburb}, ` : ""}{addr.city}, {addr.state} - {addr.postcode}
                          </p>
                          <p className="text-[#010526]/60 mt-1">Phone: {addr.phone}</p>
                        </div>
                        {selectedAddressId === String(addr.id) && (
                          <Check className="w-4 h-4 text-[#010526]" />
                        )}
                      </label>
                    ))}

                    <label
                      onClick={() => handleAddressSelect("manual")}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                        selectedAddressId === "manual"
                          ? "border-[#010526] bg-[#010526]/[0.02]"
                          : "border-[#010526]/20 hover:border-[#010526]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedAddressId"
                        checked={selectedAddressId === "manual"}
                        onChange={() => {}}
                        className="accent-[#010526]"
                      />
                      <span className="font-bold text-sm text-[#010526]">Enter a new delivery address</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold font-sans text-[#010526]">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name*"
                    required
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.contact_name}
                    onChange={(e) => setAddressForm({ ...addressForm, contact_name: e.target.value })}
                    className="col-span-2 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />

                  <input
                    type="email"
                    placeholder="Email Address*"
                    required
                    disabled={selectedAddressId !== "manual" && isLoggedIn}
                    value={addressForm.email}
                    onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                    className="col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />
                  
                  <input
                    type="tel"
                    placeholder="Phone Number*"
                    required
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold font-sans text-[#010526]">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Street Address Line 1*"
                    required
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.address_line_1}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line_1: e.target.value })}
                    className="col-span-2 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit, etc.*"
                    required
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.address_line_2}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line_2: e.target.value })}
                    className="col-span-2 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />
                  <input
                    type="text"
                    placeholder="Suburb (optional)"
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.suburb}
                    onChange={(e) => setAddressForm({ ...addressForm, suburb: e.target.value })}
                    className="col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />
                  <input
                    type="text"
                    placeholder="City*"
                    required
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />
                  <input
                    type="text"
                    placeholder="State / County (optional)"
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />
                  <input
                    type="text"
                    placeholder="Postcode*"
                    required
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.postcode}
                    onChange={(e) => setAddressForm({ ...addressForm, postcode: e.target.value })}
                    className="col-span-1 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02]"
                  />
                  <select
                    disabled={selectedAddressId !== "manual"}
                    value={addressForm.country}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      setAddressForm({ ...addressForm, country: newCountry });
                      updateCheckoutPaymentMethod(newCountry);
                    }}
                    className="col-span-2 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none disabled:opacity-50 disabled:bg-[#010526]/[0.02] h-[46px] text-[#010526]"
                    required
                  >
                    <option value="" disabled>Select Country*</option>
                    {countries.length === 0 ? (
                      <option value="United Kingdom">United Kingdom</option>
                    ) : (
                      countries.map((c) => (
                        <option key={c.id} value={c.code}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                  <textarea
                    placeholder="Delivery Notes (Optional)"
                    rows={2}
                    value={addressForm.delivery_notes}
                    onChange={(e) => setAddressForm({ ...addressForm, delivery_notes: e.target.value })}
                    className="col-span-2 bg-transparent border border-[#010526]/20 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#010526] rounded-none resize-none"
                  />

                  {/* Save to address book option */}
                  {isLoggedIn && selectedAddressId === "manual" && (
                    <div className="col-span-2 flex items-center gap-2 mt-2 font-sans text-xs sm:text-sm text-[#010526]/80">
                      <input
                        type="checkbox"
                        id="save_address"
                        checked={saveAddressToBook}
                        onChange={(e) => setSaveAddressToBook(e.target.checked)}
                        className="accent-[#010526] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="save_address" className="cursor-pointer select-none font-medium">
                        Save this address to my address book for future orders
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {checkoutType === 'payment' && (
                /* Shipping Method */
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-bold font-sans text-[#010526]">Shipping Method</h2>
                  <div className="flex flex-col gap-3 font-sans">
                    {Object.entries(shippingRates).map(([method, rate]) => (
                      <label
                        key={method}
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${selectedShippingMethod === method ? "border-[#010526] bg-[#010526]/[0.02]" : "border-[#010526]/20"}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={selectedShippingMethod === method}
                            onChange={() => setSelectedShippingMethod(method)}
                            className="accent-[#010526]"
                          />
                          <span className="font-bold text-sm uppercase tracking-wider">{method} Delivery</span>
                        </div>
                        <span className="font-bold text-sm">£{rate.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {checkoutType === 'enquiry' && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold font-sans rounded-none leading-relaxed">
                  We&apos;re currently unable to process online orders outside the United Kingdom and Ireland. Submit an enquiry and our team will contact you regarding delivery options and final pricing.
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-6 border-t border-[#010526]/10">
                <Link href="/cart" className="flex items-center gap-2 text-sm font-bold font-sans text-[#010526]/70 hover:text-[#010526] transition-colors">
                  <ArrowLeft size={16} /> Return to Cart
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      {checkoutType === 'enquiry' ? 'Send Enquiry' : 'Pay Now'}
                    </>
                  )}
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
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#010526] text-white text-[10px] font-bold font-sans rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <p className="text-sm font-bold text-[#010526] truncate">{item.name}</p>
                    <p className="text-xs text-[#010526]/60 mt-0.5">{item.size} / {item.colour}</p>
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
                <span>Shipping {checkoutType === 'payment' ? `(${selectedShippingMethod.toUpperCase()})` : ''}</span>
                <span className="font-semibold text-[#010526]">
                  {checkoutType === 'enquiry' ? 'To be confirmed' : `£${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-[#010526]/10 pt-4 mt-2 flex justify-between text-base md:text-lg font-serif text-[#010526]">
                <span className="uppercase tracking-wider">Total</span>
                <span className="font-bold text-xl">
                  {checkoutType === 'enquiry' ? `£${subtotal.toFixed(2)}` : `£${total.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
