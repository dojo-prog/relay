import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";
import { Socket } from "socket.io";
import { AUTH_TOKENS } from "../../constants/auth";
import AppError from "../../utils/AppError";
import { AccessTokenPayload } from "../../types/auth.types";
import ENV from "../../config/env";
import { findById } from "../../repositories/auth.repository";

const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const cookies = parseCookie(socket.handshake.headers.cookie ?? "");

  const access_token = cookies[AUTH_TOKENS.ACCESS_TOKEN.name];

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

  socket.user = user;

  next();
};

export default socketAuthMiddleware;
