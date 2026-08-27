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
`;

export const CONVERSATION_JOINS = `
  JOIN conversation_members cm 
    ON cm.conversation_id = c.id

  JOIN users u 
    ON u.id = c.created_by
`;
