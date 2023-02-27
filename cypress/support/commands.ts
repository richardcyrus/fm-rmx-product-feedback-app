export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Reset the Prisma database between tests.
       *
       * @returns {typeof resetDb}
       * @memberof Chainable
       * @example
       *  cy.resetDb()
       */
      resetDb: typeof resetDb;
      seedDb: typeof seedDb;
    }
  }
}

function resetDb() {
  return cy.task("resetDb");
}

function seedDb() {
  return cy.task("seedDatabase");
}

Cypress.Commands.add("resetDb", resetDb);
Cypress.Commands.add("seedDb", seedDb);

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
