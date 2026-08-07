"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight } from "lucide-react";

interface Order {
    id: string;
    orderDate: string;
    deliveryDate: string;
    status: "Delivered" | "In Transit" | "Processing";
    itemTitle: string;
    itemImage: string;
    itemPrice: string;
    itemSize?: string;
    brand: string;
    category: string;
}

// Each product purchased individually — direct buy, no cart
const mockOrders: Order[] = [
    {
        id: "IND-894201",
        orderDate: "22 July 2026",
        status: "In Transit",
        deliveryDate: "28 July 2026",
        itemTitle: "Heritage Sherwani",
        itemImage: "/products/men/sherwani/sherwani1/sherwani1.jpg",
        itemPrice: "£ 32,000",
        itemSize: "L",
        brand: "Royal Crafts",
        category: "Sherwani · Silk · Ivory",
    },
    {
        id: "IND-894202",
        orderDate: "22 July 2026",
        status: "Delivered",
        deliveryDate: "25 July 2026",
        itemTitle: "Men's Temple Necklace",
        itemImage: "/products/men/necklace/men-necklace/men-necklace.jpg",
        itemPrice: "£ 7,200",
        itemSize: "Adjustable",
        brand: "Kundan Arts",
        category: "Jewellery · Gold Plated",
    },
    {
        id: "IND-872910",
        orderDate: "14 June 2026",
        status: "Delivered",
        deliveryDate: "20 June 2026",
        itemTitle: "Party Wear Saree",
        itemImage: "/products/product-clt/Party Wear Saree.png",
        itemPrice: "£ 18,900",
        itemSize: "Free Size",
        brand: "Regal Weaves",
        category: "Saree · Silk · Pink",
    },
    {
        id: "IND-872911",
        orderDate: "14 June 2026",
        status: "Processing",
        deliveryDate: "29 July 2026",
        itemTitle: "Ethnic Salwar Suit",
        itemImage: "/products/product-clt/Salwar.png",
        itemPrice: "£ 6,500",
        itemSize: "M",
        brand: "Artisan Loom",
        category: "Salwar Suit · Cotton Silk · Yellow",
    },
];

const statusInfo = {
    Delivered: { text: "Delivered on", color: "bg-emerald-500" },
    "In Transit": { text: "Arriving on", color: "bg-amber-500" },
    Processing: { text: "Arriving on", color: "bg-amber-500" },
} as const;

export default function OrdersTab() {
    const [filter, setFilter] = useState<"all" | "in-transit" | "delivered">("all");

    const filteredOrders = mockOrders.filter((o) => {
        if (filter === "in-transit") return o.status === "In Transit" || o.status === "Processing";
        if (filter === "delivered") return o.status === "Delivered";
        return true;
    });

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-normal text-[#010526]">Order History</h2>
                {/* <p className="text-sm text-[#010526]/80 mt-1 leading-relaxed">
                    Every item you purchased directly. Each order is placed as a single product.
                </p> */}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2">
                {(["all", "in-transit", "delivered"] as const).map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 text-xs font-semibold capitalize tracking-wide transition-all ${filter === f
                            ? "bg-[#010526] text-white shadow-sm"
                            : "bg-[#010526]/[0.06] text-[#010526]/80 hover:bg-[#010526]/10 hover:text-[#010526]"
                            }`}
                    >
                        {f === "all" ? `All (${mockOrders.length})` : f.replace("-", " ")}
                    </button>
                ))}
            </div>

            {/* Order list */}
            {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-[#010526]/[0.02] text-center gap-2">
                    <Package size={36} className="text-[#010526]/25 stroke-[1.2]" />
                    <p className="text-sm font-semibold text-[#010526]/90">No orders found</p>
                    <p className="text-xs text-[#010526]/70">Nothing in this category yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredOrders.map((order) => (
                        <Link
                            href={`/orders/${order.id}`}
                            key={order.id}
                            className="group flex flex-col p-5 border border-[#010526]/10 hover:border-[#010526]/60 bg-white transition-all"
                        >
                            <div className="flex items-start gap-4">
                                {/* Product image */}
                                <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-[#010526]/[0.03]">
                                    <Image
                                        src={order.itemImage}
                                        alt={order.itemTitle}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Product info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] uppercase tracking-widest text-[#010526]/60 mb-0.5">
                                        {order.brand}
                                    </p>
                                    <h3 className="text-base font-semibold text-[#010526] leading-snug group-hover:text-black">
                                        {order.itemTitle}
                                    </h3>
                                    <p className="text-xs text-[#010526]/70 mt-0.5 truncate">{order.category}</p>
                                    {order.itemSize && (
                                        <p className="text-xs text-[#010526]/70 mt-0.5">Size: {order.itemSize}</p>
                                    )}
                                    <span className="text-base font-semibold text-[#010526] mt-2 block">
                                        {order.itemPrice}
                                    </span>
                                </div>
                            </div>

                            {/* Footer: status + view button */}
                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#010526]/10">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${statusInfo[order.status].color}`} />
                                    <span className="text-xs font-semibold text-[#010526]/90">
                                        {statusInfo[order.status].text} {order.deliveryDate}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#010526]/50 group-hover:text-[#010526] transition-colors">
                                    View <ArrowRight size={12} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
