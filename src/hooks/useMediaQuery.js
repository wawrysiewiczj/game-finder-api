import { useState, useEffect } from "react";

/**
 * Custom hook that detects if a media query matches
 * @param {string} query - Media query to check
 * @returns {boolean} - True if the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia(query);

    // Set the initial value
    setMatches(mediaQuery.matches);

    // Define a handler for changes
    const handler = (event) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener("change", handler);

    // Clean up the event listener
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}
