import { z } from "zod";
import { PaginationQuerySchema, UUIDSchema } from "../common";
import { MessageContentSchema } from "./message.schema";

// =======================================
// PARAMS
// =======================================

export const MessageIdParamsSchema = z.object({
  messageId: UUIDSchema,
});

// =======================================
// QUERY
// =======================================

export const MessageQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
});

// =======================================
// BODY
// =======================================

export const CreateMessageBodySchema = z.object({
  conversationId: UUIDSchema,
  content: MessageContentSchema,
});

export const UpdateMessageBodySchema = z.object({
  conversationId: UUIDSchema,
  content: MessageContentSchema,
});

export const DeleteMessageBodySchema = z.object({
  conversationId: UUIDSchema,
});

// =======================================
// TYPES
// =======================================

export type MessageIdParams = z.infer<typeof MessageIdParamsSchema>;

export type MessageQuery = z.infer<typeof MessageQuerySchema>;

export type CreateMessageBody = z.infer<typeof CreateMessageBodySchema>;

export type UpdateMessageBody = z.infer<typeof UpdateMessageBodySchema>;

export type DeleteMessageBody = z.infer<typeof DeleteMessageBodySchema>;
