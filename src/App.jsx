import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy loading stron
const HomePage = lazy(() => import("@/pages/HomePage"));
const BrowseGames = lazy(() => import("@/pages/BrowseGames"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const GamePage = lazy(() => import("@/pages/GamePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

// Komponent ładowania
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px]">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-muted-foreground">Ładowanie strony...</p>
  </div>
);

function App() {
  return (
    <>
      <Seo />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/browse" element={<BrowseGames />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/game/:id" element={<GamePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
