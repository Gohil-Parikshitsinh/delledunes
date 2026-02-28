import express from "express";
import authUser from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

// Public — apply coupon at checkout
couponRouter.post("/apply", authUser, applyCoupon);

// Admin — CRUD
couponRouter.get("/", authUser, adminAuth, getAllCoupons);
couponRouter.post("/", authUser, adminAuth, createCoupon);
couponRouter.put("/:id", authUser, adminAuth, updateCoupon);
couponRouter.delete("/:id", authUser, adminAuth, deleteCoupon);

export default couponRouter;