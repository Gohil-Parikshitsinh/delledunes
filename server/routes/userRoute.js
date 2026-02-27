import express from "express";
import authUser from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";
import { getAllUser, getUserById, deleteUser, updateProfile, updatePassword} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.put("/profile", authUser, updateProfile);
userRouter.put("/password", authUser, updatePassword);

userRouter.get('/',authUser, adminAuth, getAllUser)
userRouter.get('/:id',authUser, adminAuth, getUserById)
userRouter.delete('/:id',authUser, adminAuth, deleteUser)

export default userRouter;