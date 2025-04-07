import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getGameDetails, getGames, getGameScreenshots } from "@/services/api";

import { useSearchParams } from "react-router-dom";

/**
 * Custom hook for fetching game details by ID
 * @param {string|number} id - Game ID
 * @returns {Object} Query result with game details
 */
export const useGameDetails = (id) => {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => getGameDetails(id),
    enabled: !!id, // Only run when ID is available
  });
};

/**
 * Custom hook for fetching game screenshots by ID
 * @param {string|number} id - Game ID
 * @returns {Object} Query result with game screenshots
 */
export const useGameScreenshots = (id) => {
  return useQuery({
    queryKey: ["gameScreenshots", id],
    queryFn: () => getGameScreenshots(id),
    enabled: !!id, // Only run when ID is available
  });
};

/**
 * Custom hook for fetching games with filtering, sorting, and pagination
 * @returns {Object} Query result with games data and loading states
 */
export const useGames = () => {
  const [searchParams] = useSearchParams();

  // Parse search params from URL
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page"))
    : 1;
  const pageSize = searchParams.get("page_size")
    ? parseInt(searchParams.get("page_size"))
    : 20;
  const search = searchParams.get("search") || "";
  const genres = searchParams.get("genres") || "";
  const platforms = searchParams.get("platforms") || "";
  const ordering = searchParams.get("ordering") || "-added"; // Default sort by newest

  // Construct API parameters
  const params = {
    page,
    page_size: pageSize,
    search,
    genres,
    platforms,
    ordering,
  };

  // Filter out empty params
  Object.keys(params).forEach((key) => {
    if (params[key] === "" || params[key] === undefined) {
      delete params[key];
    }
  });

  return useQuery({
    queryKey: ["games", params],
    queryFn: () => getGames(params),
    keepPreviousData: true, // Keep old data while fetching new data
  });
};

/**
 * Custom hook for fetching games with filtering, sorting, and infinite scrolling
 * @returns {Object} Infinite Query result with games data and loading states
 */
export const useInfiniteGames = () => {
  const [searchParams] = useSearchParams();

  // Parse search params from URL (except page, as we'll handle pagination differently)
  const pageSize = searchParams.get("page_size")
    ? parseInt(searchParams.get("page_size"))
    : 20;
  const search = searchParams.get("search") || "";
  const genres = searchParams.get("genres") || "";
  const platforms = searchParams.get("platforms") || "";
  const ordering = searchParams.get("ordering") || "-added"; // Default sort by newest

  // Create base params (without page)
  const baseParams = {
    page_size: pageSize,
    search,
    genres,
    platforms,
    ordering,
  };

  // Filter out empty params
  Object.keys(baseParams).forEach((key) => {
    if (baseParams[key] === "" || baseParams[key] === undefined) {
      delete baseParams[key];
    }
  });

  return useInfiniteQuery({
    queryKey: ["infiniteGames", baseParams],
    queryFn: async ({ pageParam = 1 }) => {
      // Combine baseParams with current page
      const params = { ...baseParams, page: pageParam };
      const data = await getGames(params);
      return data;
    },
    getNextPageParam: (lastPage) => {
      // Calculate next page based on API response
      // RAWG API uses 1-based indexing for pages
      const nextPage = lastPage.next
        ? parseInt(new URL(lastPage.next).searchParams.get("page"))
        : undefined;

      return nextPage;
    },
    // Keep previously fetched data while loading new data
    keepPreviousData: true,
    // Refetch when window gets focus
    refetchOnWindowFocus: false,
  });
};

/**
 * Custom hook for fetching popular games for the home page with optimized caching
 * @param {number} limit - Number of games to fetch
 * @returns {Object} Query result with popular games data
 */
export const usePopularGames = (limit = 8) => {
  return useQuery({
    queryKey: ["popularGames", limit],
    queryFn: () =>
      getGames({
        page: 1,
        page_size: limit,
        ordering: "-rating",
      }),
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
  });
};

export default {
  useGameDetails,
  useGameScreenshots,
  useGames,
  useInfiniteGames,
  usePopularGames,
};
