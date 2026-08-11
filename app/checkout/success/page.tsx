"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/components/context/CartContext";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { apiUrl } from "@/lib/api";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-xs uppercase tracking-widest text-[#010526]/60">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Missing Order ID");
      setLoading(false);
      setVerifying(false);
      return;
    }

    let attempts = 0;
    const checkPaymentStatus = async () => {
      attempts++;
      if (attempts > 15) {
        setError("We are still confirming your payment. You can check the status of your order in your profile.");
        setVerifying(false);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(apiUrl("/api/checkout/payment-status"), {
          method: "POST",
          headers,
          body: JSON.stringify({ order_id: orderId })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.payment_status === "paid") {
            setOrderDetails(data);
            clearCart();
            window.dispatchEvent(new Event("cart-change"));
            setVerifying(false);
            setLoading(false);
          } else if (data.payment_status === "failed") {
            setError(data.payment_failure_reason || "Payment failed. Please contact support.");
            setVerifying(false);
            setLoading(false);
          } else {
            // Keep polling if payment is still processing or pending
            setTimeout(checkPaymentStatus, 3000);
          }
        } else {
          setError("Failed to verify payment status.");
          setVerifying(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error verifying payment status:", err);
        setError("An error occurred while verifying your payment.");
        setVerifying(false);
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  if (loading || verifying) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#010526] mb-4" />
          <h1 className="text-xl uppercase tracking-wider font-light">Verifying Payment...</h1>
          <p className="text-xs font-sans text-[#010526]/60 mt-1">We&apos;re confirming your payment. Please wait.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
        <Header />
        <main className="flex-1 w-full max-w-[600px] mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mb-6" />
          <h1 className="text-2xl font-light uppercase tracking-wider mb-2">Payment Verification Failed</h1>
          <p className="text-sm font-sans text-[#010526]/70 mb-8">{error}</p>
          <div className="flex gap-4">
            <Link href="/checkout" className="px-6 py-3 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
              Return to Checkout
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
      <Header />
      <main className="flex-1 w-full max-w-[800px] mx-auto px-4 md:px-8 py-16 text-center">
        <div className="bg-[#010526]/[0.02] p-8 md:p-12 border border-[#010526]/10 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mb-6" />
          <h1 className="text-3xl font-light uppercase tracking-wider mb-2">Order Confirmed</h1>
          <p className="text-sm font-sans text-[#010526]/60 mb-8">
            Thank you for your order! Your order number is <strong className="text-[#010526]">#{orderDetails?.order_number}</strong>.
          </p>

          <div className="w-full border-t border-b border-[#010526]/10 py-6 my-6 text-left font-sans text-sm flex flex-col gap-4">
            <h2 className="text-base font-bold font-serif uppercase tracking-wider text-[#010526]">Order Summary</h2>
            <div className="flex justify-between text-xs text-[#010526]/70">
              <span>Payment Method</span>
              <span className="font-semibold uppercase">Stripe Checkout</span>
            </div>
            <div className="flex justify-between text-xs text-[#010526]/70">
              <span>Status</span>
              <span className="font-semibold text-green-700 uppercase">Paid</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#010526] border-t border-[#010526]/10 pt-3 mt-1">
              <span>Total Paid</span>
              <span>£{orderDetails?.grand_total ? Number(orderDetails.grand_total).toFixed(2) : "0.00"}</span>
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
