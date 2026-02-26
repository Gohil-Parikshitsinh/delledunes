import axiosInstance from "./axiosInstance.js";

// GET /api/cart
export const getCart = async () => {
  const response = await axiosInstance.get("/api/cart");
  return response.data;
};

// POST /api/cart
export const addToCart = async ({ productId, variantId, quantity }) => {
  const response = await axiosInstance.post("/api/cart", {
    product: productId,  
    variant: variantId,  
    quantity,
  });
  return response.data;
};

// PUT /api/cart/:variantId
export const updateCartItem = async (variantId, { quantity }) => {
  const response = await axiosInstance.put(`/api/cart/${variantId}`, {
    quantity,
  });
  return response.data;
};

// DELETE /api/cart/:variantId
export const removeCartItem = async (variantId) => {
  const response = await axiosInstance.delete(`/api/cart/${variantId}`);
  return response.data;
};

// DELETE /api/cart/clear
export const clearCart = async () => {
  const response = await axiosInstance.delete("/api/cart/clear");
  return response.data;
};