import ConversationItem from "./ConversationItem";
import { useConversations } from "../hooks/useConversations";
import type { ConversationType } from "@relay/shared";

interface ConversationListProps {
  search: string;
  type?: ConversationType;
  unread?: boolean;
}

const ConversationList = ({ search, type, unread }: ConversationListProps) => {
  const { data, isPending, isError } = useConversations({
    search,
    type,
    unread,
  });

  const conversations =
    data?.pages.flatMap((page) => page.data.conversations) ?? [];

  return (
    <div>
      {conversations.map((c) => (
        <ConversationItem key={c.id} conversation={c} />
      ))}
    </div>
  );
};

export default ConversationList;
