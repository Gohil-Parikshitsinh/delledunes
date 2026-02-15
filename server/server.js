import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 4000;

dotenv.config()

await connectDB()
await connectCloudinary()

const allowedOrigins = ['http://localhost:5173']

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

app.use('/api/auth',userRouter)

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);  
})