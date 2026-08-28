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

const CreateConversationButton = () => {
  return (
    <Dialog>
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

        <CreateConversationForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateConversationButton;
