import { Controller } from "../types/handlers";
import * as notificationService from "../services/notification.service";
import { NotificationQuerySchema } from "../schemas/notifications";

export const getNotifications: Controller = async (req, res, next) => {
  try {
    const data = await notificationService.getNotifications(
      req.user!.id,
      NotificationQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead: Controller = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user!.id);

    res.status(200).json({
      success: true,
      message: "Marked all notifications as read",
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead: Controller = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(
      req.user!.id,
      req.params.notificationId as string,
    );

    res.status(200).json({
      success: true,
      message: "Notification set as read",
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRead: Controller = async (req, res, next) => {
  try {
    const notificationIds = await notificationService.deleteRead(req.user!.id);

    res
      .status(200)
      .json({
        success: true,
        message: "Deleted read notifications",
        data: { notificationIds },
      });
  } catch (error) {
    next(error);
  }
};
