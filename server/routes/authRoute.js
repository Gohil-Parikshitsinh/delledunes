import express from "express";
import { isAuth, login, logout, register } from "../controllers/userController.js";
import authUser from "../middlewares/userAuth.js";

const authRouter = express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',authUser, logout)
authRouter.get('/me',authUser, isAuth)

export default authRouter;