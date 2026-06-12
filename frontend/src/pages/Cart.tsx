import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { QuantityStepper, EmptyState } from "../components/ui";
import { formatRWF } from "../utils/currency";
import { buildCartWhatsAppMessage, openWhatsApp } from "../utils/whatsapp";

const FREE_SHIPPING_THRESHOLD = 100000;
const SHIPPING_FEE = 3000;

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon="🛒" title="Your cart is empty" message="Looks like you haven't added anything yet. Discover amazing deals on smartphones, laptops and accessories." actionLabel="Start Shopping" actionLink="/products" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Shopping Cart <span className="text-base font-semibold text-slate-400">({totalItems} items)</span></h1>
        <button type="button" onClick={clearCart} className="text-sm font-semibold text-rose-500 transition hover:text-rose-600">Clear cart</button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-3 lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.article
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <Link to={`/products/${item.product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-28 sm:w-28">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">{item.product.brand}</span>
                      <Link to={`/products/${item.product.id}`} className="block truncate text-sm font-bold text-slate-900 hover:text-brand-600 dark:text-white">{item.product.name}</Link>
                      <p className="mt-0.5 text-xs text-slate-400">{formatRWF(item.product.newPrice)} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
                    >
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-7 4v6m4-6v6M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></svg>
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <QuantityStepper value={item.quantity} onChange={(v) => updateQuantity(item.product.id, v)} max={item.product.stock} />
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{formatRWF(item.product.newPrice * item.quantity)}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <aside aria-label="Cart summary">
          <div className="sticky top-44 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Order Summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Subtotal</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{formatRWF(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Shipping</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400">Free</span> : formatRWF(shipping)}</dd>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="rounded-xl bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                  Add {formatRWF(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery in Kigali 🚚
                </p>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base dark:border-slate-700">
                <dt className="font-extrabold text-slate-900 dark:text-white">Total</dt>
                <dd className="font-extrabold text-brand-600 dark:text-brand-400">{formatRWF(total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="mt-6 block w-full rounded-full bg-brand-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95">
              Proceed to Checkout
            </Link>
            <button
              type="button"
              onClick={() => openWhatsApp(buildCartWhatsAppMessage(items, total))}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-bold text-white transition hover:bg-[#1fb958] active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5 13.9c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-2.7-.8-4.7-2.8-6-5.2-.5-.9-.8-2-.3-2.8.2-.4.6-.6 1-.6h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.4 0 .7.7 1.2 1.8 2.2 3.1 2.8.3.1.5.1.7-.1l.7-.8c.2-.3.4-.3.7-.2l1.8.9c.3.1.4.3.4.6 0 0-.1.3-.2.5Z" /></svg>
              Order Via WhatsApp
            </button>
            <Link to="/products" className="mt-4 block text-center text-xs font-semibold text-slate-400 transition hover:text-brand-600">← Continue shopping</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
