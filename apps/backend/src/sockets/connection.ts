import { Server, Socket } from "socket.io";
import * as conversationRepository from "../repositories/conversation.repository";
import { handleUserOffline, handleUserOnline } from "./handlers/presence";
import registerConversationHandlers from "./handlers/conversation";
import registerMessageHandlers from "./handlers/message";
import registerTypingHandlers from "./handlers/typing";

const handleConnection = async (io: Server, socket: Socket) => {
  const { user } = socket;

  console.log("User connected:", user.id);

  // Personal Room
  socket.join(`user:${user.id}`);

  // Join Conversations
  const conversations = await conversationRepository.findAll(user.id);

  if (conversations.length > 0) {
    for (const c of conversations) {
      socket.join(`conversation:${c.id}`);
    }
  }

  // Feature handlers
  registerConversationHandlers(io, socket);
  registerMessageHandlers(io, socket);
  registerTypingHandlers(io, socket);

  // Global Presence
  handleUserOnline(io, socket);

  socket.on("disconnect", async (reason) => {
    console.log(`User disconnected:${user.id}`, reason);

    await handleUserOffline(io, socket);
  });
};

export default handleConnection;
