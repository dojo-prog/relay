import type { Notification } from "@relay/shared";
import { socket } from "../socket";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

interface NotificationPage {
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      total_pages: number;
    };
  };
}

export const registerNotificationListener = (
  queryClient: QueryClient,
  navigate: NavigateFunction,
) => {
  const handleNew = (notification: Notification) => {
    queryClient.setQueriesData<InfiniteData<NotificationPage>>(
      {
        queryKey: ["notifications"],
      },
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page, index) => {
            if (index !== 0) return page;

            return {
              ...page,
              data: {
                ...page.data,
                notifications: [notification, ...page.data.notifications],
              },
            };
          }),
        };
      },
    );

    console.log(notification.reference_id);

    toast.info(notification.message, {
      position: "top-center",
      action: {
        label: "View",
        onClick: () => navigate(`/conversations/${notification.reference_id}`),
      },
    });
  };

  socket.on("notification:new", handleNew);

  return () => {
    socket.off("notification:new", handleNew);
  };
};
