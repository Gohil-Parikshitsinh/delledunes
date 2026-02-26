import { useState, useEffect, useCallback } from "react";
import CartContext from "./CartContext.js";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from "../api/cart.js";

// ── LOCAL STORAGE HELPERS ─────────────────────────────────────────────────────
const GUEST_CART_KEY = "delle_dunes_guest_cart";

const getGuestCart = () => {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("Could not save guest cart to localStorage:", err);
  }
};

const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (err) {
    console.warn("Could not clear guest cart from localStorage:", err);
  }
};
// ── CART PROVIDER ─────────────────────────────────────────────────────────────
const CartProvider = ({ children, isAuthenticated }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // ── FETCH BACKEND CART ────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await getCart();
      setItems(data.data?.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ── MERGE GUEST CART INTO BACKEND ON LOGIN ────────────────────────────────
  const mergeGuestCart = useCallback(async () => {
    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;

    setSyncing(true);
    try {
      // Fire all merge requests in parallel
      await Promise.allSettled(
        guestItems.map((item) =>
          apiAddToCart({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })
        )
      );
      clearGuestCart();
      // Refresh cart from backend after merge
      await fetchCart();
    } catch {
      // Merge failed — keep guest cart, try again next login
    } finally {
      setSyncing(false);
    }
  }, [fetchCart]);

  // ── INIT ON AUTH CHANGE ───────────────────────────────────────────────────
  // When user logs in: merge guest cart then fetch
  // When user logs out: load guest cart from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCart();
    } else {
      setItems(getGuestCart());
    }
  }, [isAuthenticated, mergeGuestCart]);

  // ── ADD TO CART ───────────────────────────────────────────────────────────
  const addToCart = async ({
    productId,
    variantId,
    quantity,
    priceSnapshot,
    name,
    image,
  }) => {
    if (isAuthenticated) {
      await apiAddToCart({ productId, variantId, quantity });
      await fetchCart();
    } else {
      // Guest — update localStorage
      const current = getGuestCart();
      const existing = current.find((i) => i.variantId === variantId);

      let updated;
      if (existing) {
        updated = current.map((i) =>
          i.variantId === variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        updated = [
          ...current,
          { productId, variantId, quantity, priceSnapshot, name, image },
        ];
      }

      saveGuestCart(updated);
      setItems(updated);
    }
  };

  // ── UPDATE CART ITEM ──────────────────────────────────────────────────────
  const updateCartItem = async (variantId, quantity) => {
    if (isAuthenticated) {
      await apiUpdateCartItem(variantId, { quantity });
      await fetchCart();
    } else {
      const updated = items.map((i) =>
        i.variantId === variantId ? { ...i, quantity } : i
      );
      saveGuestCart(updated);
      setItems(updated);
    }
  };

  // ── REMOVE CART ITEM ──────────────────────────────────────────────────────
  const removeCartItem = async (variantId) => {
    if (isAuthenticated) {
      await apiRemoveCartItem(variantId);
      await fetchCart();
    } else {
      const updated = items.filter((i) => i.variantId !== variantId);
      saveGuestCart(updated);
      setItems(updated);
    }
  };

  // ── CLEAR CART ────────────────────────────────────────────────────────────
  const clearCart = async () => {
    if (isAuthenticated) {
      await apiClearCart();
      setItems([]);
    } else {
      clearGuestCart();
      setItems([]);
    }
  };

  // ── DERIVED VALUES ────────────────────────────────────────────────────────
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = items.reduce((acc, item) => {
    const price = item.priceSnapshot ?? item.priceAtPurchase ?? 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        syncing,
        cartCount,
        cartTotal,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
