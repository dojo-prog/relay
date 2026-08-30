import { z } from "zod";
import { UUIDSchema } from "../common";

// =======================================
// INPUTS
// =======================================

export const AddConversationMemberInputSchema = z.object({
  conversationId: UUIDSchema,
  memberId: UUIDSchema,
});

export const RemoveConversationMemberInputSchema = z.object({
  conversationId: UUIDSchema,
  memberId: UUIDSchema,
});

// =======================================
// TYPES
// =======================================

export type AddConversationMemberInput = z.input<
  typeof AddConversationMemberInputSchema
>;

export type RemoveConversationMemberInput = z.input<
  typeof RemoveConversationMemberInputSchema
>;
