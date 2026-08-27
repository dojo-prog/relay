import { z } from "zod";
import {
  ConversationEntitySchema,
  ConversationNameSchema,
  ConversationTypeSchema,
} from "./conversation.schema";
import { UUIDSchema } from "../common";

// =======================================
// INPUTS
// =======================================

export const CreateConversationInputSchema = z.object({
  type: ConversationTypeSchema,
  name: ConversationNameSchema,
  memberIds: z.array(UUIDSchema).optional(),
});

export const UpdateConversationInputSchema = z.object({
  conversationId: UUIDSchema,
  modified: ConversationEntitySchema.partial(),
});

export const DeleteConversationInputSchema = z.object({
  conversationId: UUIDSchema,
});

export const MarkConversationAsReadInputSchema = z.object({
  conversationId: UUIDSchema,
});
