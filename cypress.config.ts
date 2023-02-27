import { defineConfig } from "cypress";

import { truncateDb } from "@/test/helpers/truncate-db";

import { seed } from "./prisma/seed-test";

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      const isDev = config.watchForFileChanges;
      const port = process.env.PORT ?? (isDev ? "3000" : "8811");
      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
      };
      Object.assign(config, configOverrides);

      // To use this: cy.task('log', outputForTerminal)
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        async resetDb() {
          await truncateDb();
          return null;
        },
        async seedDatabase() {
          await seed();
          return null;
        },
      });

      return config;
    },
  },
});
