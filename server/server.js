import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';

import authRouter from "./routes/authRoute.js";
import userRouter from './routes/userRoute.js';
import categoryRouter from "./routes/categoryRoute.js";
import productRouter from "./routes/productRoute.js";
import variantRouter from "./routes/variantRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import adminRouter from "./routes/adminRoute.js";
import cartRouter from "./routes/cartRoute.js";
import uploadRouter from "./routes/uploadRouter.js";
import couponRouter from "./routes/couponRoute.js";

const app = express();
const port = process.env.PORT || 4000;

dotenv.config()

await connectDB()
await connectCloudinary()

const allowedOrigins = ['http://localhost:5173','https://delledunes.vercel.app']

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));
  

app.get('/',(req, res)=>res.send("API is working"))

app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/categories',categoryRouter)
app.use('/api/products',productRouter)
app.use('/api/variants',variantRouter)
app.use('/api/address',addressRouter)
app.use('/api/cart',cartRouter)
app.use('/api/orders',orderRouter)
app.use('/api/coupons', couponRouter);
app.use('/api/payment', paymentRouter)
app.use('/api/admin', adminRouter)
app.use('/api/upload', uploadRouter)

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);  
})