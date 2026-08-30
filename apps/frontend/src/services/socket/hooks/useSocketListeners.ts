import useAuthStore from "@/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { registerConversationListeners } from "../listeners/conversation.listeners";
import { registerMessageListener } from "../listeners/message.listener";
import { registerNotificationListener } from "../listeners/notification.listener";
import { registerPresenceListener } from "../listeners/presence.listener";

export const useSocketListeners = () => {
  const { user } = useAuthStore();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    socket.connect();

    const cleanupConversationListeners = registerConversationListeners(
      queryClient,
      user.id,
    );

    const cleanupMessageListeners = registerMessageListener(queryClient);

    const cleanupNotificationListeners = registerNotificationListener(
      queryClient,
      navigate,
    );

    const cleanupPresenceListener = registerPresenceListener(queryClient);

    return () => {
      cleanupConversationListeners();
      cleanupMessageListeners();
      cleanupNotificationListeners();
      cleanupPresenceListener();

      socket.disconnect();
    };
  }, [user, queryClient]);
};
