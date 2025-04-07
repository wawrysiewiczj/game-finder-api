import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class strings and returns a merged version
 * @param {...string} inputs - Class strings to be combined
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format release date
export function formattedReleaseDate(released) {
  return released
    ? new Date(released).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "TBA";
}

// Get metacritic color
export function getMetacriticColor(score) {
  if (!score) return "text-muted-foreground border-muted-foreground/30";
  if (score >= 75)
    return "text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 bg-green-600/10";
  if (score >= 50)
    return "text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-400 bg-yellow-600/10";
  return "text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 bg-red-600/10";
}
