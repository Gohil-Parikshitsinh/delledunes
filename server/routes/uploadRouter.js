import express from "express";
import multer from "multer";
import authUser from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG and WebP allowed"));
  },
});

uploadRouter.post("/", authUser, adminAuth, upload.single("image"), uploadImage);
uploadRouter.delete("/", authUser, adminAuth, deleteImage);

export default uploadRouter;