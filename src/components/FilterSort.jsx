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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);

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

    // Close the filter panel
    setIsOpen(false);
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

    // Close the filter panel
    setIsOpen(false);
  }, [
    onFilterChange,
    selectedSort,
    tempPlatforms,
    tempGenres,
    tempRatingRange,
  ]);

  // Initialize temp filters when drawer/sheet opens
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
    <div className="grid gap-6 px-1 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Rating</h3>
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
            <span>{tempRatingRange[0]}</span>
            <span>{tempRatingRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Platforms</h3>
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
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Genres</h3>
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
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 mt-4 rounded-lg border bg-card p-4 shadow-md"
    >
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
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

        {isDesktop ? (
          <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
              >
                Filters
                {filterCount > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {filterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="min-w-[350px] sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Games</SheetTitle>
                <SheetDescription>
                  Refine your results with multiple filters
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                <FilterPanel />
              </ScrollArea>
              <SheetFooter className="mt-4 flex-row gap-3 sm:justify-between">
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
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ) : (
          <Drawer open={isOpen} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
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
        )}
      </div>
    </motion.div>
  );
};

export default FilterSort;
