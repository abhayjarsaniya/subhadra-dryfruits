"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { X, Phone, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { ConfirmationResult } from "firebase/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signInWithGoogle, sendPhoneOtp, verifyPhoneOtp, user } = useAuth();

  const [mode, setMode] = useState<"choose" | "phone">("choose");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input_phone" | "input_otp">("input_phone");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  // Close when logged in
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      if (onSuccess) onSuccess();
    }
  }, [user, isOpen, onClose, onSuccess]);

  // Resend countdown
  useEffect(() => {
    let interval: any = null;
    if (step === "input_otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const confirmation = await sendPhoneOtp(cleanPhone, "recaptcha-container");
      setConfirmationResult(confirmation);
      setStep("input_otp");
      setResendTimer(30);
    } catch (err: any) {
      if (err.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later or use Google Sign-In.");
      } else {
        setError(err.message || "Failed to send verification code. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmationResult) return;
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP received via SMS.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await verifyPhoneOtp(confirmationResult, otp);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err.code === "auth/invalid-verification-code") {
        setError("Invalid OTP code. Please double-check and retry.");
      } else if (err.code === "auth/code-expired") {
        setError("This OTP has expired. Please click Resend Code.");
      } else {
        setError(err.message || "Failed to verify OTP.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendTimer > 0) return;
    setOtp("");
    await handleSendOtp({ preventDefault: () => {} } as any);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-2xl sm:p-9">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-[#6E2635] text-white shadow-md shadow-[#6E2635]/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold text-ink">
            {step === "input_otp" ? "Verify Mobile OTP" : "Welcome to Subhadra"}
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            {step === "input_otp"
              ? `Enter the 6-digit code sent to +91 ${phone}`
              : "Sign in to view your orders, saved addresses, and express checkout"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* ReCAPTCHA invisible container */}
        <div id="recaptcha-container" />

        {mode === "choose" ? (
          <div className="mt-6 space-y-3">
            {/* Google Login */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-800 shadow-2xs transition hover:bg-stone-50 disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-medium uppercase text-stone-400">
                or
              </span>
            </div>

            {/* Phone Login Option */}
            <button
              type="button"
              onClick={() => setMode("phone")}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#6E2635] text-xs font-semibold text-white shadow-md shadow-[#6E2635]/20 transition hover:bg-[#5A1E2B]"
            >
              <Phone className="h-4 w-4" />
              <span>Sign in with Mobile OTP</span>
            </button>
          </div>
        ) : (
          <div className="mt-6">
            {step === "input_phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Mobile Number
                  </label>
                  <div className="mt-1 flex rounded-xl border border-stone-300 shadow-2xs focus-within:border-[#6E2635] focus-within:ring-1 focus-within:ring-[#6E2635]">
                    <span className="flex items-center rounded-l-xl bg-stone-50 px-3.5 text-xs font-semibold text-stone-600 border-r border-stone-200">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      autoFocus
                      placeholder="98765 43210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="h-12 w-full rounded-r-xl px-3.5 text-sm text-ink outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6E2635] text-xs font-semibold text-white shadow-md shadow-[#6E2635]/20 transition hover:bg-[#5A1E2B] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Sending verification code...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Verification Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMode("choose")}
                  className="w-full py-1 text-center text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  ← Back to login options
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 h-12 w-full rounded-xl border border-stone-300 px-4 text-center font-mono text-xl tracking-widest text-ink outline-none transition focus:border-[#6E2635]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6E2635] text-xs font-semibold text-white shadow-md shadow-[#6E2635]/20 transition hover:bg-[#5A1E2B] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Proceed</span>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("input_phone");
                      setOtp("");
                    }}
                    className="hover:text-stone-800"
                  >
                    Change number
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0 || loading}
                    onClick={handleResendOtp}
                    className="font-semibold text-[#6E2635] disabled:text-stone-400 hover:underline"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
