"use client";

import { Input } from "@/components/ui/input";

interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ query, onSearch }: SearchBarProps) {
  // const [query, setQuery] = useState("");

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSearch(query);
  // };

  return (
    <Input
      type="text"
      placeholder="Search snippets..."
      value={query}
      onChange={(e) => onSearch(e.target.value)}
      className="flex-grow"
    />
  );
}
