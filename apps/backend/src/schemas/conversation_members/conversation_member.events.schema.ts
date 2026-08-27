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
