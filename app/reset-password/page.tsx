"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { apiUrl } from "@/lib/api";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center text-xs uppercase tracking-widest text-[#010526]/60">
          Loading Reset...
        </div>
        <Footer />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or expired password reset link. Please request a new one.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
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
      const res = await fetch(apiUrl("/api/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: confirmPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Could not reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-[#010526]">
      <Header />

      <main className="flex-1 w-full max-w-[500px] mx-auto px-5 py-16 md:py-24">
        <div className="border border-[#010526]/10 p-8 bg-white shadow-sm flex flex-col gap-6">
          {success ? (
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="text-emerald-500 mb-4 bg-emerald-50 p-3 rounded-full border border-emerald-100">
                <CheckCircle2 size={44} />
              </div>

              <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Password Reset!</h2>
              <p className="text-xs text-[#010526]/75 leading-relaxed mb-6 font-sans">
                Your password has been changed successfully.<br />
                You can now log in with your new password.
              </p>

              <Link
                href="/"
                className="w-full py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity text-center"
              >
                Go to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-serif font-normal uppercase tracking-wider text-[#010526] mb-1">
                  Reset Password
                </h2>
                <p className="text-[10px] text-[#010526]/60 tracking-wide uppercase font-medium">
                  Enter your new account password
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 text-xs font-sans">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
                  New Password* (Min 6 chars)
                </label>
                <div className="flex border border-[#010526]/20 items-center bg-white focus-within:border-[#010526] transition-colors">
                  <span className="pl-3 text-[#010526]/40">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 px-3 py-2.5 outline-none text-[#010526] text-sm bg-white"
                    required
                    disabled={loading || !token || !email}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-3 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                    disabled={loading || !token || !email}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#010526] uppercase tracking-widest mb-1.5">
                  Confirm Password*
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
                    className="flex-1 px-3 py-2.5 outline-none text-[#010526] text-sm bg-white"
                    required
                    disabled={loading || !token || !email}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="pr-3 text-[#010526]/40 hover:text-[#010526]/80 cursor-pointer"
                    disabled={loading || !token || !email}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token || !email}
                className="w-full mt-2 py-3 bg-[#010526] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
