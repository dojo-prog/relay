import SelectedUser from "@/components/common/SelectedUserItem";
import UserSearch from "@/components/common/UserSearch";
import type { CreateConversationBody, UserPublic } from "@relay/shared";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

interface DirectConversationProps {
  form: UseFormReturn<CreateConversationBody>;
}

const DirectConversationInput = ({ form }: DirectConversationProps) => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);

  const handleSelectUser = (user: UserPublic) => {
    form.setValue("memberIds", [user.id], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSelectedUser(user);

    setSearch("");
  };

  const handleRemoveUser = () => {
    form.setValue("memberIds", [], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSelectedUser(null);
  };

  return (
    <div className="relative space-y-2">
      <UserSearch
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        handleSelect={handleSelectUser}
      />

      {/* Selected user */}
      {selectedUser && (
        <SelectedUser user={selectedUser} handleRemove={handleRemoveUser} />
      )}
    </div>
  );
};

export default DirectConversationInput;
