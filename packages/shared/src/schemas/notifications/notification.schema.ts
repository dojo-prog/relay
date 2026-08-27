import { z } from "zod";
import { IsoDatetimeSchema, UUIDSchema } from "../common";

// =======================================
// REUSABLE FIELDS
// =======================================

export const NotificationMessageSchema = z
  .string()
  .trim()
  .min(1, { message: "Notification message is required" })
  .max(100, { message: "Notfication message cannot exceed 100 characters" });

// =======================================
// ENUM SCHEMA
// =======================================

export const NotificationTypeSchema = z.enum(
  ["message", "conversation_invite"],
  { message: "Invalid notification type" },
);

// =======================================
// ENTITY
// =======================================

export const NotificationEntitySchema = z.object({
  id: UUIDSchema,
  user_id: UUIDSchema,
  type: NotificationTypeSchema,
  message: NotificationMessageSchema,
  reference_id: UUIDSchema,
  read_at: IsoDatetimeSchema.nullable(),
  created_at: IsoDatetimeSchema,
});

// =======================================
// TYPES
// =======================================

export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export type Notification = z.infer<typeof NotificationEntitySchema>;
