import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { verifyToken } from "../utils/jwt";

const protect: RequestHandler = (req, _, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    401,
    "Not Auhtorized",
    AppErrorCode.InvalidAccessToken,
  );

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    401,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken,
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;

  next();
};

export default protect;
