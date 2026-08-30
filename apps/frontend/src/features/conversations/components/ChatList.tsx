import SearchInput from "@/components/common/SearchInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, MessageCircle } from "lucide-react";
import ChatTabs from "./ChatTabs";
import useAuthStore from "@/stores/auth.store";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import CreateConversationButton from "./CreateConversationButton";
import { useState } from "react";

const ChatList = () => {
  const { logout } = useAuthStore();

  const [search, setSearch] = useState<string>("");

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card className="flex h-full w-full flex-col gap-0 p-4">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        {/* Logo */}
        <div className="flex size-10 items-center justify-center rounded-md bg-primary">
          <MessageCircle className="size-5 text-primary-foreground" />
        </div>

        {/* Create Conversation */}
        <CreateConversationButton />
      </div>

      {/* Searchbar */}
      <div className="my-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="min-h-0 flex-1">
        <ChatTabs search={search} />
      </div>

      {/* Logout Button */}
      <div className="h-14 w-full pt-2 border-t border-secondary">
        <Button
          variant={"ghost"}
          className={"h-full w-full flex items-center"}
          onClick={handleLogout}
        >
          <LogOut className="mr-1 size-5" />
          <span className="text-m">Logout</span>
        </Button>
      </div>
    </Card>
  );
};

export default ChatList;
