import express from "express";
import { createCategory, deleteCategory, getAllCategories, getAllCategoriesAdmin, updateCategory } from "../controllers/categoryController.js";
import authUser from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";

const categoryRouter = express.Router();

categoryRouter.get('/',getAllCategories)
categoryRouter.get('/view', authUser, adminAuth, getAllCategoriesAdmin)
categoryRouter.post('/', authUser, adminAuth, createCategory)
categoryRouter.put('/:id', authUser, adminAuth, updateCategory)
categoryRouter.delete('/:id', authUser, adminAuth, deleteCategory)

export default categoryRouter;