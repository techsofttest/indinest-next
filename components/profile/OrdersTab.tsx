"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight, AlertCircle } from "lucide-react";
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

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
    }).format(amount);
};

export default function OrdersTab() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("authToken");
        if (!token) {
            setLoading(false);
            setError("You must be logged in to view your orders.");
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
                setOrders(data.orders || []);
            } else {
                throw new Error("Unable to load your orders");
            }
        } catch (err: any) {
            setError(err.message || "We couldn't load your orders right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-normal text-[#010526]">My Orders</h2>
                </div>
                <div className="flex flex-col gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse flex flex-col p-5 border border-[#010526]/10 bg-white gap-4">
                            <div className="flex justify-between items-center border-b border-[#010526]/5 pb-3">
                                <div className="h-4 bg-[#010526]/10 rounded w-1/3"></div>
                                <div className="h-4 bg-[#010526]/10 rounded w-1/6"></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-16 h-20 bg-[#010526]/10 rounded"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-[#010526]/10 rounded w-3/4"></div>
                                    <div className="h-3 bg-[#010526]/10 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-[#010526]/5">
                                <div className="h-4 bg-[#010526]/10 rounded w-1/4"></div>
                                <div className="h-4 bg-[#010526]/10 rounded w-1/5"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <AlertCircle size={36} className="text-rose-500 stroke-[1.5]" />
                <p className="text-sm font-semibold text-[#010526]/90">{error}</p>
                <button
                    onClick={fetchOrders}
                    className="px-6 py-2.5 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <Package size={48} className="text-[#010526]/20 stroke-[1.2]" />
                <h3 className="text-lg font-semibold text-[#010526]/90">No orders yet</h3>
                <p className="text-sm text-[#010526]/60 max-w-sm">You haven&apos;t placed any orders yet.</p>
                <Link
                    href="/products"
                    className="mt-2 px-6 py-3 bg-[#010526] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                    Start shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-normal text-[#010526]">My Orders</h2>
            </div>

            <div className="flex flex-col gap-4">
                {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const displayedItems = order.items.slice(0, 2);
                    const extraItemsCount = order.items.length - displayedItems.length;

                    return (
                        <div
                            key={order.id}
                            className="flex flex-col border border-[#010526]/10 bg-white transition-all hover:border-[#010526]/40"
                        >
                            {/* Card Header */}
                            <div className="flex flex-wrap justify-between items-center p-4 md:p-5 border-b border-[#010526]/5 bg-[#010526]/[0.01] gap-2">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#010526]">
                                        Order #{order.order_number}
                                    </h3>
                                    <p className="text-xs text-[#010526]/60 mt-0.5">
                                        Placed on {order.order_date}
                                    </p>
                                </div>
                                {order.payment_status && (
                                    <span className="text-xs font-medium uppercase tracking-wider text-[#010526]/70 px-2 py-0.5 bg-[#010526]/5 rounded">
                                        {order.payment_status === "not_required" ? "Not Required" : order.payment_status}
                                    </span>
                                )}
                            </div>

                            {/* Card Body - Products */}
                            <div className="flex flex-col p-4 md:p-5 gap-4">
                                {displayedItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-start">
                                        <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden bg-[#010526]/[0.03] border border-[#010526]/5">
                                            {item.image ? (
                                                <img
                                                    src={resolveProductImageUrl(item.image)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[#010526]/[0.02]">
                                                    <Package size={20} className="text-[#010526]/20 stroke-[1.2]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase tracking-widest text-[#010526]/60 font-semibold">
                                                {item.brand}
                                            </p>
                                            <h4 className="text-sm font-medium text-[#010526] mt-0.5 truncate">
                                                {item.name}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-x-3 text-xs text-[#010526]/60 mt-1">
                                                {item.weight && (
                                                    <span>{item.weight}</span>
                                                )}
                                                <span>Qty {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {extraItemsCount > 0 && (
                                    <p className="text-xs text-[#010526]/60 font-medium pl-20">
                                        + {extraItemsCount} more item{extraItemsCount > 1 ? "s" : ""}
                                    </p>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="flex justify-between items-center p-4 md:p-5 border-t border-[#010526]/5 mt-auto">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase tracking-wider text-[#010526]/50">Order Total</span>
                                    <span className="text-base font-semibold text-[#010526]">
                                        {formatCurrency(order.grand_total, order.currency)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                                        <span className="text-xs font-semibold text-[#010526]/80">
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="flex items-center gap-1.5 px-4 py-2 border border-[#010526]/10 hover:border-[#010526]/40 hover:bg-[#010526]/[0.02] text-xs font-semibold text-[#010526] transition-all"
                                    >
                                        View order <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
