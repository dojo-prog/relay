import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationList from "./ConversationList";
import { useState } from "react";

interface ChatTabsProps {
  search: string;
}

const ChatTabs = ({ search }: ChatTabsProps) => {
  const [tab, setTab] = useState("all");

  const type = tab === "groups" ? "group" : undefined;

  const unread = tab === "unread" ? true : undefined;

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex h-full min-h-0 w-full flex-col"
    >
      <TabsList className="w-full">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
        <TabsTrigger value="groups">Groups</TabsTrigger>
      </TabsList>

      <div className="min-h-0 flex-1">
        <ConversationList search={search} type={type} unread={unread} />
      </div>
    </Tabs>
  );
};

export default ChatTabs;
