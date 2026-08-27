import { UserPublic } from "@relay/shared";

declare global {
  namespace Express {
    interface Request {
      user?: UserPublic;
    }
  }
}
