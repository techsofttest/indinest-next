"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, User } from "lucide-react";
import { apiUrl } from "@/lib/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = "login" | "signup" | "signup-success" | "forgot-password" | "forgot-success";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [viewState, setViewState] = useState<ViewState>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state on close
    setViewState("login");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/customer/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userName", data.name || "IndiNest Member");
      localStorage.setItem("userEmail", data.email);
      window.dispatchEvent(new Event("auth-change"));
      handleClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/customer/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account.");
      }

      setViewState("signup-success");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link.");
      }

      setViewState("forgot-success");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-[900px] h-[550px] bg-white shadow-2xl flex overflow-hidden z-10 animate-fade-in mx-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#010526] hover:opacity-60 transition-opacity z-20 cursor-pointer"
          aria-label="Close modal"
          disabled={loading}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left Side: Campaign Image */}
        <div className="hidden md:flex md:w-[48%] relative bg-[#010526] text-white flex-col items-center justify-center p-10 overflow-hidden">
          <div className="absolute inset-0 bg-black/15 z-10" />
          <Image
            src="/login/login-campaign2.png"
            alt="IndiNest Campaign"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          {/* Logo centered inside the campaign image */}
          <div className="relative z-20 w-[180px] h-[75px] flex items-center justify-center bg-white/95 backdrop-blur-md px-6 py-4 shadow-2xl border border-white/20">
            <Image
              src="/logo/logo.png"
              alt="IndiNest"
              width={140}
              height={50}
              className="object-contain w-auto h-auto"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="w-full md:w-[52%] flex flex-col items-center justify-center p-8 md:p-12 relative overflow-y-auto">
          <div className="w-full max-w-[340px]">
            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-xs font-medium border border-red-100 rounded-sm">
                {error}
              </div>
            )}

            {/* 1. LOGIN VIEW */}
            {viewState === "login" && (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-[#010526] uppercase tracking-wider mb-1">Welcome Back</h3>
                  <p className="text-[10px] text-[#010526]/60 tracking-wide uppercase font-medium">Log in to your account</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2.5 outline-none text-[#010526] text-sm bg-white"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
                    Password
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 px-3 py-2.5 outline-none text-[#010526] text-sm bg-white"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-3 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setError(""); setViewState("forgot-password"); }}
                    className="text-xs underline text-[#010526]/70 hover:text-[#010526] font-medium cursor-pointer"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                <p className="text-sm text-center text-[#010526]/90 mt-2">
                  New to IndiNest?{" "}
                  <button
                    type="button"
                    onClick={() => { setError(""); setViewState("signup"); }}
                    className="font-bold underline text-[#010526] cursor-pointer"
                    disabled={loading}
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            )}

            {/* 2. SIGNUP VIEW */}
            {viewState === "signup" && (
              <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
                <div className="text-center mb-1">
                  <h3 className="text-lg font-bold text-[#010526] uppercase tracking-wider mb-1">Create Account</h3>
                  <p className="text-[10px] text-[#010526]/60 tracking-wide uppercase font-medium">Join IndiNest today</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1">
                    Full Name
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-3 py-2 outline-none text-[#010526] text-sm bg-white"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1">
                    Email Address
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2 outline-none text-[#010526] text-sm bg-white"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1">
                    Password (Min 6 chars)
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 px-3 py-2 outline-none text-[#010526] text-sm bg-white"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-3 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1">
                    Confirm Password
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex-1 px-3 py-2 outline-none text-[#010526] text-sm bg-white"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="pr-3 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Sign Up"}
                </button>

                <p className="text-xs text-center text-[#010526]/70 mt-2">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setError(""); setViewState("login"); }}
                    className="font-bold underline text-[#010526] cursor-pointer"
                    disabled={loading}
                  >
                    Log In
                  </button>
                </p>
              </form>
            )}

            {/* 3. SIGNUP SUCCESS VIEW */}
            {viewState === "signup-success" && (
              <div className="flex flex-col items-center justify-center text-center py-4 animate-fade-in">
                <div className="text-emerald-500 mb-4 bg-emerald-50 p-3 rounded-full border border-emerald-100">
                  <CheckCircle2 size={44} />
                </div>

                <h3 className="text-xl font-bold text-[#010526] uppercase tracking-wider mb-2">Verification Sent!</h3>
                <p className="text-xs text-[#010526]/70 leading-relaxed mb-6">
                  Account created successfully.<br />
                  Please check your inbox for an email containing a link to verify your email address before logging in.
                </p>

                <button
                  onClick={() => setViewState("login")}
                  className="w-full py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            )}

            {/* 4. FORGOT PASSWORD VIEW */}
            {viewState === "forgot-password" && (
              <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-[#010526] uppercase tracking-wider mb-1">Reset Password</h3>
                  <p className="text-[10px] text-[#010526]/60 tracking-wide uppercase font-medium">Enter email to receive reset link</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2.5 outline-none text-[#010526] text-sm bg-white"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="text-sm text-center text-[#010526]/90 mt-2">
                  Remember password?{" "}
                  <button
                    type="button"
                    onClick={() => { setError(""); setViewState("login"); }}
                    className="font-bold underline text-[#010526] cursor-pointer"
                    disabled={loading}
                  >
                    Log In
                  </button>
                </p>
              </form>
            )}

            {/* 5. FORGOT PASSWORD SUCCESS VIEW */}
            {viewState === "forgot-success" && (
              <div className="flex flex-col items-center justify-center text-center py-4 animate-fade-in">
                <div className="text-emerald-500 mb-4 bg-emerald-50 p-3 rounded-full border border-emerald-100">
                  <CheckCircle2 size={44} />
                </div>

                <h3 className="text-xl font-bold text-[#010526] uppercase tracking-wider mb-2">Email Sent!</h3>
                <p className="text-xs text-[#010526]/70 leading-relaxed mb-6">
                  If the account exists, we have sent a password reset link to your email address.<br />
                  Please check your inbox.
                </p>

                <button
                  onClick={() => setViewState("login")}
                  className="w-full py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            )}

            {viewState !== "signup-success" && viewState !== "forgot-success" && (
              <p className="text-[12px] text-[#010526]/80 text-center mt-4 leading-relaxed">
                By continuing, you agree to our<br />
                <Link href="#" className="underline font-semibold hover:text-[#010526]">Privacy Policy</Link> and <Link href="#" className="underline font-semibold hover:text-[#010526]">Terms of Service</Link>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
