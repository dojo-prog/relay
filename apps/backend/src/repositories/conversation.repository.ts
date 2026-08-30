import { PoolClient } from "pg";
import pool from "../database/db";
import {
  CONVERSATION_JOINS,
  CONVERSATION_RELATIONS_PROJECTION,
} from "../database/queries/conversations";
import {
  Conversation,
  ConversationQuery,
  ConversationWithRelations,
} from "@relay/shared";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import buildConversationSpecificFilters from "../utils/specific-filter-builder/buildConversationSpecificFilters";
import { CreateConversationData } from "../types/conversation.types";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";
import { ConversationMember } from "@relay/shared";
import { Message } from "@relay/shared";

export const find = async (
  userId: string,
  filters: ConversationQuery,
): Promise<{
  conversations: ConversationWithRelations[];
  total: number;
}> => {
  const { type, search, unread, ...rest } = filters;

  const { conditions: baseConditions, values: baseValues } =
    buildConversationSpecificFilters({ type, search, unread }, [], [userId]);

  const { whereClause, limitClause, offsetClause, values } = buildFilterQueries(
    rest,
    [...baseConditions, `cm.user_id = $${baseValues.length + 1}`],
    [...baseValues, userId],
  );

  const { rows } = await pool.query(
    `
      SELECT
        ${CONVERSATION_RELATIONS_PROJECTION},
        COUNT(*) OVER()::INT AS total
      FROM conversations c
      ${CONVERSATION_JOINS}
      ${whereClause}
      ORDER BY updated_at DESC, created_at DESC
      ${limitClause}
      ${offsetClause}
    `,
    values,
  );

  const conversations = rows.map(({ total, ...conversation }) => conversation);

  return {
    conversations,
    total: rows[0]?.total ?? 0,
  };
};

export const findAll = async (userId: string): Promise<{ id: string }[]> => {
  const { rows } = await pool.query(
    ` 
    SELECT id 
    FROM conversations c 
    JOIN conversation_members cm
      ON cm.conversation_id = c.id
    WHERE cm.user_id = $1
    `,
    [userId],
  );

  return rows;
};

export const findById = async (
  conversationId: string,
): Promise<Conversation> => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM conversations
    WHERE id = $1
    `,
    [conversationId],
  );

  return rows[0];
};

export const findWithRelationsById = async (
  userId: string,
  conversationId: string,
): Promise<ConversationWithRelations> => {
  const { rows } = await pool.query(
    `
    SELECT ${CONVERSATION_RELATIONS_PROJECTION}
    FROM conversations c
    ${CONVERSATION_JOINS}
    WHERE cm.user_id = $1
      AND c.id = $2
    `,
    [userId, conversationId],
  );

  return rows[0];
};

export const findDirectConversation = async (
  userId: string,
  otherUserId: string,
): Promise<ConversationWithRelations> => {
  const { rows } = await pool.query(
    `
    SELECT ${CONVERSATION_RELATIONS_PROJECTION}
    FROM conversations c
    ${CONVERSATION_JOINS}
    WHERE c.type = 'direct'
      AND EXISTS (
        SELECT 1
        FROM conversation_members cm2
        WHERE cm2.conversation_id = c.id
          AND cm2.user_id = $2
      )
      AND (
        SELECT COUNT(*)
        FROM conversation_members cm3
        WHERE cm3.conversation_id = c.id
      ) = 2
    LIMIT 1
    `,
    [userId, otherUserId],
  );

  return rows[0];
};

export const add = async (
  data: CreateConversationData,
  client?: PoolClient,
): Promise<string> => {
  const conn = client ? client : pool;

  const { columnsStr, placeholdersStr, values } = buildInsertQueries(data);

  const { rows } = await conn.query(
    `
    INSERT INTO conversations (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING id
    `,
    values,
  );

  return rows[0].id;
};

export const update = async (
  userId: string,
  conversationId: string,
  changes: Partial<Conversation>,
): Promise<ConversationWithRelations> => {
  const { setClause, values } = buildUpdateQueries(changes);

  values.push(conversationId);

  const { rows } = await pool.query(
    `
    UPDATE conversations
    ${setClause},
      updated_at = now()
    WHERE id = $${values.length}
    `,
    values,
  );

  return await findWithRelationsById(userId, conversationId);
};

export const remove = async (
  userId: string,
  conversationId: string,
): Promise<void> => {
  await pool.query(
    `
    DELETE FROM conversations
    WHERE id = $1
      AND created_by = $2 
    `,
    [conversationId, userId],
  );
};

export const findLatestByConversation = async (
  conversationId: string,
): Promise<Message> => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
    ORDER BY sequence DESC
    LIMIT 1
    `,
    [conversationId],
  );

  return rows[0] ?? null;
};

export const getUnreadCount = async (
  conversationId: string,
  userId: string,
): Promise<number> => {
  const { rows } = await pool.query(
    `
    SELECT
      c.message_sequence - cm.last_read_sequence AS unread_count
    FROM conversations c
    JOIN conversation_members cm
      ON cm.conversation_id = c.id
    WHERE c.id = $1
      AND cm.user_id = $2
    `,
    [conversationId, userId],
  );

  return Number(rows[0]?.unread_count ?? 0);
};

export const markAsRead = async (
  conversationId: string,
  userId: string,
  sequence: number,
): Promise<ConversationMember> => {
  const { rows } = await pool.query(
    `
    UPDATE conversation_members
    SET last_read_sequence = GREATEST(last_read_sequence, $3)
    WHERE conversation_id = $1
      AND user_id = $2
    RETURNING *
    `,
    [conversationId, userId, sequence],
  );

  return rows[0];
};
