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
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
        <TabsTrigger value="groups">Groups</TabsTrigger>
      </TabsList>

      <ConversationList search={search} type={type} unread={unread} />
    </Tabs>
  );
};

export default ChatTabs;
