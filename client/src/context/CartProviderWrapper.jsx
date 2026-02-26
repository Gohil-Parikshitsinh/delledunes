import CartProvider from "./CartProvider.jsx";
import useAuth from "../hooks/useAuth.js";

const CartProviderWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <CartProvider isAuthenticated={isAuthenticated}>
      {children}
    </CartProvider>
  );
};

export default CartProviderWrapper;