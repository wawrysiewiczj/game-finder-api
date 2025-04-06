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

const GameDetailsModal = ({ game, onClose }) => {
  const [gameDetails, setGameDetails] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadGameDetails = async () => {
      if (!game || !game.id) return;

      try {
        setIsLoading(true);
        const [details, screenshotsData] = await Promise.all([
          fetchGameDetails(game.id),
          fetchGameScreenshots(game.id),
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

    loadGameDetails();
  }, [game]);

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
    <Dialog open={!!game} onOpenChange={() => onClose()}>
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
          <div className="px-6 py-10 text-center">
            <div className="mb-4 text-5xl">😢</div>
            <h3 className="mb-2 text-xl font-semibold text-destructive">
              Error
            </h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          gameDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {gameDetails.name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <span>
                    Released:{" "}
                    {new Date(gameDetails.released).toLocaleDateString()}
                  </span>
                  {gameDetails.metacritic && (
                    <Badge
                      variant={
                        gameDetails.metacritic > 75
                          ? "default"
                          : gameDetails.metacritic > 50
                          ? "secondary"
                          : "outline"
                      }
                      className={`font-medium ${
                        gameDetails.metacritic > 75
                          ? "bg-green-500 hover:bg-green-600"
                          : gameDetails.metacritic > 50
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-destructive hover:bg-destructive/90"
                      }`}
                    >
                      Metacritic: {gameDetails.metacritic}
                    </Badge>
                  )}
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
                      className="h-auto max-h-[400px] w-full rounded-lg object-cover"
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
                        aria-label="Previous image"
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
                        aria-label="Next image"
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
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-xl font-bold">About</h3>
                <div
                  className="mt-2 prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: gameDetails.description }}
                />
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold">Details</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="mb-2 font-semibold">Platforms</p>
                    <div className="flex flex-wrap gap-1">
                      {gameDetails.platforms?.map((platform) => (
                        <Badge key={platform.platform.id} variant="outline">
                          {platform.platform.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <p className="mb-2 font-semibold">Genres</p>
                    <div className="flex flex-wrap gap-1">
                      {gameDetails.genres?.map((genre) => (
                        <Badge key={genre.id} variant="secondary">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {gameDetails.developers?.length > 0 && (
                    <div className="rounded-lg border p-3">
                      <p className="mb-2 font-semibold">Developers</p>
                      <div className="flex flex-wrap gap-1">
                        {gameDetails.developers.map((developer) => (
                          <Badge key={developer.id} variant="default">
                            {developer.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border p-3">
                    <p className="mb-2 font-semibold">Rating</p>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-1 h-5 w-5 text-yellow-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-lg font-medium">
                        {gameDetails.rating.toFixed(1)} / 5
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({gameDetails.ratings_count} ratings)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {gameDetails.website && (
                <div className="mt-6 flex justify-end">
                  <a
                    href={gameDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    Visit official website
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
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
