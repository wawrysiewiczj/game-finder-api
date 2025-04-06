import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fetchGames } from "./lib/api";
import SearchBar from "./components/SearchBar";
import GameList from "./components/GameList";
import FilterSort from "./components/FilterSort";
import Sidebar from "./components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ScrollArea } from "./components/ui/scroll-area";
import { ThemeProvider } from "./components/ThemeProvider";
import { Button } from "./components/ui/button";
import { ModeToggle } from "./components/ModeToggle";
import { useUrlSearchParams } from "./hooks/useUrlSearchParams";
import { Badge } from "./components/ui/badge";
import { cn } from "./lib/utils";

function App() {
  const { searchParams, updateSearchParams } = useUrlSearchParams();
  // Use this ref to track if we're in the initial render
  const isInitialMount = useRef(true);

  const [games, setGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  // Load featured games for the landing page
  const loadFeaturedGames = useCallback(async () => {
    try {
      const [popularData, newReleasesData, topRatedData] = await Promise.all([
        fetchGames({
          pageParam: 1,
          filters: { ordering: "-metacritic", page_size: 4 },
        }),
        fetchGames({
          pageParam: 1,
          filters: { ordering: "-released", page_size: 4 },
        }),
        fetchGames({
          pageParam: 1,
          filters: { ordering: "-rating", page_size: 4 },
        }),
      ]);

      setPopularGames(popularData.results || []);
      setNewReleases(newReleasesData.results || []);
      setTopRated(topRatedData.results || []);
    } catch (error) {
      console.error("Error loading featured games:", error);
    }
  }, []);

  // Initial load - use params from URL
  useEffect(() => {
    loadGames(1, searchQuery, filters);
    loadFeaturedGames();
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

  const handleGameCardClick = (game) => {
    // For landing page, navigate to browse when clicking a game
    if (activeTab === "landing") {
      setActiveTab("browse");
      handleSearch(game.name);
    }
  };

  // Landing page hero section
  const HeroSection = () => (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
        >
          <source
            src="https://player.vimeo.com/external/435674703.sd.mp4?s=01ad1ba21dc72c1d34728e1b43a49df6684ca753&profile_id=165&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl text-center"
      >
        <h1 className="mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl md:text-7xl">
          Discover Your Next Gaming Adventure
        </h1>
        <p className="mb-8 text-lg text-white/90 sm:text-xl">
          Explore thousands of games across all platforms with our powerful
          search and filtering tools
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            onClick={() => setActiveTab("browse")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Browse All Games
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              document
                .getElementById("featured-games")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="border-white/20 text-white hover:bg-white/10"
          >
            Explore Featured Games
          </Button>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="animate-bounce"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-white"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </div>
    </div>
  );

  // FeaturedGamesSection for landing page
  const FeaturedGamesSection = () => (
    <div id="featured-games" className="bg-background px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Featured Games
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover the most popular, newest, and highest-rated games across
            all platforms
          </p>
        </div>

        <div className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center text-2xl font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6 text-primary"
              >
                <path d="M17 4c-4.2 0-7 2.8-7 7 0 4.2 2.8 7 7 7s7-2.8 7-7-2.8-7-7-7Z" />
                <path d="M17 18v4M7 18v4M7 4c-4.2 0-7 2.8-7 7 0 4.2 2.8 7 7 7s7-2.8 7-7-2.8-7-7-7Z" />
              </svg>
              Popular Games
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setActiveTab("browse");
                handleFilterChange({
                  ordering: "-metacritic",
                  platforms: "",
                  genres: "",
                });
              }}
              className="text-sm"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-4 w-4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularGames.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleGameCardClick(game)}
                className="group cursor-pointer overflow-hidden rounded-lg border bg-card shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={game.background_image || "/placeholder-game.jpg"}
                    alt={game.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {game.metacritic && (
                    <div className="absolute right-2 top-2">
                      <Badge
                        variant="default"
                        className="bg-green-500 font-medium hover:bg-green-600"
                      >
                        {game.metacritic}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="line-clamp-1 text-base font-bold">
                    {game.name}
                  </h4>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {game.released
                      ? new Date(game.released).getFullYear()
                      : "TBA"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center text-2xl font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6 text-primary"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              New Releases
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setActiveTab("browse");
                handleFilterChange({
                  ordering: "-released",
                  platforms: "",
                  genres: "",
                });
              }}
              className="text-sm"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-4 w-4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newReleases.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleGameCardClick(game)}
                className="group cursor-pointer overflow-hidden rounded-lg border bg-card shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={game.background_image || "/placeholder-game.jpg"}
                    alt={game.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute right-2 top-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 font-medium text-white hover:bg-blue-600"
                    >
                      New
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="line-clamp-1 text-base font-bold">
                    {game.name}
                  </h4>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Released: {new Date(game.released).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center text-2xl font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6 text-primary"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Top Rated
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setActiveTab("browse");
                handleFilterChange({
                  ordering: "-rating",
                  platforms: "",
                  genres: "",
                });
              }}
              className="text-sm"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-4 w-4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topRated.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleGameCardClick(game)}
                className="group cursor-pointer overflow-hidden rounded-lg border bg-card shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={game.background_image || "/placeholder-game.jpg"}
                    alt={game.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500 font-medium text-white hover:bg-yellow-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-1 h-3 w-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {game.rating.toFixed(1)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="line-clamp-1 text-base font-bold">
                    {game.name}
                  </h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {game.genres?.slice(0, 2).map((genre) => (
                      <span
                        key={genre.id}
                        className="text-xs text-muted-foreground"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Categories section
  const CategoriesSection = () => (
    <div className="bg-muted px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore games by your favorite genres and platforms
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[
            { name: "Action", icon: "🎯", id: 4 },
            { name: "Adventure", icon: "🏝️", id: 3 },
            { name: "RPG", icon: "⚔️", id: 5 },
            { name: "Shooter", icon: "🔫", id: 2 },
            { name: "Strategy", icon: "🧠", id: 10 },
            { name: "Puzzle", icon: "🧩", id: 7 },
            { name: "Racing", icon: "🏎️", id: 1 },
            { name: "Sports", icon: "⚽", id: 15 },
            { name: "Fighting", icon: "👊", id: 6 },
            { name: "Platformer", icon: "🏃", id: 83 },
            { name: "Simulation", icon: "🧪", id: 14 },
            { name: "Casual", icon: "🎮", id: 40 },
          ].map((category) => (
            <motion.div
              key={category.name}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setActiveTab("browse");
                handleFilterChange({
                  genres: category.id.toString(),
                  platforms: "",
                  ordering: "-added",
                });
              }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-card p-4 text-center shadow-sm hover:shadow-md"
            >
              <span className="text-3xl">{category.icon}</span>
              <span className="mt-2 text-sm font-medium">{category.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="game-finder-theme">
      <div className="min-h-screen bg-background">
        {/* Global Navigation */}
        <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4">
            <div className="flex items-center gap-6">
              {/* Only show the mobile menu trigger on browse page */}
              {activeTab === "browse" && (
                <div className="md:hidden">
                  <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    initialQuery={searchQuery}
                    initialFilters={filters}
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    isMobileOnly={true}
                  />
                </div>
              )}

              <h1
                className="cursor-pointer bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 bg-clip-text text-2xl font-bold text-transparent"
                onClick={() => setActiveTab("landing")}
              >
                Game Finder
              </h1>
              <nav className="hidden items-center space-x-1 sm:flex">
                <Button
                  variant={activeTab === "landing" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("landing")}
                  className="h-9"
                >
                  Home
                </Button>
                <Button
                  variant={activeTab === "browse" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("browse")}
                  className="h-9"
                >
                  Browse
                </Button>
                <Button
                  variant={activeTab === "about" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("about")}
                  className="h-9"
                >
                  About
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Main content with conditional sidebar */}
        <main
          className={cn(
            "pt-16",
            activeTab === "browse" && !isSidebarCollapsed
              ? "md:pl-[260px]"
              : activeTab === "browse" && isSidebarCollapsed
              ? "md:pl-[60px]"
              : ""
          )}
        >
          {activeTab === "landing" && (
            <div>
              <HeroSection />
              <FeaturedGamesSection />
              <CategoriesSection />
            </div>
          )}

          {activeTab === "browse" && (
            <>
              {/* Render sidebar only for Browse mode */}
              <div className="hidden md:block">
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onFilterChange={handleFilterChange}
                  onSearch={handleSearch}
                  initialQuery={searchQuery}
                  initialFilters={filters}
                  isCollapsed={isSidebarCollapsed}
                  setIsCollapsed={setIsSidebarCollapsed}
                />
              </div>

              <div className="px-4 py-6 sm:py-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto max-w-7xl"
                >
                  {/* Show these components only on mobile when sidebar is hidden */}
                  <div className="mb-6 block md:hidden">
                    <SearchBar
                      onSearch={handleSearch}
                      initialQuery={searchQuery}
                    />
                    <FilterSort
                      onFilterChange={handleFilterChange}
                      initialFilters={filters}
                    />
                  </div>

                  <GameList
                    games={games}
                    isLoading={isLoading}
                    isError={isError}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                  />
                </motion.div>
              </div>
            </>
          )}

          {activeTab === "about" && (
            <div className="min-h-screen bg-background px-4 py-6 sm:py-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-4xl"
              >
                <div className="rounded-lg border bg-card p-6 shadow-md">
                  <h1 className="mb-6 bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                    About Game Finder
                  </h1>

                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p>
                      Game Finder is a comprehensive platform designed to help
                      gamers discover new and exciting games across various
                      platforms and genres. Our mission is to make game
                      discovery easy and enjoyable.
                    </p>

                    <h2>Features</h2>
                    <ul>
                      <li>
                        Search through thousands of games from various platforms
                      </li>
                      <li>Filter by platforms, genres, and ratings</li>
                      <li>Sort by popularity, release date, and more</li>
                      <li>View detailed information about each game</li>
                      <li>Discover new and trending games</li>
                    </ul>

                    <h2>How It Works</h2>
                    <p>
                      Game Finder uses the RAWG Video Games Database API to
                      provide up-to-date information about thousands of games.
                      Our intuitive interface allows you to easily find games
                      that match your preferences and interests.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                      Have questions, suggestions, or feedback? Feel free to
                      reach out to us at{" "}
                      <a href="mailto:info@gamefinder.com">
                        info@gamefinder.com
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </main>

        {/* Footer with responsive sidebar margin */}
        <footer
          className={cn(
            "border-t bg-background px-4 py-8",
            activeTab === "browse" && !isSidebarCollapsed
              ? "md:pl-[260px]"
              : activeTab === "browse" && isSidebarCollapsed
              ? "md:pl-[60px]"
              : ""
          )}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-lg font-bold">Game Finder</h3>
                <p className="text-sm text-muted-foreground">
                  Your ultimate platform for discovering new and exciting games
                  across all platforms.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setActiveTab("landing")}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setActiveTab("browse")}
                    >
                      Browse Games
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setActiveTab("about")}
                    >
                      About
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-bold">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://rawg.io/apidocs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      RAWG API
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-bold">Connect</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} Game Finder. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
