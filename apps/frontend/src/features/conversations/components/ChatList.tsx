import SearchInput from "@/components/common/SearchInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, MessageCircle, SquarePlus } from "lucide-react";
import ChatTabs from "./ChatTabs";
import useAuthStore from "@/stores/auth.store";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import TooltipWrapper from "@/components/common/TooltipWrapper";

const ChatList = () => {
  const { logout } = useAuthStore();

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
        <TooltipWrapper content={"Create conversation"}>
          <Button
            variant="ghost"
            size="icon"
            className="size-10"
            aria-label="Create conversation"
          >
            <SquarePlus className="size-5" />
          </Button>
        </TooltipWrapper>
      </div>

      {/* Searchbar */}
      <div className="my-4">
        <SearchInput />
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto">
        <ChatTabs />
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
