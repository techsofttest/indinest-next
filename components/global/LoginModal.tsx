"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, User } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = "login" | "signup-email" | "signup-otp" | "signup-password" | "signup-success";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [viewState, setViewState] = useState<ViewState>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state on close
    setViewState("login");
    setName("");
    setEmail("");
    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    // Perform login action
    console.log("Logging in with:", email, password);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    if (!localStorage.getItem("userName")) {
      localStorage.setItem("userName", "IndiNest Member");
    }
    window.dispatchEvent(new Event("auth-change"));
    handleClose();
  };

  const handleSignupEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    // Simulate sending OTP
    console.log("Sending OTP to:", email);
    setViewState("signup-otp");
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter the verification code sent to your email.");
      return;
    }
    setError("");
    // Simulate OTP verification
    console.log("Verifying OTP:", otp);
    setViewState("signup-password");
  };

  const handleCreatePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    // Simulate password saving
    console.log("Setting password for:", email);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    window.dispatchEvent(new Event("auth-change"));
    setViewState("signup-success");
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
            />
          </div>
        </div>


        {/* Right Side: Forms */}
        <div className="w-full md:w-[52%] flex flex-col items-center justify-center p-8 md:p-12 relative">

          {/* Back Button (only shown in signup intermediate steps) */}
          {(viewState === "signup-otp" || viewState === "signup-password") && (
            <button
              onClick={() => {
                setError("");
                if (viewState === "signup-otp") setViewState("signup-email");
                if (viewState === "signup-password") setViewState("signup-otp");
              }}
              className="absolute top-4 left-4 flex items-center gap-1 text-xs text-[#010526]/60 hover:text-[#010526] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}

          {/* Logo */}
          {/* <div className="mb-4 relative w-[140px] h-[40px] flex items-center justify-center">
            <Image
              src="/logo/logo.png"
              alt="IndiNest"
              width={140}
              height={40}
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div> */}

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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-3 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Log In
                </button>

                <p className="text-sm text-center text-[#010526]/90 mt-2">
                  New to IndiNest?{" "}
                  <button
                    type="button"
                    onClick={() => { setError(""); setViewState("signup-email"); }}
                    className="font-bold underline text-[#010526] cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            )}

            {/* 2. SIGNUP - EMAIL VIEW */}
            {viewState === "signup-email" && (
              <form onSubmit={handleSignupEmailSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-[#010526] uppercase tracking-wider mb-1">Create Account</h3>
                  <p className="text-[10px] text-[#010526]/60 tracking-wide uppercase font-medium">Step 1: Enter your Details</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
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
                      className="flex-1 px-3 py-2.5 outline-none text-[#010526] text-sm bg-white"
                      required
                    />
                  </div>
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
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Send OTP
                </button>

                <p className="text-xs text-center text-[#010526]/70 mt-2">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setError(""); setViewState("login"); }}
                    className="font-bold underline text-[#010526] cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </form>
            )}

            {/* 3. SIGNUP - OTP VIEW */}
            {viewState === "signup-otp" && (
              <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-[#010526] uppercase tracking-wider mb-1">Verify Email</h3>
                  <p className="text-[10px] text-[#010526]/60 tracking-wide font-medium">
                    We sent a code to <span className="font-bold text-[#010526]">{email}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2.5 border border-[#010526]/20 text-center tracking-[0.4em] font-bold text-lg text-[#010526] outline-none focus:border-[#010526] bg-white transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Verify OTP
                </button>

                <p className="text-sm text-center text-[#010526]/70">
                  Didn't receive code?{" "}
                  <button
                    type="button"
                    onClick={(e) => handleSignupEmailSubmit(e)}
                    className="underline font-bold hover:text-[#010526] cursor-pointer"
                  >
                    Resend Code
                  </button>
                </p>
              </form>
            )}

            {/* 4. SIGNUP - PASSWORD VIEW */}
            {viewState === "signup-password" && (
              <form onSubmit={handleCreatePasswordSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-[#010526] uppercase tracking-wider mb-1">Set Password</h3>
                  <p className="text-[10px] text-[#010526]/60 tracking-wide uppercase font-medium">Create a password for your account</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
                    Create Password
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="flex-1 px-3 py-2.5 outline-none text-[#010526] text-sm bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="pr-3 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
                    Confirm Password
                  </label>
                  <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                    <span className="pl-3 text-[#010526]/40">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex-1 px-3 py-2.5 outline-none text-[#010526] text-sm bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="pr-3 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Create Password
                </button>
              </form>
            )}

            {/* 5. SIGNUP - SUCCESS VIEW */}
            {viewState === "signup-success" && (
              <div className="flex flex-col items-center justify-center text-center py-4 animate-fade-in">
                <div className="text-emerald-500 mb-4 bg-emerald-50 p-3 rounded-full border border-emerald-100">
                  <CheckCircle2 size={44} />
                </div>

                <h3 className="text-xl font-bold text-[#010526] uppercase tracking-wider mb-2">Welcome to IndiNest!</h3>
                <p className="text-xs text-[#010526]/70 leading-relaxed mb-6">
                  Your account has been created successfully.<br />
                  You can now start shopping.
                </p>

                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            )}

            {viewState !== "signup-success" && (
              <p className="text-[12px] text-[#010526]/80 text-center mt-6 leading-relaxed">
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
