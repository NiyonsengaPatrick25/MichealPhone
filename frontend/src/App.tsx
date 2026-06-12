import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { OrderProvider } from "./contexts/OrderContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
