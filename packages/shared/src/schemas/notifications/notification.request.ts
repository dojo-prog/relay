import { z } from "zod";
import { PaginationQuerySchema, UUIDSchema } from "../common";
import { NotificationTypeSchema } from "./notification.schema";

// =======================================
// PARAMS
// =======================================

export const NotificationIdParamsSchema = z.object({
  notificationId: UUIDSchema,
});

// =======================================
// QUERY
// =======================================

export const NotificationQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
});

// =======================================
// BODY
// =======================================

export const CreateNotificationBodySchema = z.object({
  userId: UUIDSchema,
  type: NotificationTypeSchema,
  referenceId: UUIDSchema,
});

// =======================================
// TYPES
// =======================================

export type NotificationIdParams = z.infer<typeof NotificationIdParamsSchema>;

export type NotificationQuery = z.infer<typeof NotificationQuerySchema>;

export type CreateNotficationBody = z.infer<
  typeof CreateNotificationBodySchema
>;
