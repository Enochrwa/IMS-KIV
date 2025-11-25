import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  const plugins = [react(), tailwindcss(), tsconfigPaths()];
  return {
    plugins,
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false
    }
  };
});
