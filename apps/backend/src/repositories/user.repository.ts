import { UserPublic, UserQuery } from "@relay/shared";
import pool from "../database/db";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import { USER_PUBLIC_PROJECTION } from "../database/queries/users";

export const find = async (
  userId: string,
  filters: UserQuery,
): Promise<{ users: UserPublic[]; total: number }> => {
  const { whereClause, limitClause, offsetClause, values } = buildFilterQueries(
    filters,
    ["id <> $1"],
    [userId],
    ["username"],
  );

  const { rows } = await pool.query(
    `
    SELECT ${USER_PUBLIC_PROJECTION},
      COUNT(*) OVER()::INT AS total
    FROM users 
    ${whereClause}
    ${limitClause}
    ${offsetClause}
    `,
    values,
  );

  const users = rows.map(({ total, ...user }) => user);

  return {
    users,
    total: rows[0]?.total ?? 0,
  };
};
