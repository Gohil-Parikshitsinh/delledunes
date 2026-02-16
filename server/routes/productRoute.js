import express from "express";
import { createProduct, deleteProduct, getAllProduct, getAllProductAdmin, getProductById, getProductBySlug, updateProduct } from "../controllers/productController.js";
import authUser from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";

const productRouter = express.Router();

productRouter.get('/',getAllProduct)
productRouter.get('/:slug',getProductBySlug)
productRouter.get('/view',authUser, adminAuth, getAllProductAdmin)
productRouter.get('/view/:slug',authUser, adminAuth, getProductById)
productRouter.post('/',authUser, adminAuth, createProduct)
productRouter.put('/:id',authUser, adminAuth, updateProduct)
productRouter.delete('/:id',authUser, adminAuth, deleteProduct)

export default productRouter;