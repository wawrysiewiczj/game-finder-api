import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fetchGames } from "./lib/api";
import SearchBar from "./components/SearchBar";
import GameList from "./components/GameList";
import FilterSort from "./components/FilterSort";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ScrollArea } from "./components/ui/scroll-area";
import { ThemeProvider } from "./components/ThemeProvider";
import { Button } from "./components/ui/button";
import { ModeToggle } from "./components/ModeToggle";
import { useUrlSearchParams } from "./hooks/useUrlSearchParams";

function App() {
  const { searchParams, updateSearchParams } = useUrlSearchParams();
  // Use this ref to track if we're in the initial render
  const isInitialMount = useRef(true);

  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  // Extract values from URL params
  const searchQuery = searchParams.search || "";
  const filters = {
    ordering: searchParams.ordering || "-added",
    platforms: searchParams.platforms || "",
    genres: searchParams.genres || "",
    rating_min:
      searchParams.rating_min !== undefined
        ? parseFloat(searchParams.rating_min)
        : 0,
    rating_max:
      searchParams.rating_max !== undefined
        ? parseFloat(searchParams.rating_max)
        : 5,
  };

  const loadGames = useCallback(
    async (page = 1, query = "", filterParams = {}) => {
      try {
        setIsLoading(true);
        setIsError(false);

        const data = await fetchGames({
          pageParam: page,
          query,
          filters: filterParams,
        });

        setGames((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setHasNextPage(!!data.next);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error loading games:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load - use params from URL
  useEffect(() => {
    loadGames(1, searchQuery, filters);
    // This effect should only run once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    // Skip the first render to avoid double-loading
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (activeTab === "browse") {
      loadGames(1, searchQuery, filters);
    }
    // Dependencies include all the values from searchParams that we use, but NOT searchParams itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    filters.ordering,
    filters.platforms,
    filters.genres,
    filters.rating_min,
    filters.rating_max,
    activeTab,
    loadGames,
  ]);

  const handleSearch = useCallback(
    (query) => {
      updateSearchParams({ search: query, page: 1 });
    },
    [updateSearchParams]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      updateSearchParams({
        ...newFilters,
        page: 1,
      });
    },
    [updateSearchParams]
  );

  const fetchNextPage = async () => {
    if (hasNextPage && !isLoading) {
      await loadGames(currentPage + 1, searchQuery, filters);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="game-finder-theme">
      <div className="min-h-screen bg-background">
        {activeTab === "landing" && (
          <div className="relative">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 to-black/30"></div>
            <div className="relative h-screen bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center bg-no-repeat">
              <div className="absolute right-4 top-4 z-20">
                <ModeToggle />
              </div>
              <div className="flex h-full items-center justify-center px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-20 max-w-4xl text-center"
                >
                  <h1 className="mb-6 text-3xl font-bold text-white sm:text-5xl md:text-7xl">
                    Discover Your Next Gaming Adventure
                  </h1>
                  <p className="mb-8 text-lg text-white/80 sm:text-xl">
                    Explore thousands of games across all platforms with our
                    powerful search and filtering tools
                  </p>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setActiveTab("browse")}
                  >
                    Start Exploring
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "browse" && (
          <div className="px-4 py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-7xl"
            >
              <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="mb-2 bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
                    Game Finder
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Discover thousands of games from various platforms and
                    genres
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("landing")}
                    className="h-9"
                  >
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("about")}
                    className="h-9"
                  >
                    About
                  </Button>
                  <ModeToggle />
                </div>
              </header>

              <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
              <FilterSort
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />

              <GameList
                games={games}
                isLoading={isLoading}
                isError={isError}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
              />
            </motion.div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="min-h-screen bg-background px-4 py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-4xl"
            >
              <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  About Game Finder
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("landing")}
                    className="h-9"
                  >
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("browse")}
                    className="h-9"
                  >
                    Browse Games
                  </Button>
                  <ModeToggle />
                </div>
              </header>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p>
                  Game Finder is a modern web application built with React.js
                  that allows users to discover and explore video games from
                  various platforms and genres.
                </p>

                <h2>Features</h2>
                <ul>
                  <li>Search for games by title</li>
                  <li>Filter games by platform, genre, and rating</li>
                  <li>Sort games by different criteria</li>
                  <li>View detailed information about each game</li>
                  <li>Browse game screenshots</li>
                  <li>Infinite scroll loading for seamless browsing</li>
                  <li>Responsive design that works on all devices</li>
                  <li>Light and dark mode support</li>
                  <li>URL-based filtering and searching for easy sharing</li>
                </ul>

                <h2>Technology Stack</h2>
                <ul>
                  <li>React.js for building the user interface</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Shadcn UI for accessible UI components</li>
                  <li>Framer Motion for animations</li>
                  <li>RAWG API for game data</li>
                </ul>

                <h2>About the Developer</h2>
                <p>
                  This project was built to demonstrate proficiency in modern
                  web development technologies, particularly in creating
                  responsive and interactive user interfaces with React.js and
                  integrating with third-party APIs.
                </p>

                <p>
                  The source code for this project is available on GitHub, where
                  you can explore the implementation details and see how various
                  features were implemented.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    onClick={() => setActiveTab("browse")}
                    className="sm:mr-4"
                  >
                    Browse Games
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href="https://github.com/your-username/game-finder"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <footer className="mt-16 border-t py-6 text-center text-sm text-muted-foreground sm:py-8">
          <div className="mx-auto max-w-7xl px-4">
            <p>
              Powered by{" "}
              <a
                href="https://rawg.io/apidocs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                RAWG API
              </a>
            </p>
            <p className="mt-1">
              Created with React, Tailwind CSS, Shadcn UI, and Framer Motion
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
