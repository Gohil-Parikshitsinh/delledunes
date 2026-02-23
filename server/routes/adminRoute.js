import express from "express";
import authUser from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";
import {
  getDashboardChartData,
  getDashboardStats,
  getDemandPrediction,
  getInventoryStats,
  getLowStockProducts,
  getMonthlyRevenue,
  getPredictionOverview,
  getReports,
  getRevenueAnalytics,
  getSalesPrediction,
  getSalesReports,
  getTopProducts,
  getUserChurnPrediction,
  getUserReports,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", authUser, adminAuth, getDashboardStats);
adminRouter.get("/dashboard/chart", authUser, adminAuth, getDashboardChartData);

adminRouter.get("/inventory", authUser, adminAuth, getInventoryStats);
adminRouter.get(
  "/inventory/low-stock",
  authUser,
  adminAuth,
  getLowStockProducts
);

adminRouter.get("/reports", authUser, adminAuth, getReports);
adminRouter.get("/reports/sales", authUser, adminAuth, getSalesReports);
adminRouter.get("/reports/users", authUser, adminAuth, getUserReports);
adminRouter.get("/reports/products", authUser, adminAuth, getTopProducts);

adminRouter.get("/analytics/revenue", authUser, adminAuth, getRevenueAnalytics);
adminRouter.get("/analytics/monthly", authUser, adminAuth, getMonthlyRevenue);

adminRouter.get("/predictions", authUser, adminAuth, getPredictionOverview);
adminRouter.get("/predictions/sales", authUser, adminAuth, getSalesPrediction);
adminRouter.get(
  "/predictions/demand",
  authUser,
  adminAuth,
  getDemandPrediction
);
adminRouter.get(
  "/predictions/churn",
  authUser,
  adminAuth,
  getUserChurnPrediction
);

export default adminRouter;
