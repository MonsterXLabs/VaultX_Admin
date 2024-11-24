import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"
import nodePolyfills from 'rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Polyfill Node.js modules
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    // disabled: false,
  },
  publicDir: 'public',
  build: {
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
      strictRequires: true,
      // https://stackoverflow.com/questions/62770883/how-to-include-both-import-and-require-statements-in-the-bundle-using-rollup
      transformMixedEsModules: true,
    },
    rollupOptions: {
      manualChunks: {
        vendor: ['react', 'react-dom'], // Extract common libraries into a separate chunk
      },
      plugins: [
        nodePolyfills(),
        // inject({
        //   Buffer: ['buffer', 'Buffer'], // Inject Buffer
        // }),
      ],
    },
    outDir: 'build', // Custom output directory
  },
});
