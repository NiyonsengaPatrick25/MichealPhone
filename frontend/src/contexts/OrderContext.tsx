import { createContext, useContext, type ReactNode } from "react";
import type { CartItem, CustomerInfo, Order, PaymentMethod } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface OrderContextValue {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    customer: CustomerInfo,
    paymentMethod: PaymentMethod,
    subtotal: number,
    shipping: number
  ) => Order;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useLocalStorage<Order[]>("mp-orders", []);

  const placeOrder = (
    items: CartItem[],
    customer: CustomerInfo,
    paymentMethod: PaymentMethod,
    subtotal: number,
    shipping: number
  ): Order => {
    const order: Order = {
      id: `MP-${Date.now().toString(36).toUpperCase()}`,
      items,
      customer,
      paymentMethod,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "Processing",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
