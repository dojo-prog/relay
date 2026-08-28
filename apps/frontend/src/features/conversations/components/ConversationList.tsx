import type { ConversationWithRelations } from "@relay/shared";
import ConversationItem from "./ConversationItem";

export const dummyConversation: ConversationWithRelations = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  type: "direct",
  name: null,

  message_sequence: 42,

  created_by: {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    username: "alex",
  },

  participant: {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    username: "jordan",
  },

  last_message: {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    content: "Hey! Are we still meeting later?",
    created_at: "2026-08-28T10:32:00.000Z",

    sender: {
      id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      username: "jordan",
    },
  },

  created_at: "2026-08-27T09:15:00.000Z",
  updated_at: "2026-08-28T10:32:00.000Z",
};

const ConversationList = () => {
  return (
    <div>
      <ConversationItem conversation={dummyConversation} />
      <ConversationItem conversation={dummyConversation} />
      <ConversationItem conversation={dummyConversation} />
      <ConversationItem conversation={dummyConversation} />
      <ConversationItem conversation={dummyConversation} />
      <ConversationItem conversation={dummyConversation} />
    </div>
  );
};

export default ConversationList;
