import rateLimit from "express-rate-limit";
import { Request } from "express";

// TODO apply redis store for production

// =======================================
// GENERAL API LIMITER
// =======================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

// =======================================
// STRICT AUTH LIMITER
// =======================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, try again later",
  },
});

// =======================================
// MESSAGE SENDING LIMITER
// =======================================

const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  keyGenerator: (req: Request) => req.user!.id,
  message: {
    success: false,
    message: "Too many message attempts, please try again later",
  },
});

export { apiLimiter, authLimiter, messageLimiter };
