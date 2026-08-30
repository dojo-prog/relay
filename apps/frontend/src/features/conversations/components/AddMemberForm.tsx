import SelectedUser from "@/components/common/SelectedUserItem";
import UserSearch from "@/components/common/UserSearch";
import { Field, FieldLabel } from "@/components/ui/field";
import type { AddConversationMemberInput, UserPublic } from "@relay/shared";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddMember } from "../hooks/useAddMember";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AddMemberFormProps {
  conversationId: string;
  onSuccess: () => void;
}

const AddMemberForm = ({ conversationId, onSuccess }: AddMemberFormProps) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);

  const form = useForm<AddConversationMemberInput>({
    defaultValues: {
      conversationId,
      memberId: "",
    },
  });

  const memberId = form.watch("memberId");

  const handleSelectUser = (user: UserPublic) => {
    form.setValue("memberId", user.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSelectedUser(user);

    setSearch("");
  };

  const handleRemoveUser = () => {
    form.setValue("memberId", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSelectedUser(null);
  };

  const { mutateAsync: addMember, isPending } = useAddMember();

  const onsubmit = async (input: AddConversationMemberInput) => {
    try {
      await addMember(input);

      toast.success("User added to the conversation");

      onSuccess();
    } catch (error: any) {
      toast.error(error.message ?? error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
      <div className="relative space-y-2">
        <Field>
          <FieldLabel>Search for user</FieldLabel>
          <UserSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            handleSelect={handleSelectUser}
          />
        </Field>

        {/* Selected users list */}
        {selectedUser && (
          <SelectedUser user={selectedUser} handleRemove={handleRemoveUser} />
        )}

        {memberId !== "" && selectedUser && (
          <Button type="submit" className="mt-4 w-full">
            {!isPending ? (
              "Add member"
            ) : (
              <Loader2 className="animate-spin size-5" />
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddMemberForm;
