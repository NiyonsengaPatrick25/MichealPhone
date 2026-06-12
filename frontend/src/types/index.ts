export type Category = "Smartphones" | "Laptops" | "Accessories";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  image: string;
  description: string;
  rating: number;
  stock: number;
  oldPrice: number;
  newPrice: number;
  featured: boolean;
  trending: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export type PaymentMethod = "Cash On Delivery" | "Mobile Money" | "Credit Card";

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  status: "Processing" | "Confirmed" | "Delivered";
  createdAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image?: string;
  gradient: string;
  badge?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatarColor: string;
}

export type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export interface ProductFilters {
  search: string;
  category: string;
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number;
  sort: SortOption;
}
