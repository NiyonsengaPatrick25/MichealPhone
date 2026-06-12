import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatRWF, discountPercent } from "../../utils/currency";
import { cn } from "../../utils/cn";

/* ---------------- RatingStars ---------------- */
export function RatingStars({ rating, size = "sm", showValue = false }: { rating: number; size?: "sm" | "md"; showValue?: boolean }) {
  const sz = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.min(Math.max(rating - (i - 1), 0), 1);
          return (
            <span key={i} className={cn("relative inline-block", sz)}>
              <svg viewBox="0 0 20 20" className={cn(sz, "text-slate-300 dark:text-slate-600")} fill="currentColor" aria-hidden="true">
                <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.43 4.4a1 1 0 0 0 .95.69h4.62c.97 0 1.37 1.24.59 1.81l-3.74 2.72a1 1 0 0 0-.36 1.12l1.43 4.4c.3.92-.76 1.69-1.54 1.12l-3.74-2.72a1 1 0 0 0-1.18 0l-3.74 2.72c-.78.57-1.84-.2-1.54-1.12l1.43-4.4a1 1 0 0 0-.36-1.12L1.46 9.83c-.78-.57-.38-1.81.59-1.81h4.62a1 1 0 0 0 .95-.69l1.43-4.4Z" />
              </svg>
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <svg viewBox="0 0 20 20" className={cn(sz, "text-amber-400")} fill="currentColor" aria-hidden="true">
                  <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.43 4.4a1 1 0 0 0 .95.69h4.62c.97 0 1.37 1.24.59 1.81l-3.74 2.72a1 1 0 0 0-.36 1.12l1.43 4.4c.3.92-.76 1.69-1.54 1.12l-3.74-2.72a1 1 0 0 0-1.18 0l-3.74 2.72c-.78.57-1.84-.2-1.54-1.12l1.43-4.4a1 1 0 0 0-.36-1.12L1.46 9.83c-.78-.57-.38-1.81.59-1.81h4.62a1 1 0 0 0 .95-.69l1.43-4.4Z" />
                </svg>
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{rating.toFixed(1)}</span>}
    </div>
  );
}

/* ---------------- PriceTag ---------------- */
export function PriceTag({ oldPrice, newPrice, size = "md" }: { oldPrice: number; newPrice: number; size?: "sm" | "md" | "lg" }) {
  const main = size === "lg" ? "text-2xl sm:text-3xl" : size === "md" ? "text-lg" : "text-base";
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={cn(main, "font-bold text-slate-900 dark:text-white")}>{formatRWF(newPrice)}</span>
      {oldPrice > newPrice && (
        <span className="text-sm text-slate-400 line-through dark:text-slate-500">{formatRWF(oldPrice)}</span>
      )}
    </div>
  );
}

/* ---------------- ProductBadge ---------------- */
export function ProductBadge({ type, oldPrice, newPrice }: { type: "discount" | "new" | "trending" | "out"; oldPrice?: number; newPrice?: number }) {
  const styles: Record<string, string> = {
    discount: "bg-rose-500 text-white",
    new: "bg-emerald-500 text-white",
    trending: "bg-amber-400 text-slate-900",
    out: "bg-slate-700 text-white",
  };
  const label =
    type === "discount" && oldPrice && newPrice
      ? `-${discountPercent(oldPrice, newPrice)}%`
      : type === "new"
      ? "New"
      : type === "trending"
      ? "🔥 Trending"
      : "Out of stock";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm", styles[type])}>{label}</span>
  );
}

/* ---------------- SectionHeading ---------------- */
export function SectionHeading({ title, subtitle, link, linkLabel = "View all" }: { title: string; subtitle?: string; link?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link} className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          {linkLabel}
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}

/* ---------------- Skeletons ---------------- */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-square bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ---------------- EmptyState ---------------- */
export function EmptyState({ icon = "🔍", title, message, actionLabel, actionLink }: { icon?: string; title: string; message: string; actionLabel?: string; actionLink?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900"
    >
      <span className="text-5xl" aria-hidden="true">{icon}</span>
      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="mt-6 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}

/* ---------------- QuantityStepper ---------------- */
export function QuantityStepper({ value, onChange, max }: { value: number; onChange: (v: number) => void; max: number }) {
  return (
    <div className="flex items-center rounded-full border border-slate-300 dark:border-slate-700">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
        className="grid h-9 w-9 place-items-center rounded-l-full text-lg font-bold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(value + 1, max))}
        aria-label="Increase quantity"
        disabled={value >= max}
        className="grid h-9 w-9 place-items-center rounded-r-full text-lg font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        +
      </button>
    </div>
  );
}
