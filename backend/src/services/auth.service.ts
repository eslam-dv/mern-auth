import VerificationCodeType from "../constants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../utils/date";
import appAssert from "../utils/appAssert";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates";
import { APP_ORIGIN } from "../constants/env";
import { hashValue } from "../utils/bcrypt";

type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

const createAccount = async (data: CreateAccountParams) => {
  const { email, password, userAgent } = data;

  // verify user does not exist
  const existingUser = await UserModel.exists({ email });
  appAssert(!existingUser, 409, "Email already in use");

  // register user
  const user = await UserModel.create({ email, password });
  const userId = user._id;

  // create verification code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
  // send verification email
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });
  if (error) {
    console.log(error);
  }

  // create session
  const session = await SessionModel.create({ userId, userAgent });
  const sessionId = session._id;

  // sign access token & refresh token

  const refreshToken = signToken({ sessionId }, refreshTokenSignOptions);
  const accessToken = signToken({ userId, sessionId });

  // return user & tokens
  return { user: user.omitPassword(), accessToken, refreshToken };
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

const loginUser = async ({ email, password, userAgent }: LoginParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, 401, "Invalid email or password");

  // validate password from request
  const isValid = await user.comparePassword(password);
  appAssert(isValid, 401, "Invalid email or password");

  const userId = user._id;

  // create a session
  const session = await SessionModel.create({ userId, userAgent });

  const sessionInfo = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({ ...sessionInfo, userId });

  // return user & token
  return { user: user.omitPassword(), accessToken, refreshToken };
};

const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, 401, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    401,
    "Session expired",
  );
  const sessionId = session._id;

  // refresh the session if it expires in the next 24 hours
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId,
  });

  return { accessToken, newRefreshToken };
};

const verifyEmail = async (code: string) => {
  // get the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, 404, "Invalid or expired verification code");

  // update user to verified = true
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true },
  );
  appAssert(updatedUser, 400, "Failed to verify email");

  // delete verification code
  await validCode.deleteOne();

  // return user
  return { user: updatedUser.omitPassword() };
};

const sendPasswordResetEmail = async (email: string) => {
  try {
    // get the user by email
    const user = await UserModel.findOne({ email });
    appAssert(user, 404, "User not found");

    // check email rate limit
    const fiveMinsAgo = fiveMinutesAgo();
    const count = await VerificationCodeModel.countDocuments({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      createdAt: { $gt: fiveMinsAgo },
    });
    appAssert(count <= 1, 429, "Too many requests, please try again later");

    // create a verification code
    const expiresAt = oneHourFromNow();
    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      expiresAt,
    });

    // send verificatin email
    const url = `${APP_ORIGIN}/password/reset/?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;

    const { info, error } = await sendMail({
      to: user.email,
      ...getPasswordResetTemplate(url),
    });
    appAssert(info.messageId, 400, `${error?.name} - ${error?.message}`);

    // return response
    return { url, messageId: info.messageId };
  } catch (err: any) {
    console.log("sendPasswordResetEmail", err.message);
    return {};
  }
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

const resetPassword = async ({
  password,
  verificationCode,
}: ResetPasswordParams) => {
  // get the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, 404, "Invalid or expired verification code");

  // update user's password
  const hashedPassword = await hashValue(password);
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: hashedPassword,
  });
  appAssert(updatedUser, 400, "Failed to reset password");
  // delete verification code
  await validCode.deleteOne();
  // delete all sessions
  await SessionModel.deleteMany({ _id: updatedUser._id });

  return { user: updatedUser.omitPassword() };
};

export {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  verifyEmail,
  sendPasswordResetEmail,
  resetPassword,
};
