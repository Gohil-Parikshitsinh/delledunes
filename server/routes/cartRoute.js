import express from "express";
import authUser from "../middlewares/userAuth.js";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.get('/', authUser, getCart);
cartRouter.post('/', authUser, addToCart);
cartRouter.delete('/clear', authUser, clearCart);
cartRouter.put('/:variantId', authUser, updateCartItem);
cartRouter.delete('/:variantId', authUser, removeCartItem);

export default cartRouter;