"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  addLine,
  getLineQty,
  removeLine,
  setLineQty,
  totalItemCount,
  uniqueProductCount,
  type CartLine,
} from "@/lib/cart-rules";
import type { InquiryLine } from "@/lib/whatsapp";

const STORAGE_KEY = "subhadra-inquiry-cart-v1";

export type Notice = { id: number; message: string; tone: "ok" | "limit" } | null;

type StoreValue = {
  lines: CartLine[];
  ready: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  notice: Notice;
  showNotice: (message: string, tone?: "ok" | "limit") => void;
  totalCount: number;
  uniqueCount: number;
  getQty: (slug: string, weight: string) => number;
  addItem: (slug: string, weight: string, qty?: number) => boolean;
  incrementItem: (slug: string, weight: string) => boolean;
  decrementItem: (slug: string, weight: string) => void;
  updateQty: (slug: string, weight: string, qty: number) => void;
  removeItem: (slug: string, weight: string) => void;
  clearCart: () => void;
  inquiryOpen: boolean;
  inquirySeed: InquiryLine[] | null;
  openInquiry: (lines?: InquiryLine[]) => void;
  closeInquiry: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function readStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("subhadra-inquiry-cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => line && line.slug && line.weight && Number(line.qty) > 0);
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lines, setLines] = useState<CartLine[]>([]);
  const linesRef = useRef<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquirySeed, setInquirySeed] = useState<InquiryLine[] | null>(null);

  const commit = useCallback((next: CartLine[]) => {
    linesRef.current = next;
    setLines(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    }
  }, []);

  const showNotice = useCallback((message: string, tone: "ok" | "limit" = "ok") => {
    setNotice({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    const initial = readStored();
    commit(initial);
    setReady(true);
  }, [commit]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        commit(readStored());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [commit]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const locked = cartOpen || menuOpen || searchOpen || inquiryOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, menuOpen, searchOpen, inquiryOpen]);

  const openInquiry = useCallback((customLines?: InquiryLine[]) => {
    setInquirySeed(customLines ?? null);
    setCartOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
    setInquiryOpen(true);
  }, []);

  const closeInquiry = useCallback(() => setInquiryOpen(false), []);

  const getQty = useCallback(
    (slug: string, weight: string) => getLineQty(linesRef.current, slug, weight),
    [],
  );

  const incrementItem = useCallback(
    (slug: string, weight: string) => {
      const current = getLineQty(linesRef.current, slug, weight);
      if (current >= 10) {
        showNotice("Maximum quantity reached (10 per product)", "limit");
        return false;
      }
      const nextLines = setLineQty(linesRef.current, slug, weight, current + 1);
      commit(nextLines);
      if (current === 0) {
        showNotice("Added to inquiry ✓", "ok");
      } else if (current + 1 === 10) {
        showNotice("Maximum quantity reached (10 per product)", "limit");
      }
      return true;
    },
    [commit, showNotice],
  );

  const decrementItem = useCallback(
    (slug: string, weight: string) => {
      const current = getLineQty(linesRef.current, slug, weight);
      if (current <= 1) {
        commit(removeLine(linesRef.current, slug, weight));
      } else {
        commit(setLineQty(linesRef.current, slug, weight, current - 1));
      }
    },
    [commit],
  );

  const addItem = useCallback(
    (slug: string, weight: string, qty = 1) => {
      const current = getLineQty(linesRef.current, slug, weight);
      if (current >= 10) {
        showNotice("Maximum quantity reached (10 per product)", "limit");
        return false;
      }
      const result = addLine(linesRef.current, slug, weight, qty);
      if (result.ok) {
        commit(result.lines);
        showNotice("Added to inquiry ✓", "ok");
        return true;
      } else {
        showNotice(result.message || "Maximum quantity reached", "limit");
        return false;
      }
    },
    [commit, showNotice],
  );

  const updateQty = useCallback(
    (slug: string, weight: string, qty: number) => {
      if (qty <= 0) {
        commit(removeLine(linesRef.current, slug, weight));
        return;
      }
      if (qty >= 10) {
        commit(setLineQty(linesRef.current, slug, weight, 10));
        showNotice("Maximum quantity reached (10 per product)", "limit");
        return;
      }
      commit(setLineQty(linesRef.current, slug, weight, qty));
    },
    [commit, showNotice],
  );

  const removeItem = useCallback(
    (slug: string, weight: string) => {
      commit(removeLine(linesRef.current, slug, weight));
    },
    [commit],
  );

  const clearCart = useCallback(() => {
    commit([]);
  }, [commit]);

  const totalCount = useMemo(() => totalItemCount(lines), [lines]);
  const uniqueCount = useMemo(() => uniqueProductCount(lines), [lines]);

  const value = useMemo(
    () => ({
      lines,
      ready,
      cartOpen,
      setCartOpen,
      menuOpen,
      setMenuOpen,
      searchOpen,
      setSearchOpen,
      notice,
      showNotice,
      totalCount,
      uniqueCount,
      getQty,
      addItem,
      incrementItem,
      decrementItem,
      updateQty,
      removeItem,
      clearCart,
      inquiryOpen,
      inquirySeed,
      openInquiry,
      closeInquiry,
    }),
    [
      lines,
      ready,
      cartOpen,
      menuOpen,
      searchOpen,
      notice,
      showNotice,
      totalCount,
      uniqueCount,
      getQty,
      addItem,
      incrementItem,
      decrementItem,
      updateQty,
      removeItem,
      clearCart,
      inquiryOpen,
      inquirySeed,
      openInquiry,
      closeInquiry,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
