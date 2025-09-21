import dotenv from 'dotenv';
import { send } from 'process';
dotenv.config();

export interface ConfigData {
  port: string | number;
  clientUri: string;
  env: 'development' | 'production' | 'test';
  dbUri: string;
  jwtSecret: string;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
}


export const config = {
  port: process.env.PORT || 5000,
  clientUri: process.env.CLIENT_URI!,
  env: process.env.NODE_ENV || 'development',
  dbUri: process.env.DATABASE_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  smtpUser: process.env.SMTP_USER!,
  smtpPass: process.env.SMTP_PASS!,
  smtpFrom: process.env.SMTP_FROM!,
} as ConfigData;