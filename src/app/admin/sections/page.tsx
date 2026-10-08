"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Sliders, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editSection, setEditSection] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchCategories();
  }, []);

  async function fetchSections() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/sections?includeInactive=true");
      const data = await res.json();
      setSections(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await adminFetch("/api/categories?includeInactive=true");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {}
  }

  function handleOpenCreate() {
    setEditSection({
      id: "",
      section_key: `section-${Date.now()}`,
      title: "",
      subtitle: "",
      label: "Explore Collection",
      eyebrow: "Selected Showcase",
      image: "/images/hero-composition.jpg",
      source_type: "category",
      source_category_id: categories[0]?.id || "dry-fruits",
      limit_count: 8,
      display_order: sections.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(sec: any) {
    setEditSection({ ...sec });
    setIsModalOpen(true);
  }

  async function handleSaveSection(e: React.FormEvent) {
    e.preventDefault();
    if (!editSection) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSection),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsModalOpen(false);
      fetchSections();
    } catch (err: any) {
      alert("Error saving section: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSection(id: string) {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      const res = await adminFetch(`/api/sections?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchSections();
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Homepage Section Builder</h1>
          <p className="text-xs text-stone-500">
            Create 10, 12, 15+ flexible homepage showcase sections without touching developer code
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Homepage Section</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full py-10 text-center text-xs text-stone-400">Loading sections...</p>
        ) : sections.length === 0 ? (
          <p className="col-span-full py-10 text-center text-xs text-stone-400">No homepage sections configured.</p>
        ) : (
          sections.map((sec) => (
            <div
              key={sec.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs transition hover:border-[#6E2635]/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E2635]">
                    Order #{sec.display_order}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      sec.is_active ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {sec.is_active ? "Active on Home" : "Disabled"}
                  </span>
                </div>

                <p className="mt-2 text-[10px] uppercase tracking-wider text-stone-400">{sec.eyebrow}</p>
                <h3 className="font-serif text-lg font-bold text-ink">{sec.title}</h3>
                <p className="text-xs text-stone-500 line-clamp-2">{sec.subtitle}</p>

                <div className="mt-4 rounded-xl border border-stone-100 bg-[#FAF8F6] p-3 text-xs text-stone-600">
                  <p>
                    <strong className="text-stone-700">Source:</strong> {sec.source_type}
                  </p>
                  {sec.source_category_id && (
                    <p>
                      <strong className="text-stone-700">Category:</strong> {sec.source_category_id}
                    </p>
                  )}
                  <p>
                    <strong className="text-stone-700">Limit:</strong> Up to {sec.limit_count} products
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="text-xs font-semibold text-[#6E2635]">{sec.label}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sec)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-[#6E2635]"
                    title="Edit section"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sec.id)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Section Modal */}
      {isModalOpen && editSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-ink">
                {editSection.id ? "Edit Homepage Section" : "Add New Homepage Section"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Section Title *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Signature California Almonds & Nuts"
                  value={editSection.title}
                  onChange={(e) => setEditSection({ ...editSection, title: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Eyebrow / Small Header</span>
                <input
                  type="text"
                  placeholder="e.g. Fresh Harvest · Selected by Hand"
                  value={editSection.eyebrow}
                  onChange={(e) => setEditSection({ ...editSection, eyebrow: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-stone-600">Subtitle Description</span>
                <textarea
                  rows={2}
                  placeholder="Supporting line shown below section title..."
                  value={editSection.subtitle}
                  onChange={(e) => setEditSection({ ...editSection, subtitle: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs outline-none focus:border-[#6E2635]"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Product Source *</span>
                  <select
                    value={editSection.source_type}
                    onChange={(e) => setEditSection({ ...editSection, source_type: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs outline-none focus:border-[#6E2635]"
                  >
                    <option value="category">Specific Category</option>
                    <option value="best-sellers">Best Sellers</option>
                  </select>
                </label>

                {editSection.source_type === "category" && (
                  <label className="block">
                    <span className="text-xs font-semibold text-stone-600">Select Category *</span>
                    <select
                      value={editSection.source_category_id}
                      onChange={(e) => setEditSection({ ...editSection, source_category_id: e.target.value })}
                      className="mt-1 h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs outline-none focus:border-[#6E2635]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nav}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Button Label</span>
                  <input
                    type="text"
                    value={editSection.label}
                    placeholder="e.g. Explore Collection"
                    onChange={(e) => setEditSection({ ...editSection, label: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Max Products Shown</span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={editSection.limit_count}
                    onChange={(e) => setEditSection({ ...editSection, limit_count: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Display Order</span>
                  <input
                    type="number"
                    value={editSection.display_order}
                    onChange={(e) => setEditSection({ ...editSection, display_order: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="flex items-center gap-2 pt-6 text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={editSection.is_active}
                    onChange={(e) => setEditSection({ ...editSection, is_active: e.target.checked })}
                  />
                  <span>Active on Homepage</span>
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
                  {saving ? "Saving..." : "Save Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
