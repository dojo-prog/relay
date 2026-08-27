import { z } from "zod";
import { IsoDatetimeSchema, UUIDSchema } from "../common";

// =======================================
// ENTITY
// =======================================

export const MessageReadEntitySchema = z.object({
  message_id: UUIDSchema,
  user_id: UUIDSchema,
  read_at: IsoDatetimeSchema,
});

// =======================================
// TYPES
// =======================================

export type MessageRead = z.infer<typeof MessageReadEntitySchema>;
