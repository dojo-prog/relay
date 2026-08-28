import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { LoginBodySchema, RegisterBodySchema } from "@relay/shared";
import { authLimiter } from "../middlewares/rate.limit.middleware";

const router = express.Router();

router.get("/me", protectRoute, getCurrentUser);

router.post(
  "/register",
  authLimiter,
  validate({ body: RegisterBodySchema }),
  register,
);
router.post("/login", authLimiter, validate({ body: LoginBodySchema }), login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);

export default router;
