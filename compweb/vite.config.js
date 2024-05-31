import { defineConfig, loadEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  // Set the third parameter to '' to load all env variables from .env, .env.local, .env.[mode], .env.[mode].local
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      outDir: "build",
    },
    publicDir: './public',
    plugins: [
      reactRefresh(),
      svgrPlugin({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    // Define global constants based on the environment variables
    define: {
      'process.env': env,
    },
  };
});
