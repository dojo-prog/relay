import { Card } from "@/components/ui/card";
import { Users2 } from "lucide-react";

const ChatEmptyState = () => {
  return (
    <Card className="flex h-full w-full items-center justify-center">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
          <Users2 className="size-8 text-muted-foreground" />
        </div>

        <h2 className="text-xl font-semibold">No conversation selected</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    </Card>
  );
};

export default ChatEmptyState;
