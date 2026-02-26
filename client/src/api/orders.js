import axiosInstance from "./axiosInstance.js";

// POST /api/orders
export const createOrder = async ({ items, shippingAddressId }) => {
  const response = await axiosInstance.post("/api/orders", {
    items,
    shippingAddressId,
  });
  return response.data;
};

// GET /api/orders/my-orders
export const getMyOrders = async () => {
  const response = await axiosInstance.get("/api/orders/my-orders");
  return response.data;
};

// GET /api/orders/:id
export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`/api/orders/${id}`);
  return response.data;
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

// GET /api/orders
export const getAllOrders = async () => {
  const response = await axiosInstance.get("/api/orders");
  return response.data;
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (id, { orderStatus }) => {
  const response = await axiosInstance.put(`/api/orders/${id}/status`, {
    orderStatus,
  });
  return response.data;
};