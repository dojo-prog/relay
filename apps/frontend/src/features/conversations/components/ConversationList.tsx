import ConversationItem from "./ConversationItem";
import { useConversations } from "../hooks/useConversations";

const ConversationList = () => {
  const { data, isPending, isError } = useConversations({});

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
