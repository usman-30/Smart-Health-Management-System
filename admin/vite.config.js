import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import polyfillNode from "rollup-plugin-polyfill-node";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    polyfillNode(),
  ],
  resolve: {
    alias: {
      // Polyfills required by simple-peer (uses Node stream APIs)
      stream: "stream-browserify",
      buffer: "buffer/",
    },
  },
  define: {
    global: 'window', // Polyfill "global" with "window"
  },
  server: { port: 5173 },
});
