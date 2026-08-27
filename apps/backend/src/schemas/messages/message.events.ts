import { z } from "zod";
import { UUIDSchema } from "../common";
import { MessageContentSchema } from "./message.schema";

// =======================================
// INPUT
// =======================================

export const CreateMessageInputSchema = z.object({
  conversationId: UUIDSchema,
  content: MessageContentSchema,
});

export const UpdateMessageInputSchema = z.object({
  conversationId: UUIDSchema,
  messageId: UUIDSchema,
  content: MessageContentSchema,
});

export const DeleteMessageInputSchema = z.object({
  conversationId: UUIDSchema,
  messageId: UUIDSchema,
});
