import TooltipWrapper from "@/components/common/TooltipWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";
import { useState } from "react";
import type { ConversationWithRelations } from "@relay/shared";
import EditConversationForm from "./EditConversationForm";

interface EditConversationButtonProps {
  conversation: ConversationWithRelations;
}

const EditConversationButton = ({
  conversation,
}: EditConversationButtonProps) => {
  const [open, setOpen] = useState(false);

  if (conversation.type !== "group") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipWrapper content="Edit conversation">
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-10"
              aria-label="Edit conversation"
            >
              <Pen className="size-5" />
            </Button>
          }
        />
      </TooltipWrapper>

      <DialogContent className="w-md">
        <DialogTitle>Edit Conversation</DialogTitle>

        <EditConversationForm
          conversation={conversation}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditConversationButton;
