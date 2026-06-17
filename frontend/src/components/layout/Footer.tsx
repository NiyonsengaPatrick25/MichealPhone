import { useState } from "react";
import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/products", label: "Shop All" },
  { to: "/products?category=Smartphones", label: "Smartphones" },
  { to: "/products?category=Laptops", label: "Laptops" },
  { to: "/products?category=Accessories", label: "Accessories" },
  { to: "/orders", label: "Order History" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const socials = [
  { label: "Facebook", href: "https://facebook.com", path: "M14 9h3l-.4 3H14v9h-3.2v-9H8.5V9h2.3V7.2c0-2.3 1-3.7 3.7-3.7H17v3h-1.6c-1.1 0-1.4.4-1.4 1.3V9Z" },
  { label: "Instagram", href: "https://instagram.com", path: "M12 8.4A3.6 3.6 0 1 0 12 15.6 3.6 3.6 0 0 0 12 8.4Zm0-2.4c2 0 2.2 0 3 .05a4.6 4.6 0 0 1 4.95 4.95c.05.8.05 1 .05 3s0 2.2-.05 3a4.6 4.6 0 0 1-4.95 4.95c-.8.05-1 .05-3 .05s-2.2 0-3-.05A4.6 4.6 0 0 1 4.05 17c-.05-.8-.05-1-.05-3s0-2.2.05-3A4.6 4.6 0 0 1 9 6.05C9.8 6 10 6 12 6Zm5.4.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" },
  { label: "X / Twitter", href: "https://x.com", path: "M17.7 3H21l-7.1 8.1L22 21h-6.6l-5.1-6.7L4.4 21H1l7.6-8.7L2 3h6.8l4.6 6.1L17.7 3Z" },
  { label: "WhatsApp", href: "https://wa.me/250791602044", path: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5 13.9c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-2.7-.8-4.7-2.8-6-5.2-.5-.9-.8-2-.3-2.8.2-.4.6-.6 1-.6h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.4 0 .7.7 1.2 1.8 2.2 3.1 2.8.3.1.5.1.7-.1l.7-.8c.2-.3.4-.3.7-.2l1.8.9c.3.1.4.3.4.6 0 0-.1.3-.2.5Z" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white">M</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">Micheal<span className="text-brand-600 dark:text-brand-400">Phone</span></span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Your Trusted Smartphone Store. Genuine smartphones, laptops and accessories delivered across Rwanda at the best prices in RWF.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-brand-600"
                >
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex gap-2"><span aria-hidden="true">📍</span> KN 4 Ave, Kigali City Tower, Kigali, Rwanda</li>
              <li className="flex gap-2"><span aria-hidden="true">📞</span> <a href="tel:+250788123456" className="hover:text-brand-600">+250 788 123 456</a></li>
              <li className="flex gap-2"><span aria-hidden="true">✉️</span> <a href="mailto:hello@michealphone.rw" className="hover:text-brand-600">hello@michealphone.rw</a></li>
              <li className="flex gap-2"><span aria-hidden="true">🕘</span> Mon – Sat: 8:00 AM – 8:00 PM</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Newsletter</h3>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Get exclusive deals and new arrivals straight to your inbox.</p>
            {subscribed ? (
              <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">✅ Subscribed! Welcome to the family.</p>
            ) : (
              <form onSubmit={subscribe} className="mt-4 flex gap-2">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full min-w-0 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900"
                />
                <button type="submit" className="shrink-0 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 active:scale-95">Join</button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row dark:border-slate-800">
          <p>© {new Date().getFullYear()} MichealPhone. All rights reserved.</p>
          <p>Prices in Rwandan Franc (RWF) · Made with ❤️ in Kigali</p>
        </div>
      </div>
    </footer>
  );
}
