import { SentMessageInfo } from "nodemailer";

import { SMTP_USER } from "../constants/env";
import { transporter } from "../config/mailer";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendMail = async ({
  to,
  subject,
  text,
  html,
}: Params): Promise<SentMessageInfo> => {
  const mailOptoins = {
    from: `"MERN Auth" <${SMTP_USER}>`,
    to,
    text,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptoins);
    return { info };
  } catch (err: any) {
    return { error: err.message || "Failed to send email" };
  }
};
