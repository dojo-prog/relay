import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
}

const SearchInput = ({ placeholder = "Search here..." }: SearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input type="search" placeholder={placeholder} className="pl-9" />
    </div>
  );
};

export default SearchInput;
