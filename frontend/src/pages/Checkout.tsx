import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { useOrders } from "../contexts/OrderContext";
import { EmptyState } from "../components/ui";
import { formatRWF } from "../utils/currency";
import { cn } from "../utils/cn";
import type { CustomerInfo, PaymentMethod } from "../types";

const FREE_SHIPPING_THRESHOLD = 100000;
const SHIPPING_FEE = 3000;

const paymentMethods: { value: PaymentMethod; label: string; desc: string; emoji: string }[] = [
  { value: "Mobile Money", label: "Mobile Money", desc: "MTN MoMo / Airtel Money", emoji: "📲" },
  { value: "Cash On Delivery", label: "Cash On Delivery", desc: "Pay when your order arrives", emoji: "💵" },
  { value: "Credit Card", label: "Credit Card", desc: "Visa / Mastercard", emoji: "💳" },
];

type Errors = Partial<Record<keyof CustomerInfo | "momoNumber" | "cardNumber" | "cardExpiry" | "cardCvv", string>>;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState<CustomerInfo>({
    fullName: "", email: "", phone: "", address: "", city: "", district: "", notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("Mobile Money");
  const [momoNumber, setMomoNumber] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon="🧾" title="Nothing to checkout" message="Your cart is empty. Add some products before checking out." actionLabel="Browse Products" actionLink="/products" />
      </div>
    );
  }

  const set = (key: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (form.fullName.trim().length < 3) e.fullName = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!/^(\+?25)?0?7[2389]\d{7}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid Rwandan phone number (e.g. 078X XXX XXX)";
    if (form.address.trim().length < 5) e.address = "Enter your street address";
    if (form.city.trim().length < 2) e.city = "Enter your city / sector";
    if (form.district.trim().length < 2) e.district = "Enter your district";
    if (payment === "Mobile Money" && !/^(\+?25)?0?7[2389]\d{7}$/.test(momoNumber.replace(/\s/g, ""))) e.momoNumber = "Enter a valid Mobile Money number";
    if (payment === "Credit Card") {
      if (!/^\d{13,19}$/.test(card.number.replace(/\s/g, ""))) e.cardNumber = "Enter a valid card number";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.cardExpiry = "Use MM/YY format";
      if (!/^\d{3,4}$/.test(card.cvv)) e.cardCvv = "Invalid CVV";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(items, form, payment, subtotal, shipping);
      clearCart();
      navigate(`/order-success/${order.id}`);
    }, 900);
  };

  const inputCls = (err?: string) =>
    cn(
      "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 dark:bg-slate-900",
      err
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
        : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700"
    );

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-rose-500" role="alert">{error}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Checkout</h1>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-3" noValidate>
        <div className="space-y-6 lg:col-span-2">
          {/* Customer info */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="ci-heading">
            <h2 id="ci-heading" className="mb-5 flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-white">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-black text-white">1</span> Customer Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *" error={errors.fullName}>
                <input type="text" value={form.fullName} onChange={set("fullName")} placeholder="Jean Bosco Habimana" className={inputCls(errors.fullName)} autoComplete="name" />
              </Field>
              <Field label="Email *" error={errors.email}>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={inputCls(errors.email)} autoComplete="email" />
              </Field>
              <Field label="Phone Number *" error={errors.phone}>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="078X XXX XXX" className={inputCls(errors.phone)} autoComplete="tel" />
              </Field>
            </div>
          </motion.section>

          {/* Shipping */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="sh-heading">
            <h2 id="sh-heading" className="mb-5 flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-white">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-black text-white">2</span> Shipping Address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Street Address *" error={errors.address}>
                  <input type="text" value={form.address} onChange={set("address")} placeholder="KN 4 Ave, House 12" className={inputCls(errors.address)} autoComplete="street-address" />
                </Field>
              </div>
              <Field label="City / Sector *" error={errors.city}>
                <input type="text" value={form.city} onChange={set("city")} placeholder="Kigali" className={inputCls(errors.city)} />
              </Field>
              <Field label="District *" error={errors.district}>
                <input type="text" value={form.district} onChange={set("district")} placeholder="Gasabo" className={inputCls(errors.district)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Delivery Notes (optional)">
                  <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Landmark, preferred delivery time…" className={inputCls()} />
                </Field>
              </div>
            </div>
          </motion.section>

          {/* Payment */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="pm-heading">
            <h2 id="pm-heading" className="mb-5 flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-white">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-black text-white">3</span> Payment Method
            </h2>
            <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
              {paymentMethods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  role="radio"
                  aria-checked={payment === m.value}
                  onClick={() => setPayment(m.value)}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition",
                    payment === m.value
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-950/40"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                  )}
                >
                  <span className="text-2xl" aria-hidden="true">{m.emoji}</span>
                  <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{m.label}</p>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                </button>
              ))}
            </div>

            {payment === "Mobile Money" && (
              <div className="mt-4 max-w-sm">
                <Field label="Mobile Money Number *" error={errors.momoNumber}>
                  <input type="tel" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} placeholder="078X XXX XXX" className={inputCls(errors.momoNumber)} />
                </Field>
                <p className="mt-2 text-xs text-slate-400">You will receive a payment prompt on this number after placing the order.</p>
              </div>
            )}
            {payment === "Credit Card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Card Number *" error={errors.cardNumber}>
                    <input type="text" inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" className={inputCls(errors.cardNumber)} autoComplete="cc-number" />
                  </Field>
                </div>
                <Field label="Expiry (MM/YY) *" error={errors.cardExpiry}>
                  <input type="text" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="12/27" className={inputCls(errors.cardExpiry)} autoComplete="cc-exp" />
                </Field>
                <Field label="CVV *" error={errors.cardCvv}>
                  <input type="password" inputMode="numeric" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} placeholder="•••" className={inputCls(errors.cardCvv)} autoComplete="cc-csc" />
                </Field>
              </div>
            )}
            {payment === "Cash On Delivery" && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                💵 Please prepare {formatRWF(total)} in cash. Our courier will collect payment on delivery.
              </p>
            )}
          </motion.section>
        </div>

        {/* Order summary */}
        <aside aria-label="Order summary">
          <div className="sticky top-44 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Order Summary</h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((i) => (
                <li key={i.product.id} className="flex items-center gap-3">
                  <img src={i.product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{i.product.name}</p>
                    <p className="text-xs text-slate-400">Qty: {i.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{formatRWF(i.product.newPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2.5 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
              <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-semibold">{formatRWF(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd className="font-semibold">{shipping === 0 ? "Free" : formatRWF(shipping)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base dark:border-slate-700">
                <dt className="font-extrabold text-slate-900 dark:text-white">Total</dt>
                <dd className="font-extrabold text-brand-600 dark:text-brand-400">{formatRWF(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95 disabled:opacity-60"
            >
              {submitting ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Placing Order…</>
              ) : (
                <>Place Order · {formatRWF(total)}</>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-slate-400">🔒 Your information is secure and never shared.</p>
            <Link to="/cart" className="mt-2 block text-center text-xs font-semibold text-slate-400 hover:text-brand-600">← Back to cart</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
