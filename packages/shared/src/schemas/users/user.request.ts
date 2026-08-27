import { z } from "zod";
import { UUIDSchema } from "../common";

// =======================================
// PARAMS
// =======================================

export const UserIdParamsSchema = z.object({
  userId: UUIDSchema,
});

// =======================================
// TYPES
// =======================================

export type UserIdParams = z.infer<typeof UserIdParamsSchema>;
