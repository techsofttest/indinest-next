"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

export interface CartItem {
  id: string;
  product_id?: number | null;
  variant_id?: number | null;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  size?: string | null;
  colour?: string | null;
  variant_name?: string | null;
  isOutOfStock?: boolean;
  sizes?: string[];
  stock?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartLoading: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (item: Omit<CartItem, "id"> & { id?: string }) => Promise<void>;
  updateCartItem: (id: string, updates: Partial<Pick<CartItem, "quantity" | "price" | "size" | "colour" | "variant_name">>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isValidCartItem = (item: any): item is CartItem => {
  return item && typeof item.id === "string" && typeof item.name === "string" && typeof item.price === "number" && typeof item.quantity === "number";
};

function generateItemId(item: Partial<CartItem>): string {
  const normalizedName = item.name
    ? String(item.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "product";
  const parts = [
    item.product_id !== undefined && item.product_id !== null ? String(item.product_id) : "generic",
    item.variant_id !== undefined && item.variant_id !== null ? String(item.variant_id) : "base",
    normalizedName || "default",
    item.size ? String(item.size).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") : "default",
    item.colour ? String(item.colour).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") : "default",
  ];

  return parts.filter(Boolean).join("-");
}

function normalizeCartItem(item: any): CartItem {
  return {
    id: String(item.id ?? generateItemId(item)),
    product_id: item.product_id !== undefined && item.product_id !== null ? Number(item.product_id) : null,
    variant_id: item.variant_id !== undefined && item.variant_id !== null ? Number(item.variant_id) : null,
    name: String(item.name ?? "Product"),
    brand: String(item.brand ?? ""),
    image: String(item.image ?? ""),
    price: Number(item.price ?? 0),
    quantity: Math.max(1, Number(item.quantity ?? 1)),
    size: item.size !== undefined ? String(item.size) : null,
    colour: item.colour !== undefined ? String(item.colour) : null,
    variant_name: item.variant_name !== undefined ? String(item.variant_name) : null,
    isOutOfStock: Boolean(item.isOutOfStock),
    sizes: Array.isArray(item.sizes) ? item.sizes.map(String) : undefined,
    stock: item.stock !== undefined && item.stock !== null ? Number(item.stock) : 99,
  };
}

function calculateCartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateCartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);

  const persistCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem("cartItems", JSON.stringify(items));
      localStorage.setItem("cartItemCount", String(calculateCartCount(items)));
    } catch {
      // ignore localStorage failures
    }
    window.dispatchEvent(new Event("cart-change"));
  };

  const loadCartFromLocalStorage = (): CartItem[] => {
    if (typeof window === "undefined") {
      return [];
    }
    const stored = localStorage.getItem("cartItems");
    if (!stored) {
      return [];
    }
    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map(normalizeCartItem);
    } catch {
      return [];
    }
  };

  const syncCartFromLocalStorage = () => {
    const localCart = loadCartFromLocalStorage();
    if (JSON.stringify(localCart) !== JSON.stringify(cartItems)) {
      persistCart(localCart);
    }
  };

  const loadCart = async () => {
    setIsCartLoading(true);
    const localCart = loadCartFromLocalStorage();

    try {
      const response = await fetch(apiUrl("/api/cart"), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Cart API returned ${response.status}`);
      }

      const data = await response.json();
      const serverCart = Array.isArray(data.cart) ? data.cart.map(normalizeCartItem) : [];
      setBackendAvailable(true);

      if (serverCart.length === 0 && localCart.length > 0) {
        const replaceResponse = await fetch(apiUrl("/api/cart/replace"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: localCart }),
        });

        if (replaceResponse.ok) {
          const replaceData = await replaceResponse.json();
          persistCart(Array.isArray(replaceData.cart) ? replaceData.cart.map(normalizeCartItem) : localCart);
        } else {
          persistCart(localCart);
        }
      } else {
        persistCart(serverCart);
      }
    } catch (error) {
      setBackendAvailable(false);
      persistCart(localCart);
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartChange = () => syncCartFromLocalStorage();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "cartItems" || event.key === "cartItemCount") {
        syncCartFromLocalStorage();
      }
    };

    window.addEventListener("cart-change", handleCartChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("cart-change", handleCartChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setCart = (items: CartItem[]) => {
    persistCart(items.map(normalizeCartItem));
  };

  const addToCart = async (item: Omit<CartItem, "id"> & { id?: string }) => {
    const parsedItem = normalizeCartItem(item);
    if (backendAvailable) {
      try {
        const response = await fetch(apiUrl("/api/cart"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedItem),
        });

        if (!response.ok) {
          throw new Error(`Cart API add failed with ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.cart)) {
          setCart(data.cart);
          return;
        }
      } catch (error) {
        setBackendAvailable(false);
      }
    }

    const existingIndex = cartItems.findIndex((cartItem) =>
      cartItem.product_id === parsedItem.product_id &&
      cartItem.variant_id === parsedItem.variant_id &&
      cartItem.size === parsedItem.size &&
      cartItem.colour === parsedItem.colour &&
      cartItem.name === parsedItem.name
    );

    const nextCart = [...cartItems];
    const maxStock = parsedItem.stock ?? 99;
    if (existingIndex !== -1) {
      const targetQty = Math.min(nextCart[existingIndex].quantity + parsedItem.quantity, maxStock);
      nextCart[existingIndex] = {
        ...nextCart[existingIndex],
        quantity: Math.max(1, targetQty),
      };
    } else {
      parsedItem.quantity = Math.max(1, Math.min(parsedItem.quantity, maxStock));
      nextCart.push(parsedItem);
    }

    setCart(nextCart);
  };

  const updateCartItem = async (
    id: string,
    updates: Partial<Pick<CartItem, "quantity" | "price" | "size" | "colour" | "variant_name">>
  ) => {
    if (backendAvailable) {
      try {
        const response = await fetch(apiUrl(`/api/cart/${encodeURIComponent(id)}`), {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`Cart API update failed with ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.cart)) {
          setCart(data.cart);
          return;
        }
      } catch (error) {
        setBackendAvailable(false);
      }
    }

    const nextCart = cartItems.map((item) => {
      if (item.id === id) {
        const maxStock = item.stock ?? 99;
        const targetQty = updates.quantity !== undefined
          ? Math.max(1, Math.min(updates.quantity, maxStock))
          : item.quantity;
        return { ...item, ...updates, quantity: targetQty };
      }
      return item;
    });
    setCart(nextCart);
  };

  const removeFromCart = async (id: string) => {
    if (backendAvailable) {
      try {
        const response = await fetch(apiUrl(`/api/cart/${encodeURIComponent(id)}`), {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Cart API remove failed with ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.cart)) {
          setCart(data.cart);
          return;
        }
      } catch (error) {
        setBackendAvailable(false);
      }
    }

    setCart(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = async () => {
    if (backendAvailable) {
      try {
        const response = await fetch(apiUrl("/api/cart/clear"), {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Cart API clear failed with ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.cart)) {
          setCart(data.cart);
          return;
        }
      } catch (error) {
        setBackendAvailable(false);
      }
    }

    setCart([]);
  };

  const cartCount = calculateCartCount(cartItems);
  const cartTotal = calculateCartTotal(cartItems);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartLoading,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
