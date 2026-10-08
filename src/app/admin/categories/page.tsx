"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Layers, Check, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editCategory, setEditCategory] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/categories?includeInactive=true");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditCategory({
      id: "",
      slug: "",
      nav: "",
      eyebrow: "Selected Harvest",
      title: "",
      subtitle: "",
      description: "",
      meta_title: "",
      accent: "gold",
      image: "/images/hero-composition.jpg",
      groups: ["Nuts", "Dates & Figs"],
      display_order: categories.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(cat: any) {
    setEditCategory({ ...cat });
    setIsModalOpen(true);
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editCategory) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert("Error saving category: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await adminFetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Category Management</h1>
          <p className="text-xs text-stone-500">
            Create 10–12+ scalable categories, manage navigation, group tags, and descriptions
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full py-10 text-center text-xs text-stone-400">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="col-span-full py-10 text-center text-xs text-stone-400">No categories found.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs transition hover:border-[#6E2635]/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E2635]">
                    Order #{cat.display_order}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      cat.is_active ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {cat.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-lg font-bold text-ink">{cat.nav}</h3>
                <p className="text-xs text-stone-500 line-clamp-1">{cat.title}</p>
                <p className="mt-2 text-xs text-stone-600 line-clamp-2">{cat.description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.groups?.map((g: string) => (
                    <span key={g} className="rounded-lg bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="text-[11px] text-stone-500">
                  {cat.product_count ?? 0} active products
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-[#6E2635]"
                    title="Edit category"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Category Modal */}
      {isModalOpen && editCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-ink">
                {editCategory.id ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Navigation Label *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dry Fruits, Chocolates, Exotic Seeds..."
                  value={editCategory.nav}
                  onChange={(e) => setEditCategory({ ...editCategory, nav: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Category Page Title *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Dry Fruits, Picked for Every Occasion"
                  value={editCategory.title}
                  onChange={(e) => setEditCategory({ ...editCategory, title: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Category Description</span>
                <textarea
                  rows={2}
                  value={editCategory.description}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Group Tags (Comma separated)</span>
                <input
                  type="text"
                  value={editCategory.groups?.join(", ") || ""}
                  onChange={(e) =>
                    setEditCategory({
                      ...editCategory,
                      groups: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Nuts, Dates & Figs, Seeds..."
                  className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Display Order</span>
                  <input
                    type="number"
                    value={editCategory.display_order}
                    onChange={(e) => setEditCategory({ ...editCategory, display_order: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="flex items-center gap-2 pt-6 text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={editCategory.is_active}
                    onChange={(e) => setEditCategory({ ...editCategory, is_active: e.target.checked })}
                  />
                  <span>Active on Live Store</span>
                </label>
              </div>

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
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
