"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { PhoneInput, defaultCountries } from "react-international-phone";
import "react-international-phone/style.css";
import { apiUrl } from "@/lib/api";

interface Address {
    id: number;
    label?: string;
    contact_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    suburb?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    delivery_notes?: string;
    is_default_shipping: boolean;
    is_default_billing: boolean;
}

export default function AddressesTab() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [suburb, setSuburb] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postcode, setPostcode] = useState("");
    const [country, setCountry] = useState("United Kingdom");
    const [deliveryNotes, setDeliveryNotes] = useState("");
    const [label, setLabel] = useState("");

    const fetchAddresses = async () => {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("authToken");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(apiUrl("/api/customer/addresses"), {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            } else {
                throw new Error("Failed to load addresses.");
            }
        } catch (err: any) {
            setError(err.message || "Could not retrieve addresses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSetDefault = async (id: number) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const res = await fetch(apiUrl(`/api/customer/addresses/${id}/default-shipping`), {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.ok) {
                // Refresh address list
                fetchAddresses();
            } else {
                throw new Error("Failed to update default address.");
            }
        } catch (err: any) {
            alert(err.message || "Failed to set default.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const res = await fetch(apiUrl(`/api/customer/addresses/${id}`), {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.ok) {
                fetchAddresses();
            } else {
                throw new Error("Failed to delete address.");
            }
        } catch (err: any) {
            alert(err.message || "Failed to delete.");
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch(apiUrl("/api/customer/addresses"), {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: label || "Home",
                    contact_name: contactName,
                    phone,
                    address_line_1: addressLine1,
                    address_line_2: addressLine2,
                    suburb,
                    city,
                    state,
                    postcode,
                    country,
                    delivery_notes: deliveryNotes
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to save address.");
            }

            setIsAdding(false);
            // Reset form
            setContactName("");
            setPhone("");
            setAddressLine1("");
            setAddressLine2("");
            setSuburb("");
            setCity("");
            setState("");
            setPostcode("");
            setCountry("United Kingdom");
            setDeliveryNotes("");
            setLabel("");

            fetchAddresses();
        } catch (err: any) {
            setError(err.message || "Failed to save address.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#010526]/50" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-normal text-[#010526]">Address Book</h2>
                    <p className="text-sm text-[#010526]/55 mt-1 leading-relaxed">
                        Manage your saved delivery destinations for quick checkout.
                    </p>
                </div>
                {!isAdding && (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center gap-1.5 bg-[#010526] text-white text-xs font-semibold px-4 py-2.5 transition-all hover:bg-[#010526]/90 cursor-pointer"
                    >
                        <Plus size={15} />
                        Add New Address
                    </button>
                )}
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 text-xs font-sans">
                    {error}
                </div>
            )}

            {/* Add Address Form */}
            {isAdding && (
                <form onSubmit={handleAddAddress} className="p-6 sm:p-8 border border-[#010526]/10 flex flex-col gap-5 bg-white">
                    <h3 className="text-sm font-semibold text-[#010526] uppercase tracking-wider">
                        New Delivery Address
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Recipient Name*
                            </label>
                            <input
                                type="text"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Full Name"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Mobile Number*
                            </label>
                            <PhoneInput
                                defaultCountry="gb"
                                countries={defaultCountries.filter((c) => ["gb", "ie", "de"].includes(c[1]))}
                                value={phone}
                                onChange={(val) => setPhone(val)}
                                style={{ '--react-international-phone-border-radius': '0' } as React.CSSProperties}
                                inputClassName="w-full !bg-transparent !border-l-0 !text-sm !font-sans !text-[#010526] focus:!outline-none !rounded-none"
                                className="[&.react-international-phone-input-container]:border [&.react-international-phone-input-container]:border-[#010526]/20 focus-within:[&.react-international-phone-input-container]:border-[#010526]/80 [&.react-international-phone-input-container]:rounded-none bg-white h-[40px]"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Address Line 1*
                            </label>
                            <input
                                type="text"
                                value={addressLine1}
                                onChange={(e) => setAddressLine1(e.target.value)}
                                placeholder="House no, Street name, Area"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                value={addressLine2}
                                onChange={(e) => setAddressLine2(e.target.value)}
                                placeholder="Apartment, suite, unit etc."
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Suburb
                            </label>
                            <input
                                type="text"
                                value={suburb}
                                onChange={(e) => setSuburb(e.target.value)}
                                placeholder="Suburb"
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                City*
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                State*
                            </label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="State"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Postcode / Zip*
                            </label>
                            <input
                                type="text"
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                                placeholder="Postcode"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Country*
                            </label>
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="Country"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Address Label (e.g. Home, Office)
                            </label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="Label"
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Delivery Notes
                            </label>
                            <textarea
                                value={deliveryNotes}
                                onChange={(e) => setDeliveryNotes(e.target.value)}
                                placeholder="Any special instructions for the courier"
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80 font-sans min-h-[80px]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#010526] text-white text-xs font-semibold px-6 py-2.5 transition-all hover:bg-[#010526]/90 cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : "Save Address"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="bg-[#010526]/5 text-[#010526] text-xs font-semibold px-5 py-2.5 transition-all hover:bg-[#010526]/10 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
                <div className="text-center py-12 border border-[#010526]/10 font-sans">
                    <p className="text-base text-[#010526]/60">No saved addresses found. Add one above to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`p-6 flex flex-col justify-between transition-all ${addr.is_default_shipping
                                ? "border-2 border-[#010526]"
                                : "border border-[#010526]/5"
                                }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-sm text-[#010526] flex items-center gap-2">
                                        <MapPin size={16} className="text-[#010526]" />
                                        {addr.contact_name} {addr.label && <span className="text-xs font-normal text-[#010526]/50">({addr.label})</span>}
                                    </span>
                                    {addr.is_default_shipping && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1">
                                            <CheckCircle2 size={14} />
                                            Default
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-[#010526]/80 leading-relaxed font-sans">
                                    {addr.address_line_1}<br />
                                    {addr.address_line_2 && <>{addr.address_line_2}<br /></>}
                                    {addr.suburb && <>{addr.suburb}, </>}{addr.city}, {addr.state} - {addr.postcode}<br />
                                    {addr.country}<br />
                                    Phone: {addr.phone}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#010526]/10 text-xs font-medium">
                                {!addr.is_default_shipping ? (
                                    <button
                                        type="button"
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="text-[#010526] hover:underline cursor-pointer"
                                    >
                                        Set as default
                                    </button>
                                ) : (
                                    <span className="text-[#010526]/60 text-[11px]">Primary Shipping Destination</span>
                                )}

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(addr.id)}
                                        className="text-rose-600 hover:text-rose-700 cursor-pointer"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
