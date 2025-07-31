import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";
import AppError from "../utils/AppError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";

const handleZodError = (res: Response, err: z.ZodError) => {
  const errors = err.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  res.status(400).json({ message: err.message, errors });
};

const handleAppError = (res: Response, err: AppError) => {
  return res
    .status(err.statusCode)
    .json({ message: err.message, errorCode: err.errorCode });
};

const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  console.log(`PATH: ${req.path}`, err);

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (err instanceof z.ZodError) {
    return handleZodError(res, err);
  }

  if (err instanceof AppError) {
    return handleAppError(res, err);
  }

  return res.status(500).send("Internal server error");
};

export default errorHandler;
