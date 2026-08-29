import { useInfiniteQuery } from "@tanstack/react-query";

import type { UserQuery } from "@relay/shared";

import * as userApi from "../api/user.api";

export const useUsers = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["users", search],

    queryFn: ({ pageParam }) => {
      const params: UserQuery = {
        page: pageParam,
        limit: 10,
        search,
      };

      return userApi.fetchUsers(params);
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.data.pagination;

      if (page >= total_pages) {
        return undefined;
      }

      return page + 1;
    },

    enabled: search.trim().length >= 2,
  });
};
