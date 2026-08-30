import { useInfiniteQuery } from "@tanstack/react-query";

import * as notificationApi from "../api/notification.api";

export const useNotifications = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => {
      return notificationApi.getAllNotifications({ page: pageParam, limit });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.data?.pagination;

      if (page >= total_pages) return undefined;

      return page + 1;
    },
  });
};
