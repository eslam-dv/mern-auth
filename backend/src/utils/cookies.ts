import { CookieOptions, Response } from "express";

import { NODE_ENV } from "../constants/env";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

export const REFRESH_PATH = "/api/auth/refresh";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: NODE_ENV !== "development",
};

export const getAccessTokenCookieOptoins = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH,
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptoins())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

const clearAuthCookies = (res: Response) =>
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { path: REFRESH_PATH });

export { setAuthCookies, clearAuthCookies };
