import catchErrors from "../utils/catchErrors";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from "../services/auth.service";
import {
  clearAuthCookies,
  getAccessTokenCookieOptoins,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import {
  registerSchema,
  loginSchema,
  verificationCodeSchema,
  emailSchema,
  resetPasswordSchema,
} from "./auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";

const registerHandler = catchErrors(async (req, res) => {
  // validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call service
  const { user, accessToken, refreshToken } = await createAccount(request);

  // return response
  setAuthCookies({ res, accessToken, refreshToken }).status(201).json({ user });
});

const loginHandler = catchErrors(async (req, res) => {
  // validate rquirest
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call service
  const { accessToken, refreshToken } = await loginUser(request);

  // return response
  setAuthCookies({ res, accessToken, refreshToken })
    .status(200)
    .json({ message: "Login successful" });
});

const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  clearAuthCookies(res).status(200).json({ message: "Logout successful" });
});

const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, 401, "Missing refresh token");

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  res
    .status(200)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptoins())
    .json({ message: "Access token refreshed" });
});

const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  res.status(200).json({ message: "Email was verified" });
});

const sendPasswordResetHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  await sendPasswordResetEmail(email);

  res.status(200).json({ message: "Password reset email sent" });
});

const resetPasswordHandler = catchErrors(async (req, res) => {
  const request = resetPasswordSchema.parse(req.body);

  await resetPassword(request);

  clearAuthCookies(res)
    .status(200)
    .json({ message: "Password reset successful" });
});

export {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  verifyEmailHandler,
  sendPasswordResetHandler,
  resetPasswordHandler,
};
