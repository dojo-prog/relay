import TooltipWrapper from "@/components/common/TooltipWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquarePlus } from "lucide-react";
import CreateConversationForm from "./CreateConversationForm";
import { useState } from "react";

const CreateConversationButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipWrapper content={"Create conversation"}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-10"
              aria-label="Create conversation"
            >
              <SquarePlus className="size-5" />
            </Button>
          }
        />
      </TooltipWrapper>

      <DialogContent className={"w-md"}>
        <DialogTitle>Create Conversation</DialogTitle>

        <CreateConversationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateConversationButton;
