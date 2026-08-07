"use client";

import React, { useState } from "react";
import { Mail, Bell, Sparkles } from "lucide-react";

export default function NewslettersTab() {
    const [weeklyDigest, setWeeklyDigest] = useState(true);
    const [exclusiveOffers, setExclusiveOffers] = useState(true);
    const [artisanStories, setArtisanStories] = useState(false);

    return (
        <div className="flex flex-col gap-6 font-sans">
            <div>
                <h2 className="text-2xl font-serif font-normal text-[#010526]">Newsletters & Notifications</h2>
                <p className="text-xs text-[#010526]/60 mt-1">
                    Choose what emails and updates you'd like to receive from IndiNest.
                </p>
            </div>

            <div className="bg-[#010526]/[0.015] p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
                {/* Toggle 1 */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#010526]/10">
                    <div>
                        <h4 className="text-sm font-semibold text-[#010526]">Weekly Editorial & New Arrivals</h4>
                        <p className="text-xs text-[#010526]/60 mt-0.5">
                            Curated newsletters showcasing latest saree weaves and home decor trends.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setWeeklyDigest(!weeklyDigest)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            weeklyDigest ? "bg-[#010526]" : "bg-[#010526]/20"
                        }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                                weeklyDigest ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#010526]/10">
                    <div>
                        <h4 className="text-sm font-semibold text-[#010526]">Exclusive Member Offers & Vouchers</h4>
                        <p className="text-xs text-[#010526]/60 mt-0.5">
                            Notifications about festive flash sales and personalized discount codes.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setExclusiveOffers(!exclusiveOffers)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            exclusiveOffers ? "bg-[#010526]" : "bg-[#010526]/20"
                        }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                                exclusiveOffers ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-[#010526]">Artisan Stories & Weaver Interviews</h4>
                        <p className="text-xs text-[#010526]/60 mt-0.5">
                            Deep-dive articles about traditional Indian craft clusters and master weavers.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setArtisanStories(!artisanStories)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                            artisanStories ? "bg-[#010526]" : "bg-[#010526]/20"
                        }`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                                artisanStories ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
