import { UserQuery } from "@relay/shared";
import { GetUsersResult } from "../types/user.types";

import * as userRepository from "../repositories/user.repository";
import calculateTotalPages from "../utils/calculateTotalPages";

export const getUsers = async (
  userId: string,
  filters: UserQuery,
): Promise<GetUsersResult> => {
  const { users, total } = await userRepository.find(userId, filters);

  const { page, limit } = filters;

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      total_pages: calculateTotalPages(total, limit),
    },
  };
};
