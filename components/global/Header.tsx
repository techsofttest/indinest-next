"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SearchModal from "./SearchModal";
import MenuDropdown from "./MenuDropdown";
import LoginModal from "./LoginModal";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/components/context/CartContext";
import { User, ShoppingBag, LogOut } from "lucide-react";
import { apiUrl } from "@/lib/api";

// Left-side nav links
export const leftLinks = [
  { label: "All Products", href: "/products" },
];

// Right-side nav links
export const rightLinks: Array<{ label: string; href: string }> = [];

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};


export default function Header() {
  const pathname = usePathname();
  const [leftLinksState, setLeftLinksState] = useState(leftLinks);
  const [rightLinksState, setRightLinksState] = useState<Array<{ label: string; href: string }>>(rightLinks);
  const [departments, setDepartments] = useState<any[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [categoriesState, setCategoriesState] = useState<any[]>([]);

  useEffect(() => {
    async function loadHeaderData() {
      try {
        const [deptRes, headerRes] = await Promise.all([
          fetch(apiUrl('/api/storefront/departments')),
          fetch(apiUrl('/api/storefront/header'))
        ]);
        
        let depts = [];
        if (deptRes.ok) {
          depts = await deptRes.json();
          setDepartments(depts ?? []);
        }
        
        let homeFeaturedCats = [];
        if (headerRes.ok) {
          const headerData = await headerRes.json();
          homeFeaturedCats = headerData.home_featured_categories ?? [];
          setCategoriesState(headerData.categories ?? []);
        }

        setLeftLinksState([
          { label: "All Products", href: "/products" },
          ...homeFeaturedCats.map((cat: any) => ({
            label: cat.name,
            href: cat.href || `/category/${cat.slug}`
          }))
        ]);
        setRightLinksState([
          ...(depts ?? []).map((dept: any) => ({
            label: dept.name,
            href: `/departments/${dept.slug}`
          }))
        ]);
      } catch (err) {
        console.error("Failed to load header data:", err);
      }
    }
    loadHeaderData();
  }, []);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { cartCount, isCartDrawerOpen, openCartDrawer, closeCartDrawer } = useCart();

  useEffect(() => {
    const handleOpenDrawer = () => openCartDrawer();
    window.addEventListener("cart-open-drawer", handleOpenDrawer);
    return () => window.removeEventListener("cart-open-drawer", handleOpenDrawer);
  }, [openCartDrawer]);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUserName(localStorage.getItem("userName") || "");
      setUserEmail(localStorage.getItem("userEmail") || "");
    };
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white relative">
        <div className="flex items-center justify-between px-4 md:px-8 py-5">

          {/* ── LEFT: Hamburger + nav links ── */}
          <div className="flex items-center gap-6">
            {/* Hamburger */}
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-6 w-6 flex-col items-center justify-center gap-1.5"
            >
              <span
                className={`block h-0.5 w-5 bg-[#010526] transition-transform duration-300 ease-in-out ${menuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
              />
              <span
                className={`block h-0.5 bg-[#010526] transition-opacity duration-300 ease-in-out ${menuOpen ? "w-5 opacity-0" : "w-5"
                  }`}
              />
              <span
                className={`block h-0.5 w-5 bg-[#010526] transition-transform duration-300 ease-in-out ${menuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
              />
            </button>

            {/* Left nav links — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-7 text-[11px] font-semibold uppercase tracking-widest">
              {leftLinksState.map((link: any) => {
                if (link.label === "Gifts") {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`relative flex items-center gap-1.5 transition-opacity after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:bg-[#010526] after:transition-all after:duration-300 hover:after:w-full text-[#010526] ${isActive ? "after:w-full opacity-100" : "after:w-0 hover:opacity-60"}`}
                    >
                      <img src="/icons/gift.gif" alt="" aria-hidden="true" className="w-5 h-5 object-contain" />
                      {link.label}
                    </a>
                  );
                }


                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="relative text-[#010526] hover:opacity-60 transition-opacity after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-[#010526] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* ── CENTER: Logo with reveal animation ── */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="block">
              <div
                className="transition-all duration-1000 ease-out"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed
                    ? "translateY(0) scale(1)"
                    : "translateY(-14px) scale(0.88)",
                  filter: revealed ? "blur(0px)" : "blur(5px)",
                }}
              >
                <Image
                  src="/logo/logo.png"
                  alt="IndiNest"
                  width={160}
                  height={58}
                  priority
                  className="object-contain w-auto h-auto"
                  style={{ maxWidth: "160px", maxHeight: "58px", width: "auto", height: "auto" }}
                />
              </div>
            </Link>
          </div>

          {/* ── RIGHT: nav links + icons ── */}
          <div className="flex items-center gap-5">
            {/* Right nav links — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-7 text-[11px] font-semibold uppercase tracking-widest">
              {rightLinksState.map((link: any) => {
                const isActive = link.href !== "#" && pathname.startsWith(link.href);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`relative transition-opacity after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:bg-[#010526] after:transition-all after:duration-300 hover:after:w-full text-[#010526] ${isActive
                      ? "after:w-full opacity-100"
                      : "after:w-0 hover:opacity-60"
                      }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Icon group */}
            <div className="flex items-center gap-4 text-[#010526]">
              {/* Search */}
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="hover:opacity-60 transition-opacity"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Account with Hover Dropdown */}
              <div className="relative group py-2">
                <button
                  aria-label="Account"
                  onClick={() => {
                    if (!isLoggedIn) {
                      setLoginOpen(true);
                    }
                  }}
                  className="hover:opacity-60 transition-opacity flex items-center h-full cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2.5">
                  {!isLoggedIn ? (
                    <div className="px-4 py-2 flex flex-col items-center">
                      {/* <p className="text-[10px] text-[#010526]/50 uppercase tracking-widest mb-3 text-center font-bold">Access your account</p> */}
                      <button
                        onClick={() => setLoginOpen(true)}
                        className="w-full py-2 bg-[#010526] text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity text-center cursor-pointer"
                      >
                        Login / Sign Up
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col py-1">
                      {/* User Info Header */}
                      <div className="px-5 py-2.5 mb-1.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#010526] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {getInitials(userName)}
                        </div>
                        <div className="flex flex-col min-w-0 -mt-0.5">
                          <p className="text-sm font-bold text-[#010526] truncate tracking-wide uppercase">{userName}</p>
                          <p className="text-[11px] text-[#010526]/70 truncate tracking-wider mt-0.5">{userEmail}</p>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="px-5 py-3 text-sm text-[#010526] hover:bg-[#010526]/5 transition-colors uppercase tracking-widest font-semibold flex items-center gap-2.5"
                      >
                        <User size={16} className="opacity-75" />
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="px-5 py-3 text-sm text-[#010526] hover:bg-[#010526]/5 transition-colors uppercase tracking-widest font-semibold flex items-center gap-2.5"
                      >
                        <ShoppingBag size={16} className="opacity-75" />
                        Order History
                      </Link>
                      <hr className="border-[#010526]/10 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-[#010526]/5 transition-colors uppercase tracking-widest font-semibold flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart */}
              <button
                onClick={openCartDrawer}
                aria-label="Cart"
                className="relative hover:opacity-60 transition-opacity flex items-center cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {/* Cart badge */}
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#010526] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <MenuDropdown isOpen={menuOpen} onClose={() => setMenuOpen(false)} departments={departments} />
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
        <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
      </header >
    </>
  );
}
