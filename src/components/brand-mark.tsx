import Link from "next/link";
import { BRAND, BRAND_FULL } from "@/data/site";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex min-w-0 items-center gap-2 sm:gap-2.5 ${className}`}
      aria-label={BRAND_FULL}
    >
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#6E2635] text-[#6E2635] sm:h-9 sm:w-9"
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none">
          {/* Elegant royal almond/lotus motif for Subhadra */}
          <path
            d="M16 4C19 8.5 24.5 12 24.5 18C24.5 22.7 20.7 26.5 16 26.5C11.3 26.5 7.5 22.7 7.5 18C7.5 12 13 8.5 16 4Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M16 11V22M12.5 15C13.5 18 16 20 16 20C16 20 18.5 18 19.5 15"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <div className="flex flex-col">
        <span className="truncate whitespace-nowrap font-serif text-[14px] font-semibold leading-none tracking-tight text-ink min-[360px]:text-[15px] sm:text-xl">
          {BRAND}
        </span>
        <span className="hidden text-[8.5px] font-medium uppercase tracking-[0.18em] text-[#6E2635] min-[400px]:inline-block">
          Ahmedabad
        </span>
      </div>
    </Link>
  );
}
