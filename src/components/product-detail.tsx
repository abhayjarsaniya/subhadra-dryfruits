"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  collections,
  defaultWeight,
  priceFor,
  weightsOf,
  type Product,
} from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const weights = weightsOf(product);
  const [weight, setWeight] = useState(defaultWeight(product));
  const { lines, incrementItem, decrementItem, addItem, setCartOpen } = useStore();

  const currentLine = lines.find((l) => l.slug === product.slug && l.weight === weight);
  const currentQty = currentLine ? currentLine.qty : 0;

  const price = priceFor(product, weight);
  const collection = collections[product.category] || { nav: "Collection" };
  const bundle = product.category === "bundles";

  const isOutOfStock = Boolean(product.available === false || (product as any).is_out_of_stock || (product as any).stock_qty <= 0);

  function handleAdd() {
    if (isOutOfStock) return;
    addItem(product.slug, weight);
  }

  function handleIncrement() {
    if (isOutOfStock) return;
    incrementItem(product.slug, weight);
  }

  function handleDecrement() {
    decrementItem(product.slug, weight);
  }

  function handleBuyNow() {
    if (isOutOfStock) return;
    if (currentQty === 0) {
      addItem(product.slug, weight);
    }
    setCartOpen(true);
  }

  return (
    <div className="shell py-8 sm:py-12">
      <nav className="text-xs text-stone-500 sm:text-sm" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-[#6E2635]">Home</Link>
        <span className="px-2 text-stone-400">/</span>
        <Link href={`/${product.category}`} className="transition-colors hover:text-[#6E2635]">{collection.nav}</Link>
        <span className="px-2 text-stone-400">/</span>
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[24px] border border-[#e6e2dc] bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority
            className="object-contain p-4 sm:p-8"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.bestseller && (
            <span className="absolute left-4 top-4 rounded-full border border-[#e6e2dc] bg-white/95 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#6E2635] shadow-xs">
              Bestseller
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute right-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-xs">
              Out of Stock
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6E2635]">
            {product.group}
          </p>

          <h1 className="mt-2 font-serif text-3xl font-medium leading-[1.15] text-ink sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            {product.description}
          </p>

          {bundle && product.includes.length > 0 && (
            <div className="mt-6 rounded-2xl border border-stone-200 bg-[#fbf9f6] p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                What&apos;s Inside This Celebration Box:
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-stone-600 sm:text-sm">
                {product.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6E2635]" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <ul className="mt-5 space-y-2 border-y border-stone-100 py-4 text-xs text-stone-600 sm:text-sm">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span className="text-[#6E2635]">✦</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Weight Selection */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Select Pack Size / Weight
              </span>
              <span className="text-xs text-stone-500">
                Available: {weights.join(", ")}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Select weight">
              {weights.map((option) => {
                const selected = option === weight;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setWeight(option)}
                    aria-pressed={selected}
                    className={`inline-flex min-h-[46px] min-w-[56px] items-center justify-center rounded-full border bg-white px-4 py-2 text-xs font-medium tracking-wide transition-all duration-200 sm:text-sm ${
                      selected
                        ? "border-[#6E2635] font-semibold text-[#6E2635]"
                        : "border-[#e4e0da] text-stone-600 [@media(hover:hover)]:hover:border-[#6E2635] [@media(hover:hover)]:hover:text-[#6E2635]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div className="mt-7 border-t border-stone-100 pt-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">Price (Inclusive of all taxes)</p>
            <div className="mt-1 flex items-baseline gap-3">
              <p className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                {formatPrice(price)}
              </p>
              {isOutOfStock ? (
                <span className="text-sm font-semibold text-rose-600">Currently Out of Stock</span>
              ) : (
                <span className="text-xs text-emerald-700">✓ In Stock & Ready to Ship</span>
              )}
            </div>
          </div>

          {/* CTAs: Add to Cart (Primary) & Buy Now */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {isOutOfStock ? (
              <button
                type="button"
                disabled
                className="flex min-h-[50px] w-full flex-1 cursor-not-allowed items-center justify-center rounded-full bg-stone-200 px-6 py-3 text-[14.5px] font-semibold text-stone-500"
              >
                Out of Stock
              </button>
            ) : currentQty === 0 ? (
              <button
                type="button"
                onClick={handleAdd}
                className="flex min-h-[50px] w-full flex-1 cursor-pointer items-center justify-center rounded-full bg-[#6E2635] px-6 py-3 text-[14.5px] font-semibold tracking-wide text-white shadow-md transition-all duration-200 active:scale-[0.99] sm:text-[15px] [@media(hover:hover)]:hover:-translate-y-[1px] [@media(hover:hover)]:hover:bg-[#5A1E2B]"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex min-h-[50px] w-full flex-1 items-center justify-between rounded-full border border-stone-200 bg-white p-1 text-[#6E2635] shadow-sm animate-page sm:max-w-xs">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={handleDecrement}
                  className="flex h-11 w-12 items-center justify-center rounded-l-full text-xl font-semibold transition-colors duration-150 active:scale-95 [@media(hover:hover)]:hover:bg-[#6E2635]/10"
                >
                  −
                </button>
                <div className="text-center">
                  <span className="text-sm font-semibold sm:text-base">{currentQty}</span>
                  <span className="ml-1 text-[11px] text-stone-400">in cart</span>
                </div>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={handleIncrement}
                  className="flex h-11 w-12 items-center justify-center rounded-r-full text-xl font-semibold transition-colors duration-150 active:scale-95 [@media(hover:hover)]:hover:bg-[#6E2635]/10"
                >
                  +
                </button>
              </div>
            )}

            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex min-h-[50px] w-full flex-1 cursor-pointer items-center justify-center rounded-full border border-[#6E2635] bg-white px-6 py-3 text-[14.5px] font-semibold tracking-wide text-[#6E2635] shadow-sm transition-all duration-200 active:scale-[0.99] sm:text-[15px] [@media(hover:hover)]:hover:bg-[#6E2635]/5"
              >
                Buy Now
              </button>
            )}
          </div>

          {/* Storage & Freshness note */}
          <div className="mt-8 rounded-2xl border border-stone-200/70 bg-[#faf8f6] p-4 text-xs leading-relaxed text-stone-600">
            <p className="font-semibold text-ink">Storage &amp; Freshness</p>
            <p className="mt-1">{product.storage}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-stone-200/70 pt-12 sm:mt-24 sm:pt-16">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
            You May Also Enjoy
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
