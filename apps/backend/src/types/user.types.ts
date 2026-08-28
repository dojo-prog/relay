import { UserPublic } from "@relay/shared";
import { PaginationResult } from "./common";

// =======================================
// RESULT
// =======================================

export interface GetUsersResult extends PaginationResult {
  users: UserPublic[];
}
