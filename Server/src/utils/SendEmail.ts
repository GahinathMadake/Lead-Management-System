import nodemailer from "nodemailer";
import { config } from "../config/env";

export interface EmailResponse {
  success: boolean;
  message: string;
}

// Static configuration
const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 587;
const SMTP_SECURE = false;


// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

export const sendMail = async (
  to: string,
  subject: string,
  html: string
): Promise<EmailResponse> => {
  try {
    const info = await transporter.sendMail({
      from: config.smtpFrom,
      to,
      subject,
      html,
    });

    return {
      success: true,
      message: `Email queued (id: ${info.messageId})`,
    };
  } catch (err: any) {
    console.error("SMTP Error:", err);
    return {
      success: false,
      message: err?.message || "Failed to send email",
    };
  }
};
