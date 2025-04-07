import React, { useCallback, useRef, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { FileQuestion, AlertCircle, Loader2 } from "lucide-react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import GameCard from "@/components/game/GameCard";

/**
 * InfiniteGameGrid component displays an infinite-scrolling grid of game cards
 */
const InfiniteGameGrid = React.memo(
  ({
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }) => {
    const loaderRef = useRef(null);

    // Flatten all pages of games into a single array
    const games = data?.pages ? data.pages.flatMap((page) => page.results) : [];

    // Set up intersection observer for infinite scrolling
    const handleObserver = useCallback(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    // Initialize the intersection observer
    useEffect(() => {
      const element = loaderRef.current;
      const option = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      };

      const observer = new IntersectionObserver(handleObserver, option);
      if (element) observer.observe(element);

      return () => {
        if (element) observer.unobserve(element);
      };
    }, [handleObserver, hasNextPage]);

    // Error state
    if (isError && !games.length) {
      return (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px] p-4 md:p-8 text-center rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3 md:mb-4">
            <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-red-700 dark:text-red-400">
            Error Loading Games
          </h3>
          <p className="text-red-600/70 dark:text-red-300/70 mt-2 max-w-md text-sm md:text-base">
            {error?.message ||
              "There was an error loading games. Please try again."}
          </p>
        </motion.div>
      );
    }

    // Initial loading state (no data yet)
    if (isLoading && !games.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px]">
          <LoadingSpinner size="lg" className="text-primary" />
          <motion.p
            className="mt-4 text-muted-foreground text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Loading amazing games for you...
          </motion.p>
        </div>
      );
    }

    // No games found
    if (!isLoading && !games.length) {
      return (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px] p-4 md:p-8 text-center rounded-xl border border-muted bg-muted/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3 md:mb-4">
            <FileQuestion className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg md:text-xl font-bold">No Games Found</h3>
          <p className="text-muted-foreground mt-2 max-w-md text-sm md:text-base">
            Try changing your search criteria or filters to find some amazing
            games.
          </p>
        </motion.div>
      );
    }

    return (
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          <AnimatePresence mode="popLayout">
            {games.map((game, index) => (
              <motion.div
                key={`${game.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(0.05 * (index % 8), 0.2),
                }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading spinner for fetching next page */}
        <div
          ref={loaderRef}
          className={`flex justify-center py-4 md:py-8 ${
            !hasNextPage ? "hidden" : ""
          }`}
        >
          {isFetchingNextPage ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 text-primary animate-spin" />
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Loading more games...
              </p>
            </div>
          ) : (
            hasNextPage && (
              <div className="h-6 md:h-8 w-full flex items-center justify-center">
                <span className="h-1 w-10 md:w-12 bg-muted-foreground/20 rounded-full"></span>
              </div>
            )
          )}
        </div>

        {/* End of results message */}
        {!hasNextPage && games.length > 0 && (
          <motion.div
            className="text-center py-4 md:py-6 text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>You've reached the end of the results. 🎮</p>
          </motion.div>
        )}
      </div>
    );
  }
);

InfiniteGameGrid.displayName = "InfiniteGameGrid";

export default InfiniteGameGrid;
