import { createContext, useContext, type ReactNode } from "react";
import type { Product } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface WishlistContextValue {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<Product[]>("mp-wishlist", []);

  const toggleWishlist = (product: Product) =>
    setItems((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );

  const removeFromWishlist = (productId: string) =>
    setItems((prev) => prev.filter((p) => p.id !== productId));

  const isWishlisted = (productId: string) => items.some((p) => p.id === productId);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
