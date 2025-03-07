import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: ["afdev.site"], // Add your domain here
  },
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 10000,
  },
});
