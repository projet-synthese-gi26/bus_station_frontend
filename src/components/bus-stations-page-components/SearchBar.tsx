"use client";
// src/components/bus-stations-page-components/SearchBar.tsx

import { Search } from "lucide-react";

interface SearchBarProps {
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  onSearchChange,
  placeholder = "Rechercher...",
}: SearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      />
    </div>
  );
};

export default SearchBar;
