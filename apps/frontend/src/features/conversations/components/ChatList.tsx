import SearchInput from "@/components/common/SearchInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, SquarePlus } from "lucide-react";
import ChatTabs from "./ChatTabs";

const ChatList = () => {
  return (
    <Card className="flex h-full w-full flex-col gap-0 p-4">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        {/* Logo */}
        <div className="flex size-10 items-center justify-center rounded-md bg-primary">
          <MessageCircle className="size-5 text-primary-foreground" />
        </div>

        {/* Create Group */}
        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          aria-label="Create group"
        >
          <SquarePlus className="size-5" />
        </Button>
      </div>

      {/* Searchbar */}
      <div className="my-4">
        <SearchInput />
      </div>

      {/* Tabs */}
      <ChatTabs />
    </Card>
  );
};

export default ChatList;
