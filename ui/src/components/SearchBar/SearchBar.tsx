import React from "react";
import "./SearchBar.css";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  return (
    <div className="search-input-wrapper">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by title, owner, or status"
      />
    </div>
  );
};

export default SearchBar;
