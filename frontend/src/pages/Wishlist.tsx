import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { EmptyState, PriceTag, RatingStars } from "../components/ui";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon="💝" title="Your wishlist is empty" message="Save your favorite products here and never lose track of what you love." actionLabel="Discover Products" actionLink="/products" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
        My Wishlist <span className="text-base font-semibold text-slate-400">({items.length} items)</span>
      </h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {items.map((p) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <Link to={`/products/${p.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">{p.brand}</span>
                <Link to={`/products/${p.id}`} className="truncate text-sm font-bold text-slate-900 hover:text-brand-600 dark:text-white">{p.name}</Link>
                <RatingStars rating={p.rating} />
                <div className="mt-1"><PriceTag oldPrice={p.oldPrice} newPrice={p.newPrice} size="sm" /></div>
                <div className="mt-auto flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { addToCart(p); removeFromWishlist(p.id); }}
                    disabled={p.stock === 0}
                    className="flex-1 rounded-full bg-brand-600 py-2 text-xs font-bold text-white transition hover:bg-brand-700 active:scale-95 disabled:opacity-40"
                  >
                    Move to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(p.id)}
                    aria-label={`Remove ${p.name} from wishlist`}
                    className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-slate-400 transition hover:border-rose-400 hover:text-rose-500 dark:border-slate-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
