import TooltipWrapper from "@/components/common/TooltipWrapper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useConversationMembers } from "../hooks/useConversationMembers";
import type { ConversationWithRelations } from "@relay/shared";
import { Users } from "lucide-react";
import { useState } from "react";

interface ViewMembersButtonProps {
  conversation: ConversationWithRelations;
}

const ViewMembersButton = ({ conversation }: ViewMembersButtonProps) => {
  const [open, setOpen] = useState(false);

  const { data, isPending } = useConversationMembers(
    conversation.type === "group" ? conversation.id : "",
  );

  if (conversation.type !== "group") {
    return null;
  }

  const conversationMembers = data?.pages.flatMap(
    (page) => page.data.conversation_members,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipWrapper content="View members">
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-10"
              aria-label="View members"
            >
              <Users className="size-5" />
            </Button>
          }
        />
      </TooltipWrapper>

      <DialogContent className="w-md">
        <DialogTitle>Conversation Members</DialogTitle>

        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {isPending ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading members...
            </div>
          ) : conversationMembers?.length ? (
            conversationMembers.map((cm) => (
              <div
                key={cm.user.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback>
                    {cm.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <span className="truncate text-sm font-medium">
                  {cm.user.username}
                </span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No members found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMembersButton;
