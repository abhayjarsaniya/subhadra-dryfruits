"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  collections,
  lowestPrice,
  productsFor,
  type CollectionId,
} from "@/data/catalog";
import { Eyebrow } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price · Low to High" },
  { id: "price-desc", label: "Price · High to Low" },
  { id: "name", label: "Name · A to Z" },
] as const;

type SortId = (typeof sorts)[number]["id"];

function GroupQueryWatcher({ onSelectGroup }: { onSelectGroup: (grp: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const param = searchParams?.get("group");
    if (param) {
      onSelectGroup(param);
    }
  }, [searchParams, onSelectGroup]);
  return null;
}

export function CollectionView({ id }: { id: CollectionId }) {
  const collection = collections[id];
  const source = productsFor(id);
  const { setCartOpen } = useStore();

  const [group, setGroup] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortId>("featured");

  const groups = collection.groups.filter((name) => source.some((product) => product.group === name));
  const categories = id === "best-sellers"
    ? ["Dry Fruits", "Chocolates", "Coffee & Tea", "Celebration Boxes"]
    : [];

  const visible = useMemo(() => {
    let list = source.filter((product) => (group === "All" ? true : product.group === group));
    if (id === "best-sellers" && category !== "All") {
      const map: Record<string, string> = {
        "Dry Fruits": "dry-fruits",
        Chocolates: "chocolates",
        "Coffee & Tea": "coffee-tea",
        "Celebration Boxes": "bundles",
      };
      list = list.filter((product) => product.category === map[category]);
    }
    const next = list.slice();
    if (sort === "price-asc") next.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    if (sort === "price-desc") next.sort((a, b) => lowestPrice(b) - lowestPrice(a));
    if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }, [source, group, category, sort, id]);

  return (
    <div>
      <Suspense fallback={null}>
        <GroupQueryWatcher onSelectGroup={setGroup} />
      </Suspense>
      <section className="shell pb-8 pt-10 sm:pt-14">
        <Eyebrow accent="almond">{collection.eyebrow}</Eyebrow>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium leading-[1.05] text-ink sm:text-6xl">
          {collection.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
          {collection.description}
        </p>
      </section>

      <section className="shell pb-20">
        <div className="flex flex-col gap-4 border-y border-stone-100 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {["All", ...groups].map((name) => {
              const active = group === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setGroup(name)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition sm:text-sm ${
                    active
                      ? "border-[#6E2635] bg-white font-semibold text-[#6E2635] shadow-sm"
                      : "border-[#e4e0da] bg-white text-stone-600 hover:border-[#6E2635]/40"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-3 text-xs font-medium text-stone-500 sm:text-sm">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
              className="h-10 rounded-full border border-stone-200 bg-white px-3.5 text-xs text-ink outline-none transition focus:border-[#6E2635] sm:text-sm"
            >
              {sorts.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {categories.length > 0 ? (
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
            {["All", ...categories].map((name) => {
              const active = category === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-[#6E2635] bg-white font-semibold text-[#6E2635]"
                      : "border-stone-200 bg-white text-stone-600 hover:border-[#6E2635]/40"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        ) : null}

        <p className="mt-5 text-xs text-stone-500">{visible.length} selections available</p>

        {visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-2xl text-ink">No items match this filter.</p>
            <button
              type="button"
              onClick={() => {
                setGroup("All");
                setCategory("All");
              }}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#6E2635] px-5 py-2 text-xs font-semibold text-[#6E2635] transition hover:bg-[#6E2635]/5 active:scale-95 sm:text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 items-stretch gap-2.5 gap-y-4.5 sm:gap-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.slug} product={product} showSubtext={true} />
            ))}
          </div>
        )}

        <div className="mt-16 rounded-[2rem] border border-[#e6e2dc] bg-[#fbf9f6] p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
            Express Doorstep Delivery
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium text-ink sm:text-4xl">
            Choose Your Favourites. We&apos;ll Dispatch Right Away.
          </h2>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-stone-600 sm:text-sm">
            Select weights and add as many items as you wish to your cart. Complimentary shipping on orders above ₹1,499 with secure online payment or Cash on Delivery.
          </p>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-[#6E2635] px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A1E2B] active:scale-[0.99] sm:w-auto"
          >
            View Cart &amp; Checkout →
          </button>
        </div>
      </section>
    </div>
  );
}
