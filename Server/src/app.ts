import express, { Request, Response } from "express";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import {config} from './config/env';
import { errorHandler } from "./error/error.handller";
import testDbConnection from "./config/db";

// Importing the Routes here
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.routes';
import leadRoutes from './routes/lead.routes';

import cookieParser from "cookie-parser";

const app = express();
testDbConnection();


// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());


// App Security
app.use(helmet());
app.use(
  cors({
    origin: config.clientUri,
    credentials: true,
  })
);


// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: '⚠️ Too many requests from this IP, please try again later.',
  },
  legacyHeaders: false,
});
// app.use(apiLimiter);



// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


app.use('/api/getApp', (req:Request, res:Response)=>{
  res.send("App is running Successfully");
});



// App Routes will be used here
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/leads', leadRoutes);



// Error Handling Middleware
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Server running on ${config.port}`);
});

export default app;





