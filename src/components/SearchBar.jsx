import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useDebounce } from "../hooks/useDebounce";

const SearchBar = ({ onSearch, initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  // Apply search when debounced query changes
  useEffect(() => {
    // Only trigger search if the debounced query is different from initialQuery
    if (debouncedQuery !== initialQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, initialQuery]);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setQuery("");
    onSearch(""); // Immediately clear results when search is cleared
  }, [onSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search for games..."
          value={query}
          onChange={handleInputChange}
          className="h-11 pl-4 pr-10 text-base focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Search for games"
        />
        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
