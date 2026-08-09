"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { apiUrl } from "@/lib/api";
import { resolveProductImageUrl } from "@/lib/product";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await fetch(apiUrl("/api/storefront/departments"));
        if (res.ok) {
          const data = await res.json();
          setDepartments(data ?? []);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDepartments();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-12 md:py-20 text-[#010526] font-serif">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#010526]/60 mb-2">
              Explore Our Collections
            </p>
            <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider text-[#010526]">
              Shop By Department
            </h1>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-2 border-[#010526]/20 border-t-[#010526] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-sans text-[#010526]/60">Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="py-20 text-center text-base text-[#010526]/60">
              No departments found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => (
                <Link
                  key={dept.slug}
                  href={`/departments/${dept.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#010526]/10 shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                >
                  <img
                    src={dept.image_url ? resolveProductImageUrl(dept.image_url) : "/category/sarees.png"}
                    alt={dept.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/70 mb-1">
                      Department
                    </span>
                    <h3 className="text-xl font-bold uppercase tracking-wider leading-none">
                      {dept.name}
                    </h3>
                    <p className="text-[11px] font-sans text-white/80 mt-2 line-clamp-2 leading-relaxed">
                      {dept.description || "Discover premium collections curated for you."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
