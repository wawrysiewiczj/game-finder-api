import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useGameDetails, useGameScreenshots } from "@/hooks/useGame";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { AnimatedGroup } from "@/components/ui/animated-group";
import Seo from "@/components/Seo";
import {
  Heart,
  ArrowLeft,
  ExternalLink,
  CalendarIcon,
  Star,
  Award,
  Gamepad2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { FALLBACK_IMAGE } from "@/constants";
import { cn, formattedReleaseDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistProvider";

const GamePage = () => {
  const { id } = useParams();
  const { data: game, isLoading, isError, error } = useGameDetails(id);
  const { data: screenshots } = useGameScreenshots(id);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // State for expanded description
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Function to toggle description expansion
  const toggleDescription = () => {
    setDescriptionExpanded((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Seo title="Ładowanie szczegółów gry" />
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading game details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
        <Seo title="Błąd - nie znaleziono gry" />
        <h2 className="text-2xl font-bold">Error Loading Game</h2>
        <p className="text-muted-foreground mt-2">
          {error?.message || "There was an error loading the game details."}
        </p>
        <Link to="/browse" className="mt-6">
          <Button>Back to Browse</Button>
        </Link>
      </div>
    );
  }

  if (!game) return null;

  const {
    name,
    description_raw,
    background_image,
    metacritic,
    released,
    genres = [],
    platforms = [],
    developers = [],
    publishers = [],
    website,
    rating,
    ratings_count,
  } = game;

  // Prepare description for SEO (limit to ~160 characters)
  const seoDescription = description_raw
    ? `${description_raw.substring(0, 157)}...`
    : `Szczegóły, recenzje i informacje o grze ${name}. Platforma: ${platforms
        ?.map((p) => p.platform.name)
        .join(", ")}. Gatunek: ${genres?.map((g) => g.name).join(", ")}.`;

  // Build structured data for rich results in Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: name,
    description:
      description_raw?.substring(0, 500) || `Game details for ${name}`,
    image: background_image || FALLBACK_IMAGE,
    aggregateRating: rating
      ? {
          "@type": "AggregateRating",
          ratingValue: rating.toFixed(1),
          ratingCount: ratings_count,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
    applicationCategory: "Game",
    genre: genres.map((g) => g.name).join(", "),
    operatingSystem: platforms?.map((p) => p.platform.name).join(", "),
    datePublished: released,
    publisher: publishers?.map((p) => ({
      "@type": "Organization",
      name: p.name,
    })),
    developer: developers?.map((d) => ({
      "@type": "Organization",
      name: d.name,
    })),
  };

  // Prepare description text for collapsible view
  const shortDescription = description_raw
    ? description_raw.substring(0, 300) +
      (description_raw.length > 300 ? "..." : "")
    : "";

  const fullDescription = description_raw || "";
  const hasLongDescription = description_raw && description_raw.length > 300;

  const gameScreenshots = screenshots?.results || [];

  return (
    <div className="py-6">
      <Seo
        title={name}
        description={seoDescription}
        ogImage={background_image || FALLBACK_IMAGE}
        canonical={`https://game-finder.example.com/game/${id}`}
        openGraph={{
          type: "website",
          title: `${name} | Game Finder`,
          description: seoDescription,
          images: [
            {
              url: background_image || FALLBACK_IMAGE,
              width: 1280,
              height: 720,
              alt: name,
            },
          ],
        }}
      >
        {/* Add structured data for this game */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Seo>

      <div className="flex flex-col space-y-8">
        {/* Back button and actions */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Link to="/browse">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Button>
          </Link>

          <div className="flex gap-2">
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Official Site
                </Button>
              </a>
            )}

            <Button
              variant="outline"
              className={cn(
                "gap-2",
                isInWishlist(Number(id)) && "text-red-500"
              )}
              onClick={() => toggleWishlist(game)}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isInWishlist(Number(id)) ? "fill-current" : ""
                )}
              />
              {isInWishlist(Number(id)) ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </div>

        {/* Hero section with game image and basic info */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-6">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={background_image || FALLBACK_IMAGE}
                alt={name}
                className="w-full aspect-video object-cover"
              />
              {metacritic && (
                <div className="absolute top-4 right-4">
                  <Badge
                    className={cn(
                      "text-lg px-3 py-1",
                      metacritic >= 80
                        ? "bg-green-500"
                        : metacritic >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    )}
                  >
                    {metacritic}
                  </Badge>
                </div>
              )}
            </div>

            {/* Game description - Collapsible */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground">
                {description_raw ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={descriptionExpanded ? "expanded" : "collapsed"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="whitespace-pre-line">
                          {descriptionExpanded
                            ? fullDescription
                            : shortDescription}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {hasLongDescription && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleDescription}
                        className="mt-2 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        {descriptionExpanded ? (
                          <>
                            Show Less <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Read More <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No description available for this game.
                  </p>
                )}
              </div>
            </div>

            {/* Screenshots */}
            {gameScreenshots.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                <AnimatedGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameScreenshots.map((screenshot) => (
                    <div
                      key={screenshot.id}
                      className="rounded-lg overflow-hidden"
                    >
                      <img
                        src={screenshot.image}
                        alt={`${name} screenshot`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </AnimatedGroup>
              </div>
            )}
          </div>

          {/* Game details sidebar */}
          <div className="bg-card rounded-lg p-6 h-fit lg:sticky lg:top-20">
            <h1 className="text-3xl font-bold tracking-tight mb-4">{name}</h1>

            <div className="space-y-6">
              {/* Release info */}
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p className="font-medium">
                    {formattedReleaseDate(released)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Rating */}
              {rating && (
                <>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        User Rating
                      </p>
                      <p className="font-medium">
                        {rating.toFixed(1)} / 5 ({ratings_count} ratings)
                      </p>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Genres */}
              {genres.length > 0 && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Genres</p>
                    <div className="flex flex-wrap gap-2">
                      {genres.map((genre) => (
                        <Link key={genre.id} to={`/browse?genres=${genre.id}`}>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-accent"
                          >
                            {genre.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Platforms */}
              {platforms.length > 0 && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Platforms
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((platform) => (
                        <Badge key={platform.platform.id} variant="secondary">
                          {platform.platform.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Developers */}
              {developers?.length > 0 && (
                <>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Developer{developers.length > 1 ? "s" : ""}
                      </p>
                      <p className="font-medium">
                        {developers.map((dev) => dev.name).join(", ")}
                      </p>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Publishers */}
              {publishers?.length > 0 && (
                <>
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Publisher{publishers.length > 1 ? "s" : ""}
                      </p>
                      <p className="font-medium">
                        {publishers.map((pub) => pub.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
