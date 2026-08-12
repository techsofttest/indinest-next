"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ProfileSidebar, { ProfileTab } from "@/components/profile/ProfileSidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const loggedIn = localStorage.getItem("isLoggedIn") === "true";
            setIsLoggedIn(loggedIn);
            setLoading(false);
            if (!loggedIn) {
                router.push("/");
            }
        };

        checkAuth();

        window.addEventListener("auth-change", checkAuth);
        return () => {
            window.removeEventListener("auth-change", checkAuth);
        };
    }, [router]);

    const handleLogout = async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                // Call logout API to revoke token
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/customer/logout`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
            } catch (err) {
                console.error("Logout API call failed:", err);
            }
        }
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("authToken");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
    };

    // Determine active tab based on pathname
    let activeTab: ProfileTab = "overview";
    if (pathname.includes("/profile/orders")) activeTab = "orders";
    else if (pathname.includes("/profile/change-password")) activeTab = "change-password";
    else if (pathname.includes("/profile/addresses")) activeTab = "addresses";
    else if (pathname.includes("/profile/wishlist")) activeTab = "wishlist";

    if (loading || !isLoggedIn) {
        return (
            <div className="min-h-screen w-full flex flex-col bg-white">
                <Header />
                <div className="flex-1 flex items-center justify-center text-xs uppercase tracking-widest text-[#010526]/60">
                    Loading Profile...
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-white text-[#010526]">
            <Header />

            <main className="flex-1 w-full max-w-[1240px] mx-auto px-5 md:px-10 py-10 md:py-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
                    {/* Sidebar */}
                    <div className="md:col-span-3 md:sticky md:top-10">
                        <ProfileSidebar
                            activeTab={activeTab}
                            onLogout={handleLogout}
                        />
                    </div>

                    {/* Page Content */}
                    <div className="md:col-span-9">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
