import express from "express";
import authUser from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";
import { getDashboardStats, getInventoryStats, getReports } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/dashboard',authUser, adminAuth, getDashboardStats)
adminRouter.get('/inventory',authUser, adminAuth, getInventoryStats)
adminRouter.get('/reports',authUser, adminAuth, getReports)

export default adminRouter;