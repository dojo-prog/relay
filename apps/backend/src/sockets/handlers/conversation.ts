import { Server, Socket } from "socket.io";
import {
  CreateConversationInputSchema,
  DeleteConversationInputSchema,
  MarkConversationAsReadInputSchema,
  UpdateConversationInputSchema,
} from "@relay/shared";
import validate from "../utils/validate";
import handleError from "../utils/handleError";

import * as conversationService from "../../services/conversation.service";
import * as conversationMemberService from "../../services/conversation_member.service";
import {
  AddConversationMemberInputSchema,
  RemoveConversationMemberInputSchema,
} from "@relay/shared";
import { notifyUsers } from "../utils/notifyUsers";
import rateLimitAck from "../utils/rateLimitAck";

const registerConversationHandlers = (io: Server, socket: Socket) => {
  const { user } = socket;

  // =======================================
  // CREATE CONVERSATION
  // =======================================

  socket.on("conversation:create", async (input, ack) => {
    if (!rateLimitAck(socket, "conversation:create", ack)) return;

    try {
      const validated = validate(CreateConversationInputSchema, input);

      const { memberIds } = validated;

      const conversation = await conversationService.createConversation({
        userId: user.id,
        ...validated,
      });

      const conversationRoom = `conversation:${conversation.id}`;

      // Creator Joins
      socket.join(conversationRoom);

      // Initial Members Join
      if (memberIds?.length && memberIds !== undefined) {
        for (const memberId of memberIds) {
          const sockets = await io.in(`user:${memberId}`).fetchSockets();

          for (const socket of sockets) {
            socket.join(conversationRoom);
          }
        }

        await notifyUsers({
          io,
          userIds: memberIds,
          type: "conversation_invite",
          message: `${user.username} added you to a new group`,
          referenceId: conversation.id,
          excludeUserId: user.id,
        });
      }

      ack({
        success: true,
        message: "Conversation created",
        data: { conversation },
      });

      io.to(conversationRoom).emit("conversation:created", conversation);
    } catch (error) {
      handleError(error, ack);
    }
  });

  // =======================================
  // UPDATE CONVERSATION
  // =======================================

  socket.on("conversation:update", async (input, ack) => {
    if (!rateLimitAck(socket, "conversation:update", ack)) return;

    try {
      const validated = validate(UpdateConversationInputSchema, input);

      const { conversationId, modified } = validated;

      const params = {
        userId: user.id,
        conversationId,
        modified,
      };

      const updated = await conversationService.updateConversation(params);

      ack({
        success: true,
        message: "Conversation details updated",
        data: { conversation: updated },
      });

      io.to(`conversation:${conversationId}`).emit(
        "conversation:updated",
        updated,
      );
    } catch (error) {
      handleError(error, ack);
    }
  });

  // =======================================
  // DELETE CONVERSATION
  // =======================================

  socket.on("conversation:delete", async (input, ack) => {
    if (!rateLimitAck(socket, "conversation:delete", ack)) return;

    try {
      const validated = validate(DeleteConversationInputSchema, input);

      const { conversationId } = validated;

      const deleted = await conversationService.deleteConversation({
        userId: user.id,
        conversationId,
      });

      ack({
        success: true,
        message: "Conversation deleted",
        data: { conversation: deleted },
      });

      io.to(`conversation:${conversationId}`).emit(
        "conversation:deleted",
        deleted,
      );
    } catch (error) {
      handleError(error, ack);
    }
  });

  // =======================================
  // ADD MEMBER
  // =======================================

  socket.on("conversation:add_member", async (input, ack) => {
    if (!rateLimitAck(socket, "conversation:add_member", ack)) return;

    try {
      const validated = validate(AddConversationMemberInputSchema, input);

      const { conversationId, memberId } = validated;

      const conversationRoom = `conversation:${conversationId}`;

      const newMember = await conversationMemberService.addMember({
        userId: user.id,
        conversationId,
        memberId,
      });

      const sockets = await io.in(`user:${newMember.user.id}`).fetchSockets();

      for (const socket of sockets) {
        socket.join(conversationRoom);
      }

      await notifyUsers({
        io,
        userIds: [newMember.user.id],
        type: "conversation_invite",
        message: `${user.username} added you to a group`,
        referenceId: conversationId,
      });

      ack({
        success: true,
        message: "New member added",
        data: { conversation_member: newMember },
      });

      io.to(conversationRoom).emit("conversation:member_added", newMember);
    } catch (error) {
      handleError(error, ack);
    }
  });

  // =======================================
  // REMOVE MEMBER
  // =======================================

  socket.on("conversation:remove_member", async (input, ack) => {
    if (!rateLimitAck(socket, "conversation:remove_member", ack)) return;

    try {
      const validated = validate(RemoveConversationMemberInputSchema, input);

      const { conversationId, memberId } = validated;

      const conversationRoom = `conversation:${conversationId}`;

      const removedMember = await conversationMemberService.removeMember({
        userId: user.id,
        conversationId,
        memberId,
      });

      const sockets = await io
        .in(`user:${removedMember.user.id}`)
        .fetchSockets();

      for (const socket of sockets) {
        socket.leave(conversationRoom);
      }

      ack({
        success: true,
        message: "Member removed from conversation",
        data: { conversation_member: removedMember },
      });

      io.to(`user:${removedMember.user.id}`).emit(
        "conversation:member_removed",
        removedMember,
      );

      io.to(conversationRoom).emit(
        "conversation:member_removed",
        removedMember,
      );
    } catch (error) {
      handleError(error, ack);
    }
  });

  // =======================================
  // READ CONVERSATION
  // =======================================

  socket.on("conversation:read", async (input, ack) => {
    try {
      const validated = validate(MarkConversationAsReadInputSchema, input);

      const { conversationId } = validated;

      const conversationRoom = `conversation:${conversationId}`;

      const updated = await conversationService.markAsRead({
        userId: user.id,
        conversationId,
      });

      ack({
        success: true,
        message: "Marked latest message as read",
      });

      if (updated !== undefined) {
        io.to(conversationRoom).emit("conversation:has_read", updated);
      }
    } catch (error) {
      handleError(error, ack);
    }
  });
};

export default registerConversationHandlers;
