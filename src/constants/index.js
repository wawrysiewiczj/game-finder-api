import { Heart, Home, InfoIcon, LayoutGrid } from "lucide-react";

// Sorting options for games
export const SORT_OPTIONS = [
  { value: "-added", label: "Newest" },
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
  { value: "-released", label: "Release Date (Newest)" },
  { value: "released", label: "Release Date (Oldest)" },
  { value: "-rating", label: "Rating (High to Low)" },
  { value: "rating", label: "Rating (Low to High)" },
  { value: "-metacritic", label: "Metacritic (High to Low)" },
  { value: "metacritic", label: "Metacritic (Low to High)" },
];

// Default page size options
export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 20, label: "20 per page" },
  { value: 30, label: "30 per page" },
  { value: 40, label: "40 per page" },
];

// Fallback image for missing game covers
export const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image+Available";

// Platform icons mapping
export const PLATFORM_ICONS = {
  pc: "Monitor",
  playstation: "Gamepad2",
  xbox: "Gamepad",
  nintendo: "GamepadIcon",
  mac: "Laptop",
  linux: "Terminal",
  android: "Smartphone",
  ios: "Tablet",
  web: "Globe",
};

export const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    description: "Dashboard and featured games",
  },
  {
    title: "Browse Games",
    url: "/browse",
    icon: LayoutGrid,
    description: "Explore all games with filters",
  },
  {
    title: "Wishlist",
    url: "/wishlist",
    icon: Heart,
    description: "Your saved games collection",
    badge: (wishlist) => (wishlist.length > 0 ? wishlist.length : null),
  },
  {
    title: "About",
    url: "/about",
    icon: InfoIcon,
    description: "About this project",
  },
];
