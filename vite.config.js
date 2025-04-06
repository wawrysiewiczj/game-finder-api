import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Domyślnie 500 kB, tutaj zwiększamy do 1000 kB
    sourcemap: true, // Włącza generowanie source map
  },
});
