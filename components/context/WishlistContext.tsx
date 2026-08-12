"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";

export interface WishlistItem {
  id: string;
  slug?: string;
  brand?: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  discount?: string | null;
  rating?: number;
  reviews?: number;
  category?: string | null;
  variants?: any[];
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isWishlistLoading: boolean;
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (product: any) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  };

  const loadWishlist = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setWishlist([]);
      return;
    }

    setIsWishlistLoading(true);
    try {
      const res = await fetch(apiUrl("/customer/wishlist"), {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
      } else {
        if (res.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("authToken");
          localStorage.removeItem("isLoggedIn");
          window.dispatchEvent(new Event("auth-change"));
        }
        setWishlist([]);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    loadWishlist();

    const handleAuthChange = () => {
      checkAuthStatus();
      loadWishlist();
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const addToWishlist = async (product: any) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    // Optimistic update
    const tempItem: WishlistItem = {
      id: String(product.id),
      slug: product.slug,
      brand: product.brand,
      title: product.name || product.title,
      image: product.image || product.imageSrc || "",
      price: typeof product.price === "number" ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0,
      originalPrice: product.originalPrice ? (typeof product.originalPrice === "number" ? product.originalPrice : parseFloat(String(product.originalPrice).replace(/[^0-9.]/g, ""))) : null,
    };

    setWishlist((prev) => {
      if (prev.some((item) => item.id === tempItem.id)) return prev;
      return [...prev, tempItem];
    });

    try {
      const res = await fetch(apiUrl("/customer/wishlist"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (res.ok) {
        const updated = await res.json();
        setWishlist(Array.isArray(updated) ? updated : (prev) => prev);
      } else {
        // Revert optimistic update
        loadWishlist();
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      loadWishlist();
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    // Optimistic update
    setWishlist((prev) => prev.filter((item) => item.id !== String(productId)));

    try {
      const res = await fetch(apiUrl(`/customer/wishlist/${productId}`), {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const updated = await res.json();
        setWishlist(Array.isArray(updated) ? updated : (prev) => prev);
      } else {
        // Revert optimistic update
        loadWishlist();
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      loadWishlist();
    }
  };

  const isInWishlist = (productId: string | number) => {
    return wishlist.some((item) => item.id === String(productId));
  };

  const toggleWishlist = async (product: any) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlistLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
