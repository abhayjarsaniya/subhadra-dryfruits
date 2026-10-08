"use client";

import { useEffect, useState } from "react";
import { Truck, CreditCard, Bell, Save, Check } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    shipping_fee: 99,
    free_shipping_threshold: 1499,
    shipping_notes: "Doorstep delivery across India in 2–4 business days.",
    currency_symbol: "₹",
    tax_percent: 0,
    payment_gateway_mode: "simulated_gateway",
    payment_gateway_key: "",
    payment_gateway_secret: "",
    enable_cod: true,
    announcement_bar_enabled: true,
    announcement_bar_text: "Complimentary express delivery on orders above ₹1,499 · Fresh harvest guaranteed",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/settings");
      const data = await res.json();
      if (data) setSettings((prev: any) => ({ ...prev, ...data }));
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await adminFetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert("Error saving settings: " + (data.error || "Failed"));
      }
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Shipping &amp; Store Configuration</h1>
          <p className="text-xs text-stone-500">
            Configure delivery charges, payment gateway modes, COD availability, and store banners
          </p>
        </div>
        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Check className="h-3.5 w-3.5" />
            <span>Settings Saved Successfully</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Shipping Configuration */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4">
            <Truck className="h-5 w-5 text-[#6E2635]" />
            <h2 className="font-serif text-lg font-bold text-ink sm:text-xl">Shipping &amp; Delivery Rules</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-stone-600">Standard Shipping Fee (₹) *</span>
              <input
                type="number"
                required
                value={settings.shipping_fee}
                onChange={(e) => setSettings({ ...settings, shipping_fee: Number(e.target.value) })}
                className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
              />
              <span className="text-[11px] text-stone-400">Charged on checkout if subtotal is below free threshold</span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-stone-600">Free Shipping Minimum Threshold (₹) *</span>
              <input
                type="number"
                required
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
              />
              <span className="text-[11px] text-stone-400">Orders at or above this amount automatically get ₹0 shipping</span>
            </label>

            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-stone-600">Delivery Notes / Timeline Text</span>
              <input
                type="text"
                value={settings.shipping_notes}
                onChange={(e) => setSettings({ ...settings, shipping_notes: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
              />
            </label>
          </div>
        </div>

        {/* Payment Gateway & Payment Modes */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4">
            <CreditCard className="h-5 w-5 text-[#6E2635]" />
            <h2 className="font-serif text-lg font-bold text-ink sm:text-xl">Payment Gateway Architecture</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-stone-600">Payment Processing Mode</span>
              <select
                value={settings.payment_gateway_mode}
                onChange={(e) => setSettings({ ...settings, payment_gateway_mode: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs outline-none focus:border-[#6E2635]"
              >
                <option value="simulated_gateway">Production-Ready Gateway Simulator (Zero friction)</option>
                <option value="razorpay">Razorpay Live API</option>
                <option value="cashfree">Cashfree Live API</option>
              </select>
            </label>

            <label className="flex items-center gap-2 pt-6 text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={settings.enable_cod}
                onChange={(e) => setSettings({ ...settings, enable_cod: e.target.checked })}
              />
              <span>Enable Cash on Delivery (COD) Option</span>
            </label>

            {settings.payment_gateway_mode !== "simulated_gateway" && (
              <>
                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Merchant API Key ID</span>
                  <input
                    type="text"
                    placeholder="rzp_live_..."
                    value={settings.payment_gateway_key}
                    onChange={(e) => setSettings({ ...settings, payment_gateway_key: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Merchant API Key Secret</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={settings.payment_gateway_secret}
                    onChange={(e) => setSettings({ ...settings, payment_gateway_secret: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>
              </>
            )}
          </div>
        </div>

        {/* Storefront Banner Announcement */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4">
            <Bell className="h-5 w-5 text-[#6E2635]" />
            <h2 className="font-serif text-lg font-bold text-ink sm:text-xl">Store Announcement Banner</h2>
          </div>

          <div className="mt-5 space-y-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={settings.announcement_bar_enabled}
                onChange={(e) => setSettings({ ...settings, announcement_bar_enabled: e.target.checked })}
              />
              <span>Display Top Announcement Banner on Storefront</span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-stone-600">Banner Announcement Text</span>
              <input
                type="text"
                value={settings.announcement_bar_text}
                onChange={(e) => setSettings({ ...settings, announcement_bar_text: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-7 py-3 text-xs font-semibold text-white shadow-md hover:bg-[#5A1E2B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
