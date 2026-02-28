import axiosInstance from "./axiosInstance.js";

// POST /api/orders
export const createOrder = async ({ shippingAddress, couponCode }) => {
  const response = await axiosInstance.post("/api/orders", {
    shippingAddress,
    couponCode: couponCode || undefined,
  });
  return response.data;
};

// GET /api/orders/my-orders
export const getMyOrders = async () => {
  const response = await axiosInstance.get("/api/orders/my-orders");
  return response.data;
};

// GET /api/orders/:id
export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/api/orders/${orderId}`);
  return response.data;
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

// GET /api/orders/all
export const getAllOrders = async () => {
  const response = await axiosInstance.get("/api/orders/all");
  return response.data;
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`/api/orders/${id}/status`, {
    status,
  });
  return response.data;
};