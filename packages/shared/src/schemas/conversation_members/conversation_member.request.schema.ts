import { z } from "zod";
import {
  PaginationQuerySchema,
  SearchQuerySchema,
  UUIDSchema,
} from "../common";

// =======================================
// QUERY
// =======================================

export const ConversationMemberQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  search: SearchQuerySchema,
});

// =======================================
// BODY
// =======================================

export const AddConversationMemberBodySchema = z.object({
  userId: UUIDSchema,
});

// =======================================
// TYPES
// =======================================

export type ConversationMemberQuery = z.infer<
  typeof ConversationMemberQuerySchema
>;

export type AddConversationMemberBody = z.infer<
  typeof AddConversationMemberBodySchema
>;
