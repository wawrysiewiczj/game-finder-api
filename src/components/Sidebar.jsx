import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";

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

const StarIcon = (props) => (
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
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
  isCollapsed = false,
  setIsCollapsed = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);
  const [showOnMobile, setShowOnMobile] = useState(false);

  const platforms = [
    { id: 4, name: "PC" },
    { id: 187, name: "PlayStation 5" },
    { id: 18, name: "PlayStation 4" },
    { id: 1, name: "Xbox One" },
    { id: 186, name: "Xbox Series S/X" },
    { id: 7, name: "Nintendo Switch" },
  ];

  const popularGenres = [
    { id: 4, name: "Action", icon: ActionIcon },
    { id: 5, name: "RPG", icon: RPGIcon },
    { id: 2, name: "Shooter", icon: ShooterIcon },
    { id: 3, name: "Adventure", icon: null },
    { id: 10, name: "Strategy", icon: null },
    { id: 51, name: "Indie", icon: null },
  ];

  const handlePlatformClick = (platformId) => {
    const newActiveId = activePlatform === platformId ? null : platformId;
    setActivePlatform(newActiveId);

    if (onFilterChange) {
      onFilterChange({
        platforms: newActiveId ? newActiveId.toString() : "",
      });
    }

    if (showOnMobile) {
      setShowOnMobile(false);
    }
  };

  const handleGenreClick = (genreId) => {
    const newActiveId = activeGenre === genreId ? null : genreId;
    setActiveGenre(newActiveId);

    if (onFilterChange) {
      onFilterChange({
        genres: newActiveId ? newActiveId.toString() : "",
      });
    }

    if (showOnMobile) {
      setShowOnMobile(false);
    }
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (showOnMobile) {
      setShowOnMobile(false);
    }
  };

  // Mobile Drawer
  const MobileSidebar = () => (
    <Sheet open={showOnMobile} onOpenChange={setShowOnMobile}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] p-0 sm:max-w-sm">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 bg-clip-text text-xl font-bold text-transparent">
              Game Finder
            </h2>
          </div>
          <ScrollArea className="flex-1 px-4 py-6">
            <nav className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Navigation
                </h3>
                <div className="space-y-1">
                  <Button
                    variant={activeTab === "landing" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavClick("landing")}
                  >
                    <HomeIcon className="mr-2" />
                    Home
                  </Button>
                  <Button
                    variant={activeTab === "browse" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavClick("browse")}
                  >
                    <BrowseIcon className="mr-2" />
                    Browse
                  </Button>
                  <Button
                    variant={activeTab === "about" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavClick("about")}
                  >
                    <InfoIcon className="mr-2" />
                    About
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Popular Platforms
                </h3>
                <div className="space-y-1">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant={
                        activePlatform === platform.id ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => handlePlatformClick(platform.id)}
                    >
                      {platform.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Popular Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularGenres.map((genre) => (
                    <GenreBadge
                      key={genre.id}
                      name={genre.name}
                      icon={genre.icon}
                      isActive={activeGenre === genre.id}
                      onClick={() => handleGenreClick(genre.id)}
                    />
                  ))}
                </div>
              </div>
            </nav>
          </ScrollArea>
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
          <nav className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Navigation
              </h3>
              <div className="space-y-1">
                <Button
                  variant={activeTab === "landing" ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    activeTab === "landing" &&
                      "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
                  )}
                  onClick={() => handleNavClick("landing")}
                >
                  <HomeIcon className="mr-2" />
                  Home
                </Button>
                <Button
                  variant={activeTab === "browse" ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    activeTab === "browse" &&
                      "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
                  )}
                  onClick={() => handleNavClick("browse")}
                >
                  <BrowseIcon className="mr-2" />
                  Browse
                </Button>
                <Button
                  variant={activeTab === "about" ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    activeTab === "about" &&
                      "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
                  )}
                  onClick={() => handleNavClick("about")}
                >
                  <InfoIcon className="mr-2" />
                  About
                </Button>
              </div>
            </div>

            <Separator className="bg-muted/50" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Popular Platforms
                </h3>
                {activePlatform && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handlePlatformClick(null)}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant={
                      activePlatform === platform.id ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start",
                      activePlatform === platform.id &&
                        "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
                    )}
                    onClick={() => handlePlatformClick(platform.id)}
                  >
                    {platform.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-muted/50" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Popular Genres
                </h3>
                {activeGenre && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleGenreClick(null)}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {popularGenres.map((genre) => (
                  <GenreBadge
                    key={genre.id}
                    name={genre.name}
                    icon={genre.icon}
                    isActive={activeGenre === genre.id}
                    onClick={() => handleGenreClick(genre.id)}
                  />
                ))}
              </div>
            </div>

            <Separator className="bg-muted/50" />

            <div className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Top Rated
              </h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-accent/80"
                  onClick={() => {
                    setActiveTab("browse");
                    if (onFilterChange) {
                      onFilterChange({ ordering: "-rating" });
                    }
                  }}
                >
                  <StarIcon className="mr-2 text-yellow-500" />
                  Highest Rated
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-accent/80"
                  onClick={() => {
                    setActiveTab("browse");
                    if (onFilterChange) {
                      onFilterChange({ ordering: "-metacritic" });
                    }
                  }}
                >
                  <StarIcon className="mr-2 text-green-500" />
                  Popular Games
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </ScrollArea>

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

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />

      {/* Collapsed sidebar mini version */}
      {isCollapsed && (
        <div className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-[60px] flex-col border-r bg-card shadow-md md:flex">
          <div className="flex flex-col items-center gap-4 py-4">
            <Button
              variant={activeTab === "landing" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => handleNavClick("landing")}
              className={cn(
                "h-10 w-10",
                activeTab === "landing" &&
                  "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
              )}
            >
              <HomeIcon />
            </Button>
            <Button
              variant={activeTab === "browse" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => handleNavClick("browse")}
              className={cn(
                "h-10 w-10",
                activeTab === "browse" &&
                  "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
              )}
            >
              <BrowseIcon />
            </Button>
            <Button
              variant={activeTab === "about" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => handleNavClick("about")}
              className={cn(
                "h-10 w-10",
                activeTab === "about" &&
                  "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
              )}
            >
              <InfoIcon />
            </Button>

            <Separator className="my-2 w-8 bg-muted/50" />

            {platforms.slice(0, 3).map((platform) => (
              <Button
                key={platform.id}
                variant={activePlatform === platform.id ? "secondary" : "ghost"}
                size="icon"
                onClick={() => handlePlatformClick(platform.id)}
                className={cn(
                  "h-10 w-10",
                  activePlatform === platform.id &&
                    "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
                )}
              >
                <span className="text-xs font-bold">
                  {platform.name.substring(0, 2)}
                </span>
              </Button>
            ))}

            <Separator className="my-2 w-8 bg-muted/50" />

            {popularGenres.slice(0, 3).map((genre) => (
              <Button
                key={genre.id}
                variant={activeGenre === genre.id ? "secondary" : "ghost"}
                size="icon"
                onClick={() => handleGenreClick(genre.id)}
                className={cn(
                  "h-10 w-10",
                  activeGenre === genre.id &&
                    "shadow-[0_0_10px_rgba(124,58,237,0.25)]"
                )}
              >
                {genre.icon ? (
                  <genre.icon />
                ) : (
                  <span className="text-xs font-bold">
                    {genre.name.substring(0, 2)}
                  </span>
                )}
              </Button>
            ))}
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
      )}
    </>
  );
};

export default Sidebar;
