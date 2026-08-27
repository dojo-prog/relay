import { z } from "zod";
import { IsoDatetimeSchema, NonNegativeIntSchema, UUIDSchema } from "../common";
import { UsernameSchema } from "../users";

// =======================================
// REUSABLE FIELDS
// =======================================

export const MessageContentSchema = z
  .string()
  .trim()
  .min(1, { message: "Message content is required" })
  .max(500, { message: "Message content cannot exceed 500 characters" });

// =======================================
// ENUMS
// =======================================

export const MessageStatusSchema = z.enum(["sent", "delivered", "read"], {
  message: "Invalid message status",
});

// =======================================
// ENTITY
// =======================================

export const MessageEntitySchema = z.object({
  id: UUIDSchema,
  conversation_id: UUIDSchema,
  sender_id: UUIDSchema.nullable(),
  content: MessageContentSchema,
  status: MessageStatusSchema,
  sequence: NonNegativeIntSchema,
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema.nullable(),
  deleted_at: IsoDatetimeSchema.nullable(),
});

export const MessageWithRelationsSchema = MessageEntitySchema.omit({
  sender_id: true,
}).extend({
  sender: z.object({
    id: UUIDSchema,
    username: UsernameSchema,
  }),
});

// =======================================
// TYPES
// =======================================

export type Message = z.infer<typeof MessageEntitySchema>;

export type MessageWithRelations = z.infer<typeof MessageWithRelationsSchema>;
