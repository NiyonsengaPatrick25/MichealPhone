import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getProductById, getRelated } from "../services/productService";
import { sampleReviews } from "../data/ads";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { ProductGrid } from "../components/product/ProductCard";
import { RatingStars, PriceTag, QuantityStepper, EmptyState, SectionHeading } from "../components/ui";
import { formatRWF, discountPercent } from "../utils/currency";
import { buildWhatsAppMessage, openWhatsApp } from "../utils/whatsapp";
import { cn } from "../utils/cn";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => (id ? getProductById(id) : undefined), [id]);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "reviews">("description");
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon="📦" title="Product not found" message="The product you're looking for doesn't exist or has been removed." actionLabel="Browse Products" actionLink="/products" />
      </div>
    );
  }

  const gallery = [product.image, product.image, product.image];
  const related = getRelated(product);
  const wished = isWishlisted(product.id);
  const off = discountPercent(product.oldPrice, product.newPrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link to="/" className="hover:text-brand-600">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-600">{product.category}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-slate-600 dark:text-slate-300" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
            <img src={gallery[activeImg]} alt={product.name} className="aspect-square w-full object-cover" />
            {off > 0 && <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-extrabold text-white shadow">-{off}% OFF</span>}
          </div>
          <div className="mt-3 flex gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "h-20 w-20 overflow-hidden rounded-2xl border-2 transition",
                  i === activeImg ? "border-brand-600" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{product.brand} · {product.category}</span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating} size="md" showValue />
            <span className="text-xs text-slate-400">({sampleReviews.length + 24} reviews)</span>
          </div>

          <div className="mt-5"><PriceTag oldPrice={product.oldPrice} newPrice={product.newPrice} size="lg" /></div>
          {off > 0 && (
            <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              You save {formatRWF(product.oldPrice - product.newPrice)} ({off}%)
            </p>
          )}

          <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>

          {/* Stock */}
          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className={cn("h-2.5 w-2.5 rounded-full", product.stock > 5 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-rose-500")} aria-hidden="true" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {product.stock > 5 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left — order soon!` : "Out of Stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantityStepper value={quantity} onChange={(v) => setQuantity(Math.max(1, v))} max={Math.max(product.stock, 1)} />
            <button
              type="button"
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              className="rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95 disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-pressed={wished}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border-2 transition active:scale-90",
                wished ? "border-rose-400 bg-rose-50 text-rose-500 dark:bg-rose-950/40" : "border-slate-300 text-slate-400 hover:border-rose-400 hover:text-rose-500 dark:border-slate-700"
              )}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.6c0 5-7.7 9.9-9 10.7-1.3-.8-9-5.7-9-10.7A4.9 4.9 0 0 1 12 5.7 4.9 4.9 0 0 1 21 8.6Z" /></svg>
            </button>
          </div>

          {/* WhatsApp order */}
          <button
            type="button"
            onClick={() => openWhatsApp(buildWhatsAppMessage(product, quantity))}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition hover:bg-[#1fb958] active:scale-95 sm:w-auto"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5 13.9c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-2.7-.8-4.7-2.8-6-5.2-.5-.9-.8-2-.3-2.8.2-.4.6-.6 1-.6h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.4 0 .7.7 1.2 1.8 2.2 3.1 2.8.3.1.5.1.7-.1l.7-.8c.2-.3.4-.3.7-.2l1.8.9c.3.1.4.3.4.6 0 0-.1.3-.2.5Z" /></svg>
            Order Via WhatsApp
          </button>

          {/* Trust badges */}
          <div className="mt-7 grid grid-cols-3 gap-3 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {[["🚚", "Fast Delivery"], ["✅", "100% Genuine"], ["🔄", "7-Day Returns"]].map(([e, t]) => (
              <div key={t} className="rounded-2xl border border-slate-200 px-2 py-3 dark:border-slate-800">
                <span className="block text-xl" aria-hidden="true">{e}</span>{t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800" role="tablist">
          {(["description", "reviews"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "border-b-2 px-5 py-3 text-sm font-bold capitalize transition",
                tab === t ? "border-brand-600 text-brand-600 dark:text-brand-400" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
            >
              {t === "reviews" ? `Reviews (${sampleReviews.length})` : "Description"}
            </button>
          ))}
        </div>
        <div className="py-7">
          {tab === "description" ? (
            <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>{product.description}</p>
              <p>
                Every {product.brand} device sold at MichealPhone is 100% genuine with full manufacturer warranty.
                We offer free delivery within Kigali for orders above {formatRWF(100000)} and nationwide delivery across Rwanda within 1–3 business days.
              </p>
              <ul className="list-inside list-disc space-y-1.5">
                <li>Brand: {product.brand}</li>
                <li>Category: {product.category}</li>
                <li>Warranty: 12 months official warranty</li>
                <li>In the box: Device, cable, documentation</li>
                <li>Price: {formatRWF(product.newPrice)}</li>
              </ul>
            </div>
          ) : (
            <div className="max-w-3xl space-y-4">
              {sampleReviews.map((r) => (
                <article key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700 dark:bg-brand-950 dark:text-brand-300">{r.name[0]}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{r.name}</p>
                        <RatingStars rating={r.rating} />
                      </div>
                    </div>
                    <time className="text-xs text-slate-400" dateTime={r.date}>{new Date(r.date).toLocaleDateString("en-RW", { day: "numeric", month: "short", year: "numeric" })}</time>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-10" aria-label="Related products">
          <SectionHeading title="You May Also Like" subtitle={`More from ${product.category}`} link={`/products?category=${encodeURIComponent(product.category)}`} />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
