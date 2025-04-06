import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

const GameCard = ({ game, onClick }) => {
  const [imageSrc, setImageSrc] = useState(game.background_image);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle image loading errors or missing images
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageSrc("/placeholder-game.jpg");
    img.src = imageSrc;
  }, [imageSrc]);

  // Format release date
  const formatReleaseDate = (date) => {
    if (!date) return "TBA";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle platform display
  const getPlatformIcons = (platforms) => {
    if (!platforms) return null;

    const icons = [];
    if (platforms.some((p) => ["pc", "windows"].includes(p.platform.slug)))
      icons.push(
        <i
          key="pc"
          className="ri-computer-line mr-1"
          title="PC"
          aria-label="PC"
        ></i>
      );
    if (
      platforms.some((p) =>
        ["playstation", "playstation5", "playstation4"].includes(
          p.platform.slug
        )
      )
    )
      icons.push(
        <i
          key="playstation"
          className="ri-playstation-line mr-1"
          title="PlayStation"
          aria-label="PlayStation"
        ></i>
      );
    if (
      platforms.some((p) =>
        ["xbox", "xbox-one", "xbox-series-x"].includes(p.platform.slug)
      )
    )
      icons.push(
        <i
          key="xbox"
          className="ri-xbox-line mr-1"
          title="Xbox"
          aria-label="Xbox"
        ></i>
      );
    if (platforms.some((p) => p.platform.slug === "nintendo-switch"))
      icons.push(
        <i
          key="switch"
          className="ri-gamepad-line mr-1"
          title="Nintendo Switch"
          aria-label="Nintendo Switch"
        ></i>
      );
    if (platforms.some((p) => ["ios", "android"].includes(p.platform.slug)))
      icons.push(
        <i
          key="mobile"
          className="ri-smartphone-line mr-1"
          title="Mobile"
          aria-label="Mobile"
        ></i>
      );

    return (
      <div className="flex flex-wrap text-xs text-muted-foreground">
        {icons}
      </div>
    );
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card
        className="group h-full overflow-hidden rounded-lg border-0 bg-card shadow-md transition-all hover:shadow-xl"
        onClick={() => onClick(game)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(game);
          }
        }}
        role="button"
        aria-label={`View details for ${game.name}`}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          {imageSrc ? (
            <motion.img
              src={imageSrc}
              alt={game.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">No Image</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
            {getPlatformIcons(game.parent_platforms)}
          </div>

          {game.metacritic && (
            <div className="absolute right-2 top-2">
              <Badge
                variant={
                  game.metacritic > 75
                    ? "default"
                    : game.metacritic > 50
                    ? "secondary"
                    : "outline"
                }
                className={`font-medium ${
                  game.metacritic > 75
                    ? "bg-green-500 hover:bg-green-600"
                    : game.metacritic > 50
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-destructive hover:bg-destructive/90"
                }`}
              >
                {game.metacritic}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col p-4">
          <h3 className="mb-1 line-clamp-1 text-base font-bold">{game.name}</h3>

          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatReleaseDate(game.released)}
            </span>

            {game.rating > 0 && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 text-xs">{game.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {game.genres?.slice(0, 3).map((genre) => (
              <Badge
                variant="secondary"
                key={genre.id}
                className="px-2 py-0 text-xs"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

GameCard.displayName = "GameCard";

export default GameCard;
