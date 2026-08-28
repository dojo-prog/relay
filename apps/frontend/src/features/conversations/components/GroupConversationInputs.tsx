import SelectedUser from "@/components/common/SelectedUserItem";
import UserSearch from "@/components/common/UserSearch";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateConversationBody } from "@relay/shared";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

interface GroupConversationProps {
  form: UseFormReturn<CreateConversationBody>;
}

const GroupConversationInputs = ({ form }: GroupConversationProps) => {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<
    { id: string; username: string }[]
  >([]);

  const memberIds = form.watch("memberIds");

  console.log(memberIds);

  const handleSelectUser = (user: { id: string; username: string }) => {
    setSearch("");

    if (memberIds?.includes(user.id)) return;

    form.setValue("memberIds", [user.id], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleRemoveUser = (userId: string) => {
    const memberIds = form.getValues("memberIds");

    form.setValue(
      "memberIds",
      memberIds?.filter((id) => id !== userId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Group Name</FieldLabel>
        <Input id="name" placeholder="Group name" {...form.register("name")} />
      </Field>

      <div className="relative space-y-2">
        <Field>
          <FieldLabel>Group Members</FieldLabel>
          <UserSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            handleSelect={handleSelectUser}
          />
        </Field>

        {/* Selected users list */}
        {selectedUsers.length > 0 && (
          <div className="space-y-2">
            {selectedUsers.map((u) => (
              <SelectedUser
                key={u.id}
                user={u}
                handleRemove={handleRemoveUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupConversationInputs;
