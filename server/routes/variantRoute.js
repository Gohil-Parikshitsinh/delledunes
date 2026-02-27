import express from "express";
import authUser from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";
import {
  createVariant,
  deleteVariant,
  getAllVariants,
  updateVariant,
} from "../controllers/variantController.js";

const variantRouter = express.Router();

variantRouter.get("/view", authUser, adminAuth, getAllVariants);
variantRouter.post("/", authUser, adminAuth, createVariant);
variantRouter.put("/:id", authUser, adminAuth, updateVariant);
variantRouter.delete("/:id", authUser, adminAuth, deleteVariant);

export default variantRouter;
