import express from "express";
import authUser from "../middlewares/userAuth.js";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post('/create-order', authUser, createPaymentOrder)
paymentRouter.post('/verify', authUser, verifyPayment)

export default paymentRouter;