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

// GET /api/admin/reports
export const getReports = async () => {
  const response = await axiosInstance.get("/api/admin/reports");
  return response.data;
};

// GET /api/admin/reports/sales
export const getSalesReports = async () => {
  const response = await axiosInstance.get("/api/admin/reports/sales");
  return response.data;
};

// GET /api/admin/reports/users
export const getUserReports = async () => {
  const response = await axiosInstance.get("/api/admin/reports/users");
  return response.data;
};

// GET /api/admin/reports/products
export const getTopProducts = async () => {
  const response = await axiosInstance.get("/api/admin/reports/products");
  return response.data;
};

// ── ANALYTICS ─────────────────────────────────────────────────────────────────

// GET /api/admin/analytics/revenue
export const getRevenueAnalytics = async () => {
  const response = await axiosInstance.get("/api/admin/analytics/revenue");
  return response.data;
};

// GET /api/admin/analytics/monthly
export const getMonthlyRevenue = async () => {
  const response = await axiosInstance.get("/api/admin/analytics/monthly");
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