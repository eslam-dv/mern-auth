import { z } from "zod";

const emailSchema = z.email().min(1).max(255);
const passwordSchema = z.string().min(6).max(255);

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

const verificationCodeSchema = z.string().min(1).max(24);

const resetPasswordSchema = z.object({
  verificationCode: verificationCodeSchema,
  password: passwordSchema,
});

export { registerSchema, loginSchema, verificationCodeSchema, emailSchema, resetPasswordSchema };
