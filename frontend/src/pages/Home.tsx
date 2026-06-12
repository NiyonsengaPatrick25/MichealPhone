import { useEffect, useState } from "react";
import { categories } from "../data/products";
import { getFeatured, getTrending, getNewArrivals } from "../services/productService";
import { ProductGrid, CategoryCard } from "../components/product/ProductCard";
import { SectionHeading, GridSkeleton } from "../components/ui";
import {
  HeroCarousel,
  PromoCards,
  FlashSaleSection,
  DealOfTheDay,
  BrandPromotion,
  NewsletterSection,
  TestimonialsSection,
} from "../components/home/HomeSections";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const featured = getFeatured().slice(0, 8);
  const trending = getTrending().slice(0, 8);
  const arrivals = getNewArrivals(8);

  return (
    <div>
      <HeroCarousel />
      <PromoCards />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Shop by category">
        <SectionHeading title="Shop by Category" subtitle="Find exactly what you need" link="/products" />
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.name} {...c} />
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Featured products">
        <SectionHeading title="Featured Products" subtitle="Hand-picked premium devices" link="/products" />
        {loading ? <GridSkeleton count={8} /> : <ProductGrid products={featured} />}
      </section>

      <FlashSaleSection />

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Trending products">
        <SectionHeading title="Trending Now" subtitle="What everyone is buying this week" link="/products?sort=popular" />
        {loading ? <GridSkeleton count={8} /> : <ProductGrid products={trending} />}
      </section>

      <DealOfTheDay />

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-10" aria-label="New arrivals">
        <SectionHeading title="New Arrivals" subtitle="Fresh from the box" link="/products?sort=newest" />
        {loading ? <GridSkeleton count={8} /> : <ProductGrid products={arrivals} />}
      </section>

      <BrandPromotion />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
