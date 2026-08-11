"use client";

import React from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingBag,
    User,
    MapPin,
    LogOut,
} from "lucide-react";

export type ProfileTab =
    | "overview"
    | "orders"
    | "personal-details"
    | "addresses";

interface ProfileSidebarProps {
    activeTab: ProfileTab;
    onLogout: () => void;
}

interface NavItem {
    id: ProfileTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
    { id: "overview",          label: "Overview",         icon: LayoutDashboard },
    { id: "orders",            label: "Orders",           icon: ShoppingBag },
    { id: "personal-details",  label: "Personal Details", icon: User },
    { id: "addresses",         label: "Addresses",        icon: MapPin },
];

const tabRoutes: Record<ProfileTab, string> = {
    "overview": "/profile",
    "orders": "/profile/orders",
    "personal-details": "/profile/details",
    "addresses": "/profile/addresses",
};

export default function ProfileSidebar({
    activeTab,
    onLogout,
}: ProfileSidebarProps) {
    return (
        <aside className="w-full pr-0 md:pr-6">
            <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const href = tabRoutes[item.id];
                    return (
                        <Link
                            key={item.id}
                            href={href}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 text-[15px] tracking-wide transition-all duration-150 ${
                                isActive
                                    ? "font-semibold text-[#010526] bg-[#010526]/[0.06]"
                                    : "text-[#010526]/70 hover:text-[#010526] hover:bg-[#010526]/[0.03]"
                            }`}
                        >
                            <Icon
                                size={15}
                                className={isActive ? "text-[#010526]" : "text-[#010526]/50"}
                            />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="pt-4 mt-3 border-t border-[#010526]/10">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-[15px] text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                    >
                        <LogOut size={15} />
                        Sign Out
                    </button>
                </div>
            </nav>
        </aside>
    );
}
