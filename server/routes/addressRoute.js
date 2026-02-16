import express from "express";  
import authUser from "../middlewares/userAuth.js";
import { createAddress, deleteAddress, getAddressesByUser, updateAddress } from "../controllers/addressContoller.js";

const addressRouter = express.Router();

addressRouter.get('/',authUser, getAddressesByUser)
addressRouter.post('/',authUser, createAddress)
addressRouter.put('/:id',authUser, updateAddress)
addressRouter.delete('/:id',authUser, deleteAddress)

export default addressRouter;