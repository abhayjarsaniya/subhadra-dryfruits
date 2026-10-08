"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { defaultWeight, priceFor, productPath, weightsOf, type Product, type Weight } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/components/store";

export function ProductCard({
  product,
  priority = false,
  showSubtext = false,
}: {
  product: Product;
  priority?: boolean;
  showSubtext?: boolean;
}) {
  const weights = weightsOf(product);
  const [weight, setWeight] = useState<Weight>(defaultWeight(product));
  const { lines, incrementItem, decrementItem, updateQty, showNotice } = useStore();

  // Find if this product is in cart with the current weight or another weight
  const cartItemForProduct = lines.find((l) => l.slug === product.slug);
  const activeWeight: Weight = lines.some((l) => l.slug === product.slug && l.weight === weight)
    ? weight
    : ((cartItemForProduct?.weight as Weight) || weight);

  const currentLine = lines.find((l) => l.slug === product.slug && l.weight === activeWeight);
  const currentQty = currentLine ? currentLine.qty : 0;

  // Mobile quick selection sheet state
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [sheetWeight, setSheetWeight] = useState<Weight>(activeWeight);
  const [sheetQty, setSheetQty] = useState(1);

  // Sync sheet weight if active weight changes
  useEffect(() => {
    setSheetWeight(activeWeight);
  }, [activeWeight]);

  const price = priceFor(product, activeWeight);
  const sheetPrice = priceFor(product, sheetWeight);
  const bundle = product.category === "bundles";
  const badge = product.bestseller ? "Bestseller" : product.group;

  // Desktop Add Handler
  function handleDesktopAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    incrementItem(product.slug, activeWeight);
  }

  // Increment Quantity
  function handleIncrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    incrementItem(product.slug, activeWeight);
  }

  // Decrement Quantity
  function handleDecrement(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    decrementItem(product.slug, activeWeight);
  }

  // Mobile Add Confirm from Quick Sheet
  function handleMobileConfirm() {
    updateQty(product.slug, sheetWeight, sheetQty);
    setWeight(sheetWeight);
    setMobileSheetOpen(false);
    showNotice("Added to cart ✓", "ok");
  }

  return (
    <>
      <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-[#e6e2dc] bg-white shadow-[0_4px_16px_-12px_rgba(110,38,53,0.12)] transition-all duration-300 min-[360px]:rounded-[20px] [@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:border-[#6E2635]/30 [@media(hover:hover)]:hover:shadow-[0_12px_28px_-16px_rgba(110,38,53,0.18)]">
        <Link href={productPath(product)} aria-label={product.name} className="relative block aspect-square overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
            className="object-contain p-1.5 transition-transform duration-300 min-[360px]:p-2 sm:p-4 [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
          <span className="absolute left-2 top-2 rounded-full border border-[#e6e2dc] bg-white/95 px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.08em] text-[#6E2635] shadow-sm min-[360px]:text-[9px] sm:left-2.5 sm:top-2.5 sm:px-2.5 sm:text-[10px]">
            {badge}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-2.5 min-[360px]:p-3 sm:p-4">
          <h3 className="line-clamp-2 h-[2.6em] font-serif text-[13.5px] font-medium leading-[1.25] text-ink min-[360px]:text-[14.5px] sm:h-auto sm:min-h-[2.5em] sm:text-xl sm:leading-snug">
            <Link href={productPath(product)} className="transition-colors hover:text-[#6E2635]">
              {product.name}
            </Link>
          </h3>

          {/* SUBTEXT: Shown on collection pages (showSubtext=true), hidden on mobile for homepage carousels (showSubtext=false) */}
          {showSubtext ? (
            <p className="mt-1 line-clamp-2 min-h-[2.4em] text-[11px] leading-relaxed text-stone-500 min-[360px]:text-xs sm:text-sm">
              {product.short}
            </p>
          ) : (
            <p className="mt-1 hidden text-xs leading-relaxed text-stone-500 sm:line-clamp-2 sm:min-h-[2.4em] sm:text-sm">
              {product.short}
            </p>
          )}

          {bundle && product.includes.length > 0 ? (
            <p className={`mt-1 text-[10.5px] leading-relaxed text-stone-600 sm:line-clamp-1 sm:text-[11px] ${showSubtext ? "line-clamp-1" : "hidden sm:block"}`}>
              {product.includes.join(" + ")}
            </p>
          ) : null}

          {/* 2. HIDE GRAM/KG OPTIONS INITIALLY ON MOBILE (visible on sm: and up) */}
          <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex" role="group" aria-label={`Weight for ${product.name}`}>
            {weights.map((option) => {
              const selected = option === activeWeight;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setWeight(option)}
                  aria-pressed={selected}
                  className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border bg-white px-3 text-xs tracking-wide transition-all duration-200 ${
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

          {/* DESKTOP FOOTER (sm: and up) — UNCHANGED */}
          <div className="mt-auto hidden items-end justify-between gap-2 pt-4 sm:flex">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.14em] text-stone-400">Indicative</p>
              <p className="font-serif text-lg font-medium text-ink sm:text-2xl">{formatPrice(price)}</p>
            </div>

            {currentQty === 0 ? (
              <button
                type="button"
                onClick={handleDesktopAdd}
                className="relative inline-flex min-h-[44px] min-w-[72px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#6E2635] px-5 text-xs font-medium text-white shadow-sm transition-all duration-200 active:scale-95 [@media(hover:hover)]:hover:-translate-y-[1px] [@media(hover:hover)]:hover:bg-[#5A1E2B] sm:text-sm"
              >
                Add
              </button>
            ) : (
              <div className="flex flex-col items-end">
                <div className="inline-flex min-h-[44px] items-center rounded-full border border-stone-200 bg-white text-[#6E2635] shadow-sm transition-all duration-200 animate-page">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${product.name}`}
                    onClick={handleDecrement}
                    className="flex h-11 w-11 items-center justify-center rounded-l-full text-base font-semibold transition-colors duration-150 active:scale-95 [@media(hover:hover)]:hover:bg-[#6E2635]/10"
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center text-xs font-semibold sm:min-w-7 sm:text-sm">
                    {currentQty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${product.name}`}
                    disabled={currentQty >= 10}
                    onClick={handleIncrement}
                    className={`flex h-11 w-11 items-center justify-center rounded-r-full text-base font-semibold transition-colors duration-150 active:scale-95 ${
                      currentQty >= 10
                        ? "cursor-not-allowed opacity-25"
                        : "[@media(hover:hover)]:hover:bg-[#6E2635]/10"
                    }`}
                    title={currentQty >= 10 ? "Maximum quantity reached (10 per product)" : "Increase quantity"}
                  >
                    +
                  </button>
                </div>
                {currentQty >= 10 && (
                  <span className="mt-1 text-[10px] font-medium text-[#6E2635]">Max 10 reached</span>
                )}
              </div>
            )}
          </div>

          {/* MOBILE FOOTER (< sm) — CLEAN & COMPACT */}
          <div className="mt-auto pt-2.5 sm:hidden">
            {currentQty === 0 ? (
              <div className="flex items-center justify-between gap-1">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.12em] text-stone-400">Indicative</p>
                  <p className="font-serif text-[15px] font-semibold text-ink min-[360px]:text-base">
                    {formatPrice(price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSheetWeight(activeWeight);
                    setSheetQty(1);
                    setMobileSheetOpen(true);
                  }}
                  className="inline-flex min-h-[44px] min-w-[70px] items-center justify-center rounded-full bg-[#6E2635] px-4.5 text-xs font-semibold text-white shadow-sm active:scale-95 sm:text-sm"
                >
                  Add
                </button>
              </div>
            ) : (
              /* 5. MOBILE PRODUCT CARD AFTER SELECTION: Compact Weight + − 1 + */
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSheetWeight(activeWeight);
                      setSheetQty(currentQty);
                      setMobileSheetOpen(true);
                    }}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-[#6E2635] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6E2635]"
                    title="Change weight"
                  >
                    <span>{activeWeight}</span>
                    <span className="text-[8px] text-[#6E2635]/70">▼</span>
                  </button>
                  <span className="font-serif text-[13.5px] font-semibold text-ink min-[360px]:text-sm">
                    {formatPrice(price * currentQty)}
                  </span>
                </div>

                <div className="flex items-center justify-end">
                  <div className="inline-flex min-h-[44px] w-full items-center justify-between rounded-full border border-stone-200 bg-white text-[#6E2635] shadow-sm">
                    <button
                      type="button"
                      aria-label={`Decrease ${product.name}`}
                      onClick={handleDecrement}
                      className="flex h-11 w-11 items-center justify-center rounded-l-full text-base font-semibold active:scale-90"
                    >
                      −
                    </button>
                    <span className="text-xs font-semibold">{currentQty}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name}`}
                      disabled={currentQty >= 10}
                      onClick={handleIncrement}
                      className={`flex h-11 w-11 items-center justify-center rounded-r-full text-base font-semibold active:scale-90 ${
                        currentQty >= 10 ? "cursor-not-allowed opacity-25" : ""
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
                {currentQty >= 10 && (
                  <p className="text-right text-[9px] font-medium text-[#6E2635]">Max 10 reached</p>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* 3 & 4. COMPACT MOBILE SELECTION SHEET (< sm only) */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-[90] flex items-end sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSheetOpen(false)}
          />

          {/* Compact Bottom Sheet */}
          <div className="relative z-10 w-full rounded-t-[24px] border-t border-stone-100 bg-white p-5 shadow-2xl animate-page">
            {/* Top Bar */}
            <div className="mx-auto -mt-1 mb-3 h-1 w-10 rounded-full bg-stone-300" />
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-stone-100 bg-[#fbf9f6]">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-contain p-1"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-base font-semibold text-ink truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {formatPrice(sheetPrice)} for {sheetWeight}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:text-ink active:scale-95"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Weight Selection */}
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Select Weight
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {weights.map((option) => {
                  const selected = option === sheetWeight;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSheetWeight(option)}
                      className={`inline-flex min-h-[44px] min-w-[58px] items-center justify-center rounded-full border bg-white px-3.5 text-xs font-medium transition-all ${
                        selected
                          ? "border-[#6E2635] font-semibold text-[#6E2635] shadow-sm"
                          : "border-stone-200 text-stone-600"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Control */}
            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Quantity
                </p>
                <p className="text-xs text-stone-400">Maximum 10 per product</p>
              </div>

              <div className="inline-flex min-h-[46px] items-center rounded-full border border-stone-200 bg-white text-[#6E2635] shadow-sm">
                <button
                  type="button"
                  onClick={() => setSheetQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-l-full text-base font-semibold active:scale-90"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-7 text-center text-sm font-semibold">{sheetQty}</span>
                <button
                  type="button"
                  disabled={sheetQty >= 10}
                  onClick={() => setSheetQty((q) => Math.min(10, q + 1))}
                  className={`flex h-11 w-11 items-center justify-center rounded-r-full text-base font-semibold active:scale-90 ${
                    sheetQty >= 10 ? "cursor-not-allowed opacity-25" : ""
                  }`}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Confirm Add Button */}
            <div className="mt-5 pt-2">
              <button
                type="button"
                onClick={handleMobileConfirm}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#6E2635] px-4 py-3 text-sm font-semibold text-white shadow-md active:scale-[0.99]"
              >
                <span>Add to Inquiry</span>
                <span>·</span>
                <span>{sheetWeight} × {sheetQty}</span>
                <span>({formatPrice(sheetPrice * sheetQty)})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
