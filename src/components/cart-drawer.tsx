"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProduct, priceFor, productPath } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/components/store";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const router = useRouter();
  const {
    lines,
    cartOpen,
    setCartOpen,
    totalCount,
    incrementItem,
    decrementItem,
    removeItem,
    showNotice,
  } = useStore();

  const [dbProductMap, setDbProductMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!cartOpen || lines.length === 0) return;
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const map: Record<string, any> = {};
          for (const p of data.products) map[p.slug] = p;
          setDbProductMap(map);
        }
      })
      .catch(() => {});
  }, [cartOpen, lines]);

  if (!cartOpen) return null;

  const detailed = lines
    .map((line) => {
      const dbProd = dbProductMap[line.slug];
      const localProduct = getProduct(line.slug);
      const product = dbProd || localProduct;
      if (!product) return null;

      const price = dbProd
        ? (dbProd.prices[line.weight] ?? Object.values(dbProd.prices)[0] ?? 0)
        : priceFor(localProduct!, line.weight);

      return { line, product, price };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = detailed.reduce((acc, { line, price }) => acc + price * line.qty, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <aside className="fixed inset-y-0 right-0 flex w-full max-w-full flex-col bg-white shadow-2xl transition-all sm:max-w-md sm:rounded-l-[2rem]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">Your Cart</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              {totalCount > 0 ? `${totalCount} ${totalCount === 1 ? "item" : "items"} in cart` : "Your cart is empty"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition-colors [@media(hover:hover)]:hover:border-[#6E2635] [@media(hover:hover)]:hover:text-[#6E2635]"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {detailed.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f5f2] text-2xl text-[#6E2635]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 7h15l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.2 4.8H3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="20" r="1.3" fill="currentColor" />
                  <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                </svg>
              </div>
              <p className="mt-4 font-serif text-2xl text-ink">Your cart is empty.</p>
              <p className="mt-2 max-w-xs text-xs text-stone-500 sm:text-sm">
                Explore our dry fruits, chocolates, coffee and celebration boxes to start shopping.
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-[#6E2635] px-6 text-xs font-medium text-white transition-all duration-200 active:scale-95 [@media(hover:hover)]:hover:bg-[#5A1E2B]"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {detailed.map(({ line, product, price }) => {
                const maxQty = product.max_order_qty || 10;
                const stockQty = product.stock_qty ?? 99;
                const isOutOfStock = product.is_out_of_stock || stockQty <= 0;

                return (
                  <li key={`${line.slug}-${line.weight}`} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-3">
                      <Link
                        href={`/${product.category_id || product.category}/${product.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-[#fbf9f6]"
                      >
                        <Image
                          src={product.image}
                          alt={product.alt || product.name}
                          fill
                          className="object-contain p-1.5"
                          sizes="80px"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/${product.category_id || product.category}/${product.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="line-clamp-1 font-serif text-base font-medium text-ink transition-colors hover:text-[#6E2635] sm:text-lg"
                            >
                              {product.name}
                            </Link>
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="inline-block rounded border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-700">
                                {line.weight}
                              </span>
                              <span className="text-xs text-stone-500">{formatPrice(price)} each</span>
                            </div>
                            {isOutOfStock && (
                              <span className="mt-1 inline-block rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(line.slug, line.weight)}
                            className="inline-flex min-h-[40px] items-center px-2 py-1 text-xs text-stone-400 transition-colors [@media(hover:hover)]:hover:text-[#6E2635]"
                            aria-label={`Remove ${product.name}`}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* Plus / Minus quantity controller */}
                          <div className="inline-flex min-h-[44px] items-center rounded-full border border-stone-200 bg-white text-[#6E2635] shadow-sm">
                            <button
                              type="button"
                              aria-label={`Decrease ${product.name}`}
                              className="flex h-11 w-11 items-center justify-center rounded-l-full text-base font-semibold transition-colors duration-150 active:scale-95 [@media(hover:hover)]:hover:bg-[#6E2635]/10"
                              onClick={() => decrementItem(line.slug, line.weight)}
                            >
                              −
                            </button>
                            <span className="min-w-7 text-center text-xs font-semibold sm:text-sm">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase ${product.name}`}
                              disabled={line.qty >= maxQty || line.qty >= stockQty}
                              className={`flex h-11 w-11 items-center justify-center rounded-r-full text-base font-semibold transition-colors duration-150 active:scale-95 ${
                                line.qty >= maxQty || line.qty >= stockQty
                                  ? "cursor-not-allowed opacity-25"
                                  : "[@media(hover:hover)]:hover:bg-[#6E2635]/10"
                              }`}
                              onClick={() => {
                                if (line.qty >= maxQty) {
                                  showNotice(`Maximum quantity reached (${maxQty} per product)`, "limit");
                                } else if (line.qty >= stockQty) {
                                  showNotice(`Only ${stockQty} units available in stock`, "limit");
                                } else {
                                  incrementItem(line.slug, line.weight);
                                }
                              }}
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-stone-400">Total: </span>
                            <span className="font-serif text-base font-medium text-ink">
                              {formatPrice(price * line.qty)}
                            </span>
                          </div>
                        </div>

                        {line.qty >= maxQty && (
                          <p className="mt-1 text-right text-[11px] font-medium text-[#6E2635]">
                            Max limit {maxQty} per order
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer: Order Summary & Checkout CTA */}
        {detailed.length > 0 && (
          <div className="border-t border-stone-100 bg-[#faf8f5] px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-serif text-lg font-semibold text-ink sm:text-xl">
                  {totalCount} {totalCount === 1 ? "Item" : "Items"}
                </span>
                <p className="text-[11px] text-stone-500">Subtotal</p>
              </div>
              <span className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-stone-500">
              * Taxes and delivery calculated at checkout. Express delivery available across India.
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#6E2635] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 active:scale-[0.99] [@media(hover:hover)]:hover:-translate-y-[1px] [@media(hover:hover)]:hover:bg-[#5A1E2B]"
            >
              <span>Proceed to Checkout →</span>
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="mt-2.5 flex min-h-[46px] w-full items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-medium text-stone-700 transition-colors sm:text-sm [@media(hover:hover)]:hover:border-ink [@media(hover:hover)]:hover:text-ink"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export function NoticeToast() {
  const { notice, setCartOpen } = useStore();
  if (!notice) return null;
  const limit = notice.tone === "limit";

  return (
    <div className="fixed bottom-20 left-1/2 z-[70] w-[min(92vw,24rem)] -translate-x-1/2 animate-rise lg:bottom-8">
      <div
        className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-lg ${
          limit
            ? "border border-[#6E2635]/40 bg-white text-[#6E2635]"
            : "bg-[#6E2635] text-white"
        }`}
      >
        <p className="text-xs font-medium leading-snug sm:text-sm">{notice.message}</p>
        {!limit ? (
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="shrink-0 text-xs font-semibold underline underline-offset-4"
          >
            View Cart
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function MobileDock() {
  const { totalCount, setCartOpen } = useStore();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-stone-200/80 bg-white/95 px-4 py-2.5 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-ink">
            {totalCount > 0 ? `${totalCount} ${totalCount === 1 ? "Item" : "Items"} in Cart` : "Shopping Cart"}
          </p>
          <p className="text-[10px] text-stone-500">Quality assured & fresh harvest</p>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#6E2635] px-6 text-xs font-semibold text-white shadow-md active:scale-95"
        >
          View Cart →
        </button>
      </div>
    </div>
  );
}
