import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'build', // Custom output directory
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
