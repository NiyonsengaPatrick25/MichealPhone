import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { allBrands, categories } from "../data/products";
import { filterProducts } from "../services/productService";
import { ProductGrid } from "../components/product/ProductCard";
import { GridSkeleton, EmptyState, RatingStars } from "../components/ui";
import { formatRWF } from "../utils/currency";
import { cn } from "../utils/cn";
import type { ProductFilters, SortOption } from "../types";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

const priceRanges = [
  { label: "Under RWF 200,000", min: null, max: 200000 },
  { label: "RWF 200,000 – 500,000", min: 200000, max: 500000 },
  { label: "RWF 500,000 – 1,000,000", min: 500000, max: 1000000 },
  { label: "RWF 1,000,000 – 2,000,000", min: 1000000, max: 2000000 },
  { label: "Over RWF 2,000,000", min: 2000000, max: null },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceIdx, setPriceIdx] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const sort = (params.get("sort") as SortOption) ?? "popular";
  const maxFromUrl = params.get("max");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [search, category, sort, brands, priceIdx, minRating]);

  const filters: ProductFilters = useMemo(
    () => ({
      search,
      category,
      brands,
      minPrice: priceIdx !== null ? priceRanges[priceIdx].min : null,
      maxPrice: priceIdx !== null ? priceRanges[priceIdx].max : maxFromUrl ? Number(maxFromUrl) : null,
      minRating,
      sort,
    }),
    [search, category, brands, priceIdx, minRating, sort, maxFromUrl]
  );

  const results = useMemo(() => filterProducts(filters), [filters]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const toggleBrand = (b: string) =>
    setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const clearAll = () => {
    setBrands([]);
    setPriceIdx(null);
    setMinRating(0);
    setParams(new URLSearchParams(), { replace: true });
  };

  const activeCount = brands.length + (priceIdx !== null ? 1 : 0) + (minRating > 0 ? 1 : 0) + (category ? 1 : 0);

  const FiltersPanel = (
    <div className="space-y-7">
      {/* Category */}
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Category</legend>
        <div className="space-y-2">
          {["", ...categories.map((c) => c.name)].map((c) => (
            <label key={c || "all"} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="radio"
                name="category"
                checked={category === c}
                onChange={() => setParam("category", c)}
                className="h-4 w-4 accent-brand-600"
              />
              {c || "All Categories"}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Brand */}
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Brand</legend>
        <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
          {allBrands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} className="h-4 w-4 rounded accent-brand-600" />
              {b}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Price (RWF)</legend>
        <div className="space-y-2">
          {priceRanges.map((r, i) => (
            <label key={r.label} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="radio"
                name="price"
                checked={priceIdx === i}
                onChange={() => setPriceIdx(priceIdx === i ? null : i)}
                onClick={() => priceIdx === i && setPriceIdx(null)}
                className="h-4 w-4 accent-brand-600"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Rating */}
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Minimum Rating</legend>
        <div className="space-y-2">
          {[4.5, 4, 3.5, 0].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="h-4 w-4 accent-brand-600" />
              {r === 0 ? "Any rating" : <span className="flex items-center gap-1.5"><RatingStars rating={r} /> & up</span>}
            </label>
          ))}
        </div>
      </fieldset>

      <button type="button" onClick={clearAll} className="w-full rounded-full border border-slate-300 py-2.5 text-sm font-bold text-slate-600 transition hover:border-rose-400 hover:text-rose-500 dark:border-slate-700 dark:text-slate-300">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {search ? `Results for “${search}”` : category || "All Products"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {results.length} product{results.length !== 1 && "s"} found
          {filters.maxPrice && priceIdx === null ? ` · under ${formatRWF(filters.maxPrice)}` : ""}
        </p>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 lg:block" aria-label="Product filters">
          <div className="sticky top-40 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            {FiltersPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M4 6h16M7 12h10M10 18h4" /></svg>
              Filters {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[10px] font-bold text-white">{activeCount}</span>}
            </button>
            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="sort" className="hidden text-xs font-semibold text-slate-500 sm:block">Sort by</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <GridSkeleton count={8} />
          ) : results.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No products found"
              message="Try adjusting your search or filters to find what you're looking for."
              actionLabel="Clear Filters"
              actionLink="/products"
            />
          ) : (
            <ProductGrid products={results} cols={3} />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden" aria-hidden="true" />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-2xl lg:hidden dark:bg-slate-900"
              aria-label="Filters"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Filters</h2>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
                </button>
              </div>
              {FiltersPanel}
              <button type="button" onClick={() => setFiltersOpen(false)} className={cn("mt-6 w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white")}>
                Show {results.length} Results
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
