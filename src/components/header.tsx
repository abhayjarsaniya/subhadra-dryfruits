"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { InquiryLink } from "@/components/inquiry-link";
import { useStore } from "@/components/store";

const links = [
  { href: "/", label: "Home" },
  { href: "/dry-fruits", label: "Dry Fruits" },
  { href: "/chocolates", label: "Chocolates" },
  { href: "/coffee-tea", label: "Coffee & Tea" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/bundles", label: "Bundles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function CartBagGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  );
}

export function Header() {
  const pathname = usePathname();
  const { totalCount, ready, setCartOpen, menuOpen, setMenuOpen, setSearchOpen } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      {/* 3-Part Header Layout: Logo (Left) | Navigation (Center) | Actions (Right) */}
      <div className="shell relative flex h-16 items-center justify-between">
        {/* LEFT: Subhadra Dryfruits Logo + Name */}
        <div className="flex shrink-0 items-center">
          <BrandMark />
        </div>

        {/* CENTER: Navigation Links (Strictly Centered in Header container) */}
        <nav
          className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-3.5 xl:gap-5 2xl:gap-6.5 lg:flex"
          aria-label="Primary"
        >
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-1 text-[12px] font-medium tracking-wide transition-colors duration-200 hover:text-[#6E2635] xl:text-[13px] ${
                  isActive ? "font-semibold text-[#6E2635]" : "text-stone-600"
                }`}
              >
                <span>{link.label}</span>
                {isActive ? (
                  <span className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[#6E2635]" />
                ) : (
                  <span className="absolute inset-x-0 -bottom-1 h-[2px] scale-x-0 rounded-full bg-[#6E2635]/40 transition-transform duration-200 group-hover:scale-x-100" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex shrink-0 items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#e6e2dc] text-stone-600 transition hover:border-[#6E2635] hover:text-[#6E2635] sm:w-auto sm:px-3.5"
            aria-label="Search catalog"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="hidden text-xs font-medium sm:inline">Search</span>
          </button>

          {/* Cart Icon + Badge */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e2dc] text-stone-700 transition hover:border-[#6E2635] hover:text-[#6E2635]"
            aria-label={`Open cart, ${totalCount} items`}
          >
            <CartBagGlyph />
            {ready && totalCount > 0 ? (
              <span
                key={totalCount}
                className="absolute -right-1.5 -top-1 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-[#6E2635] px-1 text-[10px] font-bold text-white shadow-sm"
              >
                {totalCount}
              </span>
            ) : null}
          </button>

          {/* Desktop WhatsApp Action (Large screens xl+) */}
          <InquiryLink className="hidden h-10 items-center justify-center rounded-full bg-[#6E2635] px-[18px] text-xs font-semibold text-white shadow-sm transition hover:bg-[#5A1E2B] xl:inline-flex">
            Send Inquiry on WhatsApp
          </InquiryLink>

          {/* Mobile / Tablet Hamburger & Close Button */}
          <button
            type="button"
            className="inline-flex h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e2dc] text-stone-700 transition hover:border-[#6E2635] hover:text-[#6E2635] active:scale-95 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
