"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Save, Eye, EyeOff } from "lucide-react";
import AnimatedCheckIcon from "../common/AnimatedCheckIcon";
import { PhoneInput, defaultCountries } from "react-international-phone";
import "react-international-phone/style.css";

interface PersonalDetailsTabProps {
    userName: string;
    userEmail: string;
    onUpdateInfo: (name: string, email: string) => void;
}

export default function PersonalDetailsTab({
    userName,
    userEmail,
    onUpdateInfo,
}: PersonalDetailsTabProps) {
    const [name, setName] = useState(userName);
    const [email, setEmail] = useState(userEmail);
    const [phone, setPhone] = useState("+44 20 7925 0918");
    const [savedNotice, setSavedNotice] = useState(false);

    // State for password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateInfo(name, email);
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    // Update local state if props change (e.g., after a successful update from another tab)
    useEffect(() => {
        setName(userName);
        setEmail(userEmail);
    }, [userName, userEmail]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-serif font-normal text-[#010526]">Personal Details</h2>
                {/* <p className="text-sm text-[#010526]/70 mt-1 leading-relaxed">
                    Manage your name, email address, phone number, and login password.
                </p> */}
            </div>

            {/* Toast Notification - Adjusted z-index for highest visibility */}
            <div key={savedNotice ? 'visible' : 'hidden'} className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white border border-black/20 px-5 py-3 shadow-lg text-sm font-semibold transition-all duration-300 z-[999] ${savedNotice ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                <AnimatedCheckIcon size={24} />
                <span className="text-[#010526]">
                    Your personal information was updated successfully!
                </span>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-12 mt-6">
                <div className="flex flex-col gap-5">
                    <h3 className="text-sm font-semibold text-[#010526] uppercase tracking-wider border-b border-[#010526]/10 pb-3">
                        Account Holder
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-3.5 text-[#010526]/40" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white border border-[#010526]/15 pl-10 pr-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-3.5 text-[#010526]/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-[#010526]/15 pl-10 pr-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                                Mobile Phone Number (Optional)
                            </label>
                            <PhoneInput
                                defaultCountry="gb"
                                countries={defaultCountries.filter((c) => ["gb", "ie", "de"].includes(c[1]))}
                                value={phone}
                                onChange={(phone) => setPhone(phone)}
                                style={{ '--react-international-phone-border-radius': '0' } as React.CSSProperties}
                                inputClassName="w-full !bg-transparent !border-l-0 !text-sm !font-sans !text-[#010526] focus:!outline-none !rounded-none"
                                className="[&.react-international-phone-input-container]:border [&.react-international-phone-input-container]:border-[#010526]/15 focus-within:[&.react-international-phone-input-container]:border-[#010526] [&.react-international-phone-input-container]:rounded-none bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Password Section */}
                <div className="flex flex-col gap-5">
                    <h3 className="text-sm font-semibold text-[#010526] uppercase tracking-wider border-b border-[#010526]/10 pb-3">
                        Security & Password
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-3.5 text-[#010526]/40" />
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-[#010526]/15 pl-10 pr-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3.5 top-3.5 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-3.5 text-[#010526]/40" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="w-full bg-white border border-[#010526]/15 pl-10 pr-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3.5 top-3.5 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="self-start inline-flex items-center gap-2 bg-[#010526] text-white text-xs font-semibold px-6 py-3 transition-all hover:bg-[#010526]/90 cursor-pointer shadow-xs"
                >
                    <Save size={14} />
                    Save Changes
                </button>
            </form>
        </div>
    );
}
