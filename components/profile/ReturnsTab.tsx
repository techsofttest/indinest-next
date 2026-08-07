"use client";

import React, { useState } from "react";
import { RotateCcw, Package, CheckCircle, ArrowRight, HelpCircle } from "lucide-react";

interface ReturnsTabProps {
    mode: "return-item" | "returns-status";
}

export default function ReturnsTab({ mode }: ReturnsTabProps) {
    const [selectedOrder, setSelectedOrder] = useState("");
    const [returnReason, setReturnReason] = useState("");

    return (
        <div className="flex flex-col gap-6 font-sans">
            <div>
                <h2 className="text-2xl font-serif font-normal text-[#010526]">
                    {mode === "return-item" ? "Return an Item" : "Returns Status"}
                </h2>
                <p className="text-xs text-[#010526]/60 mt-1">
                    {mode === "return-item"
                        ? "Initiate a quick doorstep return pickup for eligible purchased items."
                        : "Track real-time progress and refund status of your returned products."}
                </p>
            </div>

            {mode === "return-item" ? (
                <div className="bg-[#010526]/[0.015] p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-[#010526] uppercase tracking-wider mb-2">
                            Select Order to Return
                        </label>
                        <select
                            value={selectedOrder}
                            onChange={(e) => setSelectedOrder(e.target.value)}
                            className="w-full bg-white border border-[#010526]/15 rounded-xl px-4 py-3 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                        >
                            <option value="">-- Select recent eligible order --</option>
                            <option value="IND-894201">Order #IND-894201 (Plated Banarasi Saree & Diya Set - ₹18,500)</option>
                            <option value="IND-872910">Order #IND-872910 (Artisanal Terracotta Lamp - ₹8,490)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#010526] uppercase tracking-wider mb-2">
                            Reason for Return
                        </label>
                        <select
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            className="w-full bg-white border border-[#010526]/15 rounded-xl px-4 py-3 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                        >
                            <option value="">-- Choose reason --</option>
                            <option value="size">Size / Fit issue</option>
                            <option value="quality">Quality didn't meet expectation</option>
                            <option value="damaged">Damaged or defective item</option>
                            <option value="different">Received wrong product</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#010526] uppercase tracking-wider mb-2">
                            Additional Comments (Optional)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Tell us more about why you're returning this item..."
                            className="w-full bg-white border border-[#010526]/15 rounded-xl p-4 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                        />
                    </div>

                    <button
                        type="button"
                        disabled={!selectedOrder || !returnReason}
                        className="self-start inline-flex items-center gap-2 bg-[#010526] text-white text-xs font-semibold px-6 py-3 rounded-xl disabled:opacity-40 transition-all hover:bg-[#010526]/90 cursor-pointer"
                    >
                        Request Return Pickup
                        <ArrowRight size={14} />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-[#010526]/[0.015] rounded-2xl">
                    <RotateCcw size={40} className="text-[#010526]/30 mb-3 stroke-[1.2]" />
                    <p className="text-sm font-semibold text-[#010526]">No active returns</p>
                    <p className="text-xs text-[#010526]/60 mt-1 max-w-xs">
                        You currently don't have any pending returns or refunds in processing.
                    </p>
                </div>
            )}
        </div>
    );
}
