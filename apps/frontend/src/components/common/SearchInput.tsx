import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({
  placeholder = "Search here...",
  value,
  onChange,
}: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
