"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { InquiryLink } from "@/components/inquiry-link";
import { useStore } from "@/components/store";
import { GOOGLE_MAPS_URL, STORE_ADDRESS, STORE_RATING } from "@/data/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dry-fruits", label: "Dry Fruits" },
  { href: "/chocolates", label: "Chocolates" },
  { href: "/coffee-tea", label: "Coffee & Tea" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/bundles", label: "Bundles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileDrawer() {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen, setSearchOpen, setCartOpen, totalCount, ready } = useStore();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, setMenuOpen]);

  if (!menuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" aria-modal="true" role="dialog">
      {/* Tap-outside Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity touch-none"
        onClick={() => setMenuOpen(false)}
        aria-label="Close navigation overlay"
      />

      {/* Right-Side Slide Drawer */}
      <aside className="fixed inset-y-0 right-0 flex w-full max-w-[320px] flex-col bg-white shadow-2xl transition-transform duration-200 ease-out sm:max-w-sm">
        {/* Drawer Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-100 px-5">
          <BrandMark />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:border-[#6E2635] hover:text-[#6E2635]"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Navigation Links (Scrollable with min 44px touch targets) */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
            Navigation
          </p>
          <nav className="mt-2 flex flex-col gap-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-[48px] items-center justify-between rounded-xl px-3.5 py-3 text-base font-medium transition active:scale-[0.99] ${
                    isActive
                      ? "bg-[#6E2635]/10 font-semibold text-[#6E2635]"
                      : "text-ink hover:bg-stone-50 hover:text-[#6E2635]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className={`text-xs ${isActive ? "text-[#6E2635]" : "text-stone-300"}`}>
                    →
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions (Search & Cart) */}
          <div className="mt-5 border-t border-stone-100 pt-4">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6E2635]">
              Quick Actions
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-[#6E2635]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span>Search Catalog</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setCartOpen(true);
                }}
                className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-[#6E2635]"
              >
                <span className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 7h15l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.2 4.8H3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="9" cy="20" r="1.3" fill="currentColor" />
                    <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                  </svg>
                  <span>Shopping Cart</span>
                </span>
                {ready && totalCount > 0 ? (
                  <span className="rounded-full bg-[#6E2635] px-2 py-0.5 text-xs font-bold text-white">
                    {totalCount}
                  </span>
                ) : null}
              </button>

              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-[#6E2635]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span>My Account / Orders</span>
              </Link>
            </div>
          </div>

          {/* Store & Contact CTAs */}
          <div className="mt-5 border-t border-stone-100 pt-5">
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setCartOpen(true);
                }}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#6E2635] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5A1E2B] active:scale-[0.99]"
              >
                <span>Proceed to Checkout ({totalCount})</span>
              </button>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-[#6E2635] hover:text-[#6E2635] active:scale-[0.99]"
              >
                <span>Visit Store / Directions ↗</span>
              </a>
            </div>

            {/* Store Information */}
            <div className="mt-4 rounded-xl bg-stone-50 p-3 text-xs text-stone-600">
              <div className="flex items-center gap-1 font-semibold text-stone-800">
                <span className="text-amber-500">★</span>
                <span>{STORE_RATING} Google Rating</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-stone-500">
                {STORE_ADDRESS.line2}, {STORE_ADDRESS.city}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
