import ConversationItem from "./ConversationItem";
import { useConversations } from "../hooks/useConversations";

interface ConversationListProps {
  search: string;
}

const ConversationList = ({ search }: ConversationListProps) => {
  const { data, isPending, isError } = useConversations({ search });

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
