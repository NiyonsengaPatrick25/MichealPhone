import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { heroAds, promoCards, brandPromos, testimonials } from "../../data/ads";
import { getDeals, getDealOfTheDay } from "../../services/productService";
import { formatRWF, discountPercent } from "../../utils/currency";
import { RatingStars, PriceTag, SectionHeading } from "../ui";
import { ProductCard } from "../product/ProductCard";
import { useCart } from "../../contexts/CartContext";
import { cn } from "../../utils/cn";

/* ---------------- Hero / Advertisement Carousel ---------------- */
export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const activeHeroAds = heroAds.filter((item) => item.status !== "Inactive");

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % activeHeroAds.length), 6000);
    return () => clearInterval(t);
  }, [activeHeroAds.length]);

  const ad = activeHeroAds[index] ?? activeHeroAds[0];
  if (!ad) return null;

  const ctaLink = ad.link ?? "/products";

  return (
    <section aria-label="Promotions" className="mx-auto max-w-7xl px-4 pt-4 sm:pt-6">
      <div className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br text-white shadow-2xl", ad.gradient)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={ad.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid min-h-[380px] items-center gap-6 p-7 sm:min-h-[420px] sm:p-12 lg:grid-cols-2"
          >
            <div className="relative z-10">
              {ad.badge && (
                <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }} className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur">
                  ⚡ {ad.badge}
                </motion.span>
              )}
              <motion.h1 initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                {ad.title}
              </motion.h1>
              <motion.p initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 max-w-md text-sm text-white/75 sm:text-base">
                {ad.subtitle}
              </motion.p>
              <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mt-7 flex flex-wrap gap-3">
                <Link to={ctaLink} className="rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-900 shadow-xl transition hover:scale-105 active:scale-95">
                  {ad.cta}
                </Link>
                <Link to="/products" className="rounded-full border border-white/30 px-7 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">
                  Browse All
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="relative hidden items-center justify-center lg:flex"
            >
              <div className="absolute h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
              <img src={ad.image} alt={ad.title} className="relative max-h-80 rounded-2xl object-contain drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {activeHeroAds.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn("h-2 rounded-full transition-all", i === index ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Flash Sale with countdown ---------------- */
function useCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, +end - +now);
      setTime({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export function FlashSaleSection() {
  const { h, m, s } = useCountdown();
  const deals = getDeals(5);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Flash sale">
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 to-orange-500 p-5 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <span className="text-3xl" aria-hidden="true">⚡</span>
            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl">Flash Sale</h2>
              <p className="text-xs text-white/80">Biggest discounts — today only!</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5" role="timer" aria-label={`Sale ends in ${h} hours ${m} minutes ${s} seconds`}>
            {[pad(h), pad(m), pad(s)].map((v, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/95 text-lg font-extrabold tabular-nums text-rose-600 shadow">{v}</span>
                {i < 2 && <span className="font-bold text-white">:</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {deals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Deal Of The Day ---------------- */
export function DealOfTheDay() {
  const product = getDealOfTheDay();
  const { addToCart } = useCart();
  const saved = product.oldPrice - product.newPrice;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Deal of the day">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="relative bg-slate-100 dark:bg-slate-800">
          <img src={product.image} alt={product.name} loading="lazy" className="h-64 w-full object-cover sm:h-full sm:max-h-[420px]" />
          <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-4 py-1.5 text-xs font-extrabold text-white shadow-lg">
            DEAL OF THE DAY · -{discountPercent(product.oldPrice, product.newPrice)}%
          </span>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{product.brand} · {product.category}</span>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">{product.name}</h2>
          <div className="mt-3"><RatingStars rating={product.rating} size="md" showValue /></div>
          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{product.description}</p>
          <div className="mt-6"><PriceTag oldPrice={product.oldPrice} newPrice={product.newPrice} size="lg" /></div>
          <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">You save {formatRWF(saved)} today!</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-full bg-brand-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 active:scale-95"
            >
              Add to Cart
            </button>
            <Link to={`/products/${product.id}`} className="rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200">
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- Promotional Cards ---------------- */
export function PromoCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6" aria-label="Promotions">
      <div className="grid gap-4 sm:grid-cols-3">
        {promoCards.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={c.link}
              className={cn("group flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl", c.gradient)}
            >
              <div>
                <h3 className="text-xl font-extrabold">{c.title}</h3>
                <p className="mt-1 text-sm text-white/85">{c.subtitle}</p>
              </div>
              <span className="mt-6 inline-flex w-fit items-center gap-1 rounded-full bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur transition group-hover:gap-2 group-hover:bg-white/30">
                {c.cta} →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Brand Promotion ---------------- */
export function BrandPromotion() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Top brands">
      <SectionHeading title="Top Brands" subtitle="Official partners & authorized reseller" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brandPromos.map((b, i) => (
          <motion.div key={b.brand} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
            <Link
              to={`/products?search=${encodeURIComponent(b.brand)}`}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:border-brand-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500"
            >
              <span className="text-3xl" aria-hidden="true">{b.emoji}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{b.brand}</span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{b.note}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Newsletter ---------------- */
export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Newsletter">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 p-8 text-center text-white sm:p-14">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true" />
        <h2 className="relative text-2xl font-extrabold sm:text-3xl">Get RWF 10,000 off your first order 🎁</h2>
        <p className="relative mx-auto mt-3 max-w-md text-sm text-white/75">Join 5,000+ subscribers and never miss flash sales, new arrivals and exclusive MichealPhone deals.</p>
        {done ? (
          <p className="relative mx-auto mt-7 w-fit rounded-full bg-white/15 px-6 py-3 text-sm font-bold backdrop-blur">✅ You're in! Check your inbox for your coupon.</p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setDone(true); }}
            className="relative mx-auto mt-7 flex max-w-md gap-2"
          >
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input
              id="nl-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white outline-none backdrop-blur placeholder:text-white/50 focus:border-white/50"
            />
            <button type="submit" className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-800 transition hover:scale-105 active:scale-95">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Customer testimonials">
      <SectionHeading title="What Our Customers Say" subtitle="Real reviews from happy customers across Rwanda" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <RatingStars rating={t.rating} />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{t.comment}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className={cn("grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold text-white", t.avatarColor)} aria-hidden="true">
                {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900 dark:text-white">{t.name}</span>
                <span className="block text-xs text-slate-400">{t.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
