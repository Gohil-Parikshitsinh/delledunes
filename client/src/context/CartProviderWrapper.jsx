import CartProvider from "./CartProvider.jsx";
import useAuth from "../hooks/useAuth.js";
import PageLoader from "../components/layout/PageLoader.jsx";

const CartProviderWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoader />;
  
  return (
    <CartProvider isAuthenticated={isAuthenticated}>
      {children}
    </CartProvider>
  );
};

export default CartProviderWrapper;