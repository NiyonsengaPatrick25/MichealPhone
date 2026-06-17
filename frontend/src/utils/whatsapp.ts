import type { CartItem, Product } from "../types";
import { formatRWF } from "./currency";

export const WHATSAPP_NUMBER = "250791602044";

export function buildWhatsAppMessage(product: Product, quantity: number): string {
  return [
    "Hello MichealPhone,",
    "",
    "I want to order:",
    "",
    `Product Name: ${product.name}`,
    `Quantity: ${quantity}`,
    `Price: ${formatRWF(product.newPrice * quantity)}`,
    "",
    "Please assist me with this order.",
  ].join("\n");
}

export function buildCartWhatsAppMessage(items: CartItem[], total: number): string {
  const lines = [
    "Hello MichealPhone,",
    "",
    "I want to order:",
    "",
    ...items.map(
      (i) =>
        `Product Name: ${i.product.name}\nQuantity: ${i.quantity}\nPrice: ${formatRWF(
          i.product.newPrice * i.quantity
        )}\n`
    ),
    `Total: ${formatRWF(total)}`,
    "",
    "Please assist me with this order.",
  ];
  return lines.join("\n");
}

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
