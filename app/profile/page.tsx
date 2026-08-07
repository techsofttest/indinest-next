"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import ProfileSidebar, { ProfileTab } from "@/components/profile/ProfileSidebar";
import OverviewTab from "@/components/profile/OverviewTab";
import OrdersTab from "@/components/profile/OrdersTab";
import PersonalDetailsTab from "@/components/profile/PersonalDetailsTab";
import AddressesTab from "@/components/profile/AddressesTab";

// 1. Extract the main logic into a child component
function ProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [userName, setUserName] = useState("IndiNest Member");
    const [userEmail, setUserEmail] = useState("member@indinest.com");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
            setUserName(localStorage.getItem("userName") || "IndiNest Member");
            setUserEmail(localStorage.getItem("userEmail") || "member@indinest.com");
        } else {
            router.push("/");
        }

        const tabFromUrl = searchParams.get("tab") as ProfileTab | null;
        if (tabFromUrl) setActiveTab(tabFromUrl);
    }, [router, searchParams]);

    const handleSelectTab = (tab: ProfileTab) => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set("tab", tab);
        window.history.pushState({}, "", url.toString());
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
    };

    if (!isLoggedIn) return null;

    return (
        <div className="flex flex-col min-h-screen w-full bg-white text-[#010526]">
            <Header />

            <main className="flex-1 w-full max-w-[1240px] mx-auto px-5 md:px-10 py-10 md:py-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
                    {/* Sidebar */}
                    <div className="md:col-span-3 md:sticky md:top-10">
                        <ProfileSidebar
                            activeTab={activeTab}
                            onSelectTab={handleSelectTab}
                            onLogout={handleLogout}
                        />
                    </div>

                    {/* Tab content */}
                    <div className="md:col-span-9">
                        {activeTab === "overview" && (
                            <OverviewTab
                                userName={userName}
                                userEmail={userEmail}
                                onSelectTab={handleSelectTab}
                            />
                        )}
                        {activeTab === "orders" && <OrdersTab />}
                        {activeTab === "personal-details" && (
                            <PersonalDetailsTab
                                userName={userName}
                                userEmail={userEmail}
                                onUpdateInfo={(name, email) => {
                                    setUserName(name);
                                    setUserEmail(email);
                                }}
                            />
                        )}
                        {activeTab === "addresses" && <AddressesTab />}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// 2. Wrap the child component in a Suspense boundary in the default export
export default function ProfilePage() {
    return (
        <Suspense 
            fallback={
                <div className="min-h-screen w-full flex flex-col bg-white">
                    <Header />
                    <div className="flex-1 flex items-center justify-center text-xs uppercase tracking-widest text-[#010526]/60">
                        Loading Profile...
                    </div>
                    <Footer />
                </div>
            }
        >
            <ProfileContent />
        </Suspense>
    );
}