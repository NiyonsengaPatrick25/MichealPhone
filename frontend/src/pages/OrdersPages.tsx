import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "../contexts/OrderContext";
import { EmptyState } from "../components/ui";
import { formatRWF } from "../utils/currency";
import { cn } from "../utils/cn";
import type { Order } from "../types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-RW", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const statusStyle: Record<Order["status"], string> = {
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  Confirmed: "bg-brand-100 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400",
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
};

/* ================= Order Success ================= */
export function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const { getOrder } = useOrders();
  const order = id ? getOrder(id) : undefined;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon="🧾" title="Order not found" message="We couldn't find this order. Check your order history." actionLabel="Order History" actionLink="/orders" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60"
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>
        </motion.div>
        <h1 className="mt-6 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Order Placed Successfully! 🎉</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Thank you, <span className="font-bold text-slate-700 dark:text-slate-200">{order.customer.fullName}</span>! Your order <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{order.id}</span> has been received.
          We'll contact you on <span className="font-semibold">{order.customer.phone}</span> to confirm.
        </p>

        <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left dark:bg-slate-800/60">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Order Details</h2>
          <ul className="mt-3 space-y-2.5">
            {order.items.map((i) => (
              <li key={i.product.id} className="flex items-center gap-3 text-sm">
                <img src={i.product.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate font-semibold text-slate-700 dark:text-slate-200">{i.product.name} <span className="text-slate-400">× {i.quantity}</span></span>
                <span className="font-bold text-slate-900 dark:text-white">{formatRWF(i.product.newPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-slate-200 pt-3 text-sm dark:border-slate-700">
            <div className="flex justify-between text-slate-500"><dt>Subtotal</dt><dd>{formatRWF(order.subtotal)}</dd></div>
            <div className="flex justify-between text-slate-500"><dt>Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatRWF(order.shipping)}</dd></div>
            <div className="flex justify-between text-slate-500"><dt>Payment</dt><dd>{order.paymentMethod}</dd></div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white"><dt>Total</dt><dd className="text-brand-600 dark:text-brand-400">{formatRWF(order.total)}</dd></div>
          </dl>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/orders" className="rounded-full border-2 border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200">View Order History</Link>
          <Link to="/products" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700">Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= Order History ================= */
export function OrderHistory() {
  const { orders } = useOrders();
  const [openId, setOpenId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon="📦" title="No orders yet" message="When you place orders, they will appear here so you can track them anytime." actionLabel="Start Shopping" actionLink="/products" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Order History</h1>
      <div className="space-y-4">
        {orders.map((order, idx) => {
          const open = openId === order.id;
          return (
            <motion.article
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : order.id)}
                aria-expanded={open}
                className="flex w-full flex-wrap items-center gap-3 p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">{order.id}</p>
                  <p className="text-xs text-slate-400">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 && "s"}</p>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyle[order.status])}>{order.status}</span>
                <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">{formatRWF(order.total)}</span>
                <svg viewBox="0 0 24 24" className={cn("h-5 w-5 text-slate-400 transition-transform", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="m6 9 6 6 6-6" /></svg>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-slate-200 dark:border-slate-800"
                  >
                    <div className="grid gap-6 p-5 sm:grid-cols-2">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Items</h3>
                        <ul className="mt-3 space-y-2.5">
                          {order.items.map((i) => (
                            <li key={i.product.id} className="flex items-center gap-3 text-sm">
                              <img src={i.product.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                              <Link to={`/products/${i.product.id}`} className="min-w-0 flex-1 truncate font-semibold text-slate-700 hover:text-brand-600 dark:text-slate-200">
                                {i.product.name} <span className="text-slate-400">× {i.quantity}</span>
                              </Link>
                              <span className="font-bold">{formatRWF(i.product.newPrice * i.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Delivery & Payment</h3>
                        <dl className="mt-3 space-y-1.5 text-slate-600 dark:text-slate-300">
                          <div><dt className="inline font-semibold">Name: </dt><dd className="inline">{order.customer.fullName}</dd></div>
                          <div><dt className="inline font-semibold">Phone: </dt><dd className="inline">{order.customer.phone}</dd></div>
                          <div><dt className="inline font-semibold">Address: </dt><dd className="inline">{order.customer.address}, {order.customer.city}, {order.customer.district}</dd></div>
                          <div><dt className="inline font-semibold">Payment: </dt><dd className="inline">{order.paymentMethod}</dd></div>
                          <div><dt className="inline font-semibold">Shipping: </dt><dd className="inline">{order.shipping === 0 ? "Free" : formatRWF(order.shipping)}</dd></div>
                          <div className="pt-1 text-base font-extrabold text-slate-900 dark:text-white">Total: <span className="text-brand-600 dark:text-brand-400">{formatRWF(order.total)}</span></div>
                        </dl>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
