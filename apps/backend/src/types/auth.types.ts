// =======================================
// AUTH TOKEN PAYLOADS
// =======================================

import { UserPublic } from "../schemas/users";

export interface AccessTokenPayload {
  id: string;
}

export interface RefreshTokenPayload {
  id: string;
}

// =======================================
// RESULT
// =======================================

export interface RegisterResult {
  user: UserPublic;
  access_token: string;
  refresh_token: string;
}

export interface LoginResult {
  user: UserPublic;
  access_token: string;
  refresh_token: string;
}
