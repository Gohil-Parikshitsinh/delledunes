import axiosInstance from "./axiosInstance.js";

// GET /api/categories/
export const getAllCategories = async () => {
  const response = await axiosInstance.get("/api/categories");
  return response.data;
};