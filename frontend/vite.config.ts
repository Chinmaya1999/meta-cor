import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src"), "@shared": path.resolve(import.meta.dirname, "../shared") } },
  server: {
    port: 5173,
    // Allow VS Code port-forwarding tunnels (and Codespaces). Specific domains only: `true` would disable
    // Vite's DNS-rebinding protection for every host.
    allowedHosts: [".devtunnels.ms", ".app.github.dev"],
    fs: { allow: [".."] },
    proxy: {
      "/api": "http://localhost:5001",
      "/uploads": "http://localhost:5001",
      "/sitemap.xml": "http://localhost:5001",
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (/react-dom|react-router|\/react\//.test(id)) return "react";
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) return "motion";
          if (/react-hook-form|\/zod\/|@hookform/.test(id)) return "forms";
        },
      },
    },
  },
});
