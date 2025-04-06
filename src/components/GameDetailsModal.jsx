import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { fetchGameDetails, fetchGameScreenshots } from "../lib/api";
import { Skeleton } from "./ui/skeleton";

const GameDetailsModal = ({ gameId, isOpen, onClose }) => {
  const [gameDetails, setGameDetails] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        setIsLoading(true);
        const [details, screenshotsData] = await Promise.all([
          fetchGameDetails(gameId),
          fetchGameScreenshots(gameId),
        ]);

        setGameDetails(details);
        setScreenshots(screenshotsData.results || []);
      } catch (err) {
        setError("Failed to load game details. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && gameId) {
      loadGameDetails();
    }
  }, [gameId, isOpen]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          gameDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {gameDetails.name}
                </DialogTitle>
                <DialogDescription>
                  Released:{" "}
                  {new Date(gameDetails.released).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              {screenshots.length > 0 && (
                <div className="relative mt-4">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={screenshots[currentImageIndex]?.image}
                      alt={`${gameDetails.name} screenshot ${
                        currentImageIndex + 1
                      }`}
                      className="h-64 w-full rounded-lg object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>

                  {screenshots.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  <div className="mt-2 flex justify-center space-x-2">
                    {screenshots.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 w-2 rounded-full ${
                          index === currentImageIndex
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-xl font-bold">About</h3>
                <div
                  className="mt-2 text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: gameDetails.description }}
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold">Details</h3>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Platforms</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {gameDetails.platforms?.map((platform) => (
                        <Badge key={platform.platform.id} variant="outline">
                          {platform.platform.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Genres</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {gameDetails.genres?.map((genre) => (
                        <Badge key={genre.id}>{genre.name}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Rating</p>
                    <p className="mt-1">{gameDetails.rating} / 5</p>
                  </div>

                  <div>
                    <p className="font-semibold">Metacritic</p>
                    <p className="mt-1">
                      {gameDetails.metacritic ? (
                        <span
                          className={`font-bold ${
                            gameDetails.metacritic >= 75
                              ? "text-green-600"
                              : gameDetails.metacritic >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {gameDetails.metacritic}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {gameDetails.website && (
                <div className="mt-4">
                  <a
                    href={gameDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit official website
                  </a>
                </div>
              )}
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GameDetailsModal;
