/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "happy-dom",
    // This is to load '.env.test' for vitest
    env: loadEnv('test', process.cwd(), ''),
    exclude: [...configDefaults.exclude, "**/cypress/**", "**/tests/e2e/**"],
    globals: true,
    include: ['./app/**/*.test.?(c|m)[jt]s?(x)'],
    watchExclude: [
      ...configDefaults.watchExclude,
      "**/api/**",
      "**/build/**",
      "**/postgres-data/**",
      "**/tests/e2e/**"
    ],
  },
});
