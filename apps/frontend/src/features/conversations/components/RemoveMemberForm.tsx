import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useConversationMembers } from "../hooks/useConversationMembers";
import { useRemoveMember } from "../hooks/useRemoveMember";
import { toast } from "sonner";
import useAuthStore from "@/stores/auth.store";
import { UserMinus } from "lucide-react";

interface RemoveMemberFormProps {
  conversationId: string;
}

const RemoveMemberForm = ({ conversationId }: RemoveMemberFormProps) => {
  const { user } = useAuthStore();

  const { data, isPending } = useConversationMembers(conversationId);

  const { mutateAsync: removeMember, isPending: isRemoving } =
    useRemoveMember();

  const conversationMembers = data?.pages.flatMap(
    (page) => page.data.conversation_members,
  );

  const handleRemove = async (userId: string) => {
    try {
      await removeMember({
        conversationId,
        memberId: userId,
      });

      toast.success("Member removed");
    } catch (error: any) {
      toast.error(error.message ?? error);
    }
  };

  if (isPending) {
    return <div>Loading members...</div>;
  }

  return (
    <div className="space-y-2">
      {conversationMembers?.map((cm) => {
        const isCurrentUser = cm.user.id === user!.id;

        return (
          <div
            key={cm.user.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-9 shrink-0">
                <AvatarFallback>
                  {cm.user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="truncate text-sm font-medium">
                {cm.user.username}
              </span>
            </div>

            {!isCurrentUser && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={isRemoving}
                onClick={() => handleRemove(cm.user.id)}
                aria-label={`Remove ${cm.user.username}`}
              >
                <UserMinus className="size-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RemoveMemberForm;
