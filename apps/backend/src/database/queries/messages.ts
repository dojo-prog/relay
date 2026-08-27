export const MESSAGE_RELATIONS_PROJECTION = `
  m.id, 
  m.conversation_id, 
  m.content, 
  m.created_at, 
  m.updated_at, 
  m.deleted_at, 

  jsonb_build_object(
    'id', u.id,
    'username', u.username
  ) AS sender
`;

export const MESSAGE_JOINS = `
  JOIN users u 
    ON u.id = m.sender_id
`;
