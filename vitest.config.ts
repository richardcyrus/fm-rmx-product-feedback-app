/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
    exclude: ["./cypress", "./node_modules"],
    watchExclude: [
      ".*\\/api\\/.*",
      ".*\\/build\\/.*",
      ".*\\/node_modules\\/.*",
      ".*\\/postgres-data\\/.*",
    ],
  },
});
