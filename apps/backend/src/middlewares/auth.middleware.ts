import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import ENV from "../config/env";
import { Middleware } from "../types/handlers";
import { AUTH_TOKENS } from "../constants/auth";
import { AccessTokenPayload } from "../types/auth.types";
import { findById } from "../repositories/auth.repository";

const protectRoute: Middleware = async (req, res, next) => {
  const access_token = req.cookies[AUTH_TOKENS.ACCESS_TOKEN.name];

  if (!access_token) {
    return next(new AppError(401, "Unauthorized"));
  }

  let decoded: AccessTokenPayload;

  try {
    decoded = jwt.verify(
      access_token,
      ENV.ACCESS_TOKEN_SECRET,
    ) as AccessTokenPayload;
  } catch (error) {
    return next(new AppError(401, "Unauthorized"));
  }

  const user = await findById(decoded.id);

  if (!user) {
    return next(new AppError(401, "Unauthorized"));
  }

  req.user = user;

  next();
};

export { protectRoute };
