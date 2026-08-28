import { useQuery } from "@tanstack/react-query";
import type { UserQuery } from "@relay/shared";

import * as userApi from "../api/user.api";

export const useUsers = (params: UserQuery) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.fetchUsers(params),
  });
};
