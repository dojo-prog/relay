import { z } from "zod";
import { IsoDatetimeSchema, NonNegativeIntSchema, UUIDSchema } from "../common";
import { UsernameSchema } from "../users";

// =======================================
// REUSABLE FIELDS
// =======================================

export const ConversationNameSchema = z
  .string()
  .trim()
  .max(100, { message: "Conversation name cannot exceed 100 characters" })
  .optional()
  .nullable();

// =======================================
// REUSABLE FIELDS
// =======================================

export const ConversationTypeSchema = z.enum(["direct", "group"], {
  message: "Invalid conversation type",
});

// =======================================
// ENTITY
// =======================================

export const ConversationEntitySchema = z.object({
  id: UUIDSchema,
  type: ConversationTypeSchema,
  name: ConversationNameSchema,
  message_sequence: NonNegativeIntSchema,
  created_by: UUIDSchema.nullable(),
  created_at: IsoDatetimeSchema,
  updated_at: IsoDatetimeSchema,
});

export const ConversationWithRelationsSchema = ConversationEntitySchema.omit({
  created_by: true,
}).extend({
  created_by: z.object({
    id: UUIDSchema,
    username: UsernameSchema,
  }),
});

// =======================================
// TYPES
// =======================================

export type ConversationType = z.infer<typeof ConversationTypeSchema>;

export type Conversation = z.infer<typeof ConversationEntitySchema>;

export type ConversationWithRelations = z.infer<
  typeof ConversationWithRelationsSchema
>;
