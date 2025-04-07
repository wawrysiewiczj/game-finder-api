import React from "react";

import { motion } from "framer-motion";
import { FileQuestion, AlertCircle } from "lucide-react";

import { AnimatedGroup } from "@/components/ui/animated-group";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import GameCard from "@/components/game/GameCard";

/**
 * GameGrid component displays a grid of game cards
 * @param {Object} props
 * @param {Array} props.games - List of games to display
 * @param {boolean} props.isLoading - Whether games are currently loading
 * @param {boolean} props.isError - Whether there was an error loading games
 * @param {Object} props.error - Error object if there was an error
 */
const GameGrid = React.memo(({ games, isLoading, isError, error }) => {
  if (isError) {
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

  if (isLoading) {
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

  if (!games || games.length === 0) {
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
    <AnimatedGroup
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
      childClassName="transition-all"
      animation="fadeInUp"
      staggerChildren={0.05}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </AnimatedGroup>
  );
});

GameGrid.displayName = "GameGrid";

export default GameGrid;
