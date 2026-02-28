import axiosInstance from "./axiosInstance";

// Admin
export const getAllCoupons = () => axiosInstance.get("/api/coupons");

export const createCoupon = (data) => axiosInstance.post("/api/coupons", data);

export const updateCoupon = (id, data) =>
  axiosInstance.put(`/api/coupons/${id}`, data);

export const deleteCoupon = (id) =>
  axiosInstance.delete(`/api/coupons/${id}`);

// Storefront — apply at checkout
export const applyCoupon = (code, cartTotal) =>
  axiosInstance.post("/api/coupons/apply", { code, cartTotal });