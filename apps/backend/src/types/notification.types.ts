import { Notification, NotificationType } from "@relay/shared";
import { PaginationResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  message: string;
  referenceId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateNotificationData {
  user_id: string;
  type: NotificationType;
  message: string;
  reference_id: string;
}

// =======================================
// RESULT
// =======================================

export interface GetNotificationsResult extends PaginationResult {
  notifications: Notification[];
}
