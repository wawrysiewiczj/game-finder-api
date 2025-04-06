import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
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
import { useDebounce } from "../hooks/useDebounce";

// Icons
const HomeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BrowseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <path d="M17 9V5H7v4" />
    <path d="M12 13V5" />
    <rect width="14" height="14" x="5" y="5" rx="2" />
    <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="m21 15-3-3v8" />
  </svg>
);

const InfoIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const ActionIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <path d="M12.5 8.8v-.8h-.8l-1.19 1.19ZM17 12l-2.5-2.5" />
    <path d="m8 17 1-.34v-.46l-1.8-1.8" />
    <path d="M7.5 13 9 14.5l-1.5.5M11 15.5l.4 1.6 1.6.4m4-8-2 2" />
    <path d="M3 8a13.77 13.77 0 0 0 2 6c1.1-1.13 1.09-1.95 1.78-2.34l.84-.4a1.19 1.19 0 0 1 1.05.2.88.88 0 0 1 .21.75c-.17 2.6 1.83 4.04 3.12 4.79M6.03 9.24C8.61 7.79 12.54 8.2 15 10" />
    <path d="M18.7 14.5 15 12l1.34-1.34a1.2 1.2 0 0 1 .86-.35 1.2 1.2 0 0 1 .86.35l1.64 1.64a1.2 1.2 0 0 1 .35.85c0 .32-.13.62-.35.85Z" />
  </svg>
);

const SearchIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const FilterIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const SortIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <path d="M3 6h18M7 12h10m-14 6h18" />
  </svg>
);

const RPGIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
    <path d="m11 8v6" />
    <path d="m8 11h6" />
  </svg>
);

const ShooterIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <path d="M22 9a2 2 0 0 0-2-2h-12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z" />
    <path d="M10 13V9" />
    <path d="M14 13V9" />
    <path d="M2 9v6" />
    <path d="M6 9v6" />
  </svg>
);

const ChevronLeftIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-4 w-4", props.className)}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const MenuIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-5 w-5", props.className)}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

// Data for filters
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
  { id: 4, name: "Action", icon: ActionIcon },
  { id: 51, name: "Indie", icon: null },
  { id: 3, name: "Adventure", icon: null },
  { id: 5, name: "RPG", icon: RPGIcon },
  { id: 10, name: "Strategy", icon: null },
  { id: 2, name: "Shooter", icon: ShooterIcon },
  { id: 40, name: "Casual", icon: null },
  { id: 14, name: "Simulation", icon: null },
  { id: 7, name: "Puzzle", icon: null },
  { id: 11, name: "Arcade", icon: null },
  { id: 83, name: "Platformer", icon: null },
  { id: 1, name: "Racing", icon: null },
  { id: 59, name: "Massively Multiplayer", icon: null },
  { id: 15, name: "Sports", icon: null },
  { id: 6, name: "Fighting", icon: null },
];

const sortOptions = [
  { value: "-added", label: "Date added" },
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
  { value: "-released", label: "Release date" },
  { value: "-metacritic", label: "Popularity" },
  { value: "-rating", label: "Average rating" },
];

// Genre badges with color variants
const GenreBadge = ({ name, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all",
      isActive
        ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(124,58,237,0.5)]"
        : "bg-muted/80 text-foreground/70 hover:bg-muted/50"
    )}
  >
    {Icon && <Icon className="h-3.5 w-3.5" />}
    {name}
  </button>
);

const Sidebar = ({
  activeTab,
  setActiveTab,
  onFilterChange,
  onSearch,
  initialQuery = "",
  initialFilters = {},
  isCollapsed = false,
  setIsCollapsed = () => {},
  isMobileOnly = false,
}) => {
  const [showOnMobile, setShowOnMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Filter states
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

  // Temporary filter states
  const [tempPlatforms, setTempPlatforms] = useState(selectedPlatforms);
  const [tempGenres, setTempGenres] = useState(selectedGenres);
  const [tempRatingRange, setTempRatingRange] = useState(ratingRange);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Apply search when debounced value changes
  React.useEffect(() => {
    if (debouncedSearch !== initialQuery) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, initialQuery, onSearch]);

  // Handle sort change
  const handleSortChange = (value) => {
    setSelectedSort(value);
    onFilterChange({ ordering: value });
  };

  // Handle platform selection
  const handlePlatformChange = (platformId) => {
    setTempPlatforms((prev) => {
      if (prev.includes(platformId)) {
        return prev.filter((id) => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  // Handle genre selection
  const handleGenreChange = (genreId) => {
    setTempGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  // Handle rating range change
  const handleRatingChange = (value) => {
    setTempRatingRange(value);
  };

  // Reset all filters
  const handleReset = () => {
    setTempPlatforms([]);
    setTempGenres([]);
    setTempRatingRange([0, 5]);
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setRatingRange([0, 5]);
    setSelectedSort("-added");
    setSearchQuery("");

    onFilterChange({
      ordering: "-added",
      platforms: "",
      genres: "",
      rating_min: 0,
      rating_max: 5,
    });
    onSearch("");

    if (showOnMobile) {
      setShowOnMobile(false);
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    setSelectedPlatforms(tempPlatforms);
    setSelectedGenres(tempGenres);
    setRatingRange(tempRatingRange);

    onFilterChange({
      ordering: selectedSort,
      platforms: tempPlatforms.join(","),
      genres: tempGenres.join(","),
      rating_min: tempRatingRange[0],
      rating_max: tempRatingRange[1],
    });

    if (showOnMobile) {
      setShowOnMobile(false);
    }
  };

  // Get active filter count for badge
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedPlatforms.length > 0) count += 1;
    if (selectedGenres.length > 0) count += 1;
    if (ratingRange[0] > 0 || ratingRange[1] < 5) count += 1;
    if (searchQuery) count += 1;
    return count;
  };

  const filterCount = getActiveFilterCount();

  // Filter panel content
  const FilterPanel = () => (
    <div className="grid gap-6 px-1">
      {/* Search Input */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Search
        </h3>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <Separator className="bg-muted/50" />

      {/* Sort Dropdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Sort by
        </h3>
        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="h-10 w-full">
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

      <Separator className="bg-muted/50" />

      {/* Filters in Accordions */}
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

  // Mobile Drawer
  const MobileSidebar = () => (
    <Sheet open={showOnMobile} onOpenChange={setShowOnMobile}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <div className="flex items-center">
            <FilterIcon className="h-5 w-5" />
            {filterCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {filterCount}
              </span>
            )}
          </div>
          <span className="sr-only">Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] p-0 sm:max-w-sm">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="text-xl font-bold">Filters & Search</h2>
          </div>
          <ScrollArea className="flex-1 px-4 py-6">
            <FilterPanel />
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Reset
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1">
                Apply
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <motion.div
      initial={{ x: isCollapsed ? -240 : 0 }}
      animate={{ x: isCollapsed ? -240 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-[260px] flex-col border-r bg-card shadow-md md:flex"
    >
      <ScrollArea className="flex-1">
        <div className={cn("px-4 py-6", isCollapsed && "invisible")}>
          <h2 className="mb-6 text-xl font-bold">Filter & Search</h2>
          <FilterPanel />
        </div>
      </ScrollArea>

      <div className={cn("border-t p-4", isCollapsed && "invisible")}>
        <div className="grid gap-2">
          <Button variant="outline" onClick={handleReset} className="w-full">
            Reset All
          </Button>
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Sidebar Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 h-8 w-8 rounded-full border bg-background shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronLeftIcon
          className={isCollapsed ? "rotate-180 transform" : ""}
        />
        <span className="sr-only">
          {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        </span>
      </Button>
    </motion.div>
  );

  // Mini collapsed sidebar
  const CollapsedSidebar = () => (
    <div className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-[60px] flex-col border-r bg-card shadow-md md:flex">
      <div className="flex flex-col items-center gap-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => setIsCollapsed(false)}
          title="Expand filters"
        >
          <FilterIcon className="h-5 w-5" />
          {filterCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {filterCount}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => {
            setIsCollapsed(false);
            document
              .querySelector('input[placeholder="Search games..."]')
              .focus();
          }}
          title="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => {
            setIsCollapsed(false);
            // Focus the sort dropdown when expanded
          }}
          title="Sort"
        >
          <SortIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Expand button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 h-8 w-8 rounded-full border bg-background shadow-md"
        onClick={() => setIsCollapsed(false)}
      >
        <ChevronLeftIcon className="rotate-180 transform" />
        <span className="sr-only">Expand Sidebar</span>
      </Button>
    </div>
  );

  // If this is only for mobile
  if (isMobileOnly) {
    return <MobileSidebar />;
  }

  return (
    <>
      <MobileSidebar />
      {!isCollapsed ? <DesktopSidebar /> : <CollapsedSidebar />}
    </>
  );
};

export default Sidebar;
