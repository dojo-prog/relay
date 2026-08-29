export const CONVERSATION_RELATIONS_PROJECTION = `
  c.id,
  c.type,
  c.name,
  c.created_at,
  c.updated_at,

  jsonb_build_object(
    'id', u.id,
    'username', u.username
  ) AS created_by,

  CASE
    WHEN c.type = 'direct' THEN (
      SELECT jsonb_build_object(
        'id', p.id,
        'username', p.username
      )
      FROM conversation_members pcm
      JOIN users p
        ON p.id = pcm.user_id
      WHERE pcm.conversation_id = c.id
        AND pcm.user_id <> $1
      LIMIT 1
    )
    ELSE NULL
  END AS participant,

  (
    SELECT jsonb_build_object(
      'id', m.id,
      'content', m.content,
      'created_at', m.created_at,
      'sender', jsonb_build_object(
        'id', sender.id,
        'username', sender.username
      )
    )
    FROM messages m
    JOIN users sender
      ON sender.id = m.sender_id
    WHERE m.conversation_id = c.id
    ORDER BY m.created_at DESC
    LIMIT 1
  ) AS last_message,

  (
    SELECT
      c2.message_sequence - cm.last_read_sequence AS unread_count
    FROM conversations c2
    JOIN conversation_members cm
      ON cm.conversation_id = c2.id
    WHERE c2.id = c.id
      AND cm.user_id = $1
  ) AS unread_count
`;

export const CONVERSATION_JOINS = `
  JOIN conversation_members cm
    ON cm.conversation_id = c.id
   AND cm.user_id = $1

  JOIN users u
    ON u.id = c.created_by
`;
