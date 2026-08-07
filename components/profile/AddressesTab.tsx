"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { PhoneInput, defaultCountries } from "react-international-phone";
import "react-international-phone/style.css";

interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
}

const initialAddresses: Address[] = [
    {
        id: "addr-1",
        name: "IndiNest Member",
        street: "10 Downing Street",
        city: "London",
        state: "England",
        pincode: "SW1A 2AA",
        phone: "+44 20 7925 0918",
        isDefault: true,
    },
    {
        id: "addr-2",
        name: "IndiNest Member (Office)",
        street: "Pariser Platz 5",
        city: "Berlin",
        state: "Berlin",
        pincode: "10117",
        phone: "+49 30 2270",
        isDefault: false,
    },
];

export default function AddressesTab() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("userAddresses");
        if (stored) {
            setAddresses(JSON.parse(stored));
        } else {
            setAddresses(initialAddresses);
            localStorage.setItem("userAddresses", JSON.stringify(initialAddresses));
        }
    }, []);

    const updateAddresses = (newAddresses: Address[]) => {
        setAddresses(newAddresses);
        localStorage.setItem("userAddresses", JSON.stringify(newAddresses));
    };

    // Form state
    const [formName, setFormName] = useState("");
    const [formStreet, setFormStreet] = useState("");
    const [formCity, setFormCity] = useState("");
    const [formState, setFormState] = useState("");
    const [formPincode, setFormPincode] = useState("");
    const [formPhone, setFormPhone] = useState("");

    const handleSetDefault = (id: string) => {
        updateAddresses(
            addresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            }))
        );
    };

    const handleDelete = (id: string) => {
        updateAddresses(addresses.filter((addr) => addr.id !== id));
    };

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        const newAddr: Address = {
            id: `addr-${Date.now()}`,
            name: formName || "IndiNest Member",
            street: formStreet,
            city: formCity,
            state: formState,
            pincode: formPincode,
            phone: formPhone,
            isDefault: addresses.length === 0,
        };
        updateAddresses([...addresses, newAddr]);
        setIsAdding(false);
        // Reset form
        setFormName("");
        setFormStreet("");
        setFormCity("");
        setFormState("");
        setFormPincode("");
        setFormPhone("");
    };

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

            {/* Add Address Form */}
            {isAdding && (
                <form onSubmit={handleAddAddress} className="p-6 sm:p-8 border border-[#010526]/10 flex flex-col gap-5">
                    <h3 className="text-sm font-semibold text-[#010526] uppercase tracking-wider">
                        New Delivery Address
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Recipient Name
                            </label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Full Name"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Mobile Number
                            </label>
                            <PhoneInput
                                defaultCountry="gb"
                                countries={defaultCountries.filter((c) => ["gb", "ie", "de"].includes(c[1]))}
                                value={formPhone}
                                onChange={(phone) => setFormPhone(phone)}
                                style={{ '--react-international-phone-border-radius': '0' } as React.CSSProperties}
                                inputClassName="w-full !bg-transparent !border-l-0 !text-sm !font-sans !text-[#010526] focus:!outline-none !rounded-none"
                                className="[&.react-international-phone-input-container]:border [&.react-international-phone-input-container]:border-[#010526]/20 focus-within:[&.react-international-phone-input-container]:border-[#010526]/80 [&.react-international-phone-input-container]:rounded-none bg-white"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                Street Address / Flat / Landmark
                            </label>
                            <input
                                type="text"
                                value={formStreet}
                                onChange={(e) => setFormStreet(e.target.value)}
                                placeholder="House no, Street name, Area"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                City
                            </label>
                            <input
                                type="text"
                                value={formCity}
                                onChange={(e) => setFormCity(e.target.value)}
                                placeholder="City"
                                required
                                className="w-full bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#010526]/80 uppercase tracking-wider mb-1.5">
                                State & PIN Code
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formState}
                                    onChange={(e) => setFormState(e.target.value)}
                                    placeholder="State"
                                    required
                                    className="w-1/2 bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                                />
                                <input
                                    type="text"
                                    value={formPincode}
                                    onChange={(e) => setFormPincode(e.target.value)}
                                    placeholder="PIN"
                                    required
                                    className="w-1/2 bg-white border border-[#010526]/20 px-4 py-2.5 text-sm text-[#010526] focus:outline-none focus:border-[#010526]/80"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <button
                            type="submit"
                            className="bg-[#010526] text-white text-xs font-semibold px-6 py-2.5 transition-all hover:bg-[#010526]/90 cursor-pointer"
                        >
                            Save Address
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`p-6 flex flex-col justify-between transition-all ${addr.isDefault
                            ? "border-2 border-[#010526]"
                            : "border border-[#010526]/5"
                            }`}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-sm text-[#010526] flex items-center gap-2">
                                    <MapPin size={16} className="text-[#010526]" />
                                    {addr.name}
                                </span>
                                {addr.isDefault && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1">
                                        <CheckCircle2 size={14} />
                                        Default
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-[#010526]/80 leading-relaxed font-sans">
                                {addr.street}<br />
                                {addr.city}, {addr.state} - {addr.pincode}<br />
                                Phone: {addr.phone}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#010526]/10 text-xs font-medium">
                            {!addr.isDefault ? (
                                <button
                                    type="button"
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="text-[#010526] hover:underline"
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
                                    className="text-rose-600 hover:text-rose-700"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
