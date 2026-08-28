import { type ChangeEvent } from "react";
import SearchInput from "./SearchInput";
import UserSearchList from "./UserSearchList";

interface UserSearchProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (user: { id: string; username: string }) => void;
}
const users = [
  {
    id: "1",
    username: "jordan",
  },
  {
    id: "2",
    username: "alex",
  },
];

const UserSearch = ({ value, onChange, handleSelect }: UserSearchProps) => {
  return (
    <div className="relative h-max">
      <SearchInput
        placeholder="Search username..."
        value={value}
        onChange={onChange}
      />

      {value && users && (
        <div className="absolute top-full w-full z-10 mt-2 ">
          <UserSearchList users={users} handleSelect={handleSelect} />
        </div>
      )}
    </div>
  );
};

export default UserSearch;
