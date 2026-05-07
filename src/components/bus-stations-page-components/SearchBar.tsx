"use client";

import React from "react";
import { Search } from "lucide-react";
import InputField from "@/ui/InputField";

type SearchBarProps = {
  onSearchChange: (query: string) => void;
  placeholder: string;
};

const SearchBar = ({ onSearchChange, placeholder }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="text-gray-400" size={20} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
