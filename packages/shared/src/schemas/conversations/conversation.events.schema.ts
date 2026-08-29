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

// =======================================
// TYPES
// =======================================

export type CreateConversationInput = z.input<
  typeof CreateConversationInputSchema
>;

export type UpdateConversationInput = z.input<
  typeof UpdateConversationInputSchema
>;

export type DeleteConversationInput = z.input<
  typeof DeleteConversationInputSchema
>;

export type MarkConversationAsReadInput = z.input<
  typeof MarkConversationAsReadInputSchema
>;
