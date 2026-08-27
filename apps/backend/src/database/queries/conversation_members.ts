export const CONVERSATION_MEMBER_RELATIONS_PROJECTION = `
  cm.conversation_id,
  cm.joined_at,

  jsonb_build_object(
    'id', u.id,
    'username', u.username
  ) AS user
`;

export const CONVERSATION_MEMBERS_JOINS = `
  JOIN conversations c
      ON c.id = cm.conversation_id

    JOIN users u 
      ON u.id = cm.user_id
`;
