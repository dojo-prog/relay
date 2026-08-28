import { z } from "zod";
import {
  PaginationQuerySchema,
  SearchQuerySchema,
  UUIDSchema,
} from "../common";

// =======================================
// PARAMS
// =======================================

export const UserIdParamsSchema = z.object({
  userId: UUIDSchema,
});

// =======================================
// QUERY
// =======================================

export const UserQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  search: SearchQuerySchema,
});

// =======================================
// TYPES
// =======================================

export type UserIdParams = z.infer<typeof UserIdParamsSchema>;

export type UserQuery = z.infer<typeof UserQuerySchema>;
