"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OverviewTab from "@/components/profile/OverviewTab";

export default function ProfilePage() {
    const router = useRouter();
    const [userName, setUserName] = useState("IndiNest Member");
    const [userEmail, setUserEmail] = useState("member@indinest.com");

    useEffect(() => {
        setUserName(localStorage.getItem("userName") || "IndiNest Member");
        setUserEmail(localStorage.getItem("userEmail") || "member@indinest.com");
    }, []);

    const handleSelectTab = (tab: string) => {
        const tabRoutes: Record<string, string> = {
            "overview": "/profile",
            "orders": "/profile/orders",
            "personal-details": "/profile/details",
            "addresses": "/profile/addresses",
        };
        router.push(tabRoutes[tab] || "/profile");
    };

    return (
        <OverviewTab
            userName={userName}
            userEmail={userEmail}
            onSelectTab={handleSelectTab}
        />
    );
}