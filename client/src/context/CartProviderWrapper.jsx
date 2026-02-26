import CartProvider from "./CartProvider.jsx";
import useAuth from "../hooks/useAuth.js";

const CartProviderWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  
  return (
    <CartProvider isAuthenticated={isAuthenticated}>
      {children}
    </CartProvider>
  );
};

export default CartProviderWrapper;