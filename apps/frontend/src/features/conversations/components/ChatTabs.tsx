import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationList from "./ConversationList";

const ChatTabs = () => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
        <TabsTrigger value="groups">Groups</TabsTrigger>
      </TabsList>

      <ConversationList />
    </Tabs>
  );
};

export default ChatTabs;
