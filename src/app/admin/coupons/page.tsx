"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Tags, X, Check } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editCoupon, setEditCoupon] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/coupons");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditCoupon({
      id: "",
      code: "",
      description: "",
      discount_type: "percent",
      discount_value: 10,
      min_order_amount: 500,
      max_discount_amount: 300,
      usage_limit: 100,
      is_active: true,
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(cpn: any) {
    setEditCoupon({ ...cpn });
    setIsModalOpen(true);
  }

  async function handleSaveCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!editCoupon) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCoupon),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      alert("Error saving coupon: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCoupon(id: string) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await adminFetch(`/api/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCoupons();
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Coupon &amp; Discount Rules</h1>
          <p className="text-xs text-stone-500">
            Create percentage discounts, flat cashback, minimum order thresholds, and usage caps
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Coupon</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full py-10 text-center text-xs text-stone-400">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="col-span-full py-10 text-center text-xs text-stone-400">No active coupons found.</p>
        ) : (
          coupons.map((cpn) => (
            <div
              key={cpn.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-stone-100 px-2.5 py-1 font-mono text-sm font-bold text-ink tracking-wider">
                    {cpn.code}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      cpn.is_active ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {cpn.is_active ? "Active" : "Disabled"}
                  </span>
                </div>

                <p className="mt-3 text-xs text-stone-600">{cpn.description || "Promotional Discount"}</p>

                <div className="mt-3 space-y-1 text-xs text-stone-500">
                  <p>
                    <strong className="text-stone-700">Benefit:</strong>{" "}
                    {cpn.discount_type === "percent"
                      ? `${cpn.discount_value}% OFF (Max ₹${cpn.max_discount_amount || "Unlimited"})`
                      : `Flat ₹${cpn.discount_value} OFF`}
                  </p>
                  <p>
                    <strong className="text-stone-700">Min. Order:</strong> ₹{cpn.min_order_amount || 0}
                  </p>
                  <p>
                    <strong className="text-stone-700">Times Used:</strong> {cpn.times_used || 0}{" "}
                    {cpn.usage_limit > 0 ? `/ ${cpn.usage_limit}` : "(Unlimited)"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-1 border-t border-stone-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cpn)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-[#6E2635]"
                  title="Edit coupon"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(cpn.id)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Delete coupon"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Coupon Modal */}
      {isModalOpen && editCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-ink">
                {editCoupon.id ? "Edit Coupon" : "Create Coupon"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Coupon Code *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE15, WELCOME200"
                  value={editCoupon.code}
                  onChange={(e) => setEditCoupon({ ...editCoupon, code: e.target.value.toUpperCase() })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs uppercase font-mono outline-none focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Short Description</span>
                <input
                  type="text"
                  placeholder="10% off for new shoppers..."
                  value={editCoupon.description}
                  onChange={(e) => setEditCoupon({ ...editCoupon, description: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Discount Type</span>
                  <select
                    value={editCoupon.discount_type}
                    onChange={(e) => setEditCoupon({ ...editCoupon, discount_type: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs outline-none focus:border-[#6E2635]"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Value *</span>
                  <input
                    type="number"
                    required
                    value={editCoupon.discount_value}
                    onChange={(e) => setEditCoupon({ ...editCoupon, discount_value: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Min. Order (₹)</span>
                  <input
                    type="number"
                    value={editCoupon.min_order_amount}
                    onChange={(e) => setEditCoupon({ ...editCoupon, min_order_amount: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Max Discount (₹)</span>
                  <input
                    type="number"
                    value={editCoupon.max_discount_amount}
                    onChange={(e) => setEditCoupon({ ...editCoupon, max_discount_amount: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={editCoupon.is_active}
                  onChange={(e) => setEditCoupon({ ...editCoupon, is_active: e.target.checked })}
                />
                <span>Active for Shoppers</span>
              </label>

              <div className="mt-6 flex justify-end gap-3 border-t border-stone-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-stone-200 px-5 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#6E2635] px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
