"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Copy,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Modal / Drawer state
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter, search]);

  async function fetchCategories() {
    try {
      const res = await adminFetch("/api/categories?includeInactive=true");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {}
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const res = await adminFetch(
        `/api/products?activeOnly=false&limit=${limit}&offset=${offset}&category=${categoryFilter}&search=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditProduct({
      id: "",
      slug: "",
      name: "",
      subtitle: "",
      category_id: categories[0]?.id || "dry-fruits",
      group_name: "General",
      origin: "",
      short: "",
      description: "",
      highlights: ["Carefully hand-selected", "Premium harvest quality"],
      storage: "Keep in a cool, dry place.",
      image: "/images/california-almonds.jpg",
      images: ["/images/california-almonds.jpg"],
      alt: "",
      badge: "",
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      is_bestseller: false,
      is_featured: 1,
      is_new: true,
      is_out_of_stock: false,
      is_active: true,
      stock_qty: 50,
      max_order_qty: 10,
      low_stock_threshold: 5,
      prices: { "250g": 450, "500g": 850 },
      sale_prices: {},
      includes: [],
      festival: "",
      tags: [],
      display_order: total + 1,
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(prod: any) {
    setEditProduct({ ...prod });
    setIsModalOpen(true);
  }

  function handleDuplicate(prod: any) {
    const copy = {
      ...prod,
      id: "",
      slug: `${prod.slug}-copy-${Math.floor(10 + Math.random() * 90)}`,
      name: `${prod.name} (Copy)`,
      sku: `${prod.sku}-COPY`,
    };
    setEditProduct(copy);
    setIsModalOpen(true);
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editProduct) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert("Error saving product: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await adminFetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch {}
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    try {
      const res = await adminFetch(`/api/products?bulkIds=${selectedIds.join(",")}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedIds([]);
        fetchProducts();
      }
    } catch {}
  }

  async function handleToggleStatus(prod: any, field: string) {
    const updated = { ...prod, [field]: !prod[field] };
    try {
      await adminFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      fetchProducts();
    } catch {}
  }

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Product Management</h1>
          <p className="text-xs text-stone-500">Manage 250+ products, stock levels, variants, and badges</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6E2635] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5A1E2B]"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search products by name, short description, group, or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-xl border border-stone-200 pl-10 pr-4 text-xs text-ink outline-none transition focus:border-[#6E2635]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-stone-400" />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-xs font-medium text-stone-700 outline-none focus:border-[#6E2635]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nav}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="border-b border-stone-200/80 bg-[#FAF8F6] text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === products.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(products.map((p) => p.id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">Category / Group</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Stock &amp; Limits</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-xs text-stone-400">
                    Loading products from database...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-xs text-stone-400">
                    No products matched your criteria.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const lowest = Math.min(...Object.values(prod.prices).map(Number).filter(Boolean));
                  const isOutOfStock = prod.is_out_of_stock || prod.stock_qty <= 0;
                  const isSelected = selectedIds.includes(prod.id);

                  return (
                    <tr key={prod.id} className="hover:bg-stone-50/60 transition">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds([...selectedIds, prod.id]);
                            else setSelectedIds(selectedIds.filter((id) => id !== prod.id));
                          }}
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white">
                            <Image src={prod.image} alt={prod.name} fill className="object-contain p-1" sizes="48px" />
                          </div>
                          <div>
                            <p className="font-semibold text-ink sm:text-sm">{prod.name}</p>
                            <p className="text-[11px] text-stone-400 font-mono">SKU: {prod.sku || "N/A"}</p>
                            <div className="mt-1 flex items-center gap-1.5">
                              {prod.is_bestseller && (
                                <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                                  BESTSELLER
                                </span>
                              )}
                              {prod.badge && (
                                <span className="rounded bg-stone-100 px-1.5 py-0.2 text-[9px] font-medium text-stone-600">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-stone-800">{prod.category_id}</p>
                        <p className="text-[11px] text-stone-400">{prod.group_name}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-serif font-bold text-ink sm:text-sm">{formatPrice(lowest)}</p>
                        <p className="text-[10px] text-stone-400">
                          {Object.keys(prod.prices).join(", ")}
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isOutOfStock
                                ? "bg-rose-100 text-rose-700"
                                : prod.stock_qty <= prod.low_stock_threshold
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {isOutOfStock ? "Out of Stock" : `${prod.stock_qty} in stock`}
                          </span>
                          <p className="text-[10px] text-stone-400">Max/order: {prod.max_order_qty}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(prod, "is_active")}
                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              prod.is_active ? "bg-emerald-50 text-emerald-700" : "bg-stone-200 text-stone-600"
                            }`}
                          >
                            {prod.is_active ? "Active" : "Hidden"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(prod, "is_out_of_stock")}
                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              isOutOfStock ? "bg-rose-50 text-rose-700" : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {isOutOfStock ? "Sold Out" : "In Stock"}
                          </button>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(prod)}
                            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                            title="Duplicate product"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-[#6E2635]"
                            title="Edit product"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3">
          <p className="text-xs text-stone-500">
            Showing {products.length} of {total} products
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-stone-700">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {isModalOpen && editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="font-serif text-xl font-bold text-ink sm:text-2xl">
                {editProduct.id ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-stone-600">Product Name *</span>
                  <input
                    type="text"
                    required
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Category *</span>
                  <select
                    value={editProduct.category_id}
                    onChange={(e) => setEditProduct({ ...editProduct, category_id: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs outline-none focus:border-[#6E2635]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nav}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Group / Sub-category</span>
                  <input
                    type="text"
                    value={editProduct.group_name}
                    onChange={(e) => setEditProduct({ ...editProduct, group_name: e.target.value })}
                    placeholder="Nuts, Dates, Hampers, Dark..."
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">SKU Code</span>
                  <input
                    type="text"
                    value={editProduct.sku}
                    onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Origin</span>
                  <input
                    type="text"
                    value={editProduct.origin}
                    placeholder="California, Iran, India..."
                    onChange={(e) => setEditProduct({ ...editProduct, origin: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-stone-600">Short Summary</span>
                  <input
                    type="text"
                    value={editProduct.short}
                    placeholder="Short line shown on cards..."
                    onChange={(e) => setEditProduct({ ...editProduct, short: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-stone-600">Full Description</span>
                  <textarea
                    rows={3}
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-stone-600">Image URL / Path</span>
                  <input
                    type="text"
                    value={editProduct.image}
                    placeholder="/images/california-almonds.jpg"
                    onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                {/* Stock & Purchase Limits */}
                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Current Stock Quantity</span>
                  <input
                    type="number"
                    min="0"
                    value={editProduct.stock_qty}
                    onChange={(e) => setEditProduct({ ...editProduct, stock_qty: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-stone-600">Max Allowed Per Order</span>
                  <input
                    type="number"
                    min="1"
                    value={editProduct.max_order_qty}
                    onChange={(e) => setEditProduct({ ...editProduct, max_order_qty: Number(e.target.value) })}
                    className="mt-1 h-10 w-full rounded-xl border border-stone-200 px-3 text-xs outline-none focus:border-[#6E2635]"
                  />
                </label>

                {/* Weight & Prices */}
                <div className="sm:col-span-2 rounded-2xl border border-stone-100 bg-[#FAF8F6] p-4">
                  <span className="text-xs font-semibold text-stone-700">Weights &amp; Prices (₹ INR)</span>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {["100g", "250g", "500g", "1kg"].map((wt) => (
                      <label key={wt} className="block">
                        <span className="text-[11px] text-stone-500">{wt}</span>
                        <input
                          type="number"
                          placeholder="—"
                          value={editProduct.prices?.[wt] ?? ""}
                          onChange={(e) => {
                            const val = e.target.value ? Number(e.target.value) : undefined;
                            const nextPrices = { ...editProduct.prices };
                            if (val == null) delete nextPrices[wt];
                            else nextPrices[wt] = val;
                            setEditProduct({ ...editProduct, prices: nextPrices });
                          }}
                          className="mt-0.5 h-9 w-full rounded-lg border border-stone-200 bg-white px-2.5 text-xs outline-none focus:border-[#6E2635]"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Checkbox Toggles */}
                <div className="sm:col-span-2 flex flex-wrap gap-5 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={editProduct.is_active}
                      onChange={(e) => setEditProduct({ ...editProduct, is_active: e.target.checked })}
                    />
                    <span>Active (Visible on Store)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={editProduct.is_out_of_stock}
                      onChange={(e) => setEditProduct({ ...editProduct, is_out_of_stock: e.target.checked })}
                    />
                    <span>Mark as Out of Stock</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={editProduct.is_bestseller}
                      onChange={(e) => setEditProduct({ ...editProduct, is_bestseller: e.target.checked })}
                    />
                    <span>Mark as Bestseller</span>
                  </label>
                </div>
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
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
