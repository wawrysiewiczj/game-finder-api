import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Calendar } from "lucide-react";

import { cn, formattedReleaseDate } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/constants";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useWishlist } from "@/context/WishlistProvider";

const GameCard = React.memo(({ game }) => {
  if (!game) return null;

  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlistStatus = isInWishlist(game.id);

  const {
    id,
    name,
    background_image,
    metacritic,
    released,
    rating,
    genres = [],
    parent_platforms = [],
  } = game;

  // Get platform icons - memoized
  const platformIcons = React.useMemo(() => {
    if (!parent_platforms) return [];
    const platforms = parent_platforms.map((p) => p.platform);
    const icons = [];

    if (platforms.some((p) => p.slug === "pc")) icons.push("windows");
    if (platforms.some((p) => p.slug.includes("playstation")))
      icons.push("playstation");
    if (platforms.some((p) => p.slug.includes("xbox"))) icons.push("xbox");
    if (platforms.some((p) => p.slug.includes("nintendo")))
      icons.push("nintendo");
    if (platforms.some((p) => p.slug === "ios" || p.slug === "mac"))
      icons.push("apple");
    if (platforms.some((p) => p.slug === "android")) icons.push("android");
    if (platforms.some((p) => p.slug === "linux")) icons.push("linux");

    return icons;
  }, [parent_platforms]);

  // Handle wishlist toggling
  const handleToggleWishlist = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(game);
    },
    [game, toggleWishlist]
  );

  return (
    <Card className="h-full flex flex-col overflow-hidden border rounded-xl shadow-md bg-card hover:shadow-lg transition-all duration-300 relative">
      {/* Card Content Container */}
      <Link to={`/game/${id}`} className="flex flex-col h-full">
        {/* Image with overlays */}
        <div className="relative overflow-hidden aspect-video">
          {/* Game Image */}
          <img
            src={background_image || FALLBACK_IMAGE}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

          {/* Platform icons - top left */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {platformIcons.map((platform, index) => (
              <div
                key={index}
                className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/90"
              >
                <i className={`ri-${platform}-fill`}></i>
              </div>
            ))}
          </div>

          {/* Metacritic and Rating - top right */}
          <div className="absolute top-3 right-3 flex gap-2">
            {metacritic && (
              <div
                className={cn(
                  "h-7 min-w-7 px-1.5 rounded-md font-bold flex items-center justify-center text-sm",
                  metacritic >= 75
                    ? "bg-green-500/90 text-white"
                    : metacritic >= 50
                    ? "bg-yellow-500/90 text-white"
                    : "bg-red-500/90 text-white"
                )}
              >
                {metacritic}
              </div>
            )}

            {rating > 0 && (
              <div className="h-7 rounded-md bg-black/50 backdrop-blur-sm px-2 flex items-center gap-1 text-sm text-yellow-400">
                <Star className="h-3.5 w-3.5 fill-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Wishlist button - bottom right */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute bottom-3 right-3 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 z-10",
              wishlistStatus && "text-red-500 hover:text-red-600"
            )}
            onClick={handleToggleWishlist}
          >
            <Heart
              className={cn("h-4 w-4", wishlistStatus && "fill-current")}
            />
          </Button>
        </div>

        {/* Card content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Game title */}
          <h3 className="font-bold text-base sm:text-lg leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>

          {/* Release date */}
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3 mr-1.5" />
            <span>{formattedReleaseDate(released)}</span>
          </div>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {genres.slice(0, 3).map((genre) => (
              <Badge
                key={genre.id}
                variant="outline"
                className="px-2 py-0.5 text-[10px] bg-muted/40 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>
      </Link>

      {/* Focus/Hover effect */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-xl border-2 border-primary/30"></div>
    </Card>
  );
});

GameCard.displayName = "GameCard";

export default GameCard;
