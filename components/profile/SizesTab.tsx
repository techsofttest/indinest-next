"use client";

import React, { useState } from "react";
import { Ruler, Save, Check } from "lucide-react";

export default function SizesTab() {
    const [topSize, setTopSize] = useState("M");
    const [blouseSize, setBlouseSize] = useState("36");
    const [shoeSize, setShoeSize] = useState("UK 6");
    const [savedNotice, setSavedNotice] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    return (
        <div className="flex flex-col gap-6 font-sans">
            <div>
                <h2 className="text-2xl font-serif font-normal text-[#010526]">Your Sizes & Preferences</h2>
                <p className="text-xs text-[#010526]/60 mt-1">
                    Save your standard clothing and footwear sizes for tailored recommendations.
                </p>
            </div>

            {savedNotice && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 text-xs font-semibold">
                    <Check size={16} />
                    Size preferences saved!
                </div>
            )}

            <form onSubmit={handleSave} className="bg-[#010526]/[0.015] p-6 sm:p-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                            Ethnic Top / Kurta Size
                        </label>
                        <select
                            value={topSize}
                            onChange={(e) => setTopSize(e.target.value)}
                            className="w-full bg-white border border-[#010526]/15 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                        >
                            <option value="XS">XS (Extra Small)</option>
                            <option value="S">S (Small)</option>
                            <option value="M">M (Medium)</option>
                            <option value="L">L (Large)</option>
                            <option value="XL">XL (Extra Large)</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                            Saree Blouse Size (Bust)
                        </label>
                        <select
                            value={blouseSize}
                            onChange={(e) => setBlouseSize(e.target.value)}
                            className="w-full bg-white border border-[#010526]/15 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                        >
                            <option value="32">32 inches</option>
                            <option value="34">34 inches</option>
                            <option value="36">36 inches</option>
                            <option value="38">38 inches</option>
                            <option value="40">40 inches</option>
                            <option value="42">42 inches</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                            Footwear Size
                        </label>
                        <select
                            value={shoeSize}
                            onChange={(e) => setShoeSize(e.target.value)}
                            className="w-full bg-white border border-[#010526]/15 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                        >
                            <option value="UK 4">UK 4 / Euro 37</option>
                            <option value="UK 5">UK 5 / Euro 38</option>
                            <option value="UK 6">UK 6 / Euro 39</option>
                            <option value="UK 7">UK 7 / Euro 40</option>
                            <option value="UK 8">UK 8 / Euro 41</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="self-start inline-flex items-center gap-2 bg-[#010526] text-white text-xs font-semibold px-6 py-3 transition-all hover:bg-[#010526]/90 cursor-pointer"
                >
                    <Save size={14} />
                    Save Size Profile
                </button>
            </form>
        </div>
    );
}
