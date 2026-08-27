import * as notificationRepository from "../repositories/notification.repository";
import { Notification, NotificationQuery } from "@relay/shared";
import {
  CreateNotificationParams,
  GetNotificationsResult,
} from "../types/notification.types";
import AppError from "../utils/AppError";
import calculateTotalPages from "../utils/calculateTotalPages";

export const getNotifications = async (
  userId: string,
  filters: NotificationQuery,
): Promise<GetNotificationsResult> => {
  const { notifications, total } = await notificationRepository.find(
    userId,
    filters,
  );

  const { page, limit } = filters;

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      total_pages: calculateTotalPages(total, limit),
    },
  };
};

export const createNotification = async (
  params: CreateNotificationParams,
): Promise<Notification> => {
  const { userId, type, message, referenceId } = params;

  const data = {
    user_id: userId,
    type,
    message,
    reference_id: referenceId,
  };

  return await notificationRepository.add(data);
};

export const markAllAsRead = async (
  userId: string,
): Promise<Notification[]> => {
  const unreadIds = await notificationRepository.findUnreadIds(userId);

  return await notificationRepository.markAsRead(userId, unreadIds);
};

export const markAsRead = async (
  userId: string,
  notificationId: string,
): Promise<Notification> => {
  const notification = await notificationRepository.findById(
    userId,
    notificationId,
  );

  if (!notification) {
    throw new AppError(404, "Notification not found");
  }

  const read = await notificationRepository.markAsRead(userId, [
    notification.id,
  ]);

  return read[0];
};

export const deleteRead = async (userId: string): Promise<string[]> => {
  return await notificationRepository.deleteRead(userId);
};
