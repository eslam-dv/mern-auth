import { createTransport } from "nodemailer";
import { SMTP_HOST, SMTP_PASS, SMTP_USER } from "../constants/env";

export const transporter = createTransport({
  host: SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});
