"use client";

import React from "react";
import { Crown, Sparkles, Truck, Gift, Zap, ShieldCheck } from "lucide-react";

export default function PlusMembershipTab() {
    return (
        <div className="flex flex-col gap-6 font-sans">
            {/* Main Plus Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#010526] via-[#101944] to-[#1c2a68] text-white p-8 md:p-10 shadow-md">
                <div className="flex justify-between items-start z-10 relative">
                    <div>
                        <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 mb-3">
                            <Crown size={13} />
                            IndiNest Plus Member
                        </span>
                        <h2 className="text-3xl font-serif font-normal text-white">Your Plus Balance</h2>
                        <p className="text-white/70 text-xs mt-1">Earn points on every handloom & artisanal luxury purchase.</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-center">
                        <span className="text-2xl font-bold font-mono text-amber-300">0 P</span>
                        <span className="block text-[10px] text-white/60 uppercase tracking-widest mt-0.5">Points</span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center z-10 relative">
                    <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-sm font-semibold text-white">Early Access</span>
                        <span className="block text-[11px] text-white/60 mt-0.5">To seasonal sales</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-sm font-semibold text-white">Double Points</span>
                        <span className="block text-[11px] text-white/60 mt-0.5">On silk collections</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-sm font-semibold text-white">Priority Service</span>
                        <span className="block text-[11px] text-white/60 mt-0.5">24/7 VIP Concierge</span>
                    </div>
                </div>
            </div>

            {/* Benefits List */}
            <div className="mt-2">
                <h3 className="text-lg font-serif font-normal text-[#010526] mb-4">Membership Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-4 p-4 rounded-xl bg-[#010526]/[0.02] border border-[#010526]/5">
                        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 h-fit">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-[#010526]">Exclusive Product Drops</h4>
                            <p className="text-xs text-[#010526]/60 mt-1">First access to limited artisan collaborations and heirloom saree releases.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl bg-[#010526]/[0.02] border border-[#010526]/5">
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 h-fit">
                            <Gift size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-[#010526]">Birthday Vouchers</h4>
                            <p className="text-xs text-[#010526]/60 mt-1">Enjoy a special ₹2,000 anniversary reward on your birth month.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl bg-[#010526]/[0.02] border border-[#010526]/5">
                        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 h-fit">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-[#010526]">Extended 30-Day Returns</h4>
                            <p className="text-xs text-[#010526]/60 mt-1">Extra peace of mind with hassle-free doorstep return pickup.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
