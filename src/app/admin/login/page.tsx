"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowRight, Store, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    async function verifyExistingAuth() {
      try {
        const token = localStorage.getItem("subhadra_admin_token") || "";
        const res = await fetch("/api/admin/auth", {
          headers: { "x-admin-token": token },
        });
        const data = await res.json();
        if (data.authenticated) {
          router.replace("/admin");
          return;
        }
      } catch {}
      setCheckingAuth(false);
    }
    verifyExistingAuth();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid username or password");
      }

      // Persist token in localStorage
      if (data.token) {
        localStorage.setItem("subhadra_admin_token", data.token);
        // Also set document cookie for browser navigation
        document.cookie = `store_admin_session=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F6]">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6E2635] border-t-transparent" />
          <p className="text-xs font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F6] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-stone-200/90 bg-white p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6E2635] text-white shadow-md shadow-[#6E2635]/20">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-ink sm:text-3xl">Admin Portal</h1>
          <p className="mt-1.5 text-xs text-stone-500">
            Control products, categories, stock, orders, coupons &amp; store settings
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">Username</span>
            <input
              type="text"
              required
              value={username}
              placeholder="admin"
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-stone-300 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635] focus:ring-1 focus:ring-[#6E2635]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">Password</span>
            <input
              type="password"
              required
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-stone-300 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635] focus:ring-1 focus:ring-[#6E2635]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6E2635] text-sm font-semibold text-white shadow-md shadow-[#6E2635]/20 transition hover:bg-[#5A1E2B] disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Sign In to Admin Panel</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3 border-t border-stone-100 pt-5">
          <div className="flex items-center justify-between rounded-xl bg-[#FAF8F6] p-3 text-xs text-stone-600">
            <div>
              <p className="font-semibold text-stone-800">Default Credentials:</p>
              <p className="font-mono text-[11px] text-stone-500">User: <strong className="text-stone-700">admin</strong> · Pass: <strong className="text-stone-700">admin123</strong></p>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername("admin");
                setPassword("admin123");
              }}
              className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6E2635] shadow-2xs hover:bg-stone-50"
            >
              <KeyRound className="h-3 w-3" />
              <span>Fill</span>
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 py-1 text-center text-xs font-medium text-stone-500 transition hover:text-[#6E2635]"
          >
            <Store className="h-3.5 w-3.5" />
            <span>Return to Live Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
