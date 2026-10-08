"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tags,
  Truck,
  Sliders,
  LogOut,
  Menu,
  X,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Homepage Sections", href: "/admin/sections", icon: SlidersHorizontal },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Tags },
  { name: "Shipping & Settings", href: "/admin/settings", icon: Truck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#F7F5F2] text-stone-800">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 flex-col border-r border-stone-200/80 bg-white lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-stone-100 px-6">
          <Link href="/admin" className="font-serif text-lg font-bold tracking-tight text-[#6E2635]">
            Store Admin
          </Link>
          <span className="rounded-full bg-[#6E2635]/10 px-2 py-0.5 text-[10px] font-bold text-[#6E2635]">
            LIVE DB
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-[#6E2635] text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-50 hover:text-[#6E2635]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-stone-100 p-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-stone-200 bg-[#FAF8F6] px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100"
          >
            <span>View Live Store</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-8 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border border-stone-200 p-2 text-stone-600"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/admin" className="font-serif text-base font-bold text-[#6E2635]">
              Store Admin
            </Link>
          </div>
          <Link href="/" target="_blank" className="flex items-center gap-1 text-xs font-medium text-[#6E2635]">
            <span>Store</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium ${
                      active ? "bg-[#6E2635] text-white" : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
