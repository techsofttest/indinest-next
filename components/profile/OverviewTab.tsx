"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Package, User, MapPin, Pencil } from "lucide-react";
import { ProfileTab } from "./ProfileSidebar";

interface OverviewTabProps {
    userName: string;
    userEmail: string;
    onSelectTab: (tab: ProfileTab) => void;
}

export default function OverviewTab({ userName, userEmail, onSelectTab }: OverviewTabProps) {
    const upcomingDeliveries = [
        {
            id: "ORD-9821-A",
            date: "Tomorrow, 2:00 PM - 5:00 PM",
            status: "Out for delivery",
            items: 2,
        },
        {
            id: "ORD-8732-B",
            date: "Thursday, July 30",
            status: "Shipped",
            items: 1,
        }
    ];

    return (
        <div className="flex flex-col gap-10">
            {/* Account Hero Banner */}
            <div className="relative overflow-hidden min-h-[160px] flex flex-col justify-end bg-[#010526]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='5' cy='5' r='0.5' fill='%23ffffff' fill-opacity='0.5' /%3E%3C/svg%3E")` }}>
                <div className="relative z-10 p-8 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div>
                        <p className="text-white/80 text-xs uppercase tracking-widest font-semibold mb-1">
                            Welcome Back,
                        </p>
                        <h1 className="text-3xl md:text-4xl font-serif font-normal text-white leading-tight">
                            {userName}
                        </h1>
                        <p className="text-white/70 text-sm mt-1">{userEmail}</p>
                    </div>

                    <button
                        onClick={() => onSelectTab("personal-details")}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 transition-all flex items-center gap-2 border border-white/10"
                    >
                        <Pencil size={14} />
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Welcome copy */}
            <div className="max-w-xl">
                <p className="text-[#010526]/80 text-base leading-relaxed">
                    Welcome to your private corner of <span className="font-semibold text-[#010526]">IndiNest</span>, {userName.split(' ')[0]}.
                    Manage your orders, shipping addresses, and account details right here.
                </p>
            </div>

            {/* Upcoming Deliveries */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs uppercase tracking-widest font-bold text-[#010526]/50">
                        Upcoming Deliveries
                    </h2>
                    <button onClick={() => onSelectTab("orders")} className="text-xs font-semibold text-[#010526] hover:underline">
                        View All Orders
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {upcomingDeliveries.map((delivery) => (
                        <div key={delivery.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-[#010526]/10 hover:border-[#010526]/30 bg-white transition-all gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#010526]/5 flex items-center justify-center text-[#010526]">
                                    <Package size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#010526]">{delivery.date}</p>
                                    <p className="text-xs text-[#010526]/70 mt-0.5">
                                        Order {delivery.id} • {delivery.items} {delivery.items === 1 ? 'item' : 'items'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-semibold text-[#010526]">{delivery.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick navigation cards */}
            <div>
                <h2 className="text-xs uppercase tracking-widest font-bold text-[#010526]/50 mb-4">
                    Quick Access
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            tab: "orders" as ProfileTab,
                            icon: Package,
                            title: "My Orders",
                            desc: "Track packages and manage past purchases.",
                        },
                        {
                            tab: "personal-details" as ProfileTab,
                            icon: User,
                            title: "Personal Details",
                            desc: "Update your email, name, and password.",
                        },
                        {
                            tab: "addresses" as ProfileTab,
                            icon: MapPin,
                            title: "Addresses",
                            desc: "Save and manage delivery destinations.",
                        },
                    ].map(({ tab, icon: Icon, title, desc }) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => onSelectTab(tab)}
                            className="group flex flex-col gap-3 p-5 border border-[#010526]/8 hover:border-[#010526]/20 bg-white hover:shadow-sm text-left transition-all"
                        >
                            <div className="w-9 h-9 bg-[#010526]/5 group-hover:bg-[#010526] flex items-center justify-center transition-colors">
                                <Icon size={16} className="text-[#010526] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#010526]">{title}</p>
                                <p className="text-xs text-[#010526]/70 mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                            <div className="mt-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#010526]/50 group-hover:text-[#010526] transition-colors">
                                Go <ArrowRight size={11} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
