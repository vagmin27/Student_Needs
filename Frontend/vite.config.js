import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      // This allows you to use the "@" prefix for cleaner imports 
      // e.g., import { Button } from "@/components/ui/button"
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));