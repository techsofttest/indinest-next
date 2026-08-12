"use client";

import React, { useState } from "react";
import { Lock, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import AnimatedCheckIcon from "../common/AnimatedCheckIcon";
import { apiUrl } from "@/lib/api";

export default function ChangePasswordTab() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successNotice, setSuccessNotice] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessNotice(false);

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("You must be logged in to change your password.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(apiUrl("/api/customer/change-password"), {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to update password.");
            } else {
                setSuccessNotice(true);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => setSuccessNotice(false), 4000);
            }
        } catch (err) {
            console.error("Change password error:", err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-serif font-normal text-[#010526]">Change Password</h2>
                <p className="text-sm text-[#010526]/70 mt-1 leading-relaxed">
                    Update your account security details here.
                </p>
            </div>

            {/* Toast Notification */}
            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white border border-black/20 px-5 py-3 shadow-lg text-sm font-semibold transition-all duration-300 z-[999] ${successNotice ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                <AnimatedCheckIcon size={24} />
                <span className="text-[#010526]">
                    Your password was updated successfully!
                </span>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-8 mt-6 max-w-xl">
                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs px-4 py-3 rounded-none">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-3.5 text-[#010526]/40" />
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-[#010526]/15 pl-10 pr-12 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                                required
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
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-3.5 text-[#010526]/40" />
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                className="w-full bg-white border border-[#010526]/15 pl-10 pr-12 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                                required
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

                    <div>
                        <label className="block text-xs font-semibold text-[#010526]/70 uppercase tracking-wider mb-2">
                            Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-3.5 text-[#010526]/40" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                className="w-full bg-white border border-[#010526]/15 pl-10 pr-12 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-3.5 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="self-start inline-flex items-center gap-2 bg-[#010526] text-white text-xs font-semibold px-6 py-3 transition-all hover:bg-[#010526]/90 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                    {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Save size={14} />
                    )}
                    Change Password
                </button>
            </form>
        </div>
    );
}
