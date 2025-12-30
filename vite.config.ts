/// <reference types="vite/client" />
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  test: {
    environment: "happy-dom",
    // This is to load '.env.test' for vitest
    env: loadEnv('test', process.cwd(), ''),
    exclude: [
      ...configDefaults.exclude,
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      "**/api/**",
      "**/build/**",
      "**/postgres-data/**",
      "**/tests/e2e/**"
    ],
    globals: true,
    include: ['./app/**/*.test.?(c|m)[jt]s?(x)']
  },
});
