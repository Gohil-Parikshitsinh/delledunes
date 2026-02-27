import axiosInstance from "./axiosInstance.js";

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

// GET /api/admin/dashboard
export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/api/admin/dashboard");
  return response.data;
};
// Add this to src/api/admin.js
export const getDashboardChartData = async () => {
  const response = await axiosInstance.get("/api/admin/dashboard/chart");
  return response.data;
};

// ── INVENTORY ─────────────────────────────────────────────────────────────────

// GET /api/admin/inventory
export const getInventoryStats = async () => {
  const response = await axiosInstance.get("/api/admin/inventory");
  return response.data;
};

// GET /api/admin/inventory/low-stock
export const getLowStockProducts = async () => {
  const response = await axiosInstance.get("/api/admin/inventory/low-stock");
  return response.data;
};

// ── REPORTS ───────────────────────────────────────────────────────────────────

export const getRevenueAnalytics = async (startDate = "", endDate = "") => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const response = await axiosInstance.get(`/api/admin/analytics/revenue?${params}`);
  return response.data;
};

export const getMonthlyRevenue = async (year) => {
  const response = await axiosInstance.get(`/api/admin/analytics/monthly?year=${year}`);
  return response.data;
};

export const getSalesReports = async (startDate = "", endDate = "") => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const response = await axiosInstance.get(`/api/admin/reports/sales?${params}`);
  return response.data;
};

export const getUserReports = async (startDate = "", endDate = "") => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const response = await axiosInstance.get(`/api/admin/reports/users?${params}`);
  return response.data;
};

export const getTopProducts = async (startDate = "", endDate = "") => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const response = await axiosInstance.get(`/api/admin/reports/products?${params}`);
  return response.data;
};

// ── PREDICTIONS — ML endpoints ────────────────────────────────────────────────

// GET /api/admin/predictions
export const getPredictionOverview = async () => {
  const response = await axiosInstance.get("/api/admin/predictions");
  return response.data;
};

// GET /api/admin/predictions/sales
export const getSalesPrediction = async () => {
  const response = await axiosInstance.get("/api/admin/predictions/sales");
  return response.data;
};

// GET /api/admin/predictions/demand
export const getDemandPrediction = async () => {
  const response = await axiosInstance.get("/api/admin/predictions/demand");
  return response.data;
};

// GET /api/admin/predictions/churn
export const getUserChurnPrediction = async () => {
  const response = await axiosInstance.get("/api/admin/predictions/churn");
  return response.data;
};

// ── USERS ─────────────────────────────────────────────────────────────────────

// GET /api/users
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/api/users");    
  return response.data;
};

// GET /api/users/:id
export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/api/users/${id}`);
  return response.data;
};

// DELETE /api/users/:id
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/users/${id}`);
  return response.data;
};

// ── VARIANTS ──────────────────────────────────────────────────────────────────

// GET /api/variants/view
export const getAllVariants = async () => {
  const response = await axiosInstance.get("/api/variants/view");
  return response.data;
};

// POST /api/variants
export const createVariant = async ({ product, size, stock }) => {
  const response = await axiosInstance.post("/api/variants", {
    product,
    size,
    stock,
  });
  return response.data;
};

// PUT /api/variants/:id
export const updateVariant = async (id, { skuCode, size, stock }) => {
  const response = await axiosInstance.put(`/api/variants/${id}`, {
    skuCode,
    size,
    stock,
  });
  return response.data;
};

// DELETE /api/variants/:id
export const deleteVariant = async (id) => {
  const response = await axiosInstance.delete(`/api/variants/${id}`);
  return response.data;
};

// ── PRODUCTS (admin) ──────────────────────────────────────────────────────────

// GET /api/products/view
export const getAllProductsAdmin = async () => {
  const response = await axiosInstance.get("/api/products/view");  
  return response.data;
};

// GET /api/products/view/:slug
export const getProductByIdAdmin = async (id) => {
  const response = await axiosInstance.get(`/api/products/view/${id}`);
  return response.data;
};

// POST /api/products
export const createProduct = async (data) => {
  const response = await axiosInstance.post("/api/products", data);
  return response.data;
};

// PUT /api/products/:id
export const updateProduct = async (id, data) => {
  const response = await axiosInstance.put(`/api/products/${id}`, data);
  return response.data;
};

// DELETE /api/products/:id
export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
};

// ── CATEGORIES (admin) ────────────────────────────────────────────────────────

// GET /api/categories/view
export const getAllCategoriesAdmin = async () => {
  const response = await axiosInstance.get("/api/categories/view");
  return response.data;
};

// POST /api/categories
export const createCategory = async ({ name, slug }) => {
  const response = await axiosInstance.post("/api/categories", { name, slug });
  return response.data;
};

// PUT /api/categories/:id
export const updateCategory = async (id, { name, slug }) => {
  const response = await axiosInstance.put(`/api/categories/${id}`, {
    name,
    slug,
  });
  return response.data;
};

// DELETE /api/categories/:id
export const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`/api/categories/${id}`);
  return response.data;
};