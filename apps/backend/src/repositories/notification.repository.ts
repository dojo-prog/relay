import pool from "../database/db";
import { Notification, NotificationQuery } from "@relay/shared";
import { CreateNotificationData } from "../types/notification.types";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";

export const find = async (
  userId: string,
  filters: NotificationQuery,
): Promise<{ notifications: Notification[]; total: number }> => {
  const { whereClause, limitClause, offsetClause, values } = buildFilterQueries(
    filters,
    ["user_id = $1"],
    [userId],
  );

  const { rows } = await pool.query(
    `
    SELECT *,
      COUNT(*) OVER()::INT total
    FROM notifications
    ${whereClause}
    ORDER BY created_at DESC
    ${limitClause}
    ${offsetClause}
    `,
    values,
  );

  const notifications = rows.map(({ total, ...n }) => n);

  return {
    notifications,
    total: rows[0]?.total ?? 0,
  };
};

export const findById = async (
  userId: string,
  notificationId: string,
): Promise<Notification> => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE id = $1
      AND user_id = $2
    `,
    [notificationId, userId],
  );

  return rows[0];
};

export const findUnreadIds = async (userId: string): Promise<string[]> => {
  const { rows } = await pool.query(
    `
    SELECT id
    FROM notifications
    WHERE user_id = $1
      AND read_at = null
    `,
    [userId],
  );

  return rows.map((id) => id);
};

export const add = async (
  data: CreateNotificationData,
): Promise<Notification> => {
  const { columnsStr, placeholdersStr, values } = buildInsertQueries(data);

  const { rows } = await pool.query(
    `
    INSERT INTO notifications (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING * 
    `,
    values,
  );

  return rows[0];
};

export const markAsRead = async (
  userId: string,
  ids: string[],
): Promise<Notification[]> => {
  const { rows } = await pool.query(
    `
    UPDATE notifications 
    SET read_at = now()
    WHERE user_id = $1
     AND id =  ANY($2)
    RETURNING *
    `,
    [userId, ids],
  );

  return rows;
};

export const deleteRead = async (userId: string): Promise<string[]> => {
  const { rows } = await pool.query(
    `
    DELETE FROM notifications
    WHERE user_id = $1
      AND read_at IS NOT NULL
    RETURNING id
    `,
    [userId],
  );

  return rows.map((id) => id);
};
