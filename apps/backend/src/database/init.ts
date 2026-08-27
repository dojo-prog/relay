import pool from "./db";

const initDb = async () => {
  await pool.query(
    `
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text NOT NULL UNIQUE,
      email text NOT NULL UNIQUE, 
      password_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(), 
      updated_at timestamptz NOT NULL DEFAULT now() 
    );
    
    CREATE TABLE IF NOT EXISTS conversations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      type text NOT NULL CHECK 
        (type IN ('direct', 'group')),
      name text,
      message_sequence bigint NOT NULL DEFAULT 0,
      created_by uuid REFERENCES users(id)
        ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(), 
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS conversation_members (
      conversation_id uuid NOT NULL REFERENCES conversations(id)
        ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES users(id)
        ON DELETE CASCADE, 
      last_read_sequence bigint NOT NULL DEFAULT 0,
      joined_at timestamptz NOT NULL DEFAULT now(),

      PRIMARY KEY (conversation_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id uuid NOT NULL REFERENCES conversations(id)
        ON DELETE CASCADE,
      sender_id uuid REFERENCES users(id)
        ON DELETE SET NULL, 
      content text NOT NULL,
      status text NOT NULL default 'sent', 
      sequence bigint NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(), 
      updated_at timestamptz,
      deleted_at timestamptz,

      UNIQUE (conversation_id, sequence)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
      type text NOT NULL CHECK
        (type IN ('message', 'conversation_invite')),
      message text NOT NULL, 
      reference_id uuid NOT NULL, 
      read_at timestamptz, 
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_conversations_name
      ON conversations (name);

    CREATE INDEX IF NOT EXISTS idx_conversations_type
      ON conversations (type);

    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
      ON messages (conversation_id);

    CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
      ON notifications (user_id);

    CREATE INDEX IF NOT EXISTS idx_notifications_type 
      ON notifications (type);
    `,
  );
};

initDb();
