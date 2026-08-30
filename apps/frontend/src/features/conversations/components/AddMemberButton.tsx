import TooltipWrapper from "@/components/common/TooltipWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ConversationWithRelations } from "@relay/shared";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import AddMemberForm from "./AddMemberForm";

interface AddMemberProps {
  conversation: ConversationWithRelations;
}

const AddMemberButton = ({ conversation }: AddMemberProps) => {
  const [open, setOpen] = useState(false);

  if (conversation.type !== "group") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipWrapper content="Add Member">
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-10"
              aria-label="Add member"
            >
              <UserPlus className="size-5" />
            </Button>
          }
        />
      </TooltipWrapper>

      <DialogContent className="w-md">
        <DialogTitle>Add Member</DialogTitle>

        <AddMemberForm
          conversationId={conversation.id}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberButton;
