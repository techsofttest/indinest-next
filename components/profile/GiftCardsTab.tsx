"use client";

import React, { useState } from "react";
import { Gift, Plus, Sparkles, Check } from "lucide-react";

export default function GiftCardsTab() {
    const [cardCode, setCardCode] = useState("");
    const [balance, setBalance] = useState("₹0.00");
    const [appliedNotice, setAppliedNotice] = useState(false);

    const handleClaim = (e: React.FormEvent) => {
        e.preventDefault();
        if (cardCode.trim()) {
            setBalance("₹2,500.00");
            setAppliedNotice(true);
            setCardCode("");
            setTimeout(() => setAppliedNotice(false), 4000);
        }
    };

    return (
        <div className="flex flex-col gap-6 font-sans">
            <div>
                <h2 className="text-2xl font-serif font-normal text-[#010526]">Gift Cards & Vouchers</h2>
                <p className="text-xs text-[#010526]/60 mt-1">
                    Redeem IndiNest gift cards or view available shopping credits.
                </p>
            </div>

            {/* Balance Banner */}
            <div className="bg-gradient-to-r from-[#010526] via-[#151f54] to-[#25368a] text-white p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div>
                    <span className="text-xs text-white/60 uppercase tracking-widest block font-medium">
                        Total Gift Card Balance
                    </span>
                    <span className="text-3xl font-serif font-normal text-white mt-1 block">{balance}</span>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 bg-white text-[#010526] text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs hover:bg-white/90 transition-all"
                >
                    <Sparkles size={14} />
                    Buy Gift Card
                </button>
            </div>

            {appliedNotice && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl text-xs font-semibold">
                    <Check size={16} />
                    Gift voucher successfully redeemed! ₹2,500 added to your account balance.
                </div>
            )}

            {/* Redeem Form */}
            <div className="bg-[#010526]/[0.015] p-6 sm:p-8 rounded-2xl border border-[#010526]/5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-[#010526] uppercase tracking-wider">
                    Redeem a Gift Card
                </h3>
                <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={cardCode}
                        onChange={(e) => setCardCode(e.target.value)}
                        placeholder="Enter 16-digit gift card code"
                        className="flex-1 bg-white border border-[#010526]/15 rounded-xl px-4 py-2.5 text-sm text-[#010526] font-mono tracking-widest focus:outline-none focus:border-[#010526]"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-[#010526] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all hover:bg-[#010526]/90 cursor-pointer"
                    >
                        Redeem Code
                    </button>
                </form>
            </div>
        </div>
    );
}
