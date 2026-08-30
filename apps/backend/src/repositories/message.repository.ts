import pool from "../database/db";
import {
  MESSAGE_JOINS,
  MESSAGE_RELATIONS_PROJECTION,
} from "../database/queries/messages";
import { Message, MessageQuery, MessageWithRelations } from "@relay/shared";
import { CreateMessageData } from "../types/message.types";
import buildFilterQueries from "../utils/query-builder/buildFilterQueries";
import buildInsertQueries from "../utils/query-builder/buildInsertQueries";
import buildUpdateQueries from "../utils/query-builder/buildUpdateQueries";

export const find = async (
  conversationId: string,
  filters: MessageQuery,
): Promise<{ messages: MessageWithRelations[]; total: number }> => {
  const { whereClause, limitClause, offsetClause, values } = buildFilterQueries(
    filters,
    ["m.conversation_id = $1"],
    [conversationId],
  );

  const { rows } = await pool.query(
    `
    SELECT ${MESSAGE_RELATIONS_PROJECTION},
      COUNT(*) OVER()::INT AS total
    FROM messages m
    ${MESSAGE_JOINS}
    ${whereClause}
    ORDER BY created_at ASC
    ${limitClause}
    ${offsetClause}
    `,
    values,
  );

  const messages = rows.map(({ total, ...m }) => m);

  return {
    messages,
    total: rows[0]?.total ?? 0,
  };
};

export const findById = async (
  conversationId: string,
  messageId: string,
): Promise<Message> => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM messages
    WHERE id = $1
      AND conversation_id = $2
    `,
    [messageId, conversationId],
  );

  return rows[0];
};

export const findWithRelationsById = async (
  conversationId: string,
  messageId: string,
): Promise<MessageWithRelations> => {
  const { rows } = await pool.query(
    `
    SELECT ${MESSAGE_RELATIONS_PROJECTION}
    FROM messages m
    ${MESSAGE_JOINS}
    WHERE m.id = $1
      AND conversation_id = $2
    `,
    [messageId, conversationId],
  );

  return rows[0];
};

export const add = async (
  data: CreateMessageData,
): Promise<MessageWithRelations> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update conversation message sequence
    const { rows: conversationRows } = await client.query(
      `
      UPDATE conversations
      SET message_sequence = message_sequence + 1
      WHERE id = $1
      RETURNING message_sequence
      `,
      [data.conversation_id],
    );

    const sequence = Number(conversationRows[0].message_sequence);

    // Add sequence to data for insert
    const finalData = {
      ...data,
      sequence,
    };

    // Insert message
    const { columnsStr, placeholdersStr, values } =
      buildInsertQueries(finalData);

    const { rows } = await client.query(
      `
    INSERT INTO messages (${columnsStr})
    VALUES (${placeholdersStr})
    RETURNING id
    `,
      values,
    );

    const message_id = rows[0].id;

    await client.query("COMMIT");

    return await findWithRelationsById(data.conversation_id, message_id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const update = async (
  conversationId: string,
  messageId: string,
  changes: Partial<Message>,
): Promise<MessageWithRelations> => {
  const { setClause, values } = buildUpdateQueries(changes);

  values.push(messageId, conversationId);

  await pool.query(
    `
    UPDATE messages
    ${setClause}
    WHERE id = $${values.length - 1}
      AND conversation_id = $${values.length}
    `,
    values,
  );

  return await findWithRelationsById(conversationId, messageId);
};

export const remove = async (
  conversationId: string,
  messageId: string,
): Promise<MessageWithRelations> => {
  await pool.query(
    `
    DELETE FROM messages 
    WHERE id = $1
      AND conversation_id = $2
    `,
    [messageId, conversationId],
  );

  return await findWithRelationsById(conversationId, messageId);
};
