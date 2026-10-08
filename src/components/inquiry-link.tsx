"use client";

import { useStore } from "@/components/store";

export function InquiryLink({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  lines?: any[];
  onClick?: () => void;
}) {
  const { setCartOpen } = useStore();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        setCartOpen(true);
      }}
    >
      {children}
    </button>
  );
}
