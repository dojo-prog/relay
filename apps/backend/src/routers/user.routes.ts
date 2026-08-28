import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { apiLimiter } from "../middlewares/rate.limit.middleware";
import validate from "../middlewares/validation.middleware";
import { UserQuerySchema } from "@relay/shared";
import { getUsers } from "../controllers/user.controller";

const router = express.Router();

router.use(protectRoute);

router.use(apiLimiter);

router.get("/", validate({ query: UserQuerySchema }), getUsers);

export default router;
