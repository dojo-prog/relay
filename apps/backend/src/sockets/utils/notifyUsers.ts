import { Server } from "socket.io";
import { NotificationType } from "../../schemas/notifications";

import * as notificationService from "../../services/notification.service";
import * as conversationMemberService from "../../services/conversation_member.service";

interface NotifyUsersParams {
  io: Server;
  userIds: string[];
  type: NotificationType;
  message: string;
  referenceId: string;
  excludeUserId?: string;
}

type NotifyConversationMembersParams = Omit<NotifyUsersParams, "userIds"> & {
  conversationId: string;
  userId: string;
};

const notifyUsers = async ({
  io,
  userIds,
  type,
  message,
  referenceId,
  excludeUserId,
}: NotifyUsersParams) => {
  const recepientIds = excludeUserId
    ? userIds.filter((id) => id !== excludeUserId)
    : userIds;

  if (recepientIds.length === 0) return;

  try {
    const notifications = await Promise.all(
      recepientIds.map((userId) =>
        notificationService.createNotification({
          userId,
          type,
          message,
          referenceId,
        }),
      ),
    );

    for (const notification of notifications) {
      io.to(`user:${notification.user_id}`).emit(
        "notification:new",
        notification,
      );
    }
  } catch (error) {
    console.error("Notification creation/emission failed:", error);
  }
};

const notifyConversationMembers = async ({
  io,
  conversationId,
  userId,
  type,
  message,
  referenceId,
  excludeUserId,
}: NotifyConversationMembersParams) => {
  let memberIds = await conversationMemberService.getAllConversationMemberIds({
    conversationId,
    userId,
  });

  if (excludeUserId) {
    memberIds = memberIds.filter((id) => id !== excludeUserId);
  }

  if (memberIds.length === 0) return;

  await notifyUsers({
    io,
    userIds: memberIds,
    type,
    message,
    referenceId,
  });
};

export { notifyUsers, notifyConversationMembers };
