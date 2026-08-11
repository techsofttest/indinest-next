"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowRight, MapPin, AlertCircle } from "lucide-react";
import { ProfileTab } from "./ProfileSidebar";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl } from "@/lib/product";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    weight: string;
    image: string | null;
    brand: string;
}

interface Order {
    id: number;
    order_number: string;
    order_date: string;
    status: string;
    grand_total: number;
    payment_status: string;
    currency: string;
    items: OrderItem[];
}

interface OverviewTabProps {
    userName: string;
    userEmail: string;
    onSelectTab: (tab: ProfileTab) => void;
}

const statusMapping: Record<string, { text: string; color: string }> = {
    pending_payment: { text: "Pending payment", color: "bg-amber-500" },
    confirmed: { text: "Confirmed", color: "bg-blue-500" },
    processing: { text: "Processing", color: "bg-blue-500" },
    packed: { text: "Packed", color: "bg-indigo-500" },
    ready: { text: "Ready", color: "bg-indigo-500" },
    out_for_delivery: { text: "Out for delivery", color: "bg-amber-500" },
    delivered: { text: "Delivered", color: "bg-emerald-500" },
    cancelled: { text: "Cancelled", color: "bg-rose-500" },
    refund_requested: { text: "Refund requested", color: "bg-purple-500" },
    refunded: { text: "Refunded", color: "bg-purple-500" }
};

const getStatusInfo = (status: string) => {
    const key = String(status).toLowerCase();
    return statusMapping[key] || { text: status, color: "bg-gray-400" };
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
    }).format(amount);
};

export default function OverviewTab({ userName, onSelectTab }: OverviewTabProps) {
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRecentOrders = async () => {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("authToken");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(apiUrl("/api/customer/orders"), {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                const data = await res.json();
                // Show latest 3 orders
                const list = data.orders || [];
                setRecentOrders(list.slice(0, 3));
            } else {
                throw new Error("Unable to load your recent orders");
            }
        } catch (err: any) {
            setError(err.message || "We couldn't load your recent orders right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const firstName = userName.split(" ").filter(Boolean)[0] || "Member";

    return (
        <div className="flex flex-col gap-8 max-w-(--breakpoint-lg) mx-auto">
            {/* Header / Welcome */}
            <div>
                <h1 className="text-xs uppercase tracking-widest text-[#010526]/50 font-bold mb-1">My Account</h1>
                <h2 className="text-2xl md:text-3xl font-serif text-[#010526] font-normal">Welcome back, {firstName}</h2>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Orders Card */}
                <Link
                    href="/profile/orders"
                    className="group flex flex-col justify-between p-6 border border-[#010526]/10 hover:border-[#010526]/40 bg-white transition-all text-left min-h-[140px]"
                >
                    <div className="flex flex-col gap-2">
                        <div className="w-8 h-8 bg-[#010526]/5 group-hover:bg-[#010526]/10 flex items-center justify-center transition-colors">
                            <Package size={16} className="text-[#010526]" />
                        </div>
                        <h3 className="text-base font-semibold text-[#010526] mt-2">Orders</h3>
                        <p className="text-xs text-[#010526]/70 leading-relaxed">
                            View and track your orders
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#010526]/80 group-hover:text-[#010526] transition-colors">
                        View orders <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </Link>

                {/* Address Book Card */}
                <Link
                    href="/profile/addresses"
                    className="group flex flex-col justify-between p-6 border border-[#010526]/10 hover:border-[#010526]/40 bg-white transition-all text-left min-h-[140px]"
                >
                    <div className="flex flex-col gap-2">
                        <div className="w-8 h-8 bg-[#010526]/5 group-hover:bg-[#010526]/10 flex items-center justify-center transition-colors">
                            <MapPin size={16} className="text-[#010526]" />
                        </div>
                        <h3 className="text-base font-semibold text-[#010526] mt-2">Address Book</h3>
                        <p className="text-xs text-[#010526]/70 leading-relaxed">
                            Manage your delivery addresses
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#010526]/80 group-hover:text-[#010526] transition-colors">
                        Manage addresses <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </Link>
            </div>

            {/* Recent Orders section */}
            <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-between items-end border-b border-[#010526]/10 pb-3">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#010526]/60">Recent orders</h3>
                    {recentOrders.length > 0 && (
                        <Link
                            href="/profile/orders"
                            className="text-xs font-semibold text-[#010526] hover:underline"
                        >
                            View all →
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse h-28 bg-[#010526]/5 border border-[#010526]/10 rounded w-full"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center gap-3 border border-[#010526]/10 p-6 bg-white">
                        <AlertCircle size={28} className="text-rose-500 stroke-[1.5]" />
                        <p className="text-xs font-semibold text-[#010526]/80">{error}</p>
                        <button
                            type="button"
                            onClick={fetchRecentOrders}
                            className="px-4 py-2 bg-[#010526] text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            Try again
                        </button>
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-3 border border-[#010526]/10 p-6 bg-white">
                        <Package size={36} className="text-[#010526]/20 stroke-[1.2]" />
                        <h4 className="text-sm font-semibold text-[#010526]/90">No orders yet</h4>
                        <p className="text-xs text-[#010526]/60">You haven&apos;t placed any orders yet.</p>
                        <Link
                            href="/products"
                            className="mt-1 px-4 py-2 bg-[#010526] text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            Start shopping →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {recentOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const firstItem = order.items[0];
                            const extraItemsCount = order.items.length - 1;

                            return (
                                <div
                                    key={order.id}
                                    className="flex flex-col border border-[#010526]/10 bg-white transition-all hover:border-[#010526]/30 p-5 gap-4"
                                >
                                    {/* Order header */}
                                    <div className="text-xs text-[#010526]/60 border-b border-[#010526]/5 pb-3">
                                        <span className="font-semibold text-[#010526]">#{order.order_number}</span>
                                        <span className="mx-2">·</span>
                                        <span>{order.order_date}</span>
                                    </div>

                                    {/* Order product preview */}
                                    {firstItem && (
                                        <div className="flex gap-4 items-center">
                                            <div className="relative w-12 h-16 flex-shrink-0 overflow-hidden bg-[#010526]/[0.03] border border-[#010526]/5">
                                                {firstItem.image ? (
                                                    <img
                                                        src={resolveProductImageUrl(firstItem.image)}
                                                        alt={firstItem.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#010526]/[0.02]">
                                                        <Package size={16} className="text-[#010526]/20 stroke-[1.2]" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-semibold text-[#010526] truncate">
                                                    {firstItem.name}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px] text-[#010526]/60 mt-0.5">
                                                    {firstItem.weight && <span>{firstItem.weight}</span>}
                                                    <span>Qty {firstItem.quantity}</span>
                                                </div>
                                                {extraItemsCount > 0 && (
                                                    <p className="text-[10px] text-[#010526]/50 mt-1 font-medium">
                                                        + {extraItemsCount} more item{extraItemsCount > 1 ? "s" : ""}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order footer */}
                                    <div className="flex justify-between items-center pt-3 border-t border-[#010526]/5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.color}`} />
                                                <span className="text-[11px] font-semibold text-[#010526]/80">
                                                    {statusInfo.text}
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-[#010526]">
                                                {formatCurrency(order.grand_total)}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#010526] hover:underline"
                                        >
                                            View order <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
