"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F6] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6E2635] text-2xl text-white shadow-md">
            🔐
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-ink sm:text-3xl">Admin Portal</h1>
          <p className="mt-1.5 text-xs text-stone-500">
            Sign in to manage store catalog, inventory, orders, and content
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
              placeholder="e.g. admin"
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-stone-300 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
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
              className="mt-1 h-12 w-full rounded-xl border border-stone-300 px-4 text-sm text-ink outline-none transition focus:border-[#6E2635]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#6E2635] text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel"}
          </button>
        </form>

        <div className="mt-6 border-t border-stone-100 pt-4 text-center">
          <p className="text-[11px] text-stone-400">
            Default credentials: <code className="font-mono text-stone-600">admin</code> / <code className="font-mono text-stone-600">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
