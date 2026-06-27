import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useTheme } from "../../contexts/ThemeContext";
import { searchProducts } from "../../services/productService";
import { announcements } from "../../data/ads";
import { formatRWF } from "../../utils/currency";
import { cn } from "../../utils/cn";
import type { Product } from "../../types";

/* ---------- Announcement Bar ---------- */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-slate-900 text-white dark:bg-brand-950">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="truncate text-center text-xs font-medium"
          >
            {announcements[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Icons ---------- */
const icon = "h-5 w-5 sm:h-[22px] sm:w-[22px]";
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m20 20-3.5-3.5" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.6c0 5-7.7 9.9-9 10.7-1.3-.8-9-5.7-9-10.7A4.9 4.9 0 0 1 12 5.7 4.9 4.9 0 0 1 21 8.6Z" />
  </svg>
);
const CartIcon = () => (
  <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
    <circle cx="10" cy="20.5" r="1.3" /><circle cx="17.5" cy="20.5" r="1.3" />
  </svg>
);

/* ---------- Search box with live results ---------- */
function SearchBox({ onNavigate, autoFocus }: { onNavigate?: () => void; autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setResults(searchProducts(query));
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    onNavigate?.();
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={ref} className="relative w-full">
      <form onSubmit={submit} role="search">
        <label htmlFor="site-search" className="sr-only">Search products</label>
        <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2.5 transition focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:bg-slate-900">
          <span className="text-slate-400"><SearchIcon /></span>
          <input
            id="site-search"
            type="search"
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search phones, laptops, brands…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            autoComplete="off"
          />
        </div>
      </form>
      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">No results for “{query}”</p>
            ) : (
              <ul>
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/products/${p.id}`}
                      onClick={() => { setOpen(false); setQuery(""); onNavigate?.(); }}
                      className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brand} · {p.category}</p>
                      </div>
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{formatRWF(p.newPrice)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Navbar ---------- */
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/products?category=Smartphones", label: "Smartphones" },
  { to: "/products?category=Laptops", label: "Laptops" },
  { to: "/products?category=Accessories", label: "Accessories" },
  { to: "/orders", label: "Orders" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { items: wishItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const iconBtn = "relative grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-400";

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div className="border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-5" aria-label="Main navigation">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={cn(iconBtn, "lg:hidden")}
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="MichealPhone home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white shadow-lg shadow-brand-600/30">M</span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Micheal<span className="text-brand-600 dark:text-brand-400">Phone</span></span>
              <span className="text-[10px] font-medium text-slate-400">Your Trusted Smartphone Store</span>
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden flex-1 md:block md:max-w-xl">
            <SearchBox />
          </div>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button type="button" onClick={toggleTheme} className={iconBtn} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4.5" /><path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A8.6 8.6 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" /></svg>
              )}
            </button>

            <Link to="/wishlist" className={iconBtn} aria-label={`Wishlist, ${wishItems.length} items`}>
              <HeartIcon />
              {wishItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{wishItems.length}</span>
              )}
            </Link>

            <Link to="/cart" className={iconBtn} aria-label={`Cart, ${totalItems} items`}>
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">{totalItems}</span>
              )}
            </Link>
          </div>
        </nav>

        {/* Mobile search */}
        <div className="border-t border-slate-100 px-4 py-2 md:hidden dark:border-slate-800/60">
          <SearchBox />
        </div>

        {/* Desktop category links */}
        <div className="hidden border-t border-slate-100 lg:block dark:border-slate-800/60">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
            {navLinks.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2.5 text-[13px] font-semibold transition",
                    isActive && !l.to.includes("?")
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col bg-white shadow-2xl lg:hidden dark:bg-slate-900"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">Micheal<span className="text-brand-600 dark:text-brand-400">Phone</span></span>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3" aria-label="Mobile navigation">
                {navLinks.map((l) => (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    end={l.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-brand-400"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-800">
                📞 +250 784 106 107 · Kigali, Rwanda
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
