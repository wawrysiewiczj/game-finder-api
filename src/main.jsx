import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "@/App";
import "@/index.css";

import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/context/ThemeProvider";
import { WishlistProvider } from "@/context/WishlistProvider";

// Configure Query Client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 2, // Retry failed requests up to 2 times
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes by default
      cacheTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
      // Show skeleton loaders immediately without delay
      useErrorBoundary: false, // Handle errors within components
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="game-finder-theme">
          <WishlistProvider>
            <Router>
              <App />
              <Toaster position="bottom-right" />
            </Router>
          </WishlistProvider>
        </ThemeProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
