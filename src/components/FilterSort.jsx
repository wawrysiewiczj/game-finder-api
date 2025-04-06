import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useDebounce } from "../hooks/useDebounce";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Separator } from "./ui/separator";

const platforms = [
  { id: 4, name: "PC" },
  { id: 187, name: "PlayStation 5" },
  { id: 18, name: "PlayStation 4" },
  { id: 1, name: "Xbox One" },
  { id: 186, name: "Xbox Series S/X" },
  { id: 7, name: "Nintendo Switch" },
  { id: 3, name: "iOS" },
  { id: 21, name: "Android" },
];

const genres = [
  { id: 4, name: "Action" },
  { id: 51, name: "Indie" },
  { id: 3, name: "Adventure" },
  { id: 5, name: "RPG" },
  { id: 10, name: "Strategy" },
  { id: 2, name: "Shooter" },
  { id: 40, name: "Casual" },
  { id: 14, name: "Simulation" },
  { id: 7, name: "Puzzle" },
  { id: 11, name: "Arcade" },
  { id: 83, name: "Platformer" },
  { id: 1, name: "Racing" },
  { id: 59, name: "Massively Multiplayer" },
  { id: 15, name: "Sports" },
  { id: 6, name: "Fighting" },
  { id: 19, name: "Family" },
  { id: 28, name: "Board Games" },
  { id: 34, name: "Educational" },
  { id: 17, name: "Card" },
];

const sortOptions = [
  { value: "-added", label: "Date added" },
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
  { value: "-released", label: "Release date" },
  { value: "-metacritic", label: "Popularity" },
  { value: "-rating", label: "Average rating" },
];

const FilterSort = ({ onFilterChange, initialFilters = {} }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [selectedSort, setSelectedSort] = useState(
    initialFilters.ordering || "-added"
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState(() => {
    return initialFilters.platforms
      ? initialFilters.platforms.split(",").map((id) => parseInt(id, 10))
      : [];
  });
  const [selectedGenres, setSelectedGenres] = useState(() => {
    return initialFilters.genres
      ? initialFilters.genres.split(",").map((id) => parseInt(id, 10))
      : [];
  });
  const [ratingRange, setRatingRange] = useState(() => {
    return [
      initialFilters.rating_min !== undefined
        ? parseFloat(initialFilters.rating_min)
        : 0,
      initialFilters.rating_max !== undefined
        ? parseFloat(initialFilters.rating_max)
        : 5,
    ];
  });

  // Temporary filter states for the filter panel
  const [tempPlatforms, setTempPlatforms] = useState(selectedPlatforms);
  const [tempGenres, setTempGenres] = useState(selectedGenres);
  const [tempRatingRange, setTempRatingRange] = useState(ratingRange);

  // Debounced sort value
  const debouncedSort = useDebounce(selectedSort, 300);

  const handleSortChange = (value) => {
    setSelectedSort(value);
  };

  const handlePlatformChange = (platformId) => {
    setTempPlatforms((prev) => {
      if (prev.includes(platformId)) {
        return prev.filter((id) => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  const handleGenreChange = (genreId) => {
    setTempGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const handleRatingChange = (value) => {
    setTempRatingRange(value);
  };

  const handleReset = () => {
    // Reset temporary filter states
    setTempPlatforms([]);
    setTempGenres([]);
    setTempRatingRange([0, 5]);

    // Reset actual states
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setRatingRange([0, 5]);
    setSelectedSort("-added");

    // Apply changes
    onFilterChange({
      ordering: "-added",
      platforms: "",
      genres: "",
      rating_min: 0,
      rating_max: 5,
    });

    // Close the filter panel on mobile
    if (!isDesktop) {
      setIsOpen(false);
    }
  };

  // Apply filters from the panel
  const handleApplyFilters = useCallback(() => {
    // Update the actual filter states
    setSelectedPlatforms(tempPlatforms);
    setSelectedGenres(tempGenres);
    setRatingRange(tempRatingRange);

    // Apply all filters
    onFilterChange({
      ordering: selectedSort,
      platforms: tempPlatforms.join(","),
      genres: tempGenres.join(","),
      rating_min: tempRatingRange[0],
      rating_max: tempRatingRange[1],
    });

    // Close the filter panel on mobile
    if (!isDesktop) {
      setIsOpen(false);
    }
  }, [
    onFilterChange,
    selectedSort,
    tempPlatforms,
    tempGenres,
    tempRatingRange,
    isDesktop,
  ]);

  // Initialize temp filters when drawer/sidebar activates
  const handleOpenChange = (open) => {
    if (open) {
      setTempPlatforms(selectedPlatforms);
      setTempGenres(selectedGenres);
      setTempRatingRange(ratingRange);
    }
    setIsOpen(open);
  };

  // Apply sorting when debounced sort value changes
  useEffect(() => {
    if (debouncedSort !== initialFilters.ordering) {
      onFilterChange({
        ...initialFilters,
        ordering: debouncedSort,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSort]);

  // Get active filter count for badge
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedPlatforms.length > 0) count += 1;
    if (selectedGenres.length > 0) count += 1;
    if (ratingRange[0] > 0 || ratingRange[1] < 5) count += 1;
    return count;
  };

  const filterCount = getActiveFilterCount();

  const FilterPanel = () => (
    <div className="grid gap-6 px-1">
      <Accordion type="multiple" defaultValue={["rating"]} className="w-full">
        <AccordionItem value="rating">
          <AccordionTrigger className="text-base font-medium">
            Rating Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <Slider
                value={tempRatingRange}
                onValueChange={handleRatingChange}
                max={5}
                step={0.5}
                minStepsBetweenThumbs={1}
                className="mt-2"
                aria-label="Rating range"
              />
              <div className="mt-2 flex justify-between text-sm">
                <span className="font-medium">{tempRatingRange[0]}</span>
                <span className="font-medium">{tempRatingRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platforms">
          <AccordionTrigger className="text-base font-medium">
            Platforms {tempPlatforms.length > 0 && `(${tempPlatforms.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform.id}`}
                    checked={tempPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformChange(platform.id)}
                  />
                  <Label
                    htmlFor={`platform-${platform.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="genres">
          <AccordionTrigger className="text-base font-medium">
            Genres {tempGenres.length > 0 && `(${tempGenres.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {genres.map((genre) => (
                <div key={genre.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre.id}`}
                    checked={tempGenres.includes(genre.id)}
                    onCheckedChange={() => handleGenreChange(genre.id)}
                  />
                  <Label
                    htmlFor={`genre-${genre.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {genre.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  const SortControls = () => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-foreground">Sort by:</span>
      <Select value={selectedSort} onValueChange={handleSortChange}>
        <SelectTrigger className="h-10 w-full min-w-44 sm:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Render desktop sidebar
  const DesktopSidebar = () => (
    <motion.div
      initial={{ x: isSidebarCollapsed ? -250 : 0 }}
      animate={{ x: isSidebarCollapsed ? -250 : 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-4 h-[calc(100vh-6rem)] w-[280px] overflow-hidden rounded-lg border bg-card shadow-md"
    >
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="h-8 w-8"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pb-4 pt-2">
        <div className="px-4">
          <FilterPanel />
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 border-t bg-card p-4">
        <div className="grid gap-2">
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset All
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // Button to toggle collapsed sidebar
  const CollapsedSidebarButton = () => (
    <motion.button
      initial={{ x: isSidebarCollapsed ? 0 : -60 }}
      animate={{ x: isSidebarCollapsed ? 0 : -60 }}
      transition={{ duration: 0.3 }}
      onClick={() => setIsSidebarCollapsed(false)}
      className="fixed left-0 top-1/2 z-20 -translate-y-1/2 rounded-r-lg border bg-card p-2 shadow-md"
      aria-label="Show filters"
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M3 6h18M7 12h10m-8 6h6" />
        </svg>
        <span className="text-xs font-medium">Filters</span>
        {filterCount > 0 && (
          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {filterCount}
          </span>
        )}
      </div>
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 mt-4"
    >
      {isDesktop ? (
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <DesktopSidebar />
          <CollapsedSidebarButton />

          {/* Main content area */}
          <div className="w-full flex-1">
            <div className="rounded-lg border bg-card p-4 shadow-md">
              <SortControls />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-4 shadow-md">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
            <SortControls />

            <Drawer open={isOpen} onOpenChange={handleOpenChange}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="flex w-full items-center gap-2 sm:w-auto"
                >
                  Filters
                  {filterCount > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {filterCount}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter Games</DrawerTitle>
                  <DrawerDescription>
                    Refine your results with multiple filters
                  </DrawerDescription>
                </DrawerHeader>
                <div className="max-h-[70vh] overflow-y-auto px-4">
                  <FilterPanel />
                </div>
                <DrawerFooter className="flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Apply Filters
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FilterSort;
