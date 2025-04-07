import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { ArrowUpDown } from "lucide-react";

import GameFilters from "@/components/game/GameFilters";
import Seo from "@/components/Seo";

import InfiniteGameGrid from "@/components/game/InfiniteGameGrid";

import { useInfiniteGames } from "@/hooks/useGame";

const BrowseGames = () => {
  const [searchParams] = useSearchParams();

  // Use our new infinite games hook
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteGames();

  // Get total count from first page
  const totalCount = data?.pages?.[0]?.count || 0;

  // Track and count all games loaded so far
  const loadedGamesCount = data?.pages
    ? data.pages.reduce((count, page) => count + page.results.length, 0)
    : 0;

  // Check if filters are active
  const hasActiveFilters = searchParams.toString().length > 0;

  // Generate dynamic SEO data based on current filters
  const seoData = useMemo(() => {
    // Default SEO data
    const defaultData = {
      title: "Przeglądaj Gry",
      description:
        "Odkryj i przeglądaj tysiące gier w naszej bazie. Filtruj według platformy, gatunku, ocen i wielu innych kryteriów.",
    };

    // If no filters are active, return default data
    if (!hasActiveFilters) {
      return defaultData;
    }

    // Build title and description based on active filters
    let filterParts = [];

    // Check for genre filter
    const genres = searchParams.get("genres");
    if (genres) {
      filterParts.push("gatunku");
    }

    // Check for platform filter
    const platforms = searchParams.get("platforms");
    if (platforms) {
      filterParts.push("platformy");
    }

    // Check for search query
    const search = searchParams.get("search");
    if (search) {
      filterParts.push(`wyszukiwania "${search}"`);
    }

    // Check for ordering
    const ordering = searchParams.get("ordering");
    if (ordering) {
      const orderMap = {
        "-added": "najnowszych",
        "-rating": "najwyżej ocenianych",
        name: "alfabetycznie (A-Z)",
        "-released": "daty wydania (najnowsze)",
        released: "daty wydania (najstarsze)",
      };

      if (orderMap[ordering]) {
        filterParts.push(`sortowania według ${orderMap[ordering]}`);
      }
    }

    // Create dynamic title and description
    let title = defaultData.title;
    let description = defaultData.description;

    if (filterParts.length > 0) {
      title = `Gry według ${filterParts.join(", ")}`;

      if (search) {
        description = `Wyniki wyszukiwania dla "${search}" w naszej bazie gier. `;
      } else {
        description = `Przeglądaj gry według ${filterParts.join(", ")}. `;
      }

      description += `Znajdź najlepsze tytuły dopasowane do Twoich preferencji.`;
    }

    return { title, description };
  }, [searchParams, hasActiveFilters]);

  // Reset to top of the list and refetch when search params change
  useEffect(() => {
    refetch();
    // Auto-scroll to top on filter change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams, refetch]);

  return (
    <div className="py-0 md:py-6">
      <Seo
        title={seoData.title}
        description={seoData.description}
        canonical={`https://game-finder.example.com/browse${
          hasActiveFilters ? "?" + searchParams.toString() : ""
        }`}
      />

      <div className="flex flex-col space-y-4 md:space-y-6">
        {/* Page title - hidden on mobile when filters are shown */}
        <div className="hidden md:block relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl rounded-lg h-12"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent inline-block">
              Browse Games
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and explore thousands of games
            </p>
          </div>
        </div>

        {/* Mobile title - compact */}
        <div className="md:hidden pt-3 px-3">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent inline-block">
            Browse Games
          </h1>
        </div>

        <GameFilters />

        <div className="flex items-center justify-between px-3 md:px-0">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {hasActiveFilters ? "Filtered results" : "All games"}
            </span>
          </div>

          {totalCount > 0 && !isLoading && (
            <div className="text-sm font-medium">
              <span>
                {loadedGamesCount > 0 ? `${loadedGamesCount} of ` : ""}
                {totalCount.toLocaleString()}{" "}
                {totalCount === 1 ? "game" : "games"}
              </span>
            </div>
          )}
        </div>

        {/* Game grid - full width on mobile */}
        <div className="px-2 md:px-0">
          <InfiniteGameGrid
            data={data}
            isLoading={isLoading}
            isError={isError}
            error={error}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default BrowseGames;
