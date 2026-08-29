import { ConversationSpecificQuery } from "@relay/shared";

const buildConversationSpecificFilters = (
  specific: ConversationSpecificQuery,
  baseConditions: string[] = [],
  baseValues: unknown[] = [],
) => {
  const conditions = [...baseConditions];
  const values = [...baseValues];

  const { type, search } = specific;

  // =======================================
  // CONVERSATION TYPE
  // =======================================

  if (type) {
    values.push(type);

    conditions.push(`c.type = $${values.length}`);
  }

  // =======================================
  // SEARCH
  // =======================================

  if (search) {
    values.push(`%${search}%`);

    const placeholder = `$${values.length}`;

    conditions.push(`
      (
        (
          c.type = 'group'
          AND c.name ILIKE ${placeholder}
        )
        OR
        (
          c.type = 'direct'
          AND EXISTS (
            SELECT 1
            FROM conversation_members pcm
            JOIN users p
              ON p.id = pcm.user_id
            WHERE pcm.conversation_id = c.id
              AND pcm.user_id <> $1
              AND p.username ILIKE ${placeholder}
          )
        )
      )
    `);
  }

  return {
    conditions,
    values,
  };
};

export default buildConversationSpecificFilters;
