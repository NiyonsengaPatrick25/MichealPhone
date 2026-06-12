import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "../../types";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { RatingStars, PriceTag, ProductBadge } from "../ui";
import { cn } from "../../utils/cn";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.6c0 5-7.7 9.9-9 10.7-1.3-.8-9-5.7-9-10.7A4.9 4.9 0 0 1 12 5.7 4.9 4.9 0 0 1 21 8.6Z" />
    </svg>
  );
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wished = isWishlisted(product.id);
  const isNew = +new Date(product.createdAt) > +new Date(2025, 9, 1);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/40"
    >
      <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.oldPrice > product.newPrice && <ProductBadge type="discount" oldPrice={product.oldPrice} newPrice={product.newPrice} />}
          {product.stock === 0 ? <ProductBadge type="out" /> : isNew ? <ProductBadge type="new" /> : product.trending ? <ProductBadge type="trending" /> : null}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110 dark:bg-slate-800/90",
          wished ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
        )}
      >
        <HeartIcon filled={wished} />
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">{product.brand}</span>
        <Link to={`/products/${product.id}`} className="line-clamp-2 text-sm font-semibold text-slate-900 transition hover:text-brand-600 dark:text-white dark:hover:text-brand-400">
          {product.name}
        </Link>
        <RatingStars rating={product.rating} showValue />
        <div className="mt-auto pt-2">
          <PriceTag oldPrice={product.oldPrice} newPrice={product.newPrice} size="sm" />
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="mt-2 w-full rounded-full bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-brand-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-brand-400"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </motion.article>
  );
}

export function ProductGrid({ products, cols = 4 }: { products: Product[]; cols?: 3 | 4 | 5 }) {
  const colClass = cols === 3 ? "lg:grid-cols-3" : cols === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4", colClass)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col gap-3">
      {products.map((p, i) => (
        <motion.article
          key={p.id}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: Math.min(i * 0.04, 0.3) }}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-3 transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <Link to={`/products/${p.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-28 sm:w-28">
            <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">{p.brand}</span>
            <Link to={`/products/${p.id}`} className="truncate text-sm font-semibold text-slate-900 hover:text-brand-600 dark:text-white">{p.name}</Link>
            <RatingStars rating={p.rating} showValue />
            <div className="mt-auto"><PriceTag oldPrice={p.oldPrice} newPrice={p.newPrice} size="sm" /></div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function CategoryCard({ name, image, count, tagline }: { name: string; image: string; count: number; tagline: string }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(name)}`}
      className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-xs text-white/75">{tagline} · {count} products</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-300 transition group-hover:gap-2">Shop now →</span>
      </div>
    </Link>
  );
}
