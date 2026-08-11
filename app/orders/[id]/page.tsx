"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowLeft, AlertCircle, ShoppingBag, Home, Phone, User, CheckCircle2, Circle } from "lucide-react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl } from "@/lib/product";

interface PageProps {
    params: Promise<{ id: string }>;
}

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    weight: string;
    image: string | null;
    brand: string;
}

interface OrderDetail {
    id: number;
    order_number: string;
    date: string;
    status: string;
    payment_status: string;
    payment_method: string;
    currency: string;
    subtotal: number;
    shipping_cost: number;
    discount: number;
    grand_total: number;
    delivery_type: string | null;
    delivery_date: string | null;
    time_slot: string | null;
    address: {
        name: string;
        type: string;
        street: string;
        suburb: string;
        country: string;
        phone: string;
    };
    items: OrderItem[];
}

const statusMapping: Record<string, { text: string; color: string }> = {
    pending_payment: { text: "Pending payment", color: "bg-amber-500" },
    confirmed: { text: "Confirmed", color: "bg-blue-500" },
    processing: { text: "Processing", color: "bg-blue-500" },
    packed: { text: "Packed", color: "bg-indigo-500" },
    ready: { text: "Ready", color: "bg-indigo-500" },
    out_for_delivery: { text: "Out for delivery", color: "bg-amber-500" },
    delivered: { text: "Delivered", color: "bg-emerald-500" },
    cancelled: { text: "Cancelled", color: "bg-rose-500" },
    refund_requested: { text: "Refund requested", color: "bg-purple-500" },
    refunded: { text: "Refunded", color: "bg-purple-500" }
};

const getStatusInfo = (status: string) => {
    const key = String(status).toLowerCase();
    return statusMapping[key] || { text: status, color: "bg-gray-400" };
};

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
    }).format(amount);
};

export default function OrderDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrderDetails = async () => {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("authToken");
        if (!token) {
            setLoading(false);
            setError("You must be logged in to view order details.");
            return;
        }

        try {
            const res = await fetch(apiUrl(`/api/customer/orders/${id}`), {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else if (res.status === 404) {
                setError("Order not found");
            } else {
                throw new Error("Unable to load this order");
            }
        } catch (err: any) {
            setError(err.message || "We couldn't retrieve the order details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
                <Header />
                <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-10 animate-pulse">
                    <div className="h-8 bg-[#010526]/10 rounded w-1/4 mb-6"></div>
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-[65%] space-y-6">
                            <div className="h-20 bg-[#010526]/5 rounded w-full"></div>
                            <div className="h-40 bg-[#010526]/5 rounded w-full"></div>
                        </div>
                        <div className="w-full lg:w-[35%] h-60 bg-[#010526]/5 rounded"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center py-24 text-center px-5 gap-4">
                    <AlertCircle size={48} className="text-rose-500 stroke-[1.5]" />
                    <h2 className="text-2xl uppercase tracking-widest font-light text-[#010526]">
                        {error || "Order Not Found"}
                    </h2>
                    <p className="text-sm font-sans text-[#010526]/60 mb-4">
                        {error === "Order not found" ? "The order you are looking for does not exist or you do not have permission to view it." : "We had trouble fetching the order details."}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchOrderDetails}
                            className="px-6 py-3 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            Try again
                        </button>
                        <Link
                            href="/profile?tab=orders"
                            className="px-6 py-3 border border-[#010526]/20 text-[#010526] text-xs font-bold uppercase tracking-widest hover:bg-[#010526]/5 transition-colors"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const currentStatusLower = String(order.status).toLowerCase();
    const isCancelled = currentStatusLower === "cancelled";
    const statusInfo = getStatusInfo(order.status);

    // Calculate order progress steps
    const steps = [
        { label: "Order placed", done: true },
        { label: "Payment confirmed", done: !isCancelled && currentStatusLower !== "pending_payment" },
        { label: "Processing", done: !isCancelled && ["processing", "packed", "ready", "out_for_delivery", "delivered"].includes(currentStatusLower) },
        { label: "Out for delivery", done: !isCancelled && ["out_for_delivery", "delivered"].includes(currentStatusLower) },
        { label: "Delivered", done: !isCancelled && currentStatusLower === "delivered" }
    ];

    const isEnquiry = order.payment_method === "enquiry" || order.payment_method === "quote" || (order.address?.country && order.address.country.toLowerCase() !== "united kingdom" && !order.payment_method?.toLowerCase().includes("stripe") && !order.payment_method?.toLowerCase().includes("card"));

    return (
        <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
            <Header />

            <Breadcrumbs
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "My Account", href: "/profile" },
                    { label: "My Orders", href: "/profile/orders" },
                    { label: `Order #${order.order_number}` },
                ]}
            />

            <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-10">
                <div className="mb-8">
                    <Link
                        href="/profile/orders"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#010526]/60 hover:text-[#010526] transition-colors mb-6 font-sans"
                    >
                        <ArrowLeft size={14} /> Back to My Orders
                    </Link>

                    <div className="flex flex-wrap justify-between items-start gap-4 border-b border-[#010526]/10 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-light uppercase tracking-wider text-[#010526] flex items-center gap-3">
                                <ShoppingBag size={28} strokeWidth={1.5} />
                                Order #{order.order_number}
                            </h1>
                            <p className="mt-2 font-sans text-xs text-[#010526]/60">
                                Placed on {order.date}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 border border-[#010526]/10 rounded bg-[#010526]/[0.01]">
                            <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                            <span className="font-sans text-xs font-semibold text-[#010526]/80">{statusInfo.text}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* LEFT COLUMN */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-8">
                        


                        {/* Items Section */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/70 mb-4 pb-2 border-b border-[#010526]/10">
                                Items
                            </h3>
                            <div className="flex flex-col divide-y divide-[#010526]/5">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 md:gap-6 py-5">
                                        <div className="relative w-20 h-24 md:w-24 md:h-30 flex-shrink-0 bg-[#010526]/5 overflow-hidden border border-[#010526]/5">
                                            {item.image ? (
                                                <img
                                                    src={resolveProductImageUrl(item.image)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[#010526]/[0.02]">
                                                    <Package size={24} className="text-[#010526]/20 stroke-[1.2]" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-[#010526]/60">
                                                    {item.brand}
                                                </p>
                                                <h4 className="text-sm font-medium text-[#010526] mt-0.5">
                                                    {item.name}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-2 text-xs text-[#010526]/70 font-sans">
                                                    {item.weight && (
                                                        <span>{item.weight}</span>
                                                    )}
                                                    <span>Qty {item.quantity}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-[#010526] mt-2 font-sans md:hidden">
                                                {formatCurrency(item.price * item.quantity, order.currency)}
                                            </p>
                                        </div>

                                        <p className="hidden md:block text-sm font-bold text-[#010526] font-sans flex-shrink-0 self-center">
                                            {formatCurrency(item.price * item.quantity, order.currency)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {order.address && (
                            <div>
                                <h3 className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/70 mb-4 pb-2 border-b border-[#010526]/10">
                                    Delivery address
                                </h3>
                                <div className="font-sans text-xs text-[#010526]/80 space-y-1 bg-[#010526]/[0.01] p-5 border border-[#010526]/5 rounded leading-relaxed">
                                    {order.address.name && <p className="font-bold text-sm text-[#010526] mb-1">{order.address.name}</p>}
                                    {order.address.street && <p>{order.address.street}</p>}
                                    {order.address.suburb && <p>{order.address.suburb}</p>}
                                    {order.address.country && <p>{order.address.country}</p>}
                                    {order.address.phone && (
                                        <p className="pt-2 flex items-center gap-1.5 text-[#010526]/60">
                                            <Phone size={12} /> {order.address.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-full lg:w-[35%] bg-[#010526]/[0.02] border border-[#010526]/5 p-6 md:p-8 flex flex-col gap-6 lg:sticky lg:top-10 rounded">
                        <h2 className="text-lg uppercase tracking-wider font-light text-[#010526] pb-3 border-b border-[#010526]/10">
                            Order summary
                        </h2>

                        {/* Summary Totals */}
                        <div className="flex flex-col gap-3 font-sans text-xs text-[#010526]/80">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-[#010526]">
                                    {formatCurrency(order.subtotal, order.currency)}
                                </span>
                            </div>

                            {order.shipping_cost !== undefined && (
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-[#010526]">
                                        {order.shipping_cost === 0 ? "Free" : formatCurrency(order.shipping_cost, order.currency)}
                                    </span>
                                </div>
                            )}

                            {order.discount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(order.discount, order.currency)}</span>
                                </div>
                            )}

                            <div className="border-t border-[#010526]/10 pt-4 mt-2 flex justify-between text-sm font-serif text-[#010526]">
                                <span className="uppercase tracking-wider">Total</span>
                                <span className="font-bold text-base">{formatCurrency(order.grand_total, order.currency)}</span>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="border-t border-[#010526]/10 pt-5 flex flex-col gap-2">
                            <h3 className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/70">Payment</h3>
                            <div className="font-sans text-xs text-[#010526]/80">
                                {isEnquiry ? (
                                    <p className="italic text-[#010526]/60 bg-amber-500/5 border border-amber-500/10 p-3 rounded">
                                        Payment details will be provided after your enquiry is reviewed.
                                    </p>
                                ) : (
                                    <p className="flex items-center justify-between">
                                        <span>Payment method</span>
                                        <span className="font-semibold capitalize">{order.payment_method || "Card"}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Order info */}
                        <div className="border-t border-[#010526]/10 pt-5 flex flex-col gap-2">
                            <h3 className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/70">Order information</h3>
                            <div className="font-sans text-xs text-[#010526]/70 space-y-2">
                                <div className="flex justify-between">
                                    <span>Order number</span>
                                    <span className="font-semibold text-[#010526]">#{order.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Order date</span>
                                    <span className="font-semibold text-[#010526]">{order.date}</span>
                                </div>
                                {order.delivery_date && (
                                    <div className="flex justify-between">
                                        <span>Delivery date</span>
                                        <span className="font-semibold text-[#010526]">{order.delivery_date}</span>
                                    </div>
                                )}
                                {order.time_slot && (
                                    <div className="flex justify-between">
                                        <span>Time slot</span>
                                        <span className="font-semibold text-[#010526]">{order.time_slot}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
