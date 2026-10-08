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
import {
  addLine,
  getLineQty,
  removeLine,
  setLineQty,
  totalItemCount,
  uniqueProductCount,
  type CartLine,
} from "@/lib/cart-rules";

const STORAGE_KEY = "subhadra-ecommerce-cart-v2";

export type Notice = { id: number; message: string; tone: "ok" | "limit" } | null;

export type CartItemDetails = {
  line: CartLine;
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    category: string;
    stock_qty?: number;
    max_order_qty?: number;
    is_out_of_stock?: boolean;
  };
  price: number;
};

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
};

const StoreContext = createContext<StoreValue | null>(null);

function readStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("subhadra-inquiry-cart-v1") ||
      localStorage.getItem("subhadra-inquiry-cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => line && line.slug && line.weight && Number(line.qty) > 0);
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const linesRef = useRef<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

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

  // Auto-hide notice toast
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => {
      setNotice((current) => (current?.id === notice.id ? null : current));
    }, 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  const totalCount = useMemo(() => totalItemCount(lines), [lines]);
  const uniqueCount = useMemo(() => uniqueProductCount(lines), [lines]);

  const getQty = useCallback((slug: string, weight: string) => {
    return getLineQty(linesRef.current, slug, weight);
  }, []);

  const addItem = useCallback(
    (slug: string, weight: string, qty = 1) => {
      const current = linesRef.current;
      const currentQty = getLineQty(current, slug, weight);

      if (currentQty + qty > 10) {
        showNotice("Maximum quantity reached (10 per product).", "limit");
        return false;
      }

      const result = addLine(current, slug, weight, qty);
      if (!result.ok) {
        showNotice(result.message || "Maximum quantity reached.", "limit");
        return false;
      }
      commit(result.lines);
      showNotice("Added to cart", "ok");
      return true;
    },
    [commit, showNotice]
  );

  const incrementItem = useCallback(
    (slug: string, weight: string) => {
      const current = linesRef.current;
      const currentQty = getLineQty(current, slug, weight);

      if (currentQty >= 10) {
        showNotice("Maximum quantity reached (10 per product).", "limit");
        return false;
      }

      const next = setLineQty(current, slug, weight, currentQty + 1);
      commit(next);
      showNotice("Cart updated", "ok");
      return true;
    },
    [commit, showNotice]
  );

  const decrementItem = useCallback(
    (slug: string, weight: string) => {
      const current = linesRef.current;
      const currentQty = getLineQty(current, slug, weight);
      if (currentQty <= 1) {
        const next = removeLine(current, slug, weight);
        commit(next);
        showNotice("Item removed", "ok");
        return;
      }
      const next = setLineQty(current, slug, weight, currentQty - 1);
      commit(next);
    },
    [commit, showNotice]
  );

  const updateQty = useCallback(
    (slug: string, weight: string, qty: number) => {
      const current = linesRef.current;
      if (qty <= 0) {
        commit(removeLine(current, slug, weight));
        return;
      }
      if (qty > 10) {
        showNotice("Maximum quantity reached (10 per product).", "limit");
        return;
      }
      commit(setLineQty(current, slug, weight, qty));
    },
    [commit, showNotice]
  );

  const removeItem = useCallback(
    (slug: string, weight: string) => {
      const next = removeLine(linesRef.current, slug, weight);
      commit(next);
      showNotice("Item removed from cart", "ok");
    },
    [commit, showNotice]
  );

  const clearCart = useCallback(() => {
    commit([]);
  }, [commit]);

  const value = useMemo<StoreValue>(
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
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
}
