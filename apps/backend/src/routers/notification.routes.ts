import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import {
  NotificationIdParamsSchema,
  NotificationQuerySchema,
} from "@relay/shared";
import {
  deleteRead,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller";

const router = express.Router();

router.use(protectRoute);

router.get("/", validate({ query: NotificationQuerySchema }), getNotifications);

router.route("/read").patch(markAllAsRead).delete(deleteRead);

router.patch(
  "/:notificationId/read",
  validate({ params: NotificationIdParamsSchema }),
  markAsRead,
);

export default router;
