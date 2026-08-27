import { Server, Socket } from "socket.io";
import validate from "../utils/validate";
import {
  CreateMessageInputSchema,
  DeleteMessageInputSchema,
  UpdateMessageInputSchema,
} from "@relay/shared";
import handleError from "../utils/handleError";
import { notifyConversationMembers } from "../utils/notifyUsers";

import * as messageService from "../../services/message.service";
import * as conversationService from "../../services/conversation.service";
import checkRateLimit from "../middlewares/socket.rate.limit.middleware";
import rateLimitAck from "../utils/rateLimitAck";

const registerMessageHandlers = (io: Server, socket: Socket) => {
  const { user } = socket;

  // =======================================
  // CREATE MESSAGE
  // =======================================

  socket.on("message:send", async (input, ack) => {
    rateLimitAck(socket, "message:send", ack);

    try {
      const validated = validate(CreateMessageInputSchema, input);

      const { conversationId, content } = validated;

      const conversationRoom = `conversation:${conversationId}`;

      const newMessage = await messageService.sendMessage({
        userId: user.id,
        conversationId,
        content,
      });

      await notifyConversationMembers({
        io,
        conversationId,
        userId: user.id,
        type: "message",
        message: `${user.username} sent a message`,
        referenceId: newMessage.id,
        excludeUserId: user.id,
      });

      const unreadMessageCount = await conversationService.getUnreadCount({
        userId: user.id,
        conversationId,
      });

      ack({
        success: true,
        message: "Message created",
        data: { message: newMessage },
      });

      socket.to(conversationRoom).emit("message:new", {
        message: newMessage,
        unread_count: unreadMessageCount,
      });
    } catch (error) {
      handleError(error, ack);
    }
  });

  // =======================================
  // UPDATE MESSAGE
  // =======================================

  socket.on("message:update", async (input, ack) => {
    rateLimitAck(socket, "message:update", ack);

    try {
      const validated = validate(UpdateMessageInputSchema, input);

      const { conversationId, messageId, content } = validated;

      const conversationRoom = `conversation:${conversationId}`;

      const data = await messageService.updateMessage({
        userId: user.id,
        conversationId,
        messageId,
        modified: { content },
      });

      ack({
        success: true,
        message: "Message updated",
        data,
      });

      io.to(conversationRoom).emit("message:updated", data);
    } catch (error) {
      handleError(error, ack);
    }
  });

  // =======================================
  // DELETE MESSAGE
  // =======================================

  socket.on("message:delete", async (input, ack) => {
    rateLimitAck(socket, "message:delete", ack);

    try {
      const validated = validate(DeleteMessageInputSchema, input);

      const { conversationId, messageId } = validated;

      const conversationRoom = `conversation:${conversationId}`;

      const deleted = await messageService.deleteMessage({
        userId: user.id,
        conversationId,
        messageId,
      });

      ack({
        success: true,
        message: "Message deleted",
        data: { message: deleted },
      });

      const { id, conversation_id } = deleted;

      io.to(conversationRoom).emit("message:deleted", { id, conversation_id });
    } catch (error) {
      handleError(error, ack);
    }
  });
};

export default registerMessageHandlers;
