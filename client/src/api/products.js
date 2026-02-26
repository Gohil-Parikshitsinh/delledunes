import axiosInstance from "./axiosInstance.js";

// GET /api/products
export const getAllProducts = async (params = {}) => {
  const response = await axiosInstance.get("/api/products", { params });
  return response.data;
};

// GET /api/products/:slug
export const getProductBySlug = async (slug) => {
  const response = await axiosInstance.get(`/api/products/${slug}`);
  return response.data;
};