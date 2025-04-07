import React from "react";
import { Link } from "react-router-dom";

import {
  Search,
  GamepadIcon,
  Sparkles,
  ArrowRight,
  Heart,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Seo from "@/components/Seo";

import GameGrid from "@/components/game/GameGrid";

import { usePopularGames } from "@/hooks/useGame";

const FEATURED_GAMES_LIMIT = 8;

const HomePage = () => {
  // Fetch popular games for the home page with optimized caching
  const { data, isLoading, isError, error } =
    usePopularGames(FEATURED_GAMES_LIMIT);

  const games = data?.results || [];

  return (
    <div className="py-6 space-y-16">
      <Seo
        title="Znajdź swoją następną ulubioną grę"
        description="Game Finder to platforma do odkrywania i organizowania gier. Przeglądaj tysiące gier na wszystkich platformach, twórz swoją listę życzeń i znajdź swoją następną ulubioną grę."
      />

      {/* Hero Section with Animation */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-center"></div>

        {/* Animated Circles */}
        <motion.div
          className="absolute top-[-10%] right-[-5%] h-72 w-72 rounded-full bg-white opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[10%] h-96 w-96 rounded-full bg-white opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Discover Your Next
                <br />
                <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Gaming Adventure
                </span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg">
                Explore thousands of games across all platforms, create your
                wishlist, and find your next favorite game with Game Finder.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/browse">
                  <Button
                    size="lg"
                    variant="default"
                    className="gap-2 bg-white text-indigo-700 hover:bg-indigo-100 shadow-lg"
                  >
                    <Search className="h-5 w-5" />
                    Browse Games
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-white text-white hover:bg-white/20"
                  >
                    <Heart className="h-5 w-5" />
                    My Wishlist
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-white/10 blur-sm"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-1 rounded-full shadow-2xl">
                <GamepadIcon className="h-32 w-32 p-5 text-white" />
              </div>

              <div className="absolute top-0 -right-4 rounded-full bg-yellow-500 p-2 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent inline-block">
            Why Use Game Finder?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers the best ways to discover and organize your
            favorite games
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="h-10 w-10 text-indigo-500" />,
              title: "Discover Games",
              description:
                "Browse through thousands of games across all platforms and genres with advanced filtering options.",
            },
            {
              icon: <Heart className="h-10 w-10 text-pink-500" />,
              title: "Create Wishlist",
              description:
                "Save your favorite games to a wishlist for easy access later and never miss a great title.",
            },
            {
              icon: <TrendingUp className="h-10 w-10 text-purple-500" />,
              title: "Stay Updated",
              description:
                "Get the latest information about game releases, ratings, and platforms all in one place.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-background/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10 hover:border-primary/20 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-25 blur-sm group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-background/80 dark:bg-muted/20 p-3 rounded-full w-fit">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Rated Games Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <span>Top Rated Games</span>
            </h2>
            <p className="text-muted-foreground mt-1">
              The highest-rated games according to players and critics
            </p>
          </div>
          <Link to="/browse?ordering=-rating" className="group">
            <Button
              variant="outline"
              className="gap-2 group-hover:border-primary/50 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <Separator className="my-4" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Loading top games...</p>
          </div>
        ) : (
          <GameGrid
            games={games}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        )}
      </section>

      {/* CTA Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-center"></div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to find your next favorite game?
            </h2>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
              Start exploring our extensive collection of games and create your
              personalized gaming wishlist today.
            </p>
            <Link to="/browse">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-indigo-50"
              >
                Start Exploring
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
