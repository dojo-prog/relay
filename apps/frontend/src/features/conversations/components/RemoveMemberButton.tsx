import TooltipWrapper from "@/components/common/TooltipWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ConversationWithRelations } from "@relay/shared";
import { UserMinus } from "lucide-react";
import { useState } from "react";
import RemoveMemberForm from "./RemoveMemberForm";

interface RemoveMemberButtonProps {
  conversation: ConversationWithRelations;
}

const RemoveMemberButton = ({ conversation }: RemoveMemberButtonProps) => {
  const [open, setOpen] = useState(false);

  if (conversation.type !== "group") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipWrapper content="Remove Member">
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-10"
              aria-label="Add member"
            >
              <UserMinus className="size-5" />
            </Button>
          }
        />
      </TooltipWrapper>

      <DialogContent className="w-md">
        <DialogTitle>Remove Member</DialogTitle>

        <RemoveMemberForm conversationId={conversation.id} />
      </DialogContent>
    </Dialog>
  );
};

export default RemoveMemberButton;
