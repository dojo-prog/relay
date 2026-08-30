import { PoolClient } from "pg";
import pool from "../database/db";
import {
  CONVERSATION_MEMBER_RELATIONS_PROJECTION,
  CONVERSATION_MEMBERS_JOINS,
} from "../database/queries/conversation_members";
import {
  ConversationMember,
  ConversationMemberWithRelations,
} from "@relay/shared";
import { ConversationMemberQuery } from "@relay/shared";
import { AddConversationMemberData } from "../types/conversation_member.types";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";

export const find = async (
  conversationId: string,
  filters: ConversationMemberQuery,
): Promise<{
  conversation_members: ConversationMemberWithRelations[];
  total: number;
}> => {
  const { whereClause, limitClause, offsetClause, values } = buildFilterQueries(
    filters,
    ["c.id = $1"],
    [conversationId],
    ["u.username"],
  );

  const { rows } = await pool.query(
    `
    SELECT ${CONVERSATION_MEMBER_RELATIONS_PROJECTION},
      COUNT(*) OVER()::INT AS total
    FROM conversation_members cm 
    ${CONVERSATION_MEMBERS_JOINS}
    ${whereClause}
    ORDER BY cm.joined_at ASC
    ${limitClause}
    ${offsetClause}
    `,
    values,
  );

  const conversation_members = rows.map(({ total, ...cm }) => cm);

  return {
    conversation_members,
    total: rows[0]?.total ?? 0,
  };
};

export const findAllIds = async (
  conversationId: string,
): Promise<{ user_id: string }[]> => {
  const { rows } = await pool.query(
    `
    SELECT user_id 
    FROM conversation_members
    WHERE conversation_id = $1
    `,
    [conversationId],
  );

  return rows;
};

export const findById = async (
  conversationId: string,
  userId: string,
): Promise<ConversationMember> => {
  const { rows } = await pool.query(
    `
    SELECT * 
    FROM conversation_members 
    WHERE conversation_id = $1
      AND user_id = $2
    `,
    [conversationId, userId],
  );

  return rows[0];
};

export const findWithRelationsById = async (
  conversationId: string,
  userId: string,
): Promise<ConversationMemberWithRelations> => {
  const { rows } = await pool.query(
    `
    SELECT ${CONVERSATION_MEMBER_RELATIONS_PROJECTION}
    FROM conversation_members cm 
    ${CONVERSATION_MEMBERS_JOINS}
    WHERE conversation_id = $1
      AND user_id = $2
    `,
    [conversationId, userId],
  );

  return rows[0];
};

export const add = async (
  data: AddConversationMemberData,
  client?: PoolClient,
): Promise<ConversationMemberWithRelations> => {
  const conn = client ? client : pool;

  const { columnsStr, placeholdersStr, values } = buildInsertQueries(data);

  const { rows } = await conn.query(
    `
    INSERT INTO conversation_members (${columnsStr})
    VALUES (${[placeholdersStr]})
    RETURNING user_id
    `,
    values,
  );

  const user_id = rows[0].user_id;

  return await findWithRelationsById(data.conversation_id, user_id);
};

export const remove = async (
  conversationId: string,
  userId: string,
): Promise<void> => {
  await pool.query(
    `
    DELETE FROM conversation_members 
    WHERE conversation_id = $1
      AND user_id = $2
    `,
    [conversationId, userId],
  );
};
