import express from "express";  
import authUser from "../middlewares/userAuth.js";
import { createOrder, getAllOrders, getOrderById, getOrdersByUser, updateOrderStatus } from "../controllers/orderController.js";
import adminAuth from "../middlewares/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post('/',authUser, createOrder)
orderRouter.get('/my-orders', authUser, getOrdersByUser)
orderRouter.get('/:id', authUser, getOrderById)
orderRouter.get('/', authUser, adminAuth, getAllOrders)
orderRouter.put('/:id/status', authUser, adminAuth, updateOrderStatus)

export default orderRouter;