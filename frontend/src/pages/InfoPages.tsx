import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= About ================= */
const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "50+", label: "Top Products" },
  { value: "30", label: "Districts Covered" },
  { value: "4.9★", label: "Average Rating" },
];

const values = [
  { emoji: "✅", title: "100% Genuine", desc: "Every device is sealed, original and backed by official manufacturer warranty." },
  { emoji: "🚚", title: "Fast Delivery", desc: "Same-day delivery in Kigali and 1–3 days nationwide across Rwanda." },
  { emoji: "💰", title: "Best Prices", desc: "Transparent RWF pricing with regular flash sales and unbeatable deals." },
  { emoji: "🤝", title: "Real Support", desc: "Talk to a real human on WhatsApp, phone or email — 7 days a week." },
];

export function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">About MichealPhone</span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Your Trusted Smartphone Store</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base dark:text-slate-400">
          Founded in Kigali, MichealPhone started with a simple mission: make genuine smartphones, laptops and
          accessories accessible to every Rwandan at honest prices. Today we serve thousands of customers across
          all 30 districts with fast delivery, flexible payments and customer service that actually cares.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{s.value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {values.map((v, i) => (
          <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-3xl" aria-hidden="true">{v.emoji}</span>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">{v.title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-gradient-to-br from-brand-700 to-brand-950 p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-extrabold">Ready to upgrade your tech?</h2>
        <p className="mt-2 text-sm text-white/75">Browse our latest collection of smartphones, laptops and accessories.</p>
        <Link to="/products" className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-brand-800 transition hover:scale-105">Shop Now</Link>
      </div>
    </div>
  );
}

/* ================= Contact ================= */
export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.subject.trim().length < 3) errs.subject = "Enter a subject";
    if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSent(true);
  };

  const input = (err?: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 dark:bg-slate-900 ${
      err ? "border-rose-400 focus:ring-rose-500/20" : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700"
    }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">Get in Touch</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">Questions about a product, an order or delivery? We reply within minutes during business hours.</p>
      </motion.div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {[
            ["📍", "Visit Us", "KN 4 Ave, Kigali City Tower, Kigali, Rwanda"],
            ["📞", "Call Us", "+250 788 123 456"],
            ["✉️", "Email Us", "hello@michealphone.rw"],
            ["💬", "WhatsApp", "+250 788 123 456 — fastest response"],
            ["🕘", "Hours", "Mon – Sat: 8:00 AM – 8:00 PM"],
          ].map(([e, t, d]) => (
            <div key={t} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl" aria-hidden="true">{e}</span>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t}</h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid h-full place-items-center rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
              <div>
                <span className="text-5xl" aria-hidden="true">✅</span>
                <h2 className="mt-4 text-xl font-extrabold text-emerald-700 dark:text-emerald-400">Message Sent!</h2>
                <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-500">Thanks for reaching out. Our team will reply to your email shortly.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Name *</label>
                  <input id="c-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input(errors.name)} placeholder="Your name" />
                  {errors.name && <p className="mt-1 text-xs text-rose-500" role="alert">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="c-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Email *</label>
                  <input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input(errors.email)} placeholder="you@email.com" />
                  {errors.email && <p className="mt-1 text-xs text-rose-500" role="alert">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Subject *</label>
                  <input id="c-subject" type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={input(errors.subject)} placeholder="How can we help?" />
                  {errors.subject && <p className="mt-1 text-xs text-rose-500" role="alert">{errors.subject}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="c-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Message *</label>
                  <textarea id="c-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={input(errors.message)} placeholder="Tell us more…" />
                  {errors.message && <p className="mt-1 text-xs text-rose-500" role="alert">{errors.message}</p>}
                </div>
              </div>
              <button type="submit" className="mt-6 w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95 sm:w-auto sm:px-10">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= 404 ================= */
export function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-20 text-center">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-7xl font-black text-brand-600/20 sm:text-9xl dark:text-brand-400/20">404</p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or has been moved. Let's get you back to shopping.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700">Go Home</Link>
          <Link to="/products" className="rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200">Browse Products</Link>
        </div>
      </motion.div>
    </div>
  );
}
