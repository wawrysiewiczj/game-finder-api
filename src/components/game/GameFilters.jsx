import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getGenres, getPlatforms } from "@/services/api";

import { SORT_OPTIONS } from "@/constants";

import {
  Search,
  SortAsc,
  Gamepad,
  Tag,
  RotateCcw,
  Sliders,
  X,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const GameFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get current filter values from URL
  const currentGenres = searchParams.get("genres") || "";
  const currentPlatforms = searchParams.get("platforms") || "";
  const currentOrdering = searchParams.get("ordering") || "-added";

  // Fetch genres and platforms
  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });

  const { data: platformsData } = useQuery({
    queryKey: ["platforms"],
    queryFn: getPlatforms,
  });

  const genres = genresData?.results || [];
  const platforms = platformsData?.results || [];

  // Update search params when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      updateFilters({ search: debouncedSearchTerm });
    } else if (searchParams.has("search")) {
      // Remove search parameter if empty
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("search");
      setSearchParams(newParams);
    }
  }, [debouncedSearchTerm]);

  // Update filters in URL
  const updateFilters = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);

    // Update params based on newFilters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (Object.keys(newFilters).some((key) => key !== "page")) {
      newParams.set("page", "1");
    }

    setSearchParams(newParams);

    // Close mobile filters after applying on mobile
    if (window.innerWidth < 768) {
      setMobileFiltersOpen(false);
    }
  };

  // Check if a genre is selected
  const isGenreSelected = (genreId) => {
    return currentGenres.split(",").some((id) => id === genreId.toString());
  };

  // Check if a platform is selected
  const isPlatformSelected = (platformId) => {
    return currentPlatforms
      .split(",")
      .some((id) => id === platformId.toString());
  };

  // Handle genre toggle
  const handleGenreToggle = (genreId) => {
    const currentGenresArray = currentGenres ? currentGenres.split(",") : [];
    let newGenres;

    if (currentGenresArray.includes(genreId.toString())) {
      newGenres = currentGenresArray
        .filter((id) => id !== genreId.toString())
        .join(",");
    } else {
      newGenres = [...currentGenresArray, genreId.toString()].join(",");
    }

    updateFilters({ genres: newGenres });
  };

  // Handle platform toggle
  const handlePlatformToggle = (platformId) => {
    const currentPlatformsArray = currentPlatforms
      ? currentPlatforms.split(",")
      : [];
    let newPlatforms;

    if (currentPlatformsArray.includes(platformId.toString())) {
      newPlatforms = currentPlatformsArray
        .filter((id) => id !== platformId.toString())
        .join(",");
    } else {
      newPlatforms = [...currentPlatformsArray, platformId.toString()].join(
        ","
      );
    }

    updateFilters({ platforms: newPlatforms });
  };

  // Handle sort change
  const handleSortChange = (value) => {
    updateFilters({ ordering: value });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSearchParams({});
  };

  // Check if any filters are applied
  const hasFilters = searchParams.toString().length > 0;

  // Count active filters by category
  const activeGenresCount = currentGenres ? currentGenres.split(",").length : 0;
  const activePlatformsCount = currentPlatforms
    ? currentPlatforms.split(",").length
    : 0;

  // Total active filters count for badge
  const totalActiveFilters =
    activeGenresCount + activePlatformsCount + (searchTerm ? 1 : 0);

  // Filter content that will be used in both desktop and mobile views
  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-muted-foreground/20 focus:border-primary/50"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div>
          <Label
            htmlFor="sort"
            className="flex items-center gap-2 mb-1.5 text-muted-foreground"
          >
            <SortAsc className="h-4 w-4" />
            <span>Sort By</span>
          </Label>
          <Select value={currentOrdering} onValueChange={handleSortChange}>
            <SelectTrigger
              id="sort"
              className="w-full bg-background/50 border-muted-foreground/20 focus:border-primary/50"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 bg-background/50 border-muted-foreground/20 hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-colors"
            onClick={resetFilters}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Filters
          </Button>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="genres" className="border-muted-foreground/20">
          <AccordionTrigger className="hover:text-primary transition-colors">
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              <span>Genres</span>
              {activeGenresCount > 0 && (
                <span className="ml-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {activeGenresCount}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <motion.div
              className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre.id}
                    variant="outline"
                    size="sm"
                    className={`rounded-full text-xs px-2.5 py-0 h-6 transition-colors ${
                      isGenreSelected(genre.id)
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                        : "bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                    }`}
                    onClick={() => handleGenreToggle(genre.id)}
                  >
                    {genre.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platforms" className="border-muted-foreground/20">
          <AccordionTrigger className="hover:text-primary transition-colors">
            <div className="flex items-center gap-1.5">
              <Gamepad className="h-4 w-4" />
              <span>Platforms</span>
              {activePlatformsCount > 0 && (
                <span className="ml-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {activePlatformsCount}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <motion.div
              className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant="outline"
                    size="sm"
                    className={`rounded-full text-xs px-2.5 py-0 h-6 transition-colors ${
                      isPlatformSelected(platform.id)
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
                        : "bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                    }`}
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    {platform.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // Mobile filter button that shows in small screens
  const MobileFilterButton = () => (
    <div className="md:hidden sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-3 border-b border-muted/30 flex justify-between items-center">
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Sliders className="h-4 w-4" />
            Filters
            {totalActiveFilters > 0 && (
              <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {totalActiveFilters}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <div className="h-full py-6 px-1 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              Filters
            </h2>
            <FiltersContent />
          </div>
        </SheetContent>
      </Sheet>

      <Select value={currentOrdering} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] h-9 text-sm bg-background/50 border-muted-foreground/20">
          <span className="flex items-center gap-2">
            <SortAsc className="h-3.5 w-3.5" />
            <SelectValue placeholder="Sort by" />
          </span>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      {/* Mobile filter button and sorting option */}
      <MobileFilterButton />

      {/* Desktop filters - hidden on mobile */}
      <div className="hidden md:block">
        <FiltersContent />
      </div>
    </>
  );
};

export default GameFilters;
