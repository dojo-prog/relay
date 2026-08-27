import { UserPublic } from "../schemas/users";

declare module "socket.io" {
  interface Socket {
    user: UserPublic;
  }
}
