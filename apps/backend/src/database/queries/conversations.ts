export const CONVERSATION_RELATIONS_PROJECTION = `
  c.id,
  c.type,
  c.name,
  c.created_at,
  c.updated_at,

  jsonb_build_object(
    'id', u.id,
    'username', u.username
  ) AS created_by

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
  ) AS last_message
`;

export const CONVERSATION_JOINS = `
  JOIN conversation_members cm 
    ON cm.conversation_id = c.id

  JOIN users u 
    ON u.id = c.created_by
`;
