import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Search, X } from "lucide-react";

import { useWishlist } from "@/context/WishlistProvider";
import Seo from "@/components/Seo";

import GameGrid from "@/components/game/GameGrid";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";

const WishlistPage = () => {
  const { wishlist, isLoading } = useWishlist();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWishlist = wishlist.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageTitle = "Moja Lista Życzeń";
  const pageDescription =
    wishlist.length > 0
      ? `Twoja osobista lista życzeń zawierająca ${wishlist.length} gier. Zarządzaj i przeglądaj zapisane gry.`
      : "Twoja lista życzeń jest obecnie pusta. Dodaj gry do listy życzeń, klikając ikonę serca na karcie gry.";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Seo title={pageTitle} />
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <Seo
        title={pageTitle}
        description={pageDescription}
        canonical="https://game-finder.example.com/wishlist"
        noIndex={true}
      />

      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground">
            Games you've saved to your wishlist
          </p>
        </div>

        <Separator className="my-4" />

        <div className="space-y-6">
          {wishlist.length > 0 ? (
            <>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your wishlist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-2 top-2.5"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredWishlist.length} game
                  {filteredWishlist.length !== 1 && "s"}
                </div>
              </div>

              {filteredWishlist.length > 0 ? (
                <GameGrid games={filteredWishlist} />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                  <h3 className="text-xl font-bold">No Games Found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try a different search term or check your wishlist
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
              <h3 className="text-xl font-bold">Your Wishlist is Empty</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Add games to your wishlist by clicking the heart icon on any
                game card.
              </p>
              <Link to="/browse" className="mt-6">
                <Button>Browse Games</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
