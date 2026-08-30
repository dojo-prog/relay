import { z } from "zod";
import {
  PaginationQuerySchema,
  SearchQuerySchema,
  UUIDSchema,
} from "../common";
import {
  ConversationNameSchema,
  ConversationTypeSchema,
} from "./conversation.schema";

// =======================================
// PARAMS
// =======================================

export const ConversationParamsSchema = z.object({
  conversationId: UUIDSchema,
});

// =======================================
// QUERY
// =======================================

export const ConversationSpecificQuerySchema = z.object({
  type: ConversationTypeSchema.optional(),
  search: SearchQuerySchema,
  unread: z.coerce.boolean().optional(),
});

export const ConversationQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  ...ConversationSpecificQuerySchema.shape,
});

// =======================================
// BODY
// =======================================

export const CreateConversationBodySchema = z.object({
  type: ConversationTypeSchema,
  name: ConversationNameSchema,
  memberIds: z.array(UUIDSchema).optional(),
});

export const UpdateConversationBodySchema = z.object({
  name: ConversationNameSchema,
});

// =======================================
// TYPES
// =======================================

export type ConversationParams = z.infer<typeof ConversationParamsSchema>;

export type ConversationSpecificQuery = z.infer<
  typeof ConversationSpecificQuerySchema
>;

export type ConversationQuery = z.infer<typeof ConversationQuerySchema>;

export type CreateConversationBody = z.infer<
  typeof CreateConversationBodySchema
>;

export type UpdateConversationBody = z.infer<
  typeof UpdateConversationBodySchema
>;
