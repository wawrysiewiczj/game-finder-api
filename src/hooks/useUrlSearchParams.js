import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook for managing URL search parameters
 * @returns {Object} - Functions and state for managing URL search parameters
 */
export function useUrlSearchParams() {
  // Initialize search params from URL
  const [searchParams, setSearchParams] = useState(() => {
    if (typeof window === "undefined") return {};
    return parseSearchParams(window.location.search);
  });

  // Update URL when search params change
  useEffect(() => {
    const queryString = buildQueryString(searchParams);
    const url = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    window.history.replaceState({}, "", url);
  }, [searchParams]);

  // Function to update specific search params
  const updateSearchParams = useCallback((newParams) => {
    setSearchParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  }, []);

  // Function to delete specific search params
  const deleteSearchParams = useCallback((keys) => {
    setSearchParams((prev) => {
      const newParams = { ...prev };
      if (Array.isArray(keys)) {
        keys.forEach((key) => delete newParams[key]);
      } else {
        delete newParams[keys];
      }
      return newParams;
    });
  }, []);

  // Function to reset all search params
  const resetSearchParams = useCallback(() => {
    setSearchParams({});
  }, []);

  return {
    searchParams,
    updateSearchParams,
    deleteSearchParams,
    resetSearchParams,
  };
}

/**
 * Parse URL search string into an object
 * @param {string} searchString - URL search string
 * @returns {Object} - Parsed search parameters
 */
function parseSearchParams(searchString) {
  if (!searchString || searchString === "?") return {};

  const params = {};
  const searchParams = new URLSearchParams(searchString);

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
}

/**
 * Build a query string from an object
 * @param {Object} params - Search parameters object
 * @returns {string} - Query string
 */
function buildQueryString(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
}
