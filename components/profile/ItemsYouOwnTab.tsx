"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";

// Real products from the project
const purchasedItems = [
    {
        id: "p1",
        title: "Heritage Sherwani",
        brand: "Royal Crafts",
        category: "Sherwani · Silk · Ivory",
        price: "£ 32,000",
        image: "/products/men/sherwani/sherwani1/sherwani1.jpg",
        purchasedOn: "22 July 2026",
        rating: 5,
    },
    {
        id: "p2",
        title: "Men's Temple Necklace",
        brand: "Kundan Arts",
        category: "Jewellery · Gold Plated",
        price: "£ 7,200",
        image: "/products/men/necklace/men-necklace/men-necklace.jpg",
        purchasedOn: "22 July 2026",
        rating: 5,
    },
    {
        id: "p3",
        title: "Party Wear Saree",
        brand: "Regal Weaves",
        category: "Saree · Silk · Pink",
        price: "£ 18,900",
        image: "/products/product-clt/Party Wear Saree.png",
        purchasedOn: "14 June 2026",
        rating: 4,
    },
    {
        id: "p4",
        title: "Ethnic Salwar Suit",
        brand: "Artisan Loom",
        category: "Salwar Suit · Cotton Silk · Yellow",
        price: "£ 6,500",
        image: "/products/product-clt/Salwar.png",
        purchasedOn: "14 June 2026",
        rating: 4,
    },
    {
        id: "p5",
        title: "Heritage Sunglasses",
        brand: "Artisan Optics",
        category: "Accessory · Metal · Tortoise",
        price: "£ 2,800",
        image: "/products/men/glass/sunglasses1/sunglasses1.jpg",
        purchasedOn: "22 July 2026",
        rating: 4,
    },
];

export default function ItemsYouOwnTab() {
    const [ratings, setRatings] = useState<Record<string, number>>(
        Object.fromEntries(purchasedItems.map((p) => [p.id, p.rating]))
    );

    return (
        <div className="flex flex-col gap-8 font-sans">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-serif font-normal text-[#010526]">My Purchases</h2>
                <p className="text-sm text-[#010526]/55 mt-1 leading-relaxed">
                    Your complete wardrobe history from IndiNest — luxury ethnic fashion and accessories.
                </p>
            </div>

            {purchasedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-[#010526]/[0.02] text-center gap-2">
                    <ShoppingBag size={36} className="text-[#010526]/25 stroke-[1.2]" />
                    <p className="text-sm font-semibold text-[#010526]">No purchases yet</p>
                    <p className="text-xs text-[#010526]/50">Items you purchase will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {purchasedItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-4 border border-[#010526]/8 hover:border-[#010526]/18 bg-white hover:shadow-sm transition-all"
                        >
                            {/* Image */}
                            <div className="relative w-20 h-24 overflow-hidden bg-gray-50 flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex flex-col justify-between flex-1 min-w-0">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#010526]/40 mb-0.5">
                                        {item.brand}
                                    </p>
                                    <h4 className="text-sm font-semibold text-[#010526] leading-snug">
                                        {item.title}
                                    </h4>
                                    <p className="text-[11px] text-[#010526]/50 mt-0.5 truncate">
                                        {item.category}
                                    </p>
                                </div>

                                <div className="mt-2">
                                    {/* Star rating */}
                                    <div className="flex items-center gap-0.5 mb-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    setRatings((prev) => ({ ...prev, [item.id]: star }))
                                                }
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    size={13}
                                                    className={
                                                        star <= ratings[item.id]
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-[#010526]/15"
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-[#010526]">{item.price}</span>
                                        <span className="text-[10px] text-[#010526]/40">{item.purchasedOn}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
