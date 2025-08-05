import express, { Request, Response } from "express";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import {config} from './config/env';
import { errorHandler } from "./error/error.handller";

const app = express();

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
app.use(apiLimiter);



// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


app.use('/getApp', (req:Request, res:Response)=>{
  res.send("App is running Successfully");
});



app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Server running on ${config.port}`);
});

export default app;





