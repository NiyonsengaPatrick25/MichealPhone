import type { Advertisement, Testimonial, Review } from "../types";

export const announcements: string[] = [
  "🔥 Flash Sale — Up to 25% OFF flagship smartphones today only!",
  "🚚 Free delivery in Kigali on orders above RWF 100,000",
  "💳 Pay with MoMo, Card or Cash on Delivery",
  "📱 Order via WhatsApp — fast & easy: +250 788 123 456",
];

export const heroAds: Advertisement[] = [
  {
    id: "ad-1",
    title: "iPhone 16 Pro Max",
    subtitle: "Titanium. So strong. So light. So Pro. Now available at MichealPhone.",
    cta: "Shop iPhone",
    link: "/products?search=iPhone%2016",
    image: "/images/hero-phone.png",
    gradient: "from-slate-900 via-brand-950 to-slate-900",
    badge: "New Arrival",
  },
  {
    id: "ad-2",
    title: "Galaxy S25 Ultra",
    subtitle: "Galaxy AI is here. Capture epic 200MP detail and save RWF 150,000 today.",
    cta: "Shop Galaxy",
    link: "/products?search=Galaxy%20S25",
    image: "/images/phone-1.jpg",
    gradient: "from-indigo-950 via-purple-950 to-slate-950",
    badge: "Save RWF 150,000",
  },
  {
    id: "ad-3",
    title: "MacBook Season",
    subtitle: "M-series MacBooks from RWF 1,890,000. Power that lasts all day.",
    cta: "Shop Laptops",
    link: "/products?category=Laptops",
    image: "/images/laptop-1.jpg",
    gradient: "from-slate-950 via-emerald-950 to-slate-950",
    badge: "Hot Deal",
  },
];

export const promoCards: Advertisement[] = [
  {
    id: "pc-1",
    title: "Audio Week",
    subtitle: "Earbuds & headphones from RWF 45,000",
    cta: "Shop Audio",
    link: "/products?category=Accessories",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    id: "pc-2",
    title: "Budget Phones",
    subtitle: "Quality smartphones under RWF 300,000",
    cta: "Shop Now",
    link: "/products?category=Smartphones&max=300000",
    gradient: "from-brand-600 to-cyan-500",
  },
  {
    id: "pc-3",
    title: "Smartwatch Fest",
    subtitle: "Track your fitness from RWF 55,000",
    cta: "Explore",
    link: "/products?search=watch",
    gradient: "from-violet-600 to-fuchsia-500",
  },
];

export const brandPromos = [
  { brand: "Apple", note: "Authorized Reseller", emoji: "🍎" },
  { brand: "Samsung", note: "Official Partner", emoji: "📱" },
  { brand: "Xiaomi", note: "Mi Store Partner", emoji: "⚡" },
  { brand: "Google", note: "Pixel Specialist", emoji: "🤖" },
  { brand: "Tecno", note: "Premium Dealer", emoji: "✨" },
  { brand: "HP", note: "Certified Store", emoji: "💻" },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aline Uwase",
    role: "Kigali, Rwanda",
    comment: "Ordered my iPhone 15 via WhatsApp and it was delivered the same day. Genuine product, sealed box. MichealPhone is now my go-to store!",
    rating: 5,
    avatarColor: "bg-rose-500",
  },
  {
    id: "t2",
    name: "Eric Mugisha",
    role: "Musanze, Rwanda",
    comment: "Best prices in Rwanda, honestly. I compared everywhere and saved over RWF 80,000 on my Galaxy S25. Delivery to Musanze took 2 days.",
    rating: 5,
    avatarColor: "bg-brand-600",
  },
  {
    id: "t3",
    name: "Diane Ingabire",
    role: "Huye, Rwanda",
    comment: "The MacBook Air I bought works perfectly. Customer service answered all my questions patiently. Highly recommended store.",
    rating: 4.5,
    avatarColor: "bg-emerald-500",
  },
  {
    id: "t4",
    name: "Jean Claude Niyonzima",
    role: "Rubavu, Rwanda",
    comment: "Paying with Mobile Money was so easy. The Redmi Note 14 Pro arrived well-packaged with a free screen protector. 10/10!",
    rating: 5,
    avatarColor: "bg-amber-500",
  },
];

export const sampleReviews: Review[] = [
  { id: "r1", name: "Patrick K.", rating: 5, comment: "Authentic product, fast delivery to Kigali. Very happy with my purchase!", date: "2025-11-02" },
  { id: "r2", name: "Sandrine M.", rating: 4, comment: "Great phone for the price. Battery life is excellent. Delivery took a bit longer than expected.", date: "2025-10-18" },
  { id: "r3", name: "Yves H.", rating: 5, comment: "Customer support helped me choose the right model. Smooth WhatsApp ordering experience.", date: "2025-09-27" },
];
