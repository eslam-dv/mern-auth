import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { Types } from "mongoose";

export type RefreshTokenPayload = {
  sessionId: Types.ObjectId;
};

export type AccessTokenPayload = {
  userId: Types.ObjectId;
  sessionId: Types.ObjectId;
};

type SignOptionsAndSecret = SignOptions & { secret: string };

const defaults: SignOptions = {
  audience: ["user"],
};

const verifyDefaults: VerifyOptions = {
  audience: ["user"],
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: RefreshTokenPayload | AccessTokenPayload,
  options?: SignOptionsAndSecret,
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string },
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...verifyDefaults,
      ...verifyOpts,
    }) as TPayload;
    return { payload };
  } catch (err: any) {
    return { error: err.message };
  }
};
