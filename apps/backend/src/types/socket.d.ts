import { UserPublic } from "@relay/shared";

declare module "socket.io" {
  interface Socket {
    user: UserPublic;
  }
}
