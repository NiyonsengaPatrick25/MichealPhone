import { products } from "../data/products";
import type { Product, ProductFilters, SortOption } from "../types";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured);
}

export function getTrending(): Product[] {
  return products.filter((p) => p.trending);
}

export function getNewArrivals(limit = 8): Product[] {
  return [...products]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

export function getDeals(limit = 6): Product[] {
  return [...products]
    .sort((a, b) => (b.oldPrice - b.newPrice) / b.oldPrice - (a.oldPrice - a.newPrice) / a.oldPrice)
    .slice(0, limit);
}

export function getDealOfTheDay(): Product {
  return getDeals(1)[0];
}

export function getRelated(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .sort((a, b) => (b.brand === product.brand ? 1 : 0) - (a.brand === product.brand ? 1 : 0))
    .slice(0, limit);
}

export function searchProducts(query: string, limit = 6): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.newPrice - b.newPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.newPrice - a.newPrice);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "popular":
    default:
      return sorted.sort(
        (a, b) =>
          (b.trending ? 2 : 0) + (b.featured ? 1 : 0) + b.rating -
          ((a.trending ? 2 : 0) + (a.featured ? 1 : 0) + a.rating)
      );
  }
}

export function filterProducts(filters: ProductFilters): Product[] {
  const q = filters.search.trim().toLowerCase();
  let result = products.filter((p) => {
    if (q && !(`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q))) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    if (filters.minPrice !== null && p.newPrice < filters.minPrice) return false;
    if (filters.maxPrice !== null && p.newPrice > filters.maxPrice) return false;
    if (filters.minRating > 0 && p.rating < filters.minRating) return false;
    return true;
  });
  result = sortProducts(result, filters.sort);
  return result;
}
