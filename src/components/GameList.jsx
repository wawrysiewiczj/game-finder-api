import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameCard from "./GameCard";
import GameDetailsModal from "./GameDetailsModal";
import { Button } from "./ui/button";

const GameList = ({
  games,
  isLoading,
  isError,
  hasNextPage,
  fetchNextPage,
}) => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <div>
      {isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="my-12 text-center"
        >
          <h3 className="mb-2 text-xl font-semibold text-destructive">
            Error loading games
          </h3>
          <p className="text-muted-foreground">
            There was a problem fetching the games. Please try again later.
          </p>
        </motion.div>
      ) : games.length === 0 && !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="my-12 text-center"
        >
          <h3 className="mb-2 text-xl font-semibold">No games found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {games.map((game, index) => (
                <motion.div
                  key={`${game.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: (index % 8) * 0.05,
                  }}
                  layout
                >
                  <GameCard game={game} onClick={() => handleGameClick(game)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasNextPage && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={fetchNextPage}
                disabled={isLoading}
                className="min-w-40 border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                {isLoading ? "Loading..." : "Load More Games"}
              </Button>
            </div>
          )}

          {isLoading && games.length === 0 && (
            <div className="my-12 flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedGame && (
          <GameDetailsModal game={selectedGame} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameList;
