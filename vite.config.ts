import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import themePlugin from "@replit/vite-plugin-shadcn-theme-json"
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal"

const viteConfig = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer())]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      // Remove any @shared alias that might be causing issues
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
})

export default viteConfig
