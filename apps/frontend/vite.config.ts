import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const rootEnvDir = path.resolve(__dirname, "../..");
  const env = loadEnv(mode, rootEnvDir, "");
  const backendUrl =
    env.VITE_API_BASE_URL || env.APP_URL || `http://localhost:${env.APP_PORT || "3000"}`;

  return {
    envDir: rootEnvDir,
    base: "./",
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": backendUrl,
        "/health": backendUrl
      }
    }
  };
});