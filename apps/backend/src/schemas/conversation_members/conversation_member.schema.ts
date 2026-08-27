import { z } from "zod";
import { IsoDatetimeSchema, NonNegativeIntSchema, UUIDSchema } from "../common";
import { UsernameSchema } from "../users";

// =======================================
// ENTITY
// =======================================

export const ConversationMemberEntitySchema = z.object({
  conversation_id: UUIDSchema,
  user_id: UUIDSchema,
  last_read_sequence: NonNegativeIntSchema,
  joined_at: IsoDatetimeSchema,
});

export const ConversationMemberWithRelationsSchema =
  ConversationMemberEntitySchema.omit({
    user_id: true,
  }).extend({
    user: z.object({
      id: UUIDSchema,
      username: UsernameSchema,
    }),
  });

// =======================================
// TYPES
// =======================================

export type ConversationMember = z.infer<typeof ConversationMemberEntitySchema>;

export type ConversationMemberWithRelations = z.infer<
  typeof ConversationMemberWithRelationsSchema
>;
