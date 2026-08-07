"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Circle, Download, Home, Phone, User, ShoppingBag, ArrowRight } from "lucide-react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import Breadcrumbs from "@/components/common/Breadcrumbs";

interface PageProps {
    params: Promise<{ id: string }>;
}

/* ─── Data ──────────────────────────────────────────────────────────── */
interface OrderDetail {
    id: string;
    orderDate: string;
    deliveryDate: string;
    status: "Delivered" | "In Transit" | "Processing";
    itemTitle: string;
    itemImage: string;
    listingPrice: string;
    itemPrice: string;
    fees: string;
    total: string;
    itemSize?: string;
    brand: string;
    category: string;
    seller: string;
    paymentMethod: string;
    address: { name: string; phone: string; line1: string; line2: string };
    timeline: { label: string; date: string; done: boolean }[];
}

const orderDatabase: Record<string, OrderDetail> = {
    "IND-894201": {
        id: "IND-894201",
        orderDate: "22 July 2026",
        deliveryDate: "28 July 2026",
        status: "In Transit",
        itemTitle: "Heritage Sherwani",
        itemImage: "/products/men/sherwani/sherwani1/sherwani1.jpg",
        listingPrice: "£ 38,000",
        itemPrice: "£ 32,000",
        fees: "£ 500",
        total: "£ 32,000",
        itemSize: "L",
        brand: "Royal Crafts",
        category: "Sherwani · Silk · Ivory",
        seller: "Royal Crafts Heritage Pvt Ltd",
        paymentMethod: "Debit Card",
        address: { name: "IndiNest Member", phone: "+91 98765 43210", line1: "B-402, Heritage Silk Enclave", line2: "Varanasi, Uttar Pradesh – 221001" },
        timeline: [
            { label: "Order Confirmed", date: "22 July 2026", done: true },
            { label: "Packed & Dispatched", date: "24 July 2026", done: true },
            { label: "Out for Delivery", date: "28 July 2026", done: false },
            { label: "Delivered", date: "Expected 28 July 2026", done: false },
        ],
    },
    "IND-894202": {
        id: "IND-894202",
        orderDate: "22 July 2026",
        deliveryDate: "25 July 2026",
        status: "Delivered",
        itemTitle: "Men's Temple Necklace",
        itemImage: "/products/men/necklace/men-necklace/men-necklace.jpg",
        listingPrice: "£ 8,500",
        itemPrice: "£ 7,200",
        fees: "£ 100",
        total: "£ 7,200",
        itemSize: "Adjustable",
        brand: "Kundan Arts",
        category: "Jewellery · Gold Plated",
        seller: "Kundan Arts Jewellers",
        paymentMethod: "Credit Card",
        address: { name: "IndiNest Member", phone: "+91 98765 43210", line1: "B-402, Heritage Silk Enclave", line2: "Varanasi, Uttar Pradesh – 221001" },
        timeline: [
            { label: "Order Confirmed", date: "22 July 2026", done: true },
            { label: "Packed & Dispatched", date: "23 July 2026", done: true },
            { label: "Out for Delivery", date: "25 July 2026", done: true },
            { label: "Delivered", date: "25 July 2026", done: true },
        ],
    },
    "IND-872910": {
        id: "IND-872910",
        orderDate: "14 June 2026",
        deliveryDate: "20 June 2026",
        status: "Delivered",
        itemTitle: "Party Wear Saree",
        itemImage: "/products/product-clt/Party Wear Saree.png",
        listingPrice: "£ 18,900",
        itemPrice: "£ 18,900",
        fees: "£ 200",
        total: "£ 18,900",
        itemSize: "Free Size",
        brand: "Regal Weaves",
        category: "Saree · Silk · Pink",
        seller: "Regal Weaves Craft Co.",
        paymentMethod: "Credit Card",
        address: { name: "IndiNest Member", phone: "+91 98765 43210", line1: "B-402, Heritage Silk Enclave", line2: "Varanasi, Uttar Pradesh – 221001" },
        timeline: [
            { label: "Order Confirmed", date: "14 June 2026", done: true },
            { label: "Packed & Dispatched", date: "16 June 2026", done: true },
            { label: "Out for Delivery", date: "20 June 2026", done: true },
            { label: "Delivered", date: "20 June 2026", done: true },
        ],
    },
    "IND-872911": {
        id: "IND-872911",
        orderDate: "14 June 2026",
        deliveryDate: "29 July 2026",
        status: "Processing",
        itemTitle: "Ethnic Salwar Suit",
        itemImage: "/products/product-clt/Salwar.png",
        listingPrice: "£ 7,800",
        itemPrice: "£ 6,500",
        fees: "£ 400",
        total: "£ 6,500",
        itemSize: "M",
        brand: "Artisan Loom",
        category: "Salwar Suit · Cotton Silk · Yellow",
        seller: "Artisan Loom Handweaves",
        paymentMethod: "UPI",
        address: { name: "IndiNest Member", phone: "+91 98765 43210", line1: "B-402, Heritage Silk Enclave", line2: "Varanasi, Uttar Pradesh – 221001" },
        timeline: [
            { label: "Order Confirmed", date: "14 June 2026", done: true },
            { label: "Packed & Dispatched", date: "Expected 27 July 2026", done: false },
            { label: "Out for Delivery", date: "Expected 29 July 2026", done: false },
            { label: "Delivered", date: "Expected 29 July 2026", done: false },
        ],
    },
};

const statusMeta: Record<OrderDetail["status"], { dot: string; label: string }> = {
    Delivered: { dot: "bg-emerald-500", label: "Delivered" },
    "In Transit": { dot: "bg-amber-500", label: "In Transit" },
    Processing: { dot: "bg-amber-500", label: "Processing" },
};

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function OrderDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const order = orderDatabase[id];

    /* 404 state */
    if (!order) {
        return (
            <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center py-24 text-center px-5">
                    <div className="text-[#010526]/60 mb-6"><ShoppingBag size={64} strokeWidth={1} /></div>
                    <h2 className="text-2xl uppercase tracking-widest font-light text-[#010526] mb-3">
                        Order Not Found
                    </h2>
                    <p className="text-sm font-sans text-[#010526]/80 mb-8">#{id}</p>
                    <Link
                        href="/profile?tab=orders"
                        className="px-8 py-4 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        Back to Orders
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const meta = statusMeta[order.status];

    return (
        <div className="flex flex-col min-h-screen w-full bg-white text-[#010526] font-serif">
            <Header />

            {/* Breadcrumb — same component & style as product pages */}
            <Breadcrumbs
                crumbs={[
                    { label: "Home", href: "/" },
                    { label: "My Account", href: "/profile" },
                    { label: "My Orders", href: "/profile?tab=orders" },
                    { label: order.id },
                ]}
            />

            <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* ── LEFT: product card + timeline ──────────────────── */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-6">

                        {/* Page heading — mirrors cart heading style */}
                        <div className="mb-2">
                            <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider text-[#010526] flex items-center gap-3">
                                <ShoppingBag size={36} strokeWidth={1.5} />
                                Order Details
                            </h1>
                            <p className="mt-2 font-sans text-xs text-[#010526]/80">
                                Order #{order.id} · Placed on {order.orderDate}
                            </p>
                        </div>

                        {/* Product row — matches cart item row styling */}
                        <div className="flex gap-4 md:gap-6 py-6 border-b border-[#010526]/10">
                            {/* Image */}
                            <div className="relative w-24 h-32 md:w-32 md:h-44 flex-shrink-0 bg-[#010526]/5 overflow-hidden">
                                <Image
                                    src={order.itemImage}
                                    alt={order.itemTitle}
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/75">
                                                {order.brand}
                                            </p>
                                            <h2 className="text-base md:text-2xl font-medium text-[#010526] mt-1">
                                                {order.itemTitle}
                                            </h2>
                                        </div>
                                        <p className="text-base md:text-xl font-bold text-[#010526] flex-shrink-0">
                                            {order.total}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-[#010526]/80 font-sans">
                                        <span>{order.category}</span>
                                        {order.itemSize && (
                                            <span className="border-l border-[#010526]/10 pl-4">
                                                Size: <strong className="text-[#010526] font-bold">{order.itemSize}</strong>
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-sans text-xs text-[#010526]/75 mt-1.5">
                                        Sold by: {order.seller}
                                    </p>
                                </div>

                                {/* Status chip */}
                                <div className="flex items-center gap-2 mt-4">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                                    <span className="font-sans text-sm font-semibold text-[#010526]">{meta.label}</span>
                                    <span className="font-sans text-sm font-semibold text-[#010526]/75">
                                        · {order.status === "Delivered" ? "Delivered" : "Arriving"} {order.deliveryDate}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="flex flex-col gap-0 py-4">
                            <h3 className="text-xs uppercase tracking-widest font-sans font-bold text-[#010526]/75 mb-5">
                                Shipment Updates
                            </h3>
                            {order.timeline.map((step, idx) => {
                                const isLast = idx === order.timeline.length - 1;
                                return (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center flex-shrink-0">
                                            {step.done
                                                ? <CheckCircle2 size={20} className="text-emerald-600" />
                                                : <Circle size={20} className="text-[#010526]/20" />
                                            }
                                            {!isLast && (
                                                <div
                                                    className={`w-px my-1 ${step.done ? "bg-emerald-300" : "bg-[#010526]/10"}`}
                                                    style={{ minHeight: "28px" }}
                                                />
                                            )}
                                        </div>
                                        <div className="pb-5 font-sans">
                                            <p className={`text-sm font-semibold ${step.done ? "text-[#010526]" : "text-[#010526]/65"}`}>
                                                {step.label}
                                            </p>
                                            <p className={`text-xs mt-0.5 ${step.done ? "text-[#010526]/80" : "text-[#010526]/60"}`}>
                                                {step.date}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Back link */}
                        <Link
                            href="/profile?tab=orders"
                            className="font-sans text-xs uppercase tracking-widest font-bold text-[#010526]/75 hover:text-[#010526] transition-colors flex items-center gap-1.5 mt-2"
                        >
                            ← Back to My Orders
                        </Link>
                    </div>

                    {/* ── RIGHT: summary panel — mirrors cart Order Summary ── */}
                    <div className="w-full lg:w-[35%] bg-[#010526]/[0.02] p-6 md:p-8 flex flex-col gap-6 lg:sticky lg:top-10">

                        <h2 className="text-xl uppercase tracking-wider font-light text-[#010526] pb-4 border-b border-[#010526]/10">
                            Order Summary
                        </h2>

                        {/* Price breakdown */}
                        <div className="flex flex-col gap-3 font-sans text-sm text-[#010526]/85">
                            <div className="flex justify-between">
                                <span>Listing Price</span>
                                <span className={order.listingPrice !== order.itemPrice ? "line-through text-[#010526]/65" : "font-semibold text-[#010526]"}>
                                    {order.listingPrice}
                                </span>
                            </div>

                            {order.listingPrice !== order.itemPrice && (
                                <div className="flex justify-between">
                                    <span>Special Price</span>
                                    <span className="font-semibold text-emerald-600">{order.itemPrice}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span className="font-semibold text-[#010526]">{order.fees}</span>
                            </div>

                            <div className="border-t border-[#010526]/10 pt-4 mt-2 flex justify-between text-base md:text-lg font-serif text-[#010526]">
                                <span className="uppercase tracking-wider">Total</span>
                                <span className="font-bold text-xl">{order.total}</span>
                            </div>

                            <div className="flex justify-between text-xs pt-1 border-t border-[#010526]/10">
                                <span className="text-[#010526]/80">Paid by</span>
                                <span className="font-semibold text-[#010526]">{order.paymentMethod}</span>
                            </div>
                        </div>

                        {/* Delivery address */}
                        <div className="flex flex-col gap-3 border-t border-[#010526]/10 pt-5 font-sans text-sm">
                            <p className="text-xs uppercase tracking-widest font-bold text-[#010526]/75">Delivery Address</p>

                            <div className="flex items-start gap-2.5">
                                <Home size={14} className="text-[#010526]/65 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-[#010526]">{order.address.line1}</p>
                                    <p className="text-xs text-[#010526]/85 mt-0.5">{order.address.line2}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <User size={14} className="text-[#010526]/65 flex-shrink-0" />
                                <p className="text-[#010526]">{order.address.name}</p>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone size={14} className="text-[#010526]/65 flex-shrink-0" />
                                <p className="text-[#010526]">{order.address.phone}</p>
                            </div>
                        </div>

                        {/* Download Invoice CTA — mirrors cart's Secure Checkout button */}
                        <button
                            type="button"
                            className="w-full py-4 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#010526]/10"
                        >
                            <Download size={14} />
                            Download Invoice
                        </button>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
